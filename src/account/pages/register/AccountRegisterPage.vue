<template>
    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="6">
                <v-card elevation="0" class="pa-6" color="transparent">
                    <v-card-title class="text-h5 mb-2">회원가입</v-card-title>
                    <v-divider class="mb-9"></v-divider>
                    <v-card-text align="center">
                        <v-form>
                            <v-text-field max-width="400" v-model="email" label="이메일" outlined required
                                :rules="[v => !!v || '필수 항목']"></v-text-field>
                            <v-text-field class="mt-3" type="password" max-width="400" v-model="password" label="비밀번호"
                                outlined required :rules="[v => !!v || '필수 항목']"></v-text-field>
                            <p class="text-medium-emphasis text-caption">보안을 위해 다음 기준에 따라 비밀번호를 설정하시기 바랍니다:</p>
                            <v-row class="security text-medium-emphasis text-caption mt-3">
                                <v-col cols="6" v-for="(rule, index) in passwordRules" :key="index">
                                    <div class="d-flex align-center" :class="{ 'shake': rule.shake }">
                                        <v-icon v-if="password && rule.met" color="green" small class="mr-2">mdi-check</v-icon>
                                        <v-icon v-if="password && !rule.met" color="red" small class="mr-2">mdi-close</v-icon>
                                        <span v-if="!password" class="mr-2" style="width: 24px;"></span>
                                        <span>{{ rule.text }}</span>
                                    </div>
                                </v-col>
                            </v-row>
                            <div class="d-flex justify-center">
                                <v-btn class="submit-button mt-7" max-width="150" @click="checkPassword">
                                    계속
                                </v-btn>
                            </div>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            email: '',
            password: '',
            passwordRules: [
                { text: '최소 10자', met: false, shake: false },
                { text: '최소 1개의 숫자', met: false, shake: false },
                { text: '최소 1개의 대문자', met: false, shake: false },
                { text: '최소 1개의 특수문자', met: false, shake: false },
                { text: '최소 1개의 소문자', met: false, shake: false },
            ],
        }
    },
    methods: {
        checkPasswordRules() {
            const password = this.password;
            this.passwordRules[0].met = password.length >= 10;
            this.passwordRules[1].met = /[0-9]/.test(password);
            this.passwordRules[2].met = /[A-Z]/.test(password);
            this.passwordRules[3].met = /[!@#$%^&*(),.?":{}|<>]/.test(password);
            this.passwordRules[4].met = /[a-z]/.test(password);
        },
        checkPassword() {
            this.checkPasswordRules();
            let allRulesMet = true;
            this.passwordRules.forEach(rule => {
                if (!rule.met) {
                    rule.shake = true;
                    allRulesMet = false;
                    setTimeout(() => {
                        rule.shake = false;
                    }, 500);
                }
            });
            if (allRulesMet) {
                console.log("패스워드 규칙 통과")
            }
        }
    },
    watch: {
        password() {
            this.checkPasswordRules();
        }
    },
}
</script>

<style scoped>
.v-container {
    background-color: #F6F1EB;
}

.v-card {
    background-color: #fffcf7 !important;
    height: 550px;
}

.submit-button {
    background-color: #616161 !important;
    color: white !important;
    font-size: 16px !important;
    font-weight: normal !important;
    text-transform: none !important;
    letter-spacing: normal !important;
    height: 40px !important;
    width: 200px !important;
}

.submit-button:hover {
    background-color: #424242 !important;
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