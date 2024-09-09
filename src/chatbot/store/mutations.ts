import { MutationTree } from "vuex";
import { ChatState } from "./states";
import { REQUEST_SEND_MESSAGE_TO_FASTAPI, REQUEST_GET_MESSAGE_FROM_FASTAPI,
    REQUEST_VOICE_TO_FASTAPI, REQUEST_GET_VOICE_TO_FASTAPI } from "./mutation-types";
import { Audio } from "openai/resources";

export interface ChatMutations extends MutationTree<ChatState> {
    [REQUEST_SEND_MESSAGE_TO_FASTAPI](state: ChatState, receivedData: boolean): void
    [REQUEST_GET_MESSAGE_FROM_FASTAPI](state: ChatState, receivedData: any): void

    [REQUEST_VOICE_TO_FASTAPI](state: ChatState, receivedData: boolean): void
    [REQUEST_GET_VOICE_TO_FASTAPI](state: ChatState, receivedData: Audio): void

}

const mutations: MutationTree<ChatState> = {
    
    [REQUEST_SEND_MESSAGE_TO_FASTAPI](state: ChatState, receivedData: boolean): void{
        state.getMessageResponse = receivedData
    },
    [REQUEST_GET_MESSAGE_FROM_FASTAPI](state: ChatState, receivedData: any): void{
        state.assistantMessage = receivedData
    },
    
    [REQUEST_VOICE_TO_FASTAPI](state: ChatState, receivedData: boolean): void{
        state.getVoiceResponse = receivedData
    },
    [REQUEST_GET_VOICE_TO_FASTAPI](state: ChatState, receivedData: Audio): void {
        state.voice = receivedData
    },
}

export default mutations as ChatMutations