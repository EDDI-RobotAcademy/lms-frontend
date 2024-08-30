<template>
  <div id="app">
    <main>
      <v-card-title v-if="nicknameTrigger" class="header-text">
        Hi {{this.nickname}}! Make Recipes with CORNER-CHEF🧑‍🍳
      </v-card-title>
      <div class="chat-container">
        <div  ref="chatMessages" class="chat-messages">
          <div v-for="(message, index) in messages" :key="index" class="message-container">
            <img v-if="message.role === 'user' && isAuthenticated" class="avatar" :src="profileImageSrc">
            <img v-if="message.role === 'assistant'" class="robot" :src="require('@/assets/images/fixed/chef_bot.png')">
            <div :class="message.role" class="message-content">
              <div v-html="formatMessage(message.content)"></div>
            </div>
          </div>
        </div>
        <div class="chat-input" align="center">
          <input 
            type="text" 
            v-model="userInput" 
            @keyup.enter="sendMessage" 
            placeholder="어떤 레시피를 알려드릴까요?" 
            class="custom-input"
            />
          <v-btn @click="toggleSpeechRecognition" :icon="isListening ? 'mdi-stop' : 'mdi-microphone'"
            :color="isListening ? '#F2B8B5' : '#333333'" class="mic-button">
          </v-btn>
          <audio v-if="generated" :src="audioSrc" controls></audio>
          <div v-if="isLoadingResponse" class="loading-container">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
            <p>답변이 생성되는 중입니다...</p>
          </div>
          <div v-if="isLoadingVoice" class="loading-voice-container">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
            <p>음성 서비스를 실행합니다...</p>
          </div>
        </div>
        <div v-if="chatbotMessage !== null" class="voice-options">
          <button v-for="actor in voiceActors" :key="actor" @click="onClickTalk(actor)">
            {{ actor }}
          </button>
        </div>
      </div>
    </main>
  </div>
</template> 

<script>
import OpenAI from 'openai';
import { mapActions, mapState } from "vuex";
import { nextTick, ref } from 'vue'

