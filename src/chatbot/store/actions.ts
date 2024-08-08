import { ActionContext } from "vuex";
import { AxiosResponse } from "axios";
import axiosInst from "@/utility/axiosInstance";
import { ChatState } from "./states"
// import { REQUEST_SEND_MESSAGE_TO_DJANGO } from "./mutation-types";

export type ChatActions = {
    requestMessageListToDjango(context: ActionContext<ChatState, any>): Promise<void>;
    sendMessageToDjango(context: ActionContext<ChatState, any>, payload: { content: string }): Promise<void>;
};

const actions: ChatActions = {
    async requestMessageListToDjango(context: ActionContext<ChatState, any>): Promise<void> {
        try {
            const res: AxiosResponse<any, any> = await axiosInst.djangoAxiosInst.get('/chat/messages/');
            context.commit('REQUEST_MESSAGE_LIST_TO_DJANGO', res.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
    },
    async sendMessageToDjango(context: ActionContext<ChatState, any>, payload: { content: string }): Promise<void> {
        try {
            const res: AxiosResponse<any> = await axiosInst.djangoAxiosInst.post('/chat/send/', payload);
            context.commit('REQUEST_SEND_MESSAGE_TO_DJANGO', res.data);
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    },
}
