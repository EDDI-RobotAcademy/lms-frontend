
export interface RecipeState {
    savedRecipe : []
    getRecipe: boolean
    isRecipeSaved : boolean
}

const state: RecipeState = {
    savedRecipe: [],
    getRecipe: false,
    isRecipeSaved: false
};

export default state;