import { ActionContext } from "vuex";
import { AxiosResponse } from "axios";
import axiosInst from "@/utility/axiosInstance";
import { ChatState } from "./states"
import { REQUEST_SEND_MESSAGE_TO_FASTAPI, REQUEST_GET_MESSAGE_FROM_FASTAPI, 
    REQUEST_VOICE_TO_FASTAPI, REQUEST_GET_VOICE_TO_FASTAPI, REQUEST_SAVE_RECIPE_TO_DJANGO } from "./mutation-types";
import CryptoJS from 'crypto-js';
import Swal from 'sweetalert2';

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
    async requestSaveRecipeToDjango(
        context: ActionContext<ChatState, any>, 
        payload: { userToken: string, recipe: string }
    ): Promise<void> {
        try {
            // 1. Redis에서 account_id 요청
            const accountIdResponse = await axiosInst.djangoAxiosInst.post('/google_oauth/redis-get-account-id', { userToken: payload.userToken });
            const account_id = accountIdResponse.data.account_id;
    
            // 2. Recipe에 대한 SHA-256 해시값 생성 (crypto-js 사용)
            const recipe = payload.recipe;
            const recipeHash = CryptoJS.SHA256(recipe).toString(CryptoJS.enc.Hex);
    
            // 3. Django로 account_id, recipeHash 저장 요청 (MySQL 저장)
            const res = await axiosInst.djangoAxiosInst.post('/user_recipe/create-recipe', {
                accountId: account_id,
                recipeHash: recipeHash
            });
            console.log('recipeHash저장완료')
    
            // 4. 응답 데이터(res.data)를 Vuex 상태에 반영하기 위해 뮤테이션 호출
            context.commit('REQUEST_SAVE_RECIPE_TO_DJANGO', res.data);
    
            // 5. Redis에 account_id, recipeHash, recipe 저장
            await axiosInst.djangoAxiosInst.post('/google_oauth/save-recipe-to-redis', {
                accountId: account_id,
                recipeHash: recipeHash,
                recipe: recipe
            });
        // if (res.status === 201) {
        //    console.log('레시피 저장 완료');
        // } else if (res.status === 409) {
        //    console.log('중복된 레시피입니다.');
        // }
        
            console.log('레시피 저장 완료');
        } catch (error) {
            console.error("레시피 저장 중 오류 발생:", error);
            alert('레시피 저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    } 
}
export default actions