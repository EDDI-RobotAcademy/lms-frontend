import { ActionContext } from "vuex";
import { AxiosResponse } from "axios";
import axiosInst from "@/utility/axiosInstance";
import { ChatState } from "./states"
import { REQUEST_SEND_DATA_TO_FASTAPI, REQUEST_GET_MESSAGE_FROM_FASTAPI, REQUEST_GET_VOICE_TO_FASTAPI, SWITCH_FALSE } from "./mutation-types";

export type ChatActions = {
    sendDataToFastAPI(context: ActionContext<ChatState, any>, payload: {command: number, data: []}):Promise<void>;//socket서버 연결 시 {command: number, data: unknown}
    getMessageFromFastAPI(context: ActionContext<ChatState, any>):Promise<void>;
    getVoiceFromFastAPI(context: ActionContext<ChatState, any>):Promise<void>;
    saveHashDataToDjano(context: ActionContext<ChatState, any>, payload: {accountId: number, data: string }):Promise<void>;
   
};

const actions: ChatActions = {

    async sendDataToFastAPI(context: ActionContext<ChatState, any>, payload: {command: number, data: []}): Promise<void> {//socket서버 연결 시 {command: number, data: unknown}
        try {
            const res: AxiosResponse<any> = await axiosInst.fastapiAxiosInst.post('/request-ai-command', payload);
            context.commit(REQUEST_SEND_DATA_TO_FASTAPI, res.data); // res.data
            console.log('aws 응답: ', res.data)
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    },
    async getMessageFromFastAPI(context: ActionContext<ChatState, any>):Promise<void> {
        try {
            const res: AxiosResponse<any> = await axiosInst.fastapiAxiosInst.post('/request-generate-recipe-to-openai', {timeout: 1000000
              });
            context.commit(REQUEST_GET_MESSAGE_FROM_FASTAPI, res.data);
            // context.commit(SWITCH_FALSE, false);
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    },
    async getVoiceFromFastAPI(context: ActionContext<ChatState, any>):Promise<void>{
        try {
            const res: AxiosResponse<any> = await axiosInst.fastapiAxiosInst.post('/lets-speak', {timeout: 100000
              });
            context.commit(REQUEST_GET_VOICE_TO_FASTAPI, res.data); // audio_data
            context.commit(SWITCH_FALSE, false);
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    },
    async saveHashDataToDjano(context: ActionContext<ChatState, any>, payload: {accountId: number, data: string }):Promise<void>{
        try{
            const res: AxiosResponse<any> = await axiosInst.djangoAxiosInst.post('/save-recipe-hash')
        } catch(error){
            console.error('', error)
            throw error
        }
    },
}
export default actions