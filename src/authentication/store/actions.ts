import { ActionContext } from "vuex"
import { AuthenticationState } from "./states"
import { AxiosResponse } from "axios"
import axiosInst from "@/utility/axiosInstance"
import { REQUEST_IS_AUTHENTICATED_TO_DJANGO } from './mutation-types'

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
    requestRedisPurchaseTicketToDjango(
        context: ActionContext<AuthenticationState, any>, ticketInfo: { usertoken: string, ticket: string }
    ): Promise<any>
    requestRedisUpdateCherryToDjango(
        context: ActionContext<AuthenticationState, any>, cherryInfo: { usertoken: string, cherry: string }
    ): Promise<any>
    requestRedisPurchaseCherryToDjango(
        context: ActionContext<AuthenticationState, any>, cherryInfo: { usertoken: string, cherry: string }
    ): Promise<any>
    requestLogoutToDjango(
        context: ActionContext<AuthenticationState, any>,
        userToken: string
    ): Promise<void>
    requestReadyKakaoPayRedirection(
        context: ActionContext<AuthenticationState, any>, readyInfo: { amount: string, approval_url: string }
    ): Promise<void>
    requestApproveKakaoPayRedirection(
        context: ActionContext<AuthenticationState, any>, approveInfo: { tid: string, pg_todken: string }
    ): Promise<void>
}

const actions: AuthenticationActions = {
    async requestAddRedisAccessTokenToDjango(
        context: ActionContext<AuthenticationState, any>, email: string
    ): Promise<any> {
        try {
            const response = await axiosInst.djangoAxiosInst.post(
                '/google_oauth/redis-access-token', { email })

            console.log('userToken:', response.data.userToken)

            localStorage.setItem("userToken", response.data.userToken)
            return response.data;
        } catch (error) {
            console.error('Error adding redis access token:', error);
            throw error;
        }
    },
    async requestRedisGetEmailToDjango({ commit, state }: ActionContext<AuthenticationState, any>, usertoken: string
    ): Promise<any> {
        try {
            const response = await axiosInst.djangoAxiosInst.post(
                '/google_oauth/redis-get-email', { usertoken })
            commit('REQUEST_IS_AUTHENTICATED_TO_DJANGO', true);
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
    async requestRedisPurchaseTicketToDjango(context: ActionContext<AuthenticationState, any>, ticketInfo: { usertoken: string, ticket: string }
    ): Promise<any> {
        try {
            const response = await axiosInst.djangoAxiosInst.post(
                '/google_oauth/redis-purchase-ticket', ticketInfo)

            return response.data;
        } catch (error) {
            console.error('requestRedisPurchaseTicketToDjango() 오류 발생', error);
            throw error;
        }
    },
    async requestRedisUpdateCherryToDjango(context: ActionContext<AuthenticationState, any>, cherryInfo: { usertoken: string, cherry: string }
    ): Promise<any> {
        try {
            const response = await axiosInst.djangoAxiosInst.post(
                '/google_oauth/redis-update-cherry', cherryInfo)

            return response.data;
        } catch (error) {
            console.error('requestRedisUpdateCherryToDjango() 오류 발생', error);
            throw error;
        }
    },
    async requestRedisPurchaseCherryToDjango(context: ActionContext<AuthenticationState, any>, cherryInfo: { usertoken: string, cherry: string }
    ): Promise<any> {
        try {
            const response = await axiosInst.djangoAxiosInst.post(
                '/google_oauth/redis-purchase-cherry', cherryInfo)

            return response.data;
        } catch (error) {
            console.error('requestRedisPurchaseCherryToDjango() 오류 발생', error);
            throw error;
        }
    },
    async requestLogoutToDjango(
        context: ActionContext<AuthenticationState, any>, userToken: string): Promise<void> {
        try {
            const res = await axiosInst.djangoAxiosInst.post('/google_oauth/logout', { userToken: userToken })

            console.log('res:', res.data.isSuccess)
            if (res.data.isSuccess === true) {
                context.commit(REQUEST_IS_AUTHENTICATED_TO_DJANGO, false)
            }
        } catch (error) {
            console.error('requestLogoutToDjango() 중 에러 발생:', error)
            throw error
        }
        localStorage.removeItem("userToken")
    },
    async requestReadyKakaoPayRedirection(context: ActionContext<AuthenticationState, any>, readyInfo: { amount: string, approval_url: string }): Promise<any> {
        try {
            const response = await axiosInst.djangoAxiosInst.post('/google_oauth/readyKakaoPay', readyInfo)
            return response;
        } catch (error) {
            console.error('requestReadyKakaoPayRedirection() 오류 발생', error);
            throw error;
        }
    },
    async requestApproveKakaoPayRedirection(context: ActionContext<AuthenticationState, any>, approveInfo: { tid: string, pg_todken: string }): Promise<any> {
        try {
            const response = axiosInst.djangoAxiosInst.post('/google_oauth/approveKakaoPay', approveInfo)
            return response;
        } catch (error) {
            console.error('requestApproveKakaoPayRedirection() 오류 발생', error);
            throw error;
        }
    },
};

export default actions;