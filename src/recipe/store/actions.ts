import { ActionContext } from "vuex";
import { AxiosResponse } from "axios";
import { RecipeState } from "./states"
import axiosInst from "@/utility/axiosInstance";
import { SAVE_RECIPE_TO_FASTAPI, GET_RECIPE_FROM_FASTAPI, CHECK_GET_RECIPE} from "./mutation-types";
import {SWITCH_FALSE} from '@/chatbot/store/mutation-types';

export type RecipeActions = {
    requestRedisGetHashKeyToDjango(context: ActionContext<RecipeState, any>, accountId: number): Promise<void>;
    saveRecipeToFastAPI(context: ActionContext<RecipeState, any>, 
                        payload: { accountId: number, recipeHash: string, recipe: string }):Promise<void>;
    getRecipeFromFastAPI(context: ActionContext<RecipeState, any>): Promise<void>;
};

const actions: RecipeActions = { // 이름 바꿔야함
    async requestRedisGetHashKeyToDjango(context: ActionContext<RecipeState, any>, accountId: number): Promise<void>{
        const res = await axiosInst.djangoAxiosInst.post('/google_oauth/get-recipe-hashes', {accountId})
        console.log("1", res)
        return res.data.recipe_hashes
    },
    async saveRecipeToFastAPI(
        context: ActionContext<RecipeState, any>, 
        payload: { accountId: number, recipeHash: string, recipe: string }
    ): Promise<void> {
        try {   
            const res: AxiosResponse<any> = await axiosInst.fastapiAxiosInst.post('/save-log');
            console.log('database에 recipe 저장완료')
            context.commit(SAVE_RECIPE_TO_FASTAPI, true);
            context.commit(SWITCH_FALSE, false);

            // redis
            await axiosInst.djangoAxiosInst.post('/google_oauth/save-recipe-hash', {
                accountId: payload.accountId,
                recipeHash: payload.recipeHash,
                recipe: payload.recipe
            });
            console.log('redis에 레시피 저장 완료');

        } catch (error) {
            console.error("redis에 레시피 저장 중 오류 발생:", error);
            alert('레시피 저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    },

    async getRecipeFromFastAPI(context: ActionContext<RecipeState, any>): Promise<void> {
        const res: AxiosResponse<any> = await axiosInst.fastapiAxiosInst.post('/get-log');
        context.commit(GET_RECIPE_FROM_FASTAPI, true);
        context.commit(CHECK_GET_RECIPE, res.data.log_data.recipe)
        context.commit(SWITCH_FALSE, false);
        return res.data.recipe
    }
}
export default actions

