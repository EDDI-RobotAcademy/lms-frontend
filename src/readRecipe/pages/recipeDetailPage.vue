<template>
    <div id="app">
      <div class="recipe-detail">
        <h1 class="recipe-title">My Recipe Note</h1>
        <div v-if="recipe">
          <h2>저장소 번호: {{ recipe.storageNumber }}</h2>
          <p>{{ recipe.content }}</p>
        </div>
        <div v-else>
          <p>레시피를 불러오는 중입니다...</p>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue';
  
  
  const recipe = ref({
    storageNumber: 123,
    content: '이것은 더미 레시피 내용입니다. 실제 데이터는 나중에 Django API에서 가져올 예정입니다.'
  });
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');
  
  
  .recipe-title {
    font-family: 'Playfair Display', serif;
    font-size: 3.5rem;
    color: #333; 
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    text-align: center;
    margin-bottom: 2.5rem;
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
  
 
  .recipe-detail {
    padding: 30px;
    background-color: #fdf6e3; 
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 800px;
    margin: 0 auto;
    color: #3e2723; 
    font-size: 1.1rem;
    line-height: 1.6;
  }
  
  .recipe-detail h2 {
    font-size: 1.8rem;
    color: #5d4037; 
    margin-bottom: 15px;
    border-left: 5px solid #FF6F61;
    padding-left: 10px;
  }
  
  .recipe-detail p {
    font-size: 1.2rem;
    line-height: 1.8;
  }
  </style>
  