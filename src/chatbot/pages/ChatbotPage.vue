<template>
  <div id="app">
    <main>
      <div class="top-side-bar"></div>

      <div class="header-text">
        <v-card-title v-if="nicknameTrigger" class="text-align">
          Hi {{ this.nickname }}! Make Recipes with CORNER-CHEF🧑‍🍳
        </v-card-title>
      </div>

      <div class="side-bar"></div>
      <div class="side-bottom-bar"></div>

      <div class="chat-container">
        <div ref="chatMessages" class="chat-messages">
          <div v-for="(message, index) in messages" :key="index" class="message-container">
            <img v-if="message.role === 'user' && isAuthenticated" class="avatar" :src="profileImageSrc">
            <img v-if="message.role === 'assistant'" class="robot" :src="require('@/assets/images/fixed/chef_bot.png')">

            <div :class="['message-content', message.role]">
              <div v-html="formatMessage(message.content)"></div>
              <button v-if="message.role === 'assistant'" @click="openSaveDialog(message.content)"
                class="save-recipe-button">
                <i class="mdi mdi-content-save icon-align"></i>
              </button>
            </div>
          </div>
        </div>

        <audio v-if="generated" :src="audioSrc" controls class="audio"></audio>

        <div v-if="isLoadingResponse" class="loading-container">
          <div class="wrapper">
            <div class="circle"></div>
            <div class="circle"></div>
            <div class="circle"></div>
            <div class="shadow"></div>
            <div class="shadow"></div>
            <div class="shadow"></div>
          </div>
        </div>

        <!-- Dialog -->
        <v-dialog v-model="isclickSaveRecipe" class="pop-up-dialog">
          <v-card>
            <v-card-title>
              <v-text></v-text><br>
              <v-text>레시피를 저장하시겠습니까?</v-text>
            </v-card-title>
            <v-card-actions class="dialog-botton">
              <v-spacer></v-spacer>
              <v-btn text @click="saveRecipe()" class="button-go-page">확인</v-btn>
              <v-btn icon @click="closeDialog" class="close-btn" text>
                <v-icon color="#444444">mdi-close</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>

      <div class="chat-input">
        <input type="text" v-model="userInput" @keyup.enter="sendMessage" placeholder="어떤 레시피를 알려드릴까요?"
          class="custom-input" :disabled="isInputDisabled" />
        <v-btn @click="toggleSpeechRecognition" :icon="isListening ? 'mdi-stop' : 'mdi-microphone'"
          :color="isListening ? '#F2B8B5' : '#333333'" class="mic-button" />
      </div>

      <div v-if="showActorOption" class="voice-options">
        <button v-for="actor in voiceActors" :key="actor" @click="onClickTalk(actor)">
          {{ actor }}
        </button>
      </div>
    </main>
    <TicketShopPopup v-if="showTicketShop" @close="closeTicketShop" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { nextTick } from 'vue'
import CryptoJS from 'crypto-js';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import TicketShopPopup from '@/popup/pages/TicketShopPopup.vue';

const authenticationModule = "authenticationModule";
const chatbotModule = 'chatbotModule';
const accountModule = 'accountModule';
const recipeModule = 'recipeModule'

