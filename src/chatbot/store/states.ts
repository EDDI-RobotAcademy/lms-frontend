
export interface ChatState {
    getMessageResponse: boolean
    assistantMessage: unknown
    getVoiceResponse: boolean
    voice: unknown
}

const state: ChatState = {
    getMessageResponse: false,
    assistantMessage: {} as any,
    getVoiceResponse: false,
    voice: {} as any
};

export default state;