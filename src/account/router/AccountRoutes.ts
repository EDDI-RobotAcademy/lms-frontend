import AccountLoginPage from "@/account/pages/login/AccountLoginPage.vue"
import AccountRegisterPage from "@/account/pages/register/AccountRegisterPage.vue"
import AttendanceCheck from "@/account/pages/login/AttendanceCheck.vue"

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

]

export default AccountRoutes