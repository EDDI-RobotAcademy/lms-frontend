<template>
    <div class="chat-container">
      <h1>조보아씨 bot</h1>
      
      <div class="chat-messages">
        <div v-for="(message, index) in messages" :key="index" :class="message.role">
          <p>{{ message.content }}</p>
        </div>
      </div>
      
      <div class="chat-input">
        <input v-model="userInput" @keyup.enter="sendMessage" placeholder="What is up?" />
        <button @click="sendMessage">Send</button>
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
      const openai = new OpenAI({ apiKey: process.env.VUE_APP_OPENAI_API_KEY , 
                                dangerouslyAllowBrowser: true 
                            });
  
      onMounted(() => {
        // OpenAI 클라이언트 초기화
        // 주의: API 키를 클라이언트 측에 노출하는 것은 보안상 위험할 수 있습니다.
        // 실제 프로덕션 환경에서는 서버 측에서 API 호출을 처리하는 것이 좋습니다.
        openai.value = new OpenAI({ apiKey: process.env.VUE_APP_OPENAI_API_KEY,
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
  };
  </script>
  
  <style scoped>
  .chat-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .chat-messages {
    height: 400px;
    overflow-y: auto;
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 20px;
  }
  
  .user, .assistant {
    margin-bottom: 10px;
    padding: 5px;
    border-radius: 5px;
  }
  
  .user {
    background-color: #e6f3ff;
  }
  
  .assistant {
    background-color: #f0f0f0;
  }
  
  .chat-input {
    display: flex;
  }
  
  input {
    flex-grow: 1;
    padding: 10px;
    margin-right: 10px;
  }
  
  button {
    padding: 10px 20px;
  }
  </style>