import { RouteRecordRaw } from 'vue-router';
import RecipeDetailPage from '@/recipe/pages/recipeDetailPage.vue'; 

const RecipeRoutes: Array<RouteRecordRaw> = [
  {
    path: '/recipe/:recipeId',
    name: 'RecipeDetail',
    component: RecipeDetailPage,
    props: true
  }
];

export default RecipeRoutes;
