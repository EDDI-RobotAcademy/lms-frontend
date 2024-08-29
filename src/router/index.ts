import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import BoardRoutes from '@/board/router/BoardRoutes'
import ChatbotRoutes from '@/chatbot/router/ChatbotRoutes'
import HomeRoutes from '@/home/router/HomeRoutes'
import AccountRoutes from '@/account/router/AccountRoutes'
import ContactRoutes from '@/contact/router/ContactRoutes'
import aiCommandModule from '@/gatherEverything/store/aiCommandModule'
import GatherEverythingRoutes from '@/gatherEverything/router/GatherEverythingRoutes'
import ReadRecipeRoutes from '@/readRecipe/router/readRecipeRoutes'
const routes: Array<RouteRecordRaw> = [
  ...HomeRoutes,
  ...BoardRoutes,
  ...ChatbotRoutes,
  ...AccountRoutes,
  ...ContactRoutes,
  ...GatherEverythingRoutes,
  ...ReadRecipeRoutes,
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
