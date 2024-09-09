
export interface ChatState {
    getDataResponse: boolean
    assistantMessage: unknown
    voice: unknown
    isRecipeSaved: boolean
}

const state: ChatState = {
    getDataResponse: false,
    assistantMessage: {} as any,
    voice: {} as any,
    isRecipeSaved: false
};

export default state;