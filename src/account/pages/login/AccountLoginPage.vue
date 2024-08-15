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
const authenticationModule = 'authenticationModule'
const accountModule = 'accountModule'

export default {
    data() {
        return {
            email: '',
            name: '',
            password: '',
            isShowEmail: true,
            clientId: ''
        }
    },
    created() {
        this.clientId = process.env.VUE_APP_GOOGLE_CLIENT_ID;
        console.log('Client ID:', this.clientId);
    },
    methods: {
        ...mapActions(accountModule, ['requestEmailDuplicationCheckToDjango', 'requestNormalLoginToDjango', 'requestGoogleLoginToDjango', 'requestCreateNewSocialAccountToDjango','requestEmailLoginTypeToDjango']),
        ...mapActions(authenticationModule, ['requestAddRedisAccessTokenToDjango']),
        async checkEmailDuplication() {
            console.log('이메일 중복 검사')
            try {
                const isDuplicate = await this.requestEmailDuplicationCheckToDjango(this.email.trim())
                if (isDuplicate) {
                    const response = await this.requestEmailLoginTypeToDjango(this.email.trim())
                    console.log("로그인 타입 출력",response.isLoginType)
                    const LoginType = response.isLoginType
                    if (LoginType == "NORMAL") {
                        this.isShowEmail = false;
                    } else if (LoginType == "GOOGLE") {
                        alert('구글 회원 입니다.');
                    } else {
                        alert('관리자');
                    }
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
        goToGoogleLogin() {
            console.log("구현 예정")
        },
        async checkGoogleEmailDuplication(response) {
            console.log('구글 이메일 중복 검사')
            try {
                const googleEmail = response.email
                const isDuplicate = await this.requestEmailDuplicationCheckToDjango(googleEmail.trim())
                if (isDuplicate) {
                    await this.requestAddRedisAccessTokenToDjango(googleEmail.trim())
                    router.push('/')
                } else {
                    await this.requestCreateNewSocialAccountToDjango(googleEmail.trim())
                }            
            } catch (error) {
                console.log('이메일 중복 확인 실패', error)
                this.isEmailValid = false
            }
        },
        async handleGoogleLogin(googleResponse) {
            console.log("Google 응답 진입", googleResponse);
            if (googleResponse.credential) {
                const credential = googleResponse.credential;
                try {
                    console.log('Django 서버로 Google 인증 요청');
                    const response = await this.requestGoogleLoginToDjango({
                        credential: credential,
                        clientId: this.clientId
                    });
                    if (response){
                        this.checkGoogleEmailDuplication(response)
                    }
                    else
                    {
                        console.log("에러 발생")
                    }
                   
                } catch (error) {
                    console.log('Google 로그인 요청 실패', error);
                }
            } else {
                console.log('Google 인증 정보를 찾을 수 없음');
            }
        },
        initializeGoogleSignIn() {
            if (typeof window.google !== 'undefined') {
                window.google.accounts.id.initialize({
                    client_id: this.clientId,
                    callback: this.handleGoogleLogin
                });
                window.google.accounts.id.prompt();
            } else {
                console.error('구글 API 설정 누락');
            }
        },
    },
    mounted() {
        if (typeof window.google !== 'undefined') {
            this.initializeGoogleSignIn();
        } else {
            window.onload = () => {
                this.initializeGoogleSignIn();
            };
        }
    }
};
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