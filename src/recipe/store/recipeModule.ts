import actions, { RecipeActions } from "./actions"
import mutations, { RecipeMutations } from "./mutations"
import state, { RecipeState } from "./states"

export interface RecipeModule {
    namespaced: true
    actions: RecipeActions
    state: RecipeState,
    mutations: RecipeMutations
}

const recipeModule: RecipeModule = {
    namespaced: true,
    actions,
    state,
    mutations
}

export default recipeModule