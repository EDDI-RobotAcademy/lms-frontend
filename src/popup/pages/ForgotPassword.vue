<template>
    <div>
        <v-dialog v-model="dialog" max-width="400px" persistent>
            <v-card class="text-center pa-4">
                <v-card-text v-if="!isEmailSent" class="text-h6 mb-4">
                    비밀번호를 재설정하시겠습니까?
                </v-card-text>
                <v-card-text v-else class="text-h6 mb-4">
                    임시 비밀번호가 이메일로 전송 되었습니다.
                </v-card-text>
                <v-card-actions>
                    <v-btn v-if="!isEmailSent" color="primary" block @click="sendResetEmail">확인</v-btn>
                    <v-btn v-else color="primary" block @click="closeDialog">확인</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { mapActions } from 'vuex'

const accountModule = 'accountModule'

export default {
    name: 'ForgotPasswordPopup',
    props: {
        email: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            dialog: true,
            isEmailSent: false
        }
    },
    methods: {
        ...mapActions(accountModule, ['requestSendPasswordResetEmailToDjango']),
        async sendResetEmail() {
            try {
                console.log("이메일 확인", this.email)
                const response = await this.requestSendPasswordResetEmailToDjango(this.email.trim())
                console.log('비밀번호 재설정 이메일 전송:', response);
                this.isEmailSent = true;
            } catch (error) {
                console.error('비밀번호 재설정 이메일 전송 실패:', error);
                alert('비밀번호 재설정 이메일 전송에 실패했습니다. 다시 시도해주세요.');
            }
        },
        closeDialog() {
            this.dialog = false;
            this.$emit('close');
        },
    }
}
</script>
