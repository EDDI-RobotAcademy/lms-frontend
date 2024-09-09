import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import BoardRoutes from '@/board/router/BoardRoutes'
import ChatbotRoutes from '@/chatbot/router/ChatbotRoutes'
import HomeRoutes from '@/home/router/HomeRoutes'
import AccountRoutes from '@/account/router/AccountRoutes'
import ContactRoutes from '@/contact/router/ContactRoutes'
import AuthenticationRoutes from '@/authentication/router/AuthenticationRoutes'
import RecipeRoutes from '@/recipe/router/recipeRoutes'
const routes: Array<RouteRecordRaw> = [
  ...HomeRoutes,
  ...BoardRoutes,
  ...ChatbotRoutes,
  ...AccountRoutes,
  ...ContactRoutes,
  ...AuthenticationRoutes,
  ...RecipeRoutes,
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
