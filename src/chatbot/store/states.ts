// export interface ChatState {
//     messages: Chat[]
// }

export interface ChatState {
    assistantMessage: unknown
    voice: unknown
}

const state: ChatState = {
    assistantMessage: {} as any,
    voice: {} as any
};

export default state;