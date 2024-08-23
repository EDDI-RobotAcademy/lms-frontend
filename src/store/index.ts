import accountModule from '@/account/store/accountModule'
import authenticationModule from '@/authentication/store/authenticationModule'
import boardModule from '@/board/store/boardModule'
import chatbotModule from '@/chatbot/store/chatbotModule'
import aiCommandModule from '@/gatherEverything/store/aiCommandModule'
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
    aiCommandModule,
  }
})
