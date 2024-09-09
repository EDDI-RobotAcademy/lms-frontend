import { MutationTree } from "vuex";
import { RecipeState } from "./states"
import { SAVE_RECIPE_TO_FASTAPI, GET_RECIPE_FROM_FASTAPI, CHECK_GET_RECIPE} from "./mutation-types";
import recipeModule from "./recipeModule";

export interface RecipeMutations extends MutationTree<RecipeState> {
    [SAVE_RECIPE_TO_FASTAPI](state: RecipeState, receivedData: boolean): void
    [GET_RECIPE_FROM_FASTAPI](state: RecipeState, receivedData: boolean): void
    [CHECK_GET_RECIPE](state: RecipeState, receivedData: []): void

}

const mutations: MutationTree<RecipeState> = {
    [SAVE_RECIPE_TO_FASTAPI](state: RecipeState, receivedData: boolean): void{
        state.savedRecipe = receivedData
    },
    [GET_RECIPE_FROM_FASTAPI](state: RecipeState, receivedData: boolean): void{
        state.gotRecipe = receivedData
    },
    [CHECK_GET_RECIPE](state: RecipeState, receivedData: []): void{
        state.recipes = receivedData
    }
}

export default mutations as RecipeMutations