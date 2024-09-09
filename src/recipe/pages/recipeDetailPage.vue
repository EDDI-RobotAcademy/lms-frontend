<template>
  <main class="background">
    <div id="app">
      <v-container class="recipe-container">
        <v-card-title class="recipe-title">My Recipe Note</v-card-title>
        <v-card-text v-if="this.savedRecipe">
          <v-card-text class="recipe-number">Recipe No. {{ storageNumber }}</v-card-text>
          <p class="content">
            <strong class="recipe-name">{{ recipeName }} 만들기</strong>
          </p>
          <p class="content" v-html="styledRecipeContent"></p>
        </v-card-text>
        <div v-else>
          <p>레시피를 불러오는 중입니다...</p>
        </div>
      </v-container>
    </div>
  </main>
</template>

<script>
import { mapActions, mapState } from 'vuex';
const recipeModule = 'recipeModule';

export default {
  data() {
    return {
      userToken: localStorage.getItem("userToken"),
      content: 
        `[레시피 명]: 망고빙수\n
        \n\n[요리 인분 수]: 1인분

        [재료]: 망고 1개, 얼음 1컵, 우유 1/2컵, 설탕 1큰술, 통조림 망고 1/2캔, 콘드밀크 약간, 체리 1개, 연유 약간

        [요리 과정]: 
        망고는 껍질을 벗기고 적당한 크기로 썰어 놓습니다.
        얼음은 믹서에 넣고 설탕과 우유를 추가하여 곱게 갈아 빙수를 만듭니다.
        빙수를 그릇에 담은 후, 썰어놓은 망고와 통조림 망고를 올립니다.
        그 위에 콘드밀크와 연유를 뿌려줍니다.
        맨 위에 체리를 장식하면 망고빙수 완성입니다.`,
      storageNumber: 123,
      recipeName: '',
      styledRecipeContent: '',
    };
  },
  computed: {
    ...mapState(recipeModule, ["savedRecipe"]),
    recipeId() {
      return this.$route.params.recipeId;
      },
      hashKey() {
        return this.$route.query.hashKey;
      }
    },
    mounted() {
      console.log('Hash Key:', this.hashKey) // hashed된 recipe를 해당 페이지에서 this.hashkey로 불러올 수 있음
    },
  
    methods: {
    ...mapActions(recipeModule, ['requestGetRecipeToDjango']),

    async getRecipe() {
      await this.requestGetRecipeToDjango(this.userToken.trim());
      console.log('')
      this.recipeName = this.content.match(/\[레시피 명\]:\s*(.*)/)?.[1] || '';
      this.styledRecipeContent = this.content
        .replace(/\[레시피 명\]:.*\n*/, '') // 레시피 명 중복 제거
        .replace(/\[(.*?)\]:\s*/g, '<strong>[$1]</strong><br/>') // 대괄호 안 내용 두껍게 + 콜론 제거 + 줄바꿈
        .replace(/\n/g, '<br/>'); // 줄바꿈 처리
    }
  },
  created() {
    this.getRecipe(); // 컴포넌트가 생성될 때 레시피를 가져옴
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');

#app::before {
  z-index: -1;
}

.recipe-container {
  margin-top:-2%;
  background-color: #fffefb;
  border-radius: 7px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.277);
  height: 680px;
  padding: 10px;
  max-width: 900px;
  overflow-y: auto;
}

.recipe-title {
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  font-weight: bold;
  color: #333; 
  text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);
  text-align: center;
  margin-bottom: 1%;
}

.recipe-number {
  font-family: 'Playfair Display', serif;
  font-weight: bold;
  font-size: 15px;
  text-align: end;
  margin-right: 1%;
}

.recipe-name {
  font-size: 33px;
  font-weight: bold;
  color: #333;
}

.content {
  font-size: 15px;
  margin-left: 3%;
  line-height: 2.3;
  margin-top : -5%;
}

strong {
  font-weight: bold;
}
</style>
