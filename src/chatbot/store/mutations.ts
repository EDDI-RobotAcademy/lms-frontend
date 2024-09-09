import { MutationTree } from "vuex";
import { ChatState } from "./states";
import { REQUEST_SEND_DATA_TO_FASTAPI, REQUEST_GET_MESSAGE_FROM_FASTAPI, REQUEST_GET_VOICE_TO_FASTAPI, SWITCH_FALSE } from "./mutation-types";
import { Audio } from "openai/resources";

export interface ChatMutations extends MutationTree<ChatState> {
    [REQUEST_SEND_DATA_TO_FASTAPI](state: ChatState, receivedData: boolean): void
    [REQUEST_GET_MESSAGE_FROM_FASTAPI](state: ChatState, receivedData: any): void
    [REQUEST_GET_VOICE_TO_FASTAPI](state: ChatState, receivedData: Audio): void
    [SWITCH_FALSE](state: ChatState,  receivedData: boolean): void

}

const mutations: MutationTree<ChatState> = {
    
    [REQUEST_SEND_DATA_TO_FASTAPI](state: ChatState, receivedData: boolean): void{
        state.getDataResponse = receivedData
    },
    [REQUEST_GET_MESSAGE_FROM_FASTAPI](state: ChatState, receivedData: any): void{
        state.assistantMessage = receivedData
    },
    [REQUEST_GET_VOICE_TO_FASTAPI](state: ChatState, receivedData: Audio): void {
        state.voice = receivedData
    },
    [SWITCH_FALSE](state: ChatState, receivedData: boolean): void {
        state.getDataResponse = receivedData
    }
}

export default mutations as ChatMutations