import AccountLoginPage from "@/account/pages/login/AccountLoginPage.vue"
import AccountRegisterPage from "@/account/pages/register/AccountRegisterPage.vue"
import AccountMyPage from "@/account/pages/mypage/AccountMyPage.vue"
import AttendanceCheck from "@/account/pages/attendanceCheck/AttendanceCheck.vue"
import AccountFindPage from "@/account/pages/findPassword/findPassword.vue"

const AccountRoutes = [
    {
        path: '/account/login',
        name: 'AccountLoginPage',
        component: AccountLoginPage
    },
    {
        path: '/account/register',
        name: 'AccountRegisterPage',
        component: AccountRegisterPage
    },
    {
        path: '/account/AttendanceCheck',
        name: 'AttendanceCheck',
        component: AttendanceCheck
    },
    {
        path: '/account/mypage',
        name: 'AccountMyPage',
        component: AccountMyPage
    },
    {
        path: '/account/findPassword',
        name: 'AccountFindPage',
        component: AccountFindPage
    },
]

export default AccountRoutes