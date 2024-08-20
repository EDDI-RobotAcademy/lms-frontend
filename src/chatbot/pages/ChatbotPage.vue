<template class="chat-container">
  <div class="chat-messages">
    <div v-for="(message, index) in messages" :key="index" :class="message.role">
      <p v-for="(line, lineIndex) in splitMessageContent(message.content)" :key="lineIndex">{{ line }}</p>
    </div>
  </div>
  <div class="chat-input" align="center">
    <v-text-field v-model="userInput" @keyup.enter="sendMessage" placeholder="어떤 레시피를 알려드릴까요?" class="custom-text-field"
      hide-details dense />
    <v-btn @click="toggleSpeechRecognition" :icon="isListening ? 'mdi-stop' : 'mdi-microphone'"
      :color="isListening ? '#F2B8B5' : '#ffff'" class="mic-button">
    </v-btn>
  </div>
</template> 


<script>
import OpenAI from 'openai';
import { mapActions, mapState } from "vuex";

const authenticationModule = "authenticationModule";
const openai = new OpenAI({
      apiKey: process.env.VUE_APP_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });

    export default {
  name: 'Corner-Chefbot',
  data() {
    return {
      isListening: false,
      recognition: null,
      UserTicket: '',
      assistantMessages: '',  // 챗봇 응답을 저장하기 위한 변수 추가
      messages: [],
      userInput: '',
      globalClasses: {},
      globalStyles: {},
      voices: [],
      displaySettings: {
        play: {
          show: true,
          text: 'Play',
          icons: "",
          displayAsIcon: false,
          classes: "",
          style: ""
        },
        stop: {
          show: true,
          text: 'Stop',
          icons: "",
          displayAsIcon: false,
          classes: "",
          style: ""
        },
        pause: {
          show: true,
          text: 'Pause',
          icons: "",
          displayAsIcon: false,
          classes: "",
          style: ""
        }
      },
      supported: true, // 브라우저에서 TTS를 지원하는지 확인
      utterance: new SpeechSynthesisUtterance(),
      isPaused: false,
    };
  },
  computed: {
    ...mapState(authenticationModule, ["isAuthenticated"]),
  },
  mounted() {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      this.requestUserToken();
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
  methods: {
    ...mapActions(authenticationModule, ['requestRedisGetTicketToDjango']),
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
      const userToken = localStorage.getItem("userToken");
      if (userToken) {
        console.log("유저 토큰 확인");
        this.$store.state.authenticationModule.isAuthenticated = true;
        try {
          const response = await this.requestRedisGetTicketToDjango(userToken.trim());
          console.log("requestRedisGetTicketToDjango:", response.ticket)
          this.ticket = response.ticket;
          console.log("유저 티켓 반환",this.ticket)
        } catch (error) {
          console.error("Error fetching paid member type:", error);
        }
      }
    },
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
        this.messages.push({ role: 'assistant', content: this.assistantMessage });

        // TTS 기능 실행
        this.speak();

      } catch (error) {
        console.error('Error:', error);
        this.messages.push({ role: 'assistant', content: 'Sorry, an error occurred.' });
        
      }
      this.userInput = '';
    },
    speak() {
      console.log('speak');
      // 아래 주석은 ESLint 주석임. 삭제 X
      // eslint-disable-next-line no-useless-escape
      const filteredMessage = this.assistantMessage.replace(/[-~!():;'"<>^*%@#&{}[\]|\\\/`.,?]/g, '');

      this.utterance.text = filteredMessage;

      this.utterance.pitch = 8; // 피치 설정
      this.utterance.voice = this.getVoiceByLanguage(); // 언어에 맞는 음성 설정
      this.utterance.rate = 2; // 속도 설정
      this.utterance.onstart = () => {
        console.log("TTS 시작");
      };
      this.utterance.onend = () => {
        console.log("TTS 종료");
      };
      window.speechSynthesis.speak(this.utterance);
    },
    stop() {
      window.speechSynthesis.cancel();
    },
    pause() {
      this.isPaused = !this.isPaused;
      if (this.isPaused) {
        window.speechSynthesis.pause();
      } else {
        window.speechSynthesis.resume();
      }
    },
    getVoiceByLanguage() {
      const lang = 'ko-KR';  // 한국어 음성 선택
      for (const voice of window.speechSynthesis.getVoices()) {
        if (voice.lang === lang) {
          return voice;
        }
      }
      return window.speechSynthesis.getVoices()[0];
    },
    splitMessageContent(content) {
      // 마침표를 기준으로 줄바꿈하며 내용을 나누어 반환
      return content.split(/(?<=\.)\s*/).map(sentence => sentence.trim()).filter(sentence => sentence);
    },
  },
};
</script>

<style scoped>
.chat-container {
  background-color: #F6F1EB;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.chat-input {
  position: fixed;
  bottom: 0;
  left: 20%;
  right: 20%;
  display: flex;
  align-items: center;
  margin: 0;
  background-color: #F6F1EB;
  padding: 10px;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
}

.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
  margin-bottom: 70px;
}

.user,
.assistant {
  margin-bottom: 10px;
  padding: 5px;
  border-radius: 5px;
  margin-left: 25%;
  margin-right: 25%;
}

.user {
  background-color: #E4E0D7;
}

.assistant {
  background-color: #E9C8A6;
}

.custom-text-field {
  flex-grow: 1;
  margin-right: 10px;
}

.custom-text-field ::v-deep .v-input__control {
  min-height: 40px;
}

.custom-text-field ::v-deep .v-input__slot {
  margin-bottom: 0;
}

.mic-button {
  min-width: 0;
  width: 55px;
  height: 55px;
  padding: 0;
}
</style>