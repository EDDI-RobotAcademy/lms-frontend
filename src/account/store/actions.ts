import { ActionContext } from "vuex"
import { AccountState } from "./states"
import axiosInst from "@/utility/axiosInstance"

export type AccountActions = {
    requestEmailDuplicationCheckToDjango(
        context: ActionContext<AccountState, any>,
        email: string
    ): Promise<boolean>
    requestCreateNewAccountToDjango(context: ActionContext<AccountState, any>, accountInfo: { email: string, password: string }): Promise<void>
    requestNormalLoginToDjango(context: ActionContext<AccountState, any>, accountInfo: { email: string, password: string }): Promise<void>
}

const actions: AccountActions = {
    async requestEmailDuplicationCheckToDjango(
        context: ActionContext<AccountState, any>,
        email: string
    ): Promise<boolean> {

        const response = await axiosInst.djangoAxiosInst.post(
            '/account/email-duplication-check', { email })
        return response.data.isDuplicate
    },
    async requestCreateNewAccountToDjango(context: ActionContext<AccountState, any>,
        accountInfo: { email: string, password: string }): Promise<void> {
        try {
            alert('신규 계정이 생성되었습니다!')
            await axiosInst.djangoAxiosInst.post('/account/register', accountInfo)
        } catch (error) {
            console.error('신규 계정 생성 실패:', error)
            throw error
        }
    },
    async requestNormalLoginToDjango(context: ActionContext<AccountState, any>,
        accountInfo: { email: string, password: string }): Promise<void> {
        try {
            const response = await axiosInst.djangoAxiosInst.post('/account/login', accountInfo);
            return response.data
        } catch (error) {
            console.error('로그인 실패:', error);
            throw error;
        }
    },
};

export default actions;