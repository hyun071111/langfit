from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
import torch
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline as hf_pipeline, AutoModelForCausalLM, AutoTokenizer, TextIteratorStreamer, GenerationConfig, BitsAndBytesConfig
from langchain.prompts import ChatPromptTemplate
from langchain_huggingface import HuggingFacePipeline, ChatHuggingFace
from langchain_core.runnables import RunnablePassthrough
from threading import Thread
from langchain.callbacks import StdOutCallbackHandler

# 챗봇 클래스 정의
class ChatBot:
    def __init__(self):
        self.MODEL_NAME = "sh2orc/Llama-3.1-Korean-8B-Instruct"

        # BitsAndBytesConfig로 양자화 설정
        self.quantization_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_compute_dtype=torch.bfloat16,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_use_double_quant=True,
        )

        # GenerationConfig 설정
        self.generation_config = GenerationConfig.from_pretrained(self.MODEL_NAME, temperature=0.1)

        # 모델 로딩 시 quantization_config를 사용하여 양자화
        self.model = AutoModelForCausalLM.from_pretrained(
            self.MODEL_NAME,
            device_map="auto",  
            quantization_config=self.quantization_config,
            generation_config=self.generation_config,
            torch_dtype=torch.bfloat16
        )

        # 모델 최적화
        self.model = torch.compile(self.model, mode="reduce-overhead", fullgraph=True)
        self.tokenizer = AutoTokenizer.from_pretrained(self.MODEL_NAME)

        # 디바이스 설정
        self.device_name = 'cuda' if torch.cuda.is_available() else 'mps' if torch.backends.mps.is_available() else 'cpu'
        self.device = torch.device(self.device_name)

        # 프롬프트 템플릿 설정
        self.prompt = ChatPromptTemplate.from_messages(
            [
                ("system", "당신은 프로그래밍에 대한 질문에 답변할 수 있는 전문가입니다. 질문을 받고 정확한 답변을 해주세요. 모든 답변을 3문장으로 줄여서 답변해주세요. 질문을 잘 모르겠다면 모르겠다고 답변해주세요.\n\n{context}\n\n"),
                ("human", "{question}")
            ]
        )

    def invoke(self, question: str):
        # HuggingFace에서 뽑는 출력을 스트림으로 받기 위한 streamer 선언
        streamer = TextIteratorStreamer(self.tokenizer, skip_prompt=True, skip_special_tokens=True)

        # pipeline 선언
        pipe = hf_pipeline("text-generation", model=self.model, tokenizer=self.tokenizer, streamer=streamer, max_new_tokens=2048)
        hf = HuggingFacePipeline(pipeline=pipe, model_id=self.MODEL_NAME)
        chat_hf = ChatHuggingFace(llm=hf, verbose=True)

        # 체인 생성
        chain = {
            "context": lambda x: "프로그래밍 관련 질문입니다.",
            "question": RunnablePassthrough(),
        } | self.prompt | chat_hf

        # 실행하기
        invoke_kwargs = dict(input=question, kwargs={"callbacks": [StdOutCallbackHandler()]})

        runner = Thread(target=chain.invoke, kwargs=invoke_kwargs)
        runner.start()

        # 스트리밍된 출력 보내기
        for output in streamer:
            if len(output) == 0:
                continue
            yield output


# FastAPI 초기화
app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

chatbot = ChatBot()

class Question(BaseModel):
    type: str  
    question: str
    message: str

# 웹소켓 엔드포인트 정의
@app.websocket("/ws")
async def websocket_chat(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            question = Question.parse_raw(data)

            # 비동기적으로 챗봇 출력 생성
            async def generate_stream():
                for output in chatbot.invoke(question.message):
                    # 특수 문자 이스케이프 처리
                    escaped_output = output.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')
                    await websocket.send_text(f'{{"type": "message-stream", "message": "{escaped_output}"}}\n')
                    print(output)

            await generate_stream()

    except WebSocketDisconnect:
        print("클라이언트가 연결을 끊었습니다.")
    except Exception as e:
        await websocket.send_text(f'{{"error": "{str(e)}"}}')
        print(f"에러: {e}")

# 실행 명령
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
