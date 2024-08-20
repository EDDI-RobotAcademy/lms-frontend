<template>
  <div id="app">
    <main>
      <h1 class="corner-chef">Corner-Chef</h1>
      <div class="chat-container">
        <div class="chat-messages">
          <div v-for="(message, index) in messages" :key="index" :class="message.role">
            <p v-for="(line, lineIndex) in splitMessageContent(message.content)" :key="lineIndex">{{ line }}</p>
          </div>
        </div>
        <div class="chat-input">
          <input 
            type="text" 
            placeholder="가지고 계신 재료를 입력해주시면 근사한 레시피를 알려드릴게요!" 
            v-model="userInput" 
            @keyup.enter="sendMessage"
            :disabled="isChatUsed"
          >
          <button 
            @click="sendMessage" 
            :disabled="isChatUsed"
          >
            🍳
          </button>
        </div>
      </div>
      <div class="info">
        <p>서울시 금천구 가산동 670 18층 | PaikJongWon@theborn.com | Tel. 0507-1353-7302</p>
      </div>
    </main>
  </div>
</template>

<script>
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.VUE_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export default {
  name: 'App',
  data() {
    return {
      messages: [],
      userInput: '',
      maxLength: 200,
      isChatUsed: false,
    }
  },
  methods: {
    async sendMessage() {
      if (!this.userInput.trim()) return;

      const userMessage = { role: 'user', content: this.userInput };
      this.messages.push(userMessage);

      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [...this.messages, userMessage],
        });

        this.assistantMessage = response.choices[0]?.message?.content || 'Sorry, an error occurred.';
        if (this.assistantMessage.length > this.maxLength) {
              this.assistantMessage = this.assistantMessage.slice(0, this.maxLength) + '\n...';
        this.messages.push({ role: 'assistant', content: this.assistantMessage });
        }
        this.isChatUsed = true; // 채팅 기능 사용 후 비활성화
    
      } catch (error) {
        console.error('Error:', error);
        this.messages.push({ role: 'assistant', content: 'Sorry, an error occurred.' });
      }
      
      this.userInput = '';
    },
    splitMessageContent(content) {
      // 마침표를 기준으로 줄바꿈하며 내용을 나누어 반환
      return content.split(/(?<=\.)\s*/).map(sentence => sentence.trim()).filter(sentence => sentence);
    },
  }
};
</script>

<style>
@font-face {
  font-family: 'Satisfy';
  font-style: normal;
  font-weight: 400;
  src: url(https://fonts.gstatic.com/s/satisfy/v11/rP2Hp2yn6lkG50LoCZOIHQ.woff2) format('woff2');
  font-display: swap;
}

.corner-chef {
  font-family: 'Satisfy', cursive;
}

#app::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('@/assets/images/fixed/home_main_image.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  opacity: 0.8;
  z-index: -1;
}

main {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 이 부분을 유지합니다 */
  align-items: center;
  position: relative;
  z-index: 2;
  height: 100vh;
  padding: 50px 0; /* 상하 패딩을 동일하게 설정 */
  width: 100%;
  box-sizing: border-box; /* 패딩을 높이에 포함 */
}

h1 {
  font-size: 4rem;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  margin-bottom: 2rem;
  text-align: center;
  width: 100%;
}

.chat-container {
  width: 80%;
  max-width: 600px;
  height: 60vh;
  background-color: rgba(255, 255, 255, 0.5);  /* 마지막 0.5는 투명도에 관한 설정*/
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  position: relative; /* 로딩 스피너를 컨테이너에 맞게 위치시키기 위함 */
}

.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
}

.chat-input {
  display: flex;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 1);  /* 마지막 1은 투명도에 관한 설정*/
}

.chat-input input {
  flex-grow: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 20px;
  margin-right: 0.5rem;
}

.chat-input button {
  padding: 0.5rem;
  background-color: #FFD700;
  color: black;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 25px;
}

.chat-input button:hover {
  background-color: #FFC000;
}

.chat-input input:disabled,
.chat-input button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.loading-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 6px solid #f3f3f3; /* Light grey */
  border-top: 6px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.info {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  text-align: center;
  padding: 10px;
  position: absolute;
  bottom: 0;
  /* left: 0; */
  right: 0;
}

.info p {
  margin: 0;
  font-size: 14px;
}
</style>

