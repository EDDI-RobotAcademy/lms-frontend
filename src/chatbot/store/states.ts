
export interface ChatState {
    getMessageResponse: boolean
    assistantMessage: unknown
    getVoiceResponse: boolean
    voice: unknown
    isRecipeSaved: boolean
}

const state: ChatState = {
    getMessageResponse: false,
    assistantMessage: {} as any,
    getVoiceResponse: false,
    voice: {} as any,
    isRecipeSaved: false
};

export default state;