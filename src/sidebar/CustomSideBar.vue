<template>
  <div id="app">
    <nav id="nav-bar" :class="{ 'expanded': isExpanded || isChatbotPage }">
      <div id="nav-header">
        <a id="nav-title" target="_blank" @click="goToHome()">
          <i class="fab fa-codepen"></i>CORNER-CHEF
        </a>
      </div>
      <div id="nav-content">
        <div class="nav-button start-new-chat" @click="goToChatbot()">
          <i class="fas fa-palette"></i>
          <span>Start New Chat</span>
        </div>
        <hr>
        <div class="nav-button"><i class="fas fa-images"></i><span>Recents</span></div>
        <div class="nav-button"><i class="fas fa-thumbtack"></i><span>토글 구현 예정</span></div>
        <div class="nav-button"><i class="fas fa-heart"></i><span>구현 예정</span></div>
        <div class="nav-button"><i class="fas fa-chart-line"></i><span>구현 예정</span></div>
        <div class="nav-button"><i class="fas fa-fire"></i><span>구현 예정</span></div>
        
        <div class="nav-button" @click="goToAttendanceCheck()">
          <i class="fas fa-magic" ></i>
          <span>출석체크</span>
        </div>
        <hr>
        <div class="nav-button" @click="toggleShopPopup('main')"><i class="fas fa-gem"></i><span>상점</span></div>
        <div id="nav-content-highlight"></div>
      </div>
      <div v-if="this.isAuthenticated">
        <div id="nav-footer">
          <div id="nav-footer-heading">
            <div id="nav-footer-avatar">
              <img class="avatar" :src="imageSrc" alt="Default Avatar">
            </div>
            <div id="nav-footer-titlebox">
              <span id="nav-footer-title">
                <span class="nickname" @click="goToMyPage">{{ nickname }}</span>
              </span>
              <div class="user-stats">
                <span class="stat-container">
                  <i class="mdi mdi-ticket stat-icon"></i>
                  <span class="stat-count" @click="toggleShopPopup('ticket')">{{ ticket }}</span>
                </span>
                <span class="stat-container">
                  <span class="cherry stat-icon"></span>
                  <span class="stat-count" @click="toggleShopPopup('cherry')">{{ cherry }}</span>
                </span>
              </div>
            </div>
            <button @click="goToMyPage" class="mypage-button">
              <i class="mdi mdi-cog"></i>
            </button>
          </div>
        </div>
      </div>
      <div v-if="!this.isAuthenticated">
        <button @click="goToLogin" class="nav-button goto-login">
          <i class="fas fa-magic"></i>
          <span>로그인하러 가기</span>    
        </button>
      </div>
    </nav>
    <ShopPopup v-if="currentShop === 'main'" @close="closeShopPopup" />
    <CherryShopPopup v-if="currentShop === 'cherry'" @close="closeShopPopup" />
    <TicketShopPopup v-if="currentShop === 'ticket'" @close="closeShopPopup" />
  </div>
</template>

<script>
const authenticationModule = "authenticationModule";
const accountModule = "accountModule";
import { mapActions, mapState} from "vuex";
import router from "@/router";
import ShopPopup from "@/popup/pages/ShopPopup.vue";
import CherryShopPopup from "@/popup/pages/CherryShopPopup.vue";
import TicketShopPopup from "@/popup/pages/TicketShopPopup.vue";

export default ({
  components: {
    ShopPopup,
    CherryShopPopup,
    TicketShopPopup,
  },
  data() {
    return {
      isExpanded: false,
      UserEmail: '',
      nickname: '',
      ticket: '',
      cherry: '',
      currentShop: null,
      ProfileImg: '_dummy',
      userToken: localStorage.getItem("userToken"),
    }
  },
  computed: {
    ...mapState(authenticationModule, ["isAuthenticated"]),
    imageSrc() {
      return require(`@/assets/images/fixed/img${this.ProfileImg}.jpg`);
    },
    isChatbotPage() {
      return this.$route.path === '/chatbot/page';
    }
  },
  watch: {
    $route(to) {
      this.isExpanded = to.path === '/chatbot/page';
    }
  },
  methods: {
    ...mapActions(accountModule, ['requestGetProfileImgToDjango', 'requestLogoutToDjango']),
    ...mapActions(authenticationModule, ['requestRedisGetEmailToDjango', 'requestRedisGetTicketToDjango', 'requestRedisGetCherryToDjango', 'requestRedisGetNicknameToDjango']),
    
    goToLogin() {
      router.push('/account/login')
    },
    goToMyPage() {
      router.push('/account/mypage')
    },
    goToChatbot() {
      if (this.isAuthenticated){
        router.push('/chatbot/page')
      } else {
        this.goToLogin()
      }
    },
    goToHome() {
      router.push('/')
    },
    goToAttendanceCheck() {
      router.push('/account/attendanceCheck')
    },
    toggleShopPopup(shop) {
      this.currentShop = this.currentShop === shop ? null : shop;
    },
    closeShopPopup() {
      this.currentShop = null;
      location.reload();
    },
    async requestUserToken() {
      if (this.userToken) {
        try {
          const email = await this.requestRedisGetEmailToDjango(this.userToken.trim());
          this.UserEmail = email.EmailInfo;
          const Img = await this.requestGetProfileImgToDjango(email.EmailInfo)
          this.ProfileImg = Img
          const ticket = await this.requestRedisGetTicketToDjango(this.userToken.trim());
          this.ticket = ticket.ticket;
          const nickname = await this.requestRedisGetNicknameToDjango(this.userToken.trim());
          this.nickname = nickname.nickname;
          const cherry = await this.requestRedisGetCherryToDjango(this.userToken.trim());
          this.cherry = cherry.cherry;
        } catch (error) {
          console.error("Error requestUserToken:", error);
        }
      }
    },
  },
  mounted() {
    if (this.isAuthenticated) {
      this.requestUserToken();
    }
    else {
      console.log("mounted 비회원")
    }
    this.isExpanded = this.$route.path === '/chatbot/page';
  },
});

