<template>
  <div class="chat-container">
    <div class="chat-messages">
      <div v-for="(message, index) in messages" :key="index" :class="message.role">
        <p>{{ message.content }}</p>
      </div>
    </div>
    <div class="chat-input" align="center">
      <v-text-field v-model="userInput" @keyup.enter="sendMessage" placeholder="어떤 레시피를 알려드릴까요?" class="custom-text-field" hide-details dense />
      <v-btn @click="toggleSpeechRecognition" :icon="isListening ? 'mdi-stop' : 'mdi-microphone'"
             :color="isListening ? '#F2B8B5' : '#ffff'" class="mic-button">
      </v-btn>
    </div>
  </div>
</template>


<script>
import { ref, onMounted } from 'vue';
import OpenAI from 'openai';

export default {
  name: 'ChatGPTClone',
  setup() {
    const messages = ref([]);
    const userInput = ref('');
    const openai = new OpenAI({
      apiKey: process.env.VUE_APP_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });

    onMounted(() => {
      // OpenAI 클라이언트 초기화
      // 주의: API 키를 클라이언트 측에 노출하는 것은 보안상 위험할 수 있습니다.
      // 실제 프로덕션 환경에서는 서버 측에서 API 호출을 처리하는 것이 좋습니다.
      openai.value = new OpenAI({
        apiKey: process.env.VUE_APP_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      });
    });

    const sendMessage = async () => {
      if (!userInput.value.trim()) return;

      const userMessage = { role: 'user', content: userInput.value };
      messages.value.push(userMessage);

      try {
        const stream = await openai.value.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: messages.value,
          stream: true,
        });

        let assistantResponse = '';
        for await (const chunk of stream) {
          assistantResponse += chunk.choices[0]?.delta?.content || '';
        }

        messages.value.push({ role: 'assistant', content: assistantResponse });
      } catch (error) {
        console.error('Error:', error);
        messages.value.push({ role: 'assistant', content: 'Sorry, an error occurred.' });
      }

      userInput.value = '';
    };

    return {
      messages,
      userInput,
      sendMessage,
    };
  },
  data() {
    return {
      isListening: false,
      recognition: null,
    };
  },
  mounted() {
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
  display: flex;
  margin-left: 20%;
  margin-right: 20%;
  align-items: center;
}

.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
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
  min-height: 40px; /* 텍스트 필드의 높이 조정 */
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