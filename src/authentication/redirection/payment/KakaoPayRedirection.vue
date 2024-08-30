<template>
    <div></div>
</template>

<script>
import { mapActions } from 'vuex'

const authenticationModule = 'authenticationModule'

export default {
    data() {
        return {
            tid: '',
            pg_token: ''
        }
    },
    methods: {
        ...mapActions(authenticationModule, ['requestApproveKakaoPayRedirection']),

        async setRedirectData() {
            this.pg_token = this.$route.query.pg_token
            console.log("피지 토큰", this.pg_token)
            this.tid = window.localStorage.getItem('kakaopay_tid');
            console.log("tid 출력", this.tid)
            const approveInfo = {
                tid: this.tid,
                pg_token: this.pg_token,
            }
            if (this.tid && this.pg_token) {
                const response = await this.requestApproveKakaoPayRedirection(approveInfo);
                console.log("결제 승인 시각", response.data.approved_at)
                if (response.data.approved_at !== undefined) {
                    window.opener.postMessage({ paymentSuccess: true }, '*');
                    window.close();
                }
                else {
                    console.log('결제 승인 실패');
                }
            } else {
                console.error('필요한 파라미터가 없습니다.');
            }
        }
    },
    async mounted() {
        await this.setRedirectData()
    }
}
</script>