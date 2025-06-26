# LangFit

LangFit은 사용자의 언어 학습을 돕기 위한 웹 애플리케이션입니다. 채팅 인터페이스를 통해 실시간으로 피드백을 받을 수 있으며, 다양한 학습 자료를 활용하여 효과적으로 언어를 습득할 수 있습니다.

## 🚀 주요 기능

- **AI 채팅**: 사용자가 선택한 언어로 AI와 대화하며 실시간 피드백을 받을 수 있습니다.
- **강의 자료 제공**: 다양한 주제의 강의 자료를 활용하여 학습할 수 있습니다.
- **학습 결과 저장**: 학습 진행 상황을 저장하고 관리할 수 있습니다.
- **사용자 친화적 인터페이스**: 직관적인 UI/UX를 제공하여 누구나 쉽게 사용할 수 있습니다.

## 📂 폴더 구조

```
langfit/
├── chat/         # 채팅 인터페이스 관련 파일
├── img/          # 이미지 파일
├── lecture/      # 강의 자료
├── result/       # 추천 언어 결과 저장 파일
├── index.html    # 메인 HTML 파일
├── script.js     # JavaScript 기능 구현
├── style.css     # 스타일시트
└── README.md     # 프로젝트 설명 파일
```

## 🛠 기술 스택

- **프론트엔드**: HTML, CSS, JavaScript
- **AI API**: Python(FastApi)

## 💻 실행 방법

### 1. 클론 및 프로젝트 폴더 이동
```bash
git clone https://github.com/hyun071111/langfit.git
cd langfit
```

### 2. 로컬 서버 실행
Python을 사용하여 서버를 실행할 수 있습니다.

3. 가상 환경 생성 및 활성화 (선택 사항이지만 권장됨):
   - 가상 환경 생성:
     ```bash
     python -m venv venv
     ```
   - 가상 환경 활성화:
     - Windows:
       ```bash
       venv\Scripts\activate
       ```
     - macOS/Linux:
       ```bash
       source venv/bin/activate
       ```
4. 필요한 패키지 설치:
   ```bash
   cd chat
   ```
   ```bash
   pip install -r requirements.txt
   ```
5. **애플리케이션 실행**:
   ```bash
   python app.py
   ```

실행하고 index.html를 실행하여 들어가보면 챗봇을 이용할 수 있다.
