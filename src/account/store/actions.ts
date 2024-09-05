import { ActionContext } from "vuex"
import axiosInst from "@/utility/axiosInstance"

export type AccountActions = {
    requestEmailDuplicationCheckToDjango(context: ActionContext<any, any>, email: string): Promise<boolean>
    requestCreateNewAccountToDjango(context: ActionContext<any, any>, accountInfo: { email: string, password: string, nickname: string }): Promise<void>
    requestNormalLoginToDjango(context: ActionContext<any, any>, accountInfo: { email: string, password: string }): Promise<void>
    requestGoogleLoginToDjango(context: ActionContext<any, any>, googleInfo: { credential: string, clientId: string }): Promise<any>
    requestCreateNewSocialAccountToDjango(context: ActionContext<any, any>, email: string): Promise<void>
    requestEmailLoginTypeToDjango(context: ActionContext<any, any>, email: string): Promise<void>
    requestNickNameDuplicationCheckToDjango(context: ActionContext<any, any>, nickname: string): Promise<boolean>
    requestChangePasswordToDjango(context: ActionContext<any, any>, accountInfo: { email: string, password: string }): Promise<boolean>
    requestGetProfileImgToDjango(context: ActionContext<any, any>, email: string): Promise<void>
    requestSetProfileImgToDjango(context: ActionContext<any, any>, accountInfo: { email: string, img_id: string }): Promise<void>
    requestAccountCreateTimeToDjango(context: ActionContext<any, any>, email: string): Promise<void>
    requestRedisGetAttendanceDateListToDjango(context: ActionContext<any, any>, request:{usertoken: string, month: number}):Promise<void>
    requestRedisUpdateAttendanceDateListToDjango(context: ActionContext<any, any>, updateInfo:{usertoken:string; today:number}):Promise<void>
}
const actions: AccountActions = {
    async requestEmailDuplicationCheckToDjango(
        context: ActionContext<any, any>, email: string
    ): Promise<boolean> {

        const response = await axiosInst.djangoAxiosInst.post(
            '/account/email-duplication-check', { email })
        return response.data.isDuplicate
    },
    async requestCreateNewAccountToDjango(context: ActionContext<any, any>,
        accountInfo: { email: string, password: string, nickname: string }): Promise<void> {
        try {
            alert('신규 계정이 생성되었습니다!')
            await axiosInst.djangoAxiosInst.post('/account/register', accountInfo)
        } catch (error) {
            console.error('신규 계정 생성 실패:', error)
            throw error
        }
    },
    async requestNormalLoginToDjango(context: ActionContext<any, any>,
        accountInfo: { email: string, password: string }): Promise<void> {
        try {
            const response = await axiosInst.djangoAxiosInst.post('/account/login', accountInfo);
            if (response.data.access_token) {
                console.log("response.data.access_token 출력",response.data.access_token)
                context.commit('REQUEST_IS_LOGIN_TO_DJANGO', true);
            }
            return response.data;
        } catch (error) {
            console.error('로그인 실패:', error);
            throw error;
        }
    },
    async requestGoogleLoginToDjango(
        context: ActionContext<any, any>,
        googleInfo: { credential: string, clientId: string }
    ): Promise<any> {
        try {
            const response = await axiosInst.djangoAxiosInst.post(
                '/google_oauth/login', googleInfo)
            return response.data
        } catch (error) {
            console.error('Google 로그인 실패:', error)
            throw error
        }
    },
    async requestCreateNewSocialAccountToDjango(
        context: ActionContext<any, any>, email: string
    ): Promise<void> {

        const response = await axiosInst.djangoAxiosInst.post(
            '/account/register-social', { email })
        return response.data
    },
    async requestEmailLoginTypeToDjango(
        context: ActionContext<any, any>, email: string
    ): Promise<void> {

        const response = await axiosInst.djangoAxiosInst.post(
            '/account/login-type', { email })
        return response.data
    },
    async requestNickNameDuplicationCheckToDjango(
        context: ActionContext<any, any>, nickname: string
    ): Promise<boolean> {

        const response = await axiosInst.djangoAxiosInst.post(
            '/account/nickname-duplication-check', { nickname })
        return response.data.isNickNameDuplicate
    },
    async requestChangePasswordToDjango(context: ActionContext<any, any>,
        accountInfo: { email: string, password: string }): Promise<boolean> {
        try {
            const response = await axiosInst.djangoAxiosInst.post('/account/change-new-password', accountInfo);
            return response.data.success
        } catch (error) {
            console.error('requestChangePasswordToDjango 실패', error);
            throw error;
        }
    },
    async requestGetProfileImgToDjango(context: ActionContext<any, any>,
        email: string): Promise<void> {

        const response = await axiosInst.djangoAxiosInst.post(
            '/account/get-profile-img', { email })

        return response.data.getProfileImg
    },
    async requestSetProfileImgToDjango(context: ActionContext<any, any>, accountInfo: { email: string, img_id: string }): Promise<void> {

        const response = await axiosInst.djangoAxiosInst.post(
            '/account/set-profile-img', accountInfo)

        return response.data.setProfileImg
    },
    async requestAccountCreateTimeToDjango(
        context: ActionContext<any, any>, email: string
    ): Promise<void> {

        const response = await axiosInst.djangoAxiosInst.post(
            '/account/account-create-time', { email })
        return response.data.getCreateTime
    },
    // async requestRedisGetAttendanceDateListToDjango(
    //     context: ActionContext<any, any>, usertoken: string
    // ): Promise<void> {
    //     const response = await axiosInst.djangoAxiosInst.post(
    //         '/account/get-account-date-list', usertoken)
    //     return response.data.attendanceDateList
    // }
    async requestRedisGetAttendanceDateListToDjango(
        context: ActionContext<any, any>, request:{usertoken: string, month: number}
    ): Promise<void> {
        const response = await axiosInst.djangoAxiosInst.post(
            '/attendance/attendance-list', request)
        return response.data.attendanceDateList
    },
    // async requestRedisUpdateAttendanceDateListToDjango(
    //     context: ActionContext<any, any>, updateInfo:{usertoken: string; today: number}):Promise<void>{
    //     const response = await axiosInst.djangoAxiosInst.post(
    //         '/account/update-attendance-date-list', updateInfo)
    //         return response.data.attendance_status
    // },
    async requestRedisUpdateAttendanceDateListToDjango(
        context: ActionContext<any, any>, updateInfo:{usertoken: string; today: number}):Promise<void>{
        const response = await axiosInst.djangoAxiosInst.post(
            '/attendance/mark-attendance', updateInfo)
            return response.data.attendance_status
    },
};

export default actions; 