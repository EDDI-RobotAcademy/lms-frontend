<template>
    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="6">
                <v-card elevation="0" class="pa-6" color="transparent">
                    <v-card-title class="text-h5 mb-2">계정</v-card-title>
                    <v-divider class="mb-9"></v-divider>
                    <v-card-text align="center">
                        <p class="mb-4">로그인하거나 계정을 생성하려면 이메일 주소를 입력해 주세요</p>
                        <v-form @submit.prevent="submit">
                            <v-text-field max-width="300" v-model="email" label="이메일" outlined required
                                :rules="[v => !!v || '필수 항목']"></v-text-field>
                            <div class="d-flex justify-center">
                                <v-btn type="submit" class="submit-button mt-4" max-width="150">
                                    계속
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

export default {
    data: () => ({
        email: '',
    }),
    methods: {
        submit() {
            console.log('이메일 제출:', this.email);
        },
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