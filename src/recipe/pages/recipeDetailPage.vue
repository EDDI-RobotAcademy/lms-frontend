<template>
  <main class="background">
    <div id="app">
      <v-container class="recipe-container">
        <v-card-title class="recipe-title">My Recipe Note</v-card-title>
        <v-card-text v-if="recipe">
          <v-card-text class="recipe-number">Recipe No. {{ recipe.storageNumber }}</v-card-text>
          <p>{{ recipe.content }}</p>
        </v-card-text>
        <div v-else>
          <p>레시피를 불러오는 중입니다...</p>
        </div>
      </v-container>
    </div>
  </main>
</template>
  
<script lang="ts" setup>
import { ref } from 'vue';


const recipe = ref({
  storageNumber: 123,
  content: 
  `[레시피 명]: 망고빙수\n
\n\n[요리 인분 수]: 1명

[재료]: 망고 1개, 얼음 1컵, 우유 1/2컵, 설탕 1큰술, 통조림 망고 1/2캔, 콘드밀크 약간, 체리 1개, 연유 약간

[요리 과정]: 
망고는 껍질을 벗기고 적당한 크기로 썰어 놓습니다.
얼음은 믹서에 넣고 설탕과 우유를 추가하여 곱게 갈아 빙수를 만듭니다.
빙수를 그릇에 담은 후, 썰어놓은 망고와 통조림 망고를 올립니다.
그 위에 콘드밀크와 연유를 뿌려줍니다.
맨 위에 체리를 장식하면 망고빙수 완성입니다.`
});

</script>
  
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');
  
#app::before {
  background-color: aqua;
  z-index: -1;
}

.recipe-container {
  background-color: #fffefb;
  border-radius: 7px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.229);
  height: 650px;
  padding: 10px;

  max-width: 900px;
  overflow-y: auto;
  /* margin: 0 auto; */
  /* font-size: 1.1rem; */
  /* line-height: 1.6; 행간 */ 
}
.recipe-title {
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  font-weight: bold;
  color: #333; 
  text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);
  text-align: center;
  margin-bottom: 2.5rem;
}
.recipe-number {
  font-family: 'Playfair Display', serif;
  font-weight: bold;
  font-size: 15px;

  text-align:end;
}

.recipe-detail h2 {
  font-size: 30px;
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