export default {
  name: 'Corner-Chefbot',
  components: {
    TicketShopPopup
  },
  data() {
    return {
      isListening: false,
      isLoadingResponse: false,
      isInputDisabled: false,
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
      showActorOption: false,
      voiceActors: ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'],
      profileNumber: '_dummy',
      userToken: localStorage.getItem("userToken"),
      isclickSaveRecipe: false,
      generatedRecipe: '',
      showTicketShop: false,
    };
  },

  computed: {
    ...mapState(authenticationModule, ["isAuthenticated"]),
    ...mapState(chatbotModule, ['getDataResponse', 'assistantMessage', 'voice']),
    ...mapState(recipeModule, ['isRecipeSaved', 'getRecipe']),

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
    ...mapActions(authenticationModule, ['requestRedisUpdateTicketToDjango', 'requestRedisGetTicketToDjango', 'requestRedisGetAccountIdToDjango',
      'requestRedisGetEmailToDjango', 'requestRedisUpdateTicketToDjango', 'requestRedisGetNicknameToDjango']),
    ...mapActions(chatbotModule, ['sendDataToFastAPI', 'getMessageFromFastAPI', 'getVoiceFromFastAPI']),
    ...mapActions(recipeModule, ['saveRecipeToFastAPI']),

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

      try {
        const response = await this.requestRedisGetTicketToDjango(this.userToken.trim());
        console.log("requestRedisGetTicketToDjango:", response.ticket)
        this.ticket = response.ticket;
        console.log("유저 티켓 반환", this.ticket)
      } catch (error) {
        console.error("Error fetching paid member type:", error);
      }
    },

    async getNicknameFromDjango() {
      const response = await this.requestRedisGetNicknameToDjango(this.userToken.trim());
      this.nickname = response.nickname
      this.nicknameTrigger = true

    },
    async getProfileImgFromDjango() {
      const email = await this.requestRedisGetEmailToDjango(this.userToken.trim());
      this.UserEmail = email.EmailInfo;

      const profileImg = await this.requestGetProfileImgToDjango(email.EmailInfo)
      this.profileNumber = profileImg

    },
    async getMessage() {
      while (this.getDataResponse) {
        await this.sleep(9000);
        await this.getMessageFromFastAPI();
        console.log('while assistantMessage : ', this.assistantMessage)

        if (this.assistantMessage !== '큐 비었잖아 뭐함?') {
          break;
        }
      }
      this.chatbotMessage = this.assistantMessage.recipe || 'Sorry, an error occurred.';
      const botMessage = { role: 'assistant', content: this.chatbotMessage };
      this.messages.push(botMessage);
      this.showActorOption = true;

    },
    async getVoice() {
      this.showActorOption = false;
      while (this.getDataResponse) {
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
      if (this.isInputDisabled) return;

      this.isInputDisabled = true;

      try {
        const ticketResponse = await this.requestRedisGetTicketToDjango(this.userToken.trim());
        this.$store.commit(`${authenticationModule}/SET_TICKET`, ticketResponse.ticket);

        if (ticketResponse.ticket <= 0) {
          toast.error("티켓이 부족합니다.", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000,
          });
          this.showTicketShop = true;
          return;
        }

        if (!this.userInput.trim()) return;

        this.isLoadingResponse = true;

        await this.requestRedisUpdateTicketToDjango(this.userToken.trim());

        const userMessage = { role: 'user', content: this.userInput };
        this.messages.push(userMessage);

        const payload = { command: 45, data: [this.userInput] };
        this.userInput = '';
        await this.sendDataToFastAPI(payload)

        if (this.getDataResponse) {
          await this.getMessage()
        }

      } catch (error) {
        console.error('Error:', error);
        this.messages.push({ role: 'assistant', content: 'Sorry, an error occurred.' });
      } finally {
        this.isLoadingResponse = false;
        this.isInputDisabled = false;
        this.generated = false;
      }
    },
    closeTicketShop() {
      this.showTicketShop = false;
    },
    async selectVoiceActor(actor) {
      this.selectedActor = actor;
    },
    async onClickTalk(actor) {
      console.log("음성지원 서비스 버튼누름")
      await this.selectVoiceActor(actor)
      console.log('목소리: ', this.selectedActor)
      this.isLoadingResponse = true;

      try {
        const payload = { command: 44, data: [this.chatbotMessage, this.selectedActor] }
        await this.sendDataToFastAPI(payload)
        console.log('request voice에 true? ', this.getDataResponse)

        if (this.getDataResponse) {
          await this.getVoice()
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        this.isLoadingResponse = false;
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
    openSaveDialog(generatedRecipe) {
      this.isclickSaveRecipe = true;
      this.generatedRecipe = generatedRecipe
    },
    async saveRecipe() {
      console.log('레시피 저장하기: ', this.generatedRecipe)
      const accountId = await this.requestRedisGetAccountIdToDjango(this.userToken.trim())
      const recipeHash = CryptoJS.SHA256(this.generatedRecipe).toString(CryptoJS.enc.Hex);

      const payload = { command: 56, data: [accountId, recipeHash, this.generatedRecipe] }
      await this.sendDataToFastAPI(payload)
      try {
        if (this.getDataResponse) {
          const payload = { accountId: accountId, recipeHash: recipeHash, recipe: this.generatedRecipe }
          await this.saveRecipeToFastAPI(payload);
        }
        // 레시피가 성공적으로 저장된 경우
        if (this.getDataResponse) {
          this.generatedRecipe = ''; // 저장 성공 시 레시피 초기화
          alert('레시피가 성공적으로 저장되었습니다.');
          this.closeDialog()
        }
      } catch (error) {
        console.error('레시피 저장 실패:', error);
      }
    },
    closeDialog() {
      this.isclickSaveRecipe = false;
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
  background-color: #fffbfa;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  opacity: 0.8;
  z-index: -1;
}

.header-text {
  background-color: #fffbfa;
  position: fixed;
  top: 0;
  right: 0;
  width: 81.9%;
  max-width: 100%;
  height: 9vh;
  text-align: center;
  flex-direction: column;
}

.text-align {
  margin-top: 0.7%;
  font-size: 20px;
  font-family: sans-serif;
  height: 100%;
  width: 100%;
  font-weight: lighter;
}

.top-side-bar {
  background-color: #fcf3ea;
  margin-top: -3.5%;
  top: 0;
  left: 0;
  height: 9vh;
  width: 18.1%;
  border-right: 0.7px solid #c3c3c3d7;
  box-sizing: border-box;
}

.side-bar {
  background-color: #fcf3ea;
  top: 9vh;
  left: 0;
  bottom: 0;
  max-height: 84vh;
  height: 84vh;
  width: 18.1%;
  border-right: 0.7px solid #c3c3c3d7;
  box-sizing: border-box;
}

.side-bottom-bar {
  background-color: #fcf3ea;
  top: 9vh;
  left: 0;
  bottom: 0;
  max-height: 7vh;
  height: 7vh;
  width: 18.1%;
  border-right: 0.7px solid #c3c3c3d7;
  box-sizing: border-box;
}

.chat-container {
  flex: 1;
  position: fixed;
  max-width: 100%;
  max-height: 84vh;
  background-color: #fef7f5f5;
  top: 9vh;
  right: 0;
  width: 81.9%;
  height: 84vh;
  border-top: 0.7px solid #c3c3c3d7;
  border-bottom: 0.7px solid #c3c3c3d7;
  border-radius: 0px;
  box-sizing: border-box;
  /* padding과 border를 width에 포함시킴 */
}

.chat-input {
  flex: 1;
  position: fixed;
  bottom: 0;
  max-height: 7.9vh;
  height: 7.9vh;
  right: 0;
  width: 81.9%;
  max-width: 100%;
  background-color: #fffbfa;
  padding: 10px;
  gap: 100px;
}

.custom-input {
  left: 0;
  margin-left: 18.8%;
  flex-grow: 1;
  width: 76%;
  align-self: center;
  position: fixed;
  max-height: 5.2vh;
  height: 5.2vh;
  padding: 10px;
  background-color: #F6F1EB;
  border: 1px solid #ffffff00;
  font-size: 13px;
  border-radius: 5px;

}

.custom-input::placeholder {
  color: rgba(0, 0, 0, 0.6);
  font-style: Arial;
  padding-left: 1%;

}

.custom-input:disabled {
  background-color: #ece4e2;
  cursor: not-allowed;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 50px;
  z-index: 50;
}

.message-container {
  display: flex;
}

.message-content {
  position: relative;
  max-width: 80%;
  border-radius: 15px;
  order: 1;
  padding-bottom: 40px;
  padding-right: 40px;
}

.assistant {
  background-color: #fcf3ea;
  align-self: flex-start;
  margin-bottom: 1.5%;
  width: fit-content;
  box-shadow: -3px 2px 4px rgba(0, 0, 0, 0.1);
  padding-right: 40px;
}

.save-recipe-button {
  position: absolute;
  bottom: 0.5px;
  right: 1px;
  z-index: 40;
  cursor: pointer;
  color: #ffa70f;
  background: none;
  border: none;
  padding: 5px;
}



.user,
.assistant {
  font-style: Arial;
  font-size: 12px;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 12px;
  padding-right: 25px;
  border-radius: 15px;
  margin-top: 2%;
  margin-left: 4%;
  margin-right: 4%;
}

.user {
  background-color: #ffb99b;
  align-self: flex-end;
  width: fit-content;
  margin-left: auto;
  box-shadow: 3px 2px 3px rgba(0, 0, 0, 0.1);
  position: relative;
  padding-right: 15px;
}

.assistant {
  background-color: #fcf3ea;
  align-self: flex-start;
  margin-bottom: 1.5%;
  width: fit-content;
  box-shadow: -3px 2px 4px rgba(0, 0, 0, 0.1);
}

.avatar,
.robot {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin-top: 2%;
}

.avatar {
  order: 2;
  margin-left: -2%;
  margin-right: 2%;

}

.robot {
  margin-left: 2%;
  margin-top: 2%;
  margin-right: -2%;
  order: 0;
}

.mic-button {
  left: 0;
  position: fixed;
  margin-left: 95.5%;
  align-self: center;
  min-width: 0;
  width: 37px;
  height: 39px;
  padding: 0;
}

.wrapper {
  margin-bottom: 25%;
  width: 100px;
  height: 60px;
  position: relative;
  z-index: 1;
}

.circle {
  width: 10%;
  height: 10px;
  position: absolute;
  border-radius: 50%;
  background-color: hsl(25, 100%, 62%);
  left: 15%;
  transform-origin: 50%;
  animation: circle7124 .5s alternate infinite ease;
}

@keyframes circle7124 {
  0% {
    top: 60px;
    height: 5px;
    border-radius: 50px 50px 25px 25px;
    transform: scaleX(1.7);
  }

  40% {
    height: 20px;
    border-radius: 50%;
    transform: scaleX(1);
  }

  100% {
    top: 0%;
  }
}

.circle:nth-child(2) {
  left: 45%;
  animation-delay: .2s;
}

.circle:nth-child(3) {
  left: auto;
  right: 15%;
  animation-delay: .3s;
}

.shadow {
  width: 11px;
  height: 4px;
  border-radius: 50%;
  background-color: rgba(165, 158, 154, 0.9);
  position: absolute;
  top: 62px;
  transform-origin: 50%;
  z-index: -1;
  left: 15%;
  filter: blur(1px);
  animation: shadow046 .5s alternate infinite ease;
}

@keyframes shadow046 {
  0% {
    transform: scaleX(1.5);
  }

  40% {
    transform: scaleX(1);
    opacity: .7;
  }

  100% {
    transform: scaleX(.2);
    opacity: .4;
  }
}

.shadow:nth-child(4) {
  left: 45%;
  animation-delay: .2s
}

.shadow:nth-child(5) {
  left: auto;
  right: 15%;
  animation-delay: .3s;
}

.voice-options {
  display: flex;
  flex-direction: row;
  /* 버튼들을 행으로 배치 */
  flex-wrap: wrap;
  /* 버튼들이 화면 너비에 맞춰 자동으로 줄 바꿈 */
  gap: 10px;
  /* 버튼들 사이의 간격 */
  position: fixed;
  /* 화면의 고정된 위치에 배치 */
  bottom: 70px;
  /* 채팅 입력창 위쪽에 위치 */
  left: 19.2%;

}

.voice-options button {
  width: 70px;
  height: 36px;
  border: none;
  border-radius: 15px;
  background-color: #f0f0f0;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ff7e5a;
  font-family: Arial;
  color: white;
}

.voice-options button:hover {
  background-color: #ffede1;
}

.audio {
  margin-bottom: 1%;
  margin-left: 0.5%;
}

.profile-image {
  max-width: 50px;
  max-height: 50px;
  object-fit: contain;
}

.save-recipe-button {
  z-index: 40;
  cursor: pointer;
  color: #ffa70f;
  margin-top: 4.8%;
}

.save-recipe-button:hover {
  color: #fff8f7;
}

.pop-up-dialog {
  text-align: center;
  width: 400px;
  /* border-radius: 50px; */
  max-height: 800px;
  height: 300px;
  padding: 20px;
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
</style>