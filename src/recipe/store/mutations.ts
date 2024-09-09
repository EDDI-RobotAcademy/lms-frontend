import { MutationTree } from "vuex";
import { RecipeState } from "./states"
import { REQUEST_SAVE_RECIPE_TO_DJANGO, REQUEST_GET_RECIPE_TO_DJANGO, CHECK_GET_RECIPE} from "./mutation-types";
import recipeModule from "./recipeModule";

export interface RecipeMutations extends MutationTree<RecipeState> {
    [REQUEST_SAVE_RECIPE_TO_DJANGO](state: RecipeState, receivedData: boolean): void
    [REQUEST_GET_RECIPE_TO_DJANGO](state: RecipeState, receivedData: []): void
    [CHECK_GET_RECIPE](state: RecipeState, receivedData: boolean): void

}

const mutations: MutationTree<RecipeState> = {
    [REQUEST_SAVE_RECIPE_TO_DJANGO](state: RecipeState, receivedData: boolean): void{
        state.isRecipeSaved = receivedData
    },
    [REQUEST_GET_RECIPE_TO_DJANGO](state: RecipeState, receivedData: []): void{
        state.savedRecipe = receivedData
    },
    [CHECK_GET_RECIPE](state: RecipeState, receivedData: boolean): void{
        state.getRecipe = receivedData
    }
}

export default mutations as RecipeMutations