const authenticationModule = "authenticationModule";
const chatbotModule = 'chatbotModule';
const accountModule = 'accountModule';

    export default {
  name: 'Corner-Chefbot',
  data() {
    return {
      isListening: false,
      isLoadingResponse: false,
      isLoadingVoice: false,
      recognition: null,
      nicknameTrigger: false,
      nickname: '',
      UserTicket: '',
      messages: [],
      userInput: '',
      generatedVoice: '',
      generated: false,
      chatbotMessage: null,
      realAssistanatMessage: '',
      showVoiceOptions: false,
      selectedActor: null,
      voiceActors: ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'],
      profileNumber: '_dummy',
      userToken: localStorage.getItem("userToken")
    };
  },
  
  computed: {
    ...mapState(authenticationModule, ["isAuthenticated"]),
    ...mapState(chatbotModule, ['getMessageResponse', 'assistantMessage', 'getVoiceResponse', 'voice']),

    audioSrc() {
      return this.generatedVoice ? `data:audio/mpeg;base64,${this.generatedVoice}` : '';
    },
    profileImageSrc() {
      return require(`@/assets/images/fixed/img${this.profileNumber}.jpg`);
    }
  },
  mounted() {
    if (this.userToken) {
      this.requestUserToken();
      this.getNicknameFromDjango()
      this.getProfileImgFromDjango()
    }
    else {
      console.log("mounted 비회원")
    }
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        this.userInput = finalTranscript + interimTranscript;
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };
    } else {
      console.error('Speech recognition not supported');
    }
  },
  updated() {
    nextTick(() => {
      this.scrollToBottom();
    });
  },
  methods: {
    ...mapActions(accountModule, ['requestGetProfileImgToDjango']),
    ...mapActions(authenticationModule, ['requestRedisGetTicketToDjango', 'requestRedisGetEmailToDjango','requestRedisUpdateTicketToDjango', 'requestRedisGetNicknameToDjango']),
    ...mapActions(chatbotModule, ['sendMessageToFastAPI', 'getMessageFromFastAPI', 'requestVoiceToFastAPI', 'getVoiceFromFastAPI']),

    toggleSpeechRecognition() {
      if (this.recognition) {
        if (this.isListening) {
          this.stopSpeechRecognition();
        } else {
          this.startSpeechRecognition();
        }
      }
    },
    startSpeechRecognition() {
      if (this.recognition && !this.isListening) {
        this.isListening = true;
        this.recognition.start();
      }
    },
    stopSpeechRecognition() {
      if (this.recognition && this.isListening) {
        this.isListening = false;
        this.recognition.stop();
      }
    },
    async requestUserToken() {
      console.log("유저 토큰 확인");
      // this.$store.state.authenticationModule.isAuthenticated = true;

      try {
        const response = await this.requestRedisGetTicketToDjango(this.userToken.trim());
        console.log("requestRedisGetTicketToDjango:", response.ticket)
        this.ticket = response.ticket;
        console.log("유저 티켓 반환",this.ticket)
      } catch (error) {
        console.error("Error fetching paid member type:", error);
        }
    },
    
    async getNicknameFromDjango() { 
      const response = await this.requestRedisGetNicknameToDjango(this.userToken.trim());
      this.nickname = response.nickname
      this.nicknameTrigger = true

    },
    async getProfileImgFromDjango(){
      const email = await this.requestRedisGetEmailToDjango(this.userToken.trim());
      this.UserEmail = email.EmailInfo;

      const profileImg = await this.requestGetProfileImgToDjango(email.EmailInfo)
      this.profileNumber = profileImg

    },
    async getMessage() {
      while (this.getMessageResponse) {
        await this.getMessageFromFastAPI();
        await this.sleep(9000);
        console.log('while assistantMessage : ', this.assistantMessage)

        if (this.assistantMessage !== '큐 비었잖아 뭐함?') {
          break;
        }
      }
      this.chatbotMessage = this.assistantMessage.recipe || 'Sorry, an error occurred.';
      const botMessage = { role: 'assistant', content: this.chatbotMessage };
      this.messages.push(botMessage);

    },
    async getVoice() {
      while (this.getVoiceResponse) {
        await this.sleep(9000);
        await this.getVoiceFromFastAPI();
        console.log('while voice : ', this.voice)

        if (this.voice !== '큐 비었잖아 뭐함?') {
          break;
        }
      }
      this.generatedVoice = this.voice.audioData
      this.generated = true;
      console.log('generatedVoice : ', this.generatedVoice)

    },
    async sendMessage() {
      await this.requestRedisUpdateTicketToDjango(this.userToken.trim());

      if (!this.userInput.trim()) return;
  
      const userMessage = { role: 'user', content: this.userInput };
      this.messages.push(userMessage);

      try {
        const payload = {command:43, data :[this.userInput]}
        this.userInput = '';
        this.isLoadingResponse = true;
        await this.sendMessageToFastAPI(payload)

        console.log('send Message에 true? ', this.getMessageResponse)

        if (this.getMessageResponse) {
          await this.getMessage()
        }
        
      } catch (error) {
        console.error('Error:', error);
        this.messages.push({ role: 'assistant', content: 'Sorry, an error occurred.' });
      } finally {
        this.isLoadingResponse = false;
        this.generated = false;
      }
    },
    async selectVoiceActor(actor) {
      this.selectedActor = actor; // 선택된 음성 actor 저장
    },
    async onClickTalk (actor) {
      console.log("음성지원 서비스 버튼누름")
      await this.selectVoiceActor(actor)
      console.log('목소리: ', this.selectedActor)
      this.isLoadingVoice = true;
      try {
          const payload = {command: 44, data : [this.chatbotMessage, this.selectedActor]}
          await this.requestVoiceToFastAPI(payload)
          console.log('fast api가 request voice에 true를 보냈나요? ', this.getVoiceResponse)
          await this.getVoice()
      } catch (error) {
        console.error('Error:', error);
      } finally {
        this.isLoadingVoice = false;
      }
    },
    formatMessage(content) {
      return content.replace(/\n/g, '<br>');
    },
    scrollToBottom() {
      const chatMessages = this.$refs.chatMessages;
      if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    },
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
  }
};
</script>

<style scoped>
#app::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('@/assets/images/fixed/chatpage_background.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  opacity: 0.8;
  z-index: -1;
}

.header-text{
  margin-top:-2%;
  font-size: 50%;
  font-weight:lighter;
  text-align: center;
  font-size:200%;
  font-weight: bold;
}
.chat-container {
  max-width: 900px;
  background-color: #fffbfac5;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  height: 68vh;
  position: relative;
  border: 1.5px solid #e0d4c8d7; /* 테두리 두께, 스타일, 색상 */
  border-radius: 16px; /* 테두리 모서리를 둥글게 */
}

