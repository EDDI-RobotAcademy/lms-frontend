import actions, { ChatActions } from "./actions"
import mutations, { ChatMutations } from "./mutations"
import state, { ChatState } from "./states"


export interface ChatbotModule {
    namespaced: true
    state: ChatState
    actions: ChatActions
    mutations: ChatMutations
}

const chatbotModule: ChatbotModule = {
    namespaced: true,
    state,
    actions,
    mutations,
}

export default chatbotModule