<template>
    <div class="dashboard">
        <div class="content-wrapper">
            <div class="info-grid">
                <div class="info-card profile-card">
                    <img class="avatar" src="https://avatars.githubusercontent.com/u/583231?v=4" alt="Avatar">
                </div>
                <div class="info-card user-info">
                    <div class="info-item">
                        <h4>닉네임</h4>
                        <p class="value">{{ nickname }}</p>
                    </div>
                    <div class="info-item">
                        <h4>이메일</h4>
                        <p class="value">{{ UserEmail }}</p>
                    </div>
                    <div class="info-item">
                        <h4>비밀번호</h4>
                        <button @click="showPasswordChangePopup">비밀번호 변경</button>
                    </div>
                </div>
                <div class="info-card activity-info">
                    <div class="info-item">
                        <h4>가입일</h4>
                        <p class="value">2019-09-17 15:20</p>
                    </div>
                    <div class="info-item">
                        <h4>최근 로그인</h4>
                        <p class="value">2일전 (10회)</p>
                    </div>
                    <div class="info-item">
                        <h4>누적 구매 금액</h4>
                        <p class="value">2회 119,000원</p>
                    </div>
                </div>
                <div class="info-card possession-info">
                    <div class="info-item">
                        <h4>체리</h4>
                        <p class="value">{{ cherry }}</p>
                    </div>
                    <div class="info-item">
                        <h4>이용권</h4>
                        <p class="value">{{ ticket }}</p>
                    </div>
                </div>
            </div>
        </div>
        <password-change-popup v-if="isPasswordChangePopupVisible" :userEmail="UserEmail"
            @close="hidePasswordChangePopup" @password-changed="handlePasswordChanged" />
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
import { mapActions } from "vuex";
import PasswordChangePopup from '@/popup/pages/ChangePassword.vue';
const authenticationModule = "authenticationModule";

export default {
    components: {
        PasswordChangePopup
    },
    data() {
        return {
            UserEmail: '',
            nickname: '',
            ticket: '',
            cherry: '',
            isPasswordChangePopupVisible: false,
            snackbar: false,
            snackbarText: '',
            snackbarColor: 'success',
            snackbarIcon: 'mdi-check-circle',
        }
    },
    methods: {
        ...mapActions(authenticationModule, [
            'requestRedisGetEmailToDjango',
            'requestRedisGetTicketToDjango',
            'requestRedisGetCherryToDjango',
            'requestRedisGetNicknameToDjango'
        ]),
        async requestUserToken() {
            const userToken = localStorage.getItem("userToken");
            if (userToken) {
                console.log("유저 토큰 확인");
                this.$store.state.authenticationModule.isAuthenticated = true;
                try {
                    const email = await this.requestRedisGetEmailToDjango(userToken.trim());
                    this.UserEmail = email.EmailInfo;

                    const ticket = await this.requestRedisGetTicketToDjango(userToken.trim());
                    this.ticket = ticket.ticket;

                    const nickname = await this.requestRedisGetNicknameToDjango(userToken.trim());
                    this.nickname = nickname.nickname;

                    const cherry = await this.requestRedisGetCherryToDjango(userToken.trim());
                    this.cherry = cherry.cherry;
                } catch (error) {
                    console.error("Error requestUserToken:", error);
                }
            }
        },
        showPasswordChangePopup() {
            this.isPasswordChangePopupVisible = true;
        },
        hidePasswordChangePopup() {
            this.isPasswordChangePopupVisible = false;
        },
        handlePasswordChanged() {
            this.hidePasswordChangePopup();
            this.showSuccessMessage('비밀번호가 성공적으로 변경되었습니다.');
        },
        showSuccessMessage(message) {
            this.snackbarText = message;
            this.snackbarColor = 'success';
            this.snackbarIcon = 'mdi-check-circle';
            this.snackbar = true;
        },
    },
    mounted() {
        const userToken = localStorage.getItem("userToken");
        if (userToken) {
            this.requestUserToken();
        } else {
            console.log("mounted 비회원")
        }
    },
};
</script>

<style scoped>
@font-face {
    font-family: 'GangwonEduPowerExtraBoldA';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2201-2@1.0/GangwonEduPowerExtraBoldA.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}


.dashboard {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px;
    box-sizing: border-box;
    background-color: #F6F1EB;
    font-family: 'GangwonEduPowerExtraBoldA';
}

.content-wrapper {
    max-width: 1200px;
    width: 100%;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    padding: 40px;
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
}

.info-card {
    background-color: #f9f9f9;
    border-radius: 15px;
    padding: 25px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.info-card:hover {
    transform: scale(1.10);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.profile-card {
    display: flex;
    justify-content: center;
    align-items: center;
}

.avatar {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    object-fit: cover;
}


h3 {
    font-size: 20px;
    color: #333;
    margin-bottom: 20px;
    text-align: center;
}

.info-item {
    margin-bottom: 20px;
}

h4 {
    opacity: 0.5;
    font-size: 16px;
    color: #666;
    margin-bottom: 5px;
}

.value {
    font-size: 18px;
    color: #333;
}

@media (max-width: 768px) {
    .content-wrapper {
        padding: 20px;
    }

    .info-grid {
        grid-template-columns: 1fr;
    }

    .info-card:hover {
        transform: none;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    }
}
</style>