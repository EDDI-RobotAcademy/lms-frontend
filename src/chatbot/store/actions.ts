import { ActionContext } from "vuex";
import { AxiosResponse } from "axios";
import axiosInst from "@/utility/axiosInstance";
import { ChatState } from "./states"
import { REQUEST_SEND_MESSAGE_TO_FASTAPI, REQUEST_VOICE_TO_FASTAPI } from "./mutation-types";

export type ChatActions = {
    sendMessageToFastAPI(context: ActionContext<ChatState, any>, payload: { userSendMessage: string }):Promise<void>;//socket서버 연결 시 {command: number, data: unknown}
    requestVoiceToFastAPI(context: ActionContext<ChatState, any>, payload: { chatbotMessage: string }): Promise<void>;
   
};

const actions: ChatActions = {

    async sendMessageToFastAPI(context: ActionContext<ChatState, any>, payload: { userSendMessage: string }): Promise<void> {//socket서버 연결 시 {command: number, data: unknown}
        console.log('payload',payload)
        try {
            const res: AxiosResponse<any> = await axiosInst.fastapiAxiosInst.post('/request-generate-recipe-to-openai', payload, {timeout: 50000
              });
            console.log('Response received:', res.data);
            context.commit(REQUEST_SEND_MESSAGE_TO_FASTAPI, res.data);
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    },
    async requestVoiceToFastAPI(context: ActionContext<ChatState, any>, payload: { chatbotMessage: string }): Promise<void> {
        try {
            const res: AxiosResponse<any, any> = await axiosInst.fastapiAxiosInst.post('/lets-speak', payload, {timeout: 50000
            });
            context.commit(REQUEST_VOICE_TO_FASTAPI, res.data.audio_data);
        } catch (error) {
            console.error('Error fetching voices:', error);
            throw error;
        }
    },
}
export default actions