import { ActionContext } from "vuex"
import { AuthenticationState } from "./states"
import { AxiosResponse } from "axios"
import axiosInst from "@/utility/axiosInstance"

export type AuthenticationActions = {
    requestAddRedisAccessTokenToDjango(
        context: ActionContext<AuthenticationState, any>, email: string
    ): Promise<any>
    requestRedisGetEmailToDjango(
        context: ActionContext<AuthenticationState, any>, usertoken: string
    ): Promise<any>
    requestRedisGetPaidMemberTypeToDjango(
        context: ActionContext<AuthenticationState, any>, usertoken: string
    ): Promise<any>
    requestRedisGetTicketToDjango(
        context: ActionContext<AuthenticationState, any>, usertoken: string
    ): Promise<any>
    requestRedisUpdateTicketToDjango(
        context: ActionContext<AuthenticationState, any>, usertoken: string
    ): Promise<any>
    requestRedisGetNicknameToDjango(
        context: ActionContext<AuthenticationState, any>, usertoken: string
    ): Promise<any>
    requestRedisGetCherryToDjango(
        context: ActionContext<AuthenticationState, any>, usertoken: string
    ): Promise<any>
}

const actions: AuthenticationActions = {
    async requestAddRedisAccessTokenToDjango(
        { commit, state }: ActionContext<AuthenticationState, any>, email: string
    ): Promise<any> {
        try {
            const response = await axiosInst.djangoAxiosInst.post(
                '/google_oauth/redis-access-token', { email })

            console.log('userToken:', response.data.userToken)

            localStorage.setItem("userToken", response.data.userToken)
            commit('REQUEST_IS_AUTHENTICATED_TO_DJANGO', true);
            return response.data;
        } catch (error) {
            console.error('Error adding redis access token:', error);
            throw error;
        }
    },
    async requestRedisGetEmailToDjango(context: ActionContext<AuthenticationState, any>, usertoken: string
    ): Promise<any> {
        try {
            const response = await axiosInst.djangoAxiosInst.post(
                '/google_oauth/redis-get-email', { usertoken })

            return response.data;
        } catch (error) {
            console.error('requestRedisGetValueToDjango() 오류 발생', error);
            throw error;
        }
    },
    async requestRedisGetPaidMemberTypeToDjango(context: ActionContext<AuthenticationState, any>, usertoken: string
    ): Promise<any> {
        try {
            const response = await axiosInst.djangoAxiosInst.post(
                '/google_oauth/redis-get-paid-member-type', { usertoken })

            return response.data;
        } catch (error) {
            console.error('requestRedisGetValueToDjango() 오류 발생', error);
            throw error;
        }
    },
    async requestRedisGetTicketToDjango(context: ActionContext<AuthenticationState, any>, usertoken: string
    ): Promise<any> {
        try {
            const response = await axiosInst.djangoAxiosInst.post(
                '/google_oauth/redis-get-ticket', { usertoken })

            return response.data;
        } catch (error) {
            console.error('requestRedisGetTicketToDjango() 오류 발생', error);
            throw error;
        }
    },
    async requestRedisUpdateTicketToDjango(context: ActionContext<AuthenticationState, any>, usertoken: string
    ): Promise<any> {
        try {
            const response = await axiosInst.djangoAxiosInst.post(
                '/google_oauth/redis-update-ticket', { usertoken })

            return response.data;
        } catch (error) {
            console.error('requestRedisUpdateTicketToDjango() 오류 발생', error);
            throw error;
        }
    },
    async requestRedisGetNicknameToDjango(context: ActionContext<AuthenticationState, any>, usertoken: string
    ): Promise<any> {
        try {
            const response = await axiosInst.djangoAxiosInst.post(
                '/google_oauth/redis-get-nickname', { usertoken })

            return response.data;
        } catch (error) {
            console.error('requestRedisGetNicknameToDjango() 오류 발생', error);
            throw error;
        }
    },
    async requestRedisGetCherryToDjango(context: ActionContext<AuthenticationState, any>, usertoken: string
    ): Promise<any> {
        try {
            const response = await axiosInst.djangoAxiosInst.post(
                '/google_oauth/redis-get-cherry', { usertoken })

            return response.data;
        } catch (error) {
            console.error('requestRedisGetCherryToDjango() 오류 발생', error);
            throw error;
        }
    },
}

export default actions;