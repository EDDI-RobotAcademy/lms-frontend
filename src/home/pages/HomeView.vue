<template>
  <div id="app">
    <main>
      <h1 class="corner-chef">Corner-Chef</h1>
      <div class="chat-container">
        <div class="chat-messages">
          <div v-for="(message, index) in messages" :key="index" :class="message.role">
            <div v-html="formatMessage(message.content)"></div>
          </div>
        </div>
        <div class="chat-input">
          <input type="text" placeholder="가지고 계신 재료를 입력해주시면 근사한 레시피를 알려드릴게요!" v-model="userInput"
            @keyup.enter="sendMessage" :disabled="isChatUsed">
          <button @click="sendMessage" :disabled="isChatUsed">🍳</button>
        </div>
      </div>

      <div class="info">
        <p>서울시 금천구 가산동 670 18층 | PaikJongWon@theborn.com | Tel. 0507-1353-7302</p>
      </div>
      <!-- 답변 생성 로딩 표시 -->
      <div v-if="isLoadingMessage" class="loading-container">
        <div class="spinner"></div>
        <p>답변이 생성되는 중입니다...</p>
      </div>

      <v-dialog v-model="dialogForMember" class="pop-up-dialog">
        <v-card>
          <v-card-title class="headline grey lighten-2">
            <v-text class="head-icon">🤗</v-text><br>
            <v-text class="head-text">더 많은 레시피 물어보기</v-text>
          </v-card-title>
          <v-card-text class="pa-4">
            <v-text class="middle-text">채팅 페이지에서 CORNER-CHEF와<br>더 많은 이야기를 나눠보세요!</v-text>
          </v-card-text>
          <v-card-actions class="dialog-botton">
            <v-spacer></v-spacer>
            <v-btn text @click="goToChatbot" class="button-go-page">레시피 만들러 가기</v-btn>
            <v-btn icon @click="closeDialog" class="close-btn" text>
              <v-icon color="#444444">mdi-close</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogForNonMember" class="pop-up-dialog">
        <v-card>
          <v-card-title class="headline grey lighten-2">
            <v-text class="head-icon">🎁</v-text><br>
            <v-text class="head-text">신규 회원가입 혜택!</v-text>
          </v-card-title>
          <v-card-text class="pa-4">
            <v-text class="middle-text">신규 회원가입 혜택을 지금 바로 받아보세요!</v-text>
          </v-card-text>
          <v-card-actions class="dialog-botton">
            <v-spacer></v-spacer>
            <v-btn text @click="goToLogin" class="button-go-page">3초만에 가입하고 혜택 받기</v-btn>
            <v-btn icon @click="closeDialog" class="close-btn" text>
              <v-icon color="#444444">mdi-close</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </main>
  </div>
</template>

<script>
import OpenAI from 'openai';
import { mapState } from "vuex";
import router from "@/router";
const authenticationModule = "authenticationModule";

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
      isChatUsed: false,
      assistantMessage: '',
      isLoadingMessage: false,
      dialogForMember: false,
      dialogForNonMember: false,
      refreshFlag: false,
    }
  },
  computed: {
    ...mapState(authenticationModule, ["isAuthenticated"])
  },
  methods: {
    async sendMessage() {
      if (!this.userInput.trim()) return;
      const userMessage = { role: 'user', content: this.userInput };
      this.messages.push(userMessage);
      this.userInput = '';
      try {
        this.isLoadingMessage = true;
        const response = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [...this.messages, userMessage],
        });

        this.assistantMessage = response.choices[0]?.message?.content || 'Sorry, an error occurred.';
        this.messages.push({ role: 'assistant', content: this.assistantMessage });
        this.isChatUsed = true; // 채팅 기능 사용 후 비활성화

      } catch (error) {
        console.error('Error:', error);
        this.messages.push({ role: 'assistant', content: 'Sorry, an error occurred.' });
      } finally {
        this.isLoadingMessage = false;
        console.log('authentication:', this.isAuthenticated)
        if (this.isAuthenticated) {
          setTimeout(() => {
            this.dialogForMember = true;
          }, 3000);
        } else if (!this.isAuthenticated) {
          setTimeout(() => {
            this.dialogForNonMember = true;
          }, 3000);
        }
      }
    },
    formatMessage(content) {
      return content.replace(/\n/g, '<br>');
    },
    goToChatbot() {
      router.push('/chatbot/page')
    },
    goToLogin() {
      router.push('/account/login')
    },
    closeDialog() {
      this.dialogForMember = false; // 다이얼로그 닫기
    },
    refreshPage() {
      this.refreshFlag = true;
      this.$nextTick(() => {
        this.refreshFlag = false;
      });
    },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.path === '/account/login' || from.path === '/account/mypage') {
        vm.$nextTick(() => {
          window.location.reload();
        });
      }
    });
  },
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
  justify-content: space-between;
  /* 이 부분을 유지합니다 */
  align-items: center;
  position: relative;
  z-index: 2;
  height: 100vh;
  padding: 50px 0;
  /* 상하 패딩을 동일하게 설정 */
  width: 100%;
  box-sizing: border-box;
  /* 패딩을 높이에 포함 */
}

h1 {
  font-size: 4rem;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin-bottom: 2rem;
  text-align: center;
  width: 100%;
}

.chat-container {
  width: 80%;
  max-width: 600px;
  height: 60vh;
  background-color: rgba(255, 255, 255, 0.5);
  /* 마지막 0.5는 투명도에 관한 설정*/
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
}

.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
  margin-bottom: 70px;
}

.chat-input {
  display: flex;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 1);
  /* 마지막 1은 투명도에 관한 설정*/
}

.chat-input input {
  flex-grow: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 20px;
  margin-right: 0.5rem;
  text-align: left;
  /* 왼쪽 정렬 */
  background-color: #fff;
  /* 기본 배경색 */
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

.message-container {
  display: flex;
  flex-direction: column;
}

.user,
.assistant {
  margin: 5px 0;
  /* 위아래 간격 */
  padding: 10px;
  border-radius: 10px;
  max-width: 100%;
  word-wrap: break-word;

}

.user {
  text-align: right;
  background-color: #ffb357;
  align-self: flex-end;
}

.assistant {
  text-align: left;
  background-color: #fff6ef;
  align-self: flex-start;
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

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -310px;
  /* top: -20px; 위로 20px 올림 */
}

.loading-container p {
  margin-left: 10px;
  color: #555;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #09f;
  animation: spin 1s ease infinite;
}

.pop-up-dialog {
  text-align: center;
  width: 400px;
  border-radius: 50px;
  /* 둥글게 만들기 */
  max-height: 800px;
  height: 300px;
  padding: 20px;

}

.head-icon {
  position: relative;
  top: 5px;
  font-size: 40px;
}

.head-text {
  position: relative;
  top: -5px;
  font-size: 25px;
  font-weight: bold;
}

.middle-text {
  position: relative;
  /* 상대 위치 설정 */
  top: -10px;
  /* 위로 이동 */
  text-align: center;
  font-size: 15px;
}

.dialog-botton {
  align-self: center;
  color: white;

}

.button-go-page {
  font-weight: lighter;
  background-color: rgb(55, 55, 55);
  /* 버튼 배경색 */
  text-decoration: white;
  /* 버튼 텍스트 색 */
  border-radius: 10px;
  /* 버튼 모서리 둥글게 */
  padding: 13px 15px;
  /* 버튼 패딩 */
}

.close-btn {
  position: absolute !important;
  top: 8px;
  right: 8px;
  background-color: transparent !important;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
