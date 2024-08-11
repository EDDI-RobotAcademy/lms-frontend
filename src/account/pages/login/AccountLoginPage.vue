<template>
    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="6">
                <v-card elevation="0" class="pa-6" color="transparent">
                    <v-card-title class="text-h5 mb-2">계정</v-card-title>
                    <v-divider class="mb-9"></v-divider>
                    <v-card-text align="center">
                        <p class="mb-4">로그인하거나 계정을 생성하려면 이메일 주소를 입력해 주세요</p>
                        <v-form ref="form">
                            <v-text-field v-if="isShowEmail" max-width="300" v-model="email" label="이메일" outlined
                                required :rules="[v => !!v || '필수 항목']"></v-text-field>
                            <v-text-field v-if="!isShowEmail" type="password" password="@" max-width="300"
                                v-model="password" label="비밀번호" outlined required
                                :rules="[v => !!v || '필수 항목']"></v-text-field>
                            <div class="d-flex justify-center">
                                <v-btn v-if="isShowEmail" class="submit-button mt-4" max-width="150"
                                    @click="checkEmailDuplication">
                                    계속
                                </v-btn>
                                <v-btn v-if="!isShowEmail" class="submit-button mt-4" max-width="150"
                                    @click="loginUser">
                                    로그인
                                </v-btn>
                            </div>
                            <v-divider width="400" class="mt-9 mb-9"></v-divider>
                            <v-img class="google-login-btn" block @click="goToGoogleLogin"></v-img>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapActions } from 'vuex'
import router from "@/router";

const accountModule = 'accountModule'
export default {
    data() {
        return {
            email: '',
            password: '',
            isShowEmail: true
        }
    },
    methods: {
        ...mapActions(accountModule, ['requestEmailDuplicationCheckToDjango', 'requestNormalLoginToDjango']),
        async checkEmailDuplication() {
            console.log('이메일 중복 검사')
            try {
                const isDuplicate = await this.requestEmailDuplicationCheckToDjango(this.email.trim())
                if (isDuplicate) {
                    console.log('email 사용중')
                    this.isShowEmail = false
                } else {
                    console.log('email 미사용중')
                    router.push("/account/register")
                }
            } catch (error) {
                alert('이메일 중복 확인 실패')
                this.isEmailValid = false
            }
        },
        async loginUser() {
            console.log('로그인 하기 누름')
            if (this.$refs.form.validate()) {
                const accountInfo = {
                    email: this.email,
                    password: this.password,
                }
                try {
                    console.log('로그인 요청');
                    const response = await this.requestNormalLoginToDjango(accountInfo);
                    console.log('로그인 요청 완료');

                    if (response.access_token) {
                        const accessToken = response.access_token;
                        console.log('액세스 토큰:', accessToken);

                        localStorage.setItem('access_token', accessToken);

                        this.$router.push('/');
                    } else {
                        console.log('액세스 토큰을 찾을 수 없음');
                    }
                } catch (error) {
                    console.log('로그인 요청 실패', error);
                }
            }
        },
        goToGoogleLogin(){
            console.log("구현 예정")
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
    height: 490px;
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

.google-login-btn {
    background-image: url("@/assets/images/fixed/googleLogin.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    height: 50px;
    width: 200px;
}
</style>