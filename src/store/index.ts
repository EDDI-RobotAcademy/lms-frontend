import accountModule from '@/account/store/accountModule'
import boardModule from '@/board/store/boardModule'
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
  }
})
