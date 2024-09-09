import accountModule from '@/account/store/accountModule'
import authenticationModule from '@/authentication/store/authenticationModule'
import boardModule from '@/board/store/boardModule'
import chatbotModule from '@/chatbot/store/chatbotModule'

import recipeModule from '@/recipe/store/recipeModule'
import { createStore } from 'vuex'

export default createStore({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    boardModule,
    accountModule,
    authenticationModule,
    chatbotModule,
    recipeModule
  }
})
