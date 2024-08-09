<!-- App.vue -->
<template>
  <div id="app">

    <main>
      <h1>JoBoa 'C'</h1>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  data() {
    return {
      // 데이터가 필요한 경우 여기에 추가
    }
  },
  methods: {
    goToChatbotPage() {
      // this.$router.push({ name: 'ChatbotPage' }); 
      console.log('페이지 이동')
    }
  }
});
</script>

<style>

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
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 2;
  height: 100vh;
}

h1 {
  font-size: 4rem;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>