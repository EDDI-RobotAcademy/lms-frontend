import { ActionContext } from "vuex";
import { AxiosResponse } from "axios";
import axiosInst from "@/utility/axiosInstance";
import { ChatState } from "./states"
import { REQUEST_SEND_MESSAGE_TO_FASTAPI, REQUEST_GET_MESSAGE_FROM_FASTAPI, 
    REQUEST_VOICE_TO_FASTAPI, REQUEST_GET_VOICE_TO_FASTAPI, REQUEST_SAVE_RECIPE_TO_DJANGO } from "./mutation-types";

export type ChatActions = {
    sendMessageToFastAPI(context: ActionContext<ChatState, any>, payload: {command: number, data: unknown}):Promise<void>;//socket서버 연결 시 {command: number, data: unknown}
    getMessageFromFastAPI(context: ActionContext<ChatState, any>):Promise<void>;
    requestVoiceToFastAPI(context: ActionContext<ChatState, any>, payload: { command: number, data: [] }): Promise<void>;
    getVoiceFromFastAPI(context: ActionContext<ChatState, any>):Promise<void>;
    requestSaveRecipeToDjango(context: ActionContext<ChatState, any>, payload: {recipe: string}):Promise<void>;
   
};

const actions: ChatActions = {

    async sendMessageToFastAPI(context: ActionContext<ChatState, any>, payload: {command: number, data: unknown}): Promise<void> {//socket서버 연결 시 {command: number, data: unknown}
        try {
            const res: AxiosResponse<any> = await axiosInst.fastapiAxiosInst.post('/request-ai-command', payload);
            context.commit(REQUEST_SEND_MESSAGE_TO_FASTAPI, res.data); // res.data
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
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    },
    async requestVoiceToFastAPI(context: ActionContext<ChatState, any>, payload: { command: number, data: [] }): Promise<void> {
        try {
            const res: AxiosResponse<any, any> = await axiosInst.fastapiAxiosInst.post('/request-ai-command', payload);
            context.commit(REQUEST_VOICE_TO_FASTAPI, res.data); 
        } catch (error) {
            console.error('Error fetching voices:', error);
            throw error;
        }
    },
    async getVoiceFromFastAPI(context: ActionContext<ChatState, any>):Promise<void>{
        try {
            const res: AxiosResponse<any> = await axiosInst.fastapiAxiosInst.post('/lets-speak', {timeout: 100000
              });
            context.commit(REQUEST_GET_VOICE_TO_FASTAPI, res.data); // audio_data
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    },
    async requestSaveRecipeToDjango(context: ActionContext<ChatState, any>, payload: {recipe: string}):Promise<void>{
        const res :  AxiosResponse<any> = await axiosInst.djangoAxiosInst.post('/recipe/save', payload)
        context.commit(REQUEST_SAVE_RECIPE_TO_DJANGO, res.data);
    }   
}
export default actions