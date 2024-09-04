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
    async requestSaveRecipeToDjango(context: ActionContext<ChatState, any>, payload: { userToken: string, recipe: string }): Promise<void> {
        try {
            // 1. Redis에서 account_id 요청
            const accountIdResponse = await axiosInst.djangoAxiosInst.post('/google_oauth/redis-get-account-id', { userToken: payload.userToken });
            const account_id = accountIdResponse.data.account_id;
    
            // 2. Django로 user_recipe 저장 요청
            const res: AxiosResponse<any> = await axiosInst.djangoAxiosInst.post('/user_recipe/create-recipe', {
                accountId: account_id
            });
            // 3. user_recipe_id를 사용하여 Redis에 저장
            const user_recipe_id = res.data.userRecipeId;
            await axiosInst.djangoAxiosInst.post('/google_oauth/save-recipe-to-redis', {
                accountId: account_id,
                userRecipeId: user_recipe_id,
                recipe: payload.recipe
            });

    
            // 상태 업데이트
            context.commit(REQUEST_SAVE_RECIPE_TO_DJANGO, res.data);
        } catch (error) {
            console.error('Error saving recipe:', error);
            throw error;
        }
    } 
}
export default actions