</script>

<style>
@font-face {
  font-family: 'GangwonEduPowerExtraBoldA';
  src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2201-2@1.0/GangwonEduPowerExtraBoldA.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}

:root {
  --background: rgb(255, 194, 111);
  --navbar-width: 256px;
  --navbar-width-min: 80px;
  --navbar-dark-primary: #FFFFFF;
  --navbar-dark-secondary: #F6F1EB;
  --navbar-light-primary: #f5f6fa;
  --navbar-light-secondary: #eff1f3;
  --navbar-hover-color: rgba(68, 68, 68, 0.1);
  --font-family: 'GangwonEduPowerExtraBoldA', sans-serif;
  --text-color: #444444;
}

html,
body {
  margin: 0;
  background: var(--background);
  color: var(--text-color);
}

.v-card-title,
.v-btn {
  font-family: var(--font-family);
}

#nav-bar {
  position: fixed;
  left: 0;
  top: 0;
  margin-top: 4px;
  height: 99%;
  background: var(--navbar-dark-primary);
  display: flex;
  flex-direction: column;
  color: var(--text-color);
  font-family: var(--font-family);
  overflow: hidden;
  user-select: none;
  z-index: 3;
  width: var(--navbar-width-min);
  transition: width 0.3s ease, opacity 0.3s ease;
  opacity: 0;
  border-radius: 10px;
}

#nav-bar:hover, #nav-bar.expanded {
  width: var(--navbar-width);
  opacity: 0.9;
}

#nav-bar.chatbot-page {
  opacity: 0.9;
  width: var(--navbar-width);
}

#nav-header {
  position: relative;
  width: var(--navbar-width);
  min-height: 80px;
  background: var(--navbar-dark-primary);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
}

#nav-title {
  font-size: 1.5rem;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: var(--text-color);
}

#nav-bar:hover #nav-title,
#nav-bar.expanded #nav-title,
#nav-bar.chatbot-page #nav-title {
  opacity: 1;
  cursor: pointer;
}

#nav-content {
  margin: -16px 0;
  padding: 16px 0;
  position: relative;
  flex: 1;
  width: var(--navbar-width);
  background: var(--navbar-dark-primary);
  box-shadow: 0 0 0 16px var(--navbar-dark-primary);
  overflow-x: hidden;
  transition: width 0.3s ease;
}

.nav-button {
  position: relative;
  border-radius: 14px;
  height: 54px;
  display: flex;
  align-items: center;
  color: var(--text-color);
  cursor: pointer;
  z-index: 1;
  transition: color 0.2s, background-color 0.2s;
}

.nav-button:hover {
  background-color: var(--navbar-hover-color);
}

.nav-button span {
  opacity: 0;
  transition: opacity 0.3s ease;
}

#nav-bar:hover .nav-button span,
#nav-bar.expanded .nav-button span,
#nav-bar.chatbot-page .nav-button span {
  opacity: 1;
}

.nav-button .fas {
  min-width: 3rem;
  text-align: center;
}

#nav-footer {
  position: relative;
  width: 100%;
  height: 54px;
  background: var(--navbar-dark-secondary);
  display: flex;
  flex-direction: column;
  z-index: 2;
  overflow: hidden;
}

#nav-footer-heading {
  position: relative;
  width: 100%;
  height: 54px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  box-sizing: border-box;
}

#nav-footer-avatar {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 12px;
}

#nav-footer-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

#nav-footer-titlebox {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

#nav-bar:hover #nav-footer-titlebox,
#nav-bar.expanded #nav-footer-titlebox,
#nav-bar.chatbot-page #nav-footer-titlebox {
  opacity: 1;
}

#nav-footer-title {
  font-weight: bold;
  margin-bottom: 2px;
  color: var(--text-color);
}

#nav-footer-title .nickname {
  display: inline-block;
  cursor: pointer;
}

#nav-footer-title .nickname:hover {
  text-decoration: underline;
}

.user-stats {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: -2px;
}

.stat-container {
  display: inline-flex;
  align-items: center;
}

.stat-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
  position: relative;
}

.cherry {
  width: 20px;
  height: 20px;
  background-image: url('~@/assets/images/fixed/cherry.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  top: -2px;
}

.mdi-ticket {
  width: 24px;
  height: 24px;
  font-size: 16px;
  color: var(--text-color);
  top: -2px;
}

.stat-count {
  color: var(--text-color);
  font-weight: bold;
  font-size: 12px;
  line-height: 1;
}

.stat-count:hover {
  text-decoration: underline;
  cursor: pointer;
}

.mypage-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  margin-left: 8px;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.mypage-button:hover {
  background-color: var(--navbar-hover-color);
}

.nav-button.start-new-chat {
  color: #EF6F2D;
  font-weight: bold;
}

.nav-button.goto-login {
  color: #681600;
  font-weight: bold;
  text-align: center;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
}

.mypage-button .mdi-cog {
  font-size: 20px;
  color: var(--text-color);
}

@media (max-width: 768px) {
  #nav-bar,
  #nav-bar.expanded,
  #nav-bar.chatbot-page {
    width: var(--navbar-width-min);
  }

  #nav-bar:hover,
  #nav-bar.expanded:hover,
  #nav-bar.chatbot-page:hover {
    width: var(--navbar-width);
  }

  .mypage-button {
    padding: 12px;
  }

  .mypage-button .mdi-cog {
    font-size: 24px;
  }
}
</style>