    const textarea = document.querySelector('textarea');
    const sent = document.querySelector('.sent');
    const container = document.querySelector('.container');
    let messageMap = new Map();
    let currentMessageId = 0;
    
    // 텍스트 입력 이벤트 처리
    const text = () => {
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            const scrollHeight = textarea.scrollHeight;
            textarea.style.height = `${scrollHeight}px`;
            container.scrollTop = container.scrollHeight;
        });
    
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveText();
            }
        });
    
        sent.addEventListener('mousedown', () => {
            saveText();
        });
    
        const saveText = () => {
            const question = textarea.value.trim();
            if (question === '') {
                alert('다시 입력해주세요.');
                return;
            }   
            textarea.value = '';
            textarea.style.height = '50px';
    
            // 사용자의 질문을 화면에 표시
            const section = document.createElement('section');
            const article = document.createElement('article');
            article.textContent = question;
            section.appendChild(article);
            container.appendChild(section);
            container.scrollTop = container.scrollHeight;
            
            // 새로운 메시지 ID 생성
            currentMessageId++;
            messageMap.set(currentMessageId, '');
            
            sendQuestion(question);
            receiveLoading();
        }
    }
    
    text();
    
    // 로딩 애니메이션 생성
    const receiveLoading = () => {
        const nav = document.createElement('nav');
        const aside = document.createElement('aside');
        
        // Create img element instead of using innerHTML to preserve quotes
        const img = document.createElement('img');
        img.src = "../img/loading.gif";
        img.classList.add("loading-message");
        img.alt = "로딩 중";
        aside.appendChild(img);
        
        nav.appendChild(aside);
        container.appendChild(nav);
        container.scrollTop = container.scrollHeight;
    }
    
    let socket = new WebSocket("ws://localhost:5000/ws");
    
    socket.onopen = () => {
        console.log("서버에 연결되었습니다.");
    };
    
    socket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
    
            if (data.type === "message-stream") {
                let botMessage = document.querySelector(`aside[data-message-id="${currentMessageId}"]`);
                if (!botMessage) {
                    const loadingMessage = document.querySelector(".loading-message");
                    if (loadingMessage) {
                        loadingMessage.closest('nav').remove();
                    }
    
                    // 메시지 표시 준비
                    const nav = document.createElement("nav");
                    const aside = document.createElement("aside");
                    aside.classList.add("bot-message");
                    aside.dataset.messageId = currentMessageId;
                    aside.textContent = "";
                    nav.appendChild(aside);
                    container.appendChild(nav);
                    botMessage = aside;
                }
    
                // 메시지 처리
                let currentContent = messageMap.get(currentMessageId) || "";
    
                // 새 메시지 추가
                currentContent += data.message;
                messageMap.set(currentMessageId, currentContent);
    
                // 코드 블록 처리를 위한 수정된 부분
                botMessage.innerHTML = "";
                if (currentContent.includes("```")) {
                    // 코드 블록을 처리
                    const segments = currentContent.split(/(```[^\n]*\n[\s\S]*?```)/g);
                    segments.forEach(segment => {
                        if (segment.startsWith("```")) {
                            // 코드 블록 처리
                            const pre = document.createElement("pre");
                            // ```와 언어 표시 제거
                            const cleanedCode = segment.replace(/```[^\n]*\n|```$/g, "");
                            pre.textContent = cleanedCode;
                            botMessage.appendChild(pre);
                        } else if (segment.trim()) {
                            // 일반 텍스트 처리
                            const textNode = document.createElement("p");
                            textNode.textContent = segment;
                            botMessage.appendChild(textNode);
                        }
                    });
                } else if (currentContent.includes("\n")) {
                    const pre = document.createElement("pre");
                    pre.textContent = currentContent;
                    botMessage.appendChild(pre);
                } else {
                    botMessage.textContent = currentContent;
                }
    
                // 스크롤 자동 이동
                container.scrollTop = container.scrollHeight;
            } else if (data.error) {
                console.error(`서버 오류: ${data.error}`);
                alert("서버에서 오류가 발생했습니다.");
            }
        } catch (error) {
            console.error("JSON 파싱 오류:", error.message, "\n받은 데이터:", event.data);
            // 오류 발생 시에도 메시지를 누적
            let botMessage = document.querySelector(`aside[data-message-id="${currentMessageId}"]`);
            if (!botMessage) {
                const loadingMessage = document.querySelector(".loading-message");
                if (loadingMessage) {
                    loadingMessage.closest('nav').remove();
                }
    
                const nav = document.createElement("nav");
                const aside = document.createElement("aside");
                aside.classList.add("bot-message");
                aside.dataset.messageId = currentMessageId;
                aside.textContent = "";
                nav.appendChild(aside);
                container.appendChild(nav);
                botMessage = aside;
            }
    
            try {
                // JSON 파싱에 실패한 경우 message 부분만 추출
                const messageMatch = event.data.match(/"message":\s*"((?:\\.|[^"\\])*?)"/);
                if (messageMatch) {
                    const message = messageMatch[1]
                        .replace(/\\n/g, "\n")
                        .replace(/\\r/g, "\r")
                        .replace(/\\t/g, "\t")
                        .replace(/\\"/g, '"')
                        .replace(/\\'/g, "'")
                        .replace(/\\\\/g, "\\");
                        
                    let currentContent = messageMap.get(currentMessageId) || "";
                    currentContent += message;
                    messageMap.set(currentMessageId, currentContent);
                    
                    botMessage.innerHTML = "";
                    if (currentContent.includes("\n")) {
                        const pre = document.createElement("pre");
                        pre.textContent = currentContent;
                        botMessage.appendChild(pre);
                    } else {
                        botMessage.textContent = currentContent;
                    }
                }
            } catch (e) {
                console.error("메시지 추출 실패:", e);
            }
        }
    };
    
    socket.onerror = (error) => {
        console.error(`WebSocket 오류 발생: ${error.message}`);
        alert("서버와 연결할 수 없습니다.");
    };
    
    socket.onclose = (event) => {
        if (!event.wasClean) {
            console.error("WebSocket 연결이 비정상적으로 종료되었습니다. 재연결 시도 중...");
            setTimeout(() => {
                socket = new WebSocket("ws://localhost:5000/ws");
            }, 5000);
        }
    };
    
    const sendQuestion = (question) => {
        const payload = {
            type: "question",
            question: question,
            message: question
        };
        try {
            socket.send(JSON.stringify(payload));
        } catch (error) {
            console.error("메시지 전송 오류:", error.message);
            alert("메시지를 전송할 수 없습니다.");
        }
    }
