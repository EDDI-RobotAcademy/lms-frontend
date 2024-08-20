<template>
  <div id="app">
    <nav id="nav-bar">
      <div id="nav-header">
        <a id="nav-title" target="_blank">
          <i class="fab fa-codepen"></i>MENU BOARD
        </a>
      </div>
      <div id="nav-content">
        <div class="nav-button"><i class="fas fa-palette"></i><span>New Chat</span></div>
        <hr>
        <div class="nav-button"><i class="fas fa-images"></i><span>Recents</span></div>
        <div class="nav-button"><i class="fas fa-thumbtack"></i><span>토글 구현 예정</span></div>
        <div class="nav-button"><i class="fas fa-heart"></i><span>구현 예정</span></div>
        <div class="nav-button"><i class="fas fa-chart-line"></i><span>구현 예정</span></div>
        <div class="nav-button"><i class="fas fa-fire"></i><span>구현 예정</span></div>
        <div class="nav-button"><i class="fas fa-magic"></i><span>구현 예정</span></div>
        <hr>
        <div class="nav-button"><i class="fas fa-gem"></i><span>구현 예정</span></div>
        <div id="nav-content-highlight"></div>
      </div>
      <div id="nav-footer">
        <div v-if="isAuthenticated" id="nav-footer-heading">
          <div id="nav-footer-avatar">
            <img src="https://gravatar.com/avatar/4474ca42d303761c2901fa819c4f2547">
          </div>
          <div id="nav-footer-titlebox">
            <a id="nav-footer-title" target="_blank">{{ UserEmail }}</a>
            <span id="nav-footer-subtitle">{{ nickname }}</span>
          </div>
        </div>
        <button v-if="!isAuthenticated" id="nav-footer" @click="goToLogin">LOGIN</button>
      </div>
    </nav>
  </div>
</template>

<script>
const authenticationModule = "authenticationModule";
import { mapActions, mapState } from "vuex";
import router from "@/router";

export default ({
  data() {
    return {
      isExpanded: false,
      UserEmail: '',
      nickname: ''
    }
  },
  methods: {
    ...mapActions(authenticationModule, ['requestRedisGetEmailToDjango','requestRedisGetTicketToDjango','requestRedisGetNicknameToDjango']),
    goToLogin() {
      router.push('/account/login')
    },
    async requestUserToken() {
      const userToken = localStorage.getItem("userToken");
      if (userToken) {
        console.log("유저 토큰 확인");
        this.$store.state.authenticationModule.isAuthenticated = true;
        try {
          const email = await this.requestRedisGetEmailToDjango(userToken.trim());
          console.log("requestRedisGetEmailToDjango:", email.EmailInfo)
          this.UserEmail = email.EmailInfo;
          const ticket = await this.requestRedisGetTicketToDjango(userToken.trim());
          console.log("requestRedisGetTicketToDjango:", ticket.ticket)
          this.ticket = ticket.ticket;
          const nickname = await this.requestRedisGetNicknameToDjango(userToken.trim());
          console.log("requestRedisGetTicketToDjango:", nickname.nickname)
          this.nickname = nickname.nickname;
          console.log("유저 닉네임 반환",this.nickname)
        } catch (error) {
          console.error("Error requestUserToken:", error);
        }
      }
    },
  },
  computed: {
    ...mapState(authenticationModule, ["isAuthenticated"]),
  },
  mounted() {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      this.requestUserToken();
    }
    else {
      console.log("mounted 비회원")
    }
  },
});

</script>

<style>
:root {
  --background: rgb(255, 194, 111);
  --navbar-width: 256px;
  --navbar-width-min: 80px;
  --navbar-dark-primary: rgba(227, 139, 41, 0.9);
  --navbar-dark-secondary: rgb(255, 194, 111);
  --navbar-light-primary: #f5f6fa;
  --navbar-light-secondary: #eff1f3;
  --navbar-hover-color: rgba(255, 255, 255, 0.1);
  --font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
}

html,
body {
  margin: 0;
  background: var(--background);
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
  color: var(--navbar-light-primary);
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  overflow: hidden;
  user-select: none;
  z-index: 3;
  width: var(--navbar-width-min);
  transition: width 0.3s ease, opacity 0.3s ease;
  opacity: 0;
}

#nav-bar:hover {
  width: var(--navbar-width);
  opacity: 0.9;
}

#nav-header {
  position: relative;
  width: var(--navbar-width);
  min-height: 80px;
  background: var(--navbar-dark-primary);
  z-index: 2;
  display: flex;
  align-items: center;
  padding-left: 16px;
}

#nav-title {
  font-size: 1.5rem;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s ease;
}

#nav-bar:hover #nav-title {
  opacity: 1;
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
  margin-left: 16px;
  height: 54px;
  display: flex;
  align-items: center;
  color: var(--navbar-light-secondary);
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

#nav-bar:hover .nav-button span {
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
}

#nav-footer-avatar {
  position: relative;
  margin: 11px 0 11px 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
}

#nav-footer-avatar img {
  height: 100%;
}

#nav-footer-titlebox {
  position: relative;
  margin-left: 16px;
  display: flex;
  flex-direction: column;
  opacity: 0;
  transition: opacity 0.3s ease;
}

#nav-bar:hover #nav-footer-titlebox {
  opacity: 1;
}

#nav-footer-subtitle {
  color: var(--navbar-light-secondary);
  font-size: 0.6rem;
}
</style>