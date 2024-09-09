import { ActionContext } from "vuex";
import { AxiosResponse } from "axios";
import { RecipeState } from "./states"
import axiosInst from "@/utility/axiosInstance";
import { REQUEST_SAVE_RECIPE_TO_DJANGO, REQUEST_GET_RECIPE_TO_DJANGO, CHECK_GET_RECIPE} from "./mutation-types";
import CryptoJS from 'crypto-js';
import Swal from 'sweetalert2';

export type RecipeActions = {
    requestSaveRecipeToDjango(context: ActionContext<RecipeState, any>, payload: {recipe: string}):Promise<void>;
    requestGetRecipeToDjango(context: ActionContext<RecipeState, any>, payload: {userToken: string}): Promise<void>;
    requestRedisGetRecipeToDjango(context: ActionContext<RecipeState, any>, account_id: number): Promise<void>;
};

const actions: RecipeActions = {
    async requestSaveRecipeToDjango(
        context: ActionContext<RecipeState, any>, 
        payload: { userToken: string, recipe: string }
    ): Promise<void> {
        try {
            //TODO. 아래 두 줄은 athentication의 actions에 정의하고 recipeDetailPage.vue 페이지의 메소드 내에서 실행해야 함
            // recipeHash를 생성하는 것 역시 chatbotPage.vue 안의 특정 메소드 내에서 생성하고 payload로 묶은 뒤 actions 함수를 실행하는 것이 좋을 듯 
            const accountIdResponse = await axiosInst.djangoAxiosInst.post('/google_oauth/redis-get-account-id', { userToken: payload.userToken });
            const account_id = accountIdResponse.data.account_id;
    
            const recipe = payload.recipe;
            const recipeHash = CryptoJS.SHA256(recipe).toString(CryptoJS.enc.Hex);
 
            const isSaved = await axiosInst.djangoAxiosInst.post('/user_recipe/create-recipe', {
                accountId: account_id,
                recipeHash: recipeHash
            });
            console.log('database에 recipe 저장완료')
            context.commit(REQUEST_SAVE_RECIPE_TO_DJANGO, true);

            // redis
            await axiosInst.djangoAxiosInst.post('/google_oauth/save-recipe-to-redis', {
                accountId: account_id,
                recipeHash: recipeHash,
                recipe: recipe
            });
        
            console.log('redis에 레시피 저장 완료');
            return isSaved.data.message

        } catch (error) {
            console.error("redis에 레시피 저장 중 오류 발생:", error);
            alert('레시피 저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    },

    async requestGetRecipeToDjango(context: ActionContext<RecipeState, any>, payload: {userToken: string}): Promise<void> {
        const accountIdResponse = await axiosInst.djangoAxiosInst.post('/google_oauth/redis-get-account-id', { userToken: payload.userToken });
        const accountId = accountIdResponse.data.account_id;
        try {
            const res = await axiosInst.djangoAxiosInst.post('/user_recipe/get-recipe', {accountId : accountId});
            // 해시와 account_id 값을 통해 mongo에 요청하는 함수 개별적으로 정의
            
            context.commit(REQUEST_GET_RECIPE_TO_DJANGO, res.data.message);
            context.commit(CHECK_GET_RECIPE, true);

        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    },
    async requestRedisGetRecipeToDjango(context: ActionContext<RecipeState, any>, account_id: number): Promise<void>{
        console.log('redis에 recipe 정보 요청')
    }
}
export default actions