.chat-input {
  position: fixed;
  bottom: 0;
  left: 25%;
  right: 25%;
  display: flex;
  align-items: center;
  margin-bottom: 1%;
  background-color: #ffffff00;
  padding: 10px;
  /* gap: 10px; 마이크랑 프롬프트 사이의 간격 */ 
}
.with-shadow {
  box-shadow: 3px 2px 3px rgba(0, 0, 0, 0.1);
}
.custom-input {
  flex-grow: 1;
  padding: 12px;
  background-color: #f6eade;
  border: 1px solid #ffffff00;
  font-size: 15px;
  border-radius: 13px;
  /* border: 1.5px solid #e0d4c8; */

}
.custom-input::placeholder {
  color: rgba(0, 0, 0, 0.6); /* Placeholder 텍스트 색상 */
  font-style: Arial;
  padding-left: 1%;
}
.chat-messages {
  flex: 1; /* 남은 공간을 채우도록 설정 */
  overflow-y: auto; /* 채팅 내용이 넘칠 때 스크롤 */
  padding-bottom: 0px;
  z-index: 50;
}

.message-container {
  display: flex;
  margin-bottom: 0px; /* 메시지 간 간격 */
}
.message-content {
  max-width: 80%; /* 메시지의 최대 너비 (프로필 이미지가 있으면 나머지 공간을 차지) */
  border-radius: 15px;
  order: 1; /* 메시지 내용을 프로필 이미지의 왼쪽에 위치시키기 */
}

.user,
.assistant {
  font-style: Arial;
  padding: 13px;
  border-radius: 15px;
  margin-top: 2%;
  margin-left: 4%;
  margin-right: 4%;
}

.user {
  background-color: #ffb99b;
  align-self: flex-end;
  width:fit-content;
  margin-left: auto;
  box-shadow: 3px 2px 3px rgba(0, 0, 0, 0.1);
  position: relative; /* 필요: 자식 요소의 위치를 상대적으로 설정 */
  padding-right: 15px; /* 프로필 이미지 공간 확보 */
}

.assistant {
  background-color: #fcf3ea;
  align-self: flex-start;
  width:fit-content;
  box-shadow: -3px 2px 4px rgba(0, 0, 0, 0.1);
}
.avatar,
.robot {
  width: 35px; /* 프로필 이미지의 너비 */
  height: 35px; /* 프로필 이미지의 높이 */
  border-radius: 50%; /* 프로필 이미지 둥글게 */
  margin-top: 2%;
}

.avatar {
  order: 2; /* 프로필 이미지를 메시지의 오른쪽에 위치시키기 */
  margin-left: -2%;
  margin-right:2% ;

}
.robot {
  margin-left:2% ;
  margin-top: 2%;
  margin-right:-2% ;
  order: 0; /* 프로필 이미지를 메시지의 오른쪽에 위치시키기 */

}
.mic-button {
  min-width: 0;
  width: 46px;
  height: 46px;
  padding: 0;
}
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
  border-left-color: rgb(255, 140, 0);
  animation: spin 1s ease infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-voice-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
}

.loading-voice-container p {
  margin-left: 10px;
  color: #555;
}

.voice-options {
  display: flex;
  flex-direction: row; /* 버튼들을 행으로 배치 */
  flex-wrap: wrap; /* 버튼들이 화면 너비에 맞춰 자동으로 줄 바꿈 */
  gap: 10px; /* 버튼들 사이의 간격 */
  margin-top: 50px; /* 채팅 입력창 위쪽에 배치 */
  position: fixed; /* 화면의 고정된 위치에 배치 */
  bottom: 80px; /* 채팅 입력창 위쪽에 위치 */
  left: 20%;
  right: 20%;
  justify-content: center;

}

.voice-options button {
  width: 70px; /* 버튼 너비 */
  height: 36px; /* 버튼 높이 */
  border: none;
  border-radius: 15px; /* 네모난 모양 */
  background-color: #f0f0f0;
  cursor: pointer;
  font-size: 14px; /* 글자 크기 조정 */
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ff7e5a;
  font-family:Arial;
  color: white;
}
.voice-options button:hover {
  background-color: #ffede1;
}

.profile-image {
    max-width: 50px; /* 이미지의 최대 너비 */
    max-height: 50px; /* 이미지의 최대 높이 */
    object-fit: contain; /* 이미지의 비율을 유지하면서 컨테이너에 맞춤 */
}
</style>