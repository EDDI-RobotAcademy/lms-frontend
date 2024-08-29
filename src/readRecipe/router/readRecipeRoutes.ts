import { RouteRecordRaw } from 'vue-router';
import RecipeDetailPage from '@/readRecipe/pages/recipeDetailPage.vue'; 

const ReadRecipeRoutes: Array<RouteRecordRaw> = [
  {
    path: '/recipe/:recipeId',
    name: 'RecipeDetail',
    component: RecipeDetailPage,
    props: true
  }
];

export default ReadRecipeRoutes;
