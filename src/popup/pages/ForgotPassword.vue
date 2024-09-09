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
import router from "@/router";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

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
                const response = await this.requestSendPasswordResetEmailToDjango(this.email)
                console.log("response", response.success)
                if (response.success) {
                    toast.success('비밀번호 재설정 이메일 전송 완료.', {
                        position: "top-center",
                        timeout: 3000,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        draggablePercent: 0.6,
                        showCloseButtonOnHover: false,
                        hideProgressBar: false,
                        closeButton: "button",
                        icon: true,
                        rtl: false
                    });
                    this.dialog = false;
                }
                else{
                    toast.error('비밀번호 재설정 이메일 전송 실패:', {
                        position: "top-center",
                        timeout: 3000,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        draggablePercent: 0.6,
                    });
                }
            } catch (error) {
                console.error('비밀번호 재설정 이메일 전송 실패:', error);
            }
        },
        closeDialog() {
            this.dialog = false;
            this.$emit('close');
        },
    }
}
</script>
