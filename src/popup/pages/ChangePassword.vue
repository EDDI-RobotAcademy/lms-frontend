<template>
    <div>
        <v-dialog v-model="dialog" max-width="500px" transition="dialog-bottom-transition">
            <v-card class="password-change" color="#F6F1EB">
                <v-card-title class="headline text-center py-4 relative mt-10" style="color: #444444;">
                    비밀번호 변경
                </v-card-title>
                <v-btn icon @click="closeDialog" class="close-btn" text>
                    <v-icon color="#444444">mdi-close</v-icon>
                </v-btn>
                <v-card-text class="pt-6">
                    <v-container>
                        <v-form @submit.prevent="changePassword" ref="form">
                            <v-text-field 
                                v-model="currentPassword" 
                                :rules="[
                                    v => !!v || '현재 비밀번호를 입력해주세요',
                                    v => !currentPasswordError || '현재 비밀번호를 틀리셨습니다.'
                                ]"
                                label="현재 비밀번호" 
                                type="password" 
                                required
                                :error-messages="currentPasswordError ? ['현재 비밀번호를 틀리셨습니다.'] : []"
                            ></v-text-field>
                            <v-text-field v-model="newPassword" :rules="[v => !!v || '새 비밀번호를 입력해주세요']" label="새 비밀번호"
                                type="password" required @input="checkPasswordRules"></v-text-field>
                            <p class="text-medium-emphasis text-caption">보안을 위해 다음 기준에 따라 비밀번호를 설정하시기 바랍니다:</p>
                            <v-row class="security text-medium-emphasis text-caption mt-3">
                                <v-col cols="6" v-for="(rule, index) in passwordRules" :key="index">
                                    <div class="d-flex align-center" :class="{ 'shake': rule.shake }">
                                        <v-icon v-if="newPassword && rule.met" color="green" small class="mr-2">mdi-check</v-icon>
                                        <v-icon v-if="newPassword && !rule.met" color="red" small class="mr-2">mdi-close</v-icon>
                                        <span v-if="!newPassword" class="mr-2" style="width: 24px;"></span>
                                        <span>{{ rule.text }}</span>
                                    </div>
                                </v-col>
                            </v-row>
                            <v-text-field v-model="confirmPassword" :rules="[
                                v => !!v || '새 비밀번호를 다시 입력해주세요',
                                v => v === newPassword || '비밀번호가 일치하지 않습니다'
                            ]" label="새 비밀번호 확인" type="password" required></v-text-field>
                            <v-btn block x-large color="#444444" :loading="loading" type="submit" class="mt-4">
                                비밀번호 변경
                            </v-btn>
                        </v-form>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000" top rounded="pill">
            <div class="d-flex align-center">
                <v-icon left color="white">{{ snackbarIcon }}</v-icon>
                {{ snackbarText }}
            </div>
            <template v-slot:action="{ attrs }">
                <v-btn text v-bind="attrs" @click="snackbar = false">
                    닫기
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
const accountModule = 'accountModule'
export default {
    name: 'PasswordChangePopup',
    props: {
        userEmail: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            dialog: true,
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            loading: false,
            snackbar: false,
            snackbarText: '',
            snackbarColor: 'success',
            snackbarIcon: 'mdi-check-circle',
            email: this.userEmail,
            passwordRules: [
                { text: '최소 10자', met: false, shake: false },
                { text: '최소 1개의 숫자', met: false, shake: false },
                { text: '최소 1개의 대문자', met: false, shake: false },
                { text: '최소 1개의 특수문자', met: false, shake: false },
                { text: '최소 1개의 소문자', met: false, shake: false },
            ],
            currentPasswordError: false,
        }
    },
    methods: {
        ...mapActions(accountModule, ['requestNormalLoginToDjango', 'requestChangePasswordToDjango']),
        validateNewPassword() {
            return this.newPassword === this.confirmPassword && this.passwordRules.every(rule => rule.met);
        },
        checkPasswordRules() {
            const password = this.newPassword;
            this.passwordRules[0].met = password.length >= 10;
            this.passwordRules[1].met = /[0-9]/.test(password);
            this.passwordRules[2].met = /[A-Z]/.test(password);
            this.passwordRules[3].met = /[!@#$%^&*(),.?":{}|<>]/.test(password);
            this.passwordRules[4].met = /[a-z]/.test(password);
        },
        async changePassword() {
            this.currentPasswordError = false;
            if (this.$refs.form.validate() && this.validateNewPassword()) {
                this.loading = true;
                const accountInfo = {
                    email: this.email,
                    password: this.currentPassword,
                }
                const newAccountInfo = {
                    email: this.email,
                    password: this.newPassword,
                }
                try {
                    console.log('로그인 요청');
                    const response = await this.requestNormalLoginToDjango(accountInfo);
                    console.log('response 응답', response);
                    if (response.access_token == null) {
                        this.currentPasswordError = true;
                        this.$refs.form.validate();
                    } else {
                        await this.requestChangePasswordToDjango(newAccountInfo);
                        await new Promise(resolve => setTimeout(resolve, 1500));
                        this.showSuccessMessage();
                        this.closeDialog();
                    }
                } catch (error) {
                    console.error('비밀번호 변경 중 오류 발생:', error);
                    this.showErrorMessage('비밀번호 변경 중 오류가 발생했습니다. 다시 시도해 주세요.');
                } finally {
                    this.loading = false;
                }
            } else {
                this.passwordRules.forEach(rule => {
                    if (!rule.met) {
                        rule.shake = true;
                        setTimeout(() => {
                            rule.shake = false;
                        }, 500);
                    }
                });
            }
        },
        closeDialog() {
            this.dialog = false;
            this.$emit('close');
        },
        showSuccessMessage() {
            this.snackbarText = '비밀번호가 성공적으로 변경되었습니다.';
            this.snackbarColor = 'success';
            this.snackbarIcon = 'mdi-check-circle';
            this.snackbar = true;
        },
        showErrorMessage(message) {
            this.snackbarText = message;
            this.snackbarColor = 'error';
            this.snackbarIcon = 'mdi-alert-circle';
            this.snackbar = true;
        }
    }
}
</script>

<style scoped>
.password-change {
    border-radius: 20px;
    overflow: hidden;
}

.relative {
    position: relative;
}

.close-btn {
    position: absolute !important;
    top: 8px;
    right: 8px;
    background-color: transparent !important;
}

.security {
    background-color: #f6f1eb !important;
    max-width: 400px;
    text-align: left;
}

@keyframes shake {
    0% { transform: translateX(0); }
    25% { transform: translateX(5px); }
    50% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
    100% { transform: translateX(0); }
}

.shake {
    animation: shake 0.5s ease-in-out;
}
</style>