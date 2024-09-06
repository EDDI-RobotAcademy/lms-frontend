<template>
    <div>
        <input v-model="email" type="email" placeholder="이메일 주소를 입력하세요" />
        <button @click="sendResetEmail" :disabled="isLoading">비밀번호 재설정 이메일 보내기</button>
        <p v-if="message">{{ message }}</p>
    </div>
</template>

<script>
import { mapActions } from 'vuex'

const accountModule = 'accountModule'

export default {
    data() {
        return {
            email: '',
            message: '',
            isLoading: false
        }
    },
    methods: {
        ...mapActions(accountModule, ['requestSendPasswordResetEmailToDjango']),
        async sendResetEmail() {
            if (!this.email) {
                this.message = '이메일 주소를 입력해주세요.'
                return
            }

            this.isLoading = true
            this.message = ''

            try {
                await this.requestSendPasswordResetEmailToDjango(this.email)
                this.message = '비밀번호 재설정 이메일을 보냈습니다. 이메일을 확인해주세요.'
            } catch (error) {
                this.message = '이메일 전송 중 오류가 발생했습니다. 다시 시도해주세요.'
                console.error('Password reset email error:', error)
            } finally {
                this.isLoading = false
            }
        }
    }
}
</script>

<style lang="scss" scoped>
// 스타일링은 필요에 따라 추가하세요
</style>