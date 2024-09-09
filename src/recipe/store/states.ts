
export interface RecipeState {
    savedRecipe : boolean
    gotRecipe: boolean
    recipes : []
}

const state: RecipeState = {
    savedRecipe: false,
    gotRecipe: false,
    recipes: []
};

export default state;