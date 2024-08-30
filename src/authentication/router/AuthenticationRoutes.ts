import KakaoRedirection from "@/authentication/redirection/payment/KakaoPayRedirection.vue"

const AuthenticationRoutes = [
    {
        path: '/kakao_oauth/kakao-approve',
        name: 'KakaoRedirection',
        component: KakaoRedirection
    },
]

export default AuthenticationRoutes