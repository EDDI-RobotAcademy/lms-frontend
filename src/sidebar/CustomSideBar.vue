<template>
  <div id="app">
    <nav id="nav-bar">
      <input id="nav-toggle" type="checkbox">
      <div id="nav-header">
        <a id="nav-title" href="https://codepen.io" target="_blank">
          <i class="fab fa-codepen"></i>MENU BOARD
        </a>
        <label for="nav-toggle">
          <span id="nav-toggle-burger"></span>
        </label>
        <hr>
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
        <div id="nav-footer-heading">
          <div id="nav-footer-avatar">
            <img src="https://gravatar.com/avatar/4474ca42d303761c2901fa819c4f2547">
          </div>
          <div id="nav-footer-titlebox">
            <a id="nav-footer-title" href="https://codepen.io/uahnbu/pens/public" target="_blank">user</a>
            <span id="nav-footer-subtitle">Admin</span>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>


// <script>
// import { defineComponent } from '@vue/composition-api'

// export default defineComponent({
//     setup() {
        
//     },
// })
// </script>


<style>
:root {
  --background: rgb(255, 194, 111);   /*사이드바 메뉴 hover 색*/
  --navbar-width: 256px;
  --navbar-width-min: 80px;
  /*--navbar-dark-primary: rgba(255, 211, 90,0.8);*/
 --navbar-dark-primary: rgba(227,139,41);    /*사이드바 배경색*/
  --navbar-dark-secondary: rgb(255, 194, 111);   /*하단 USER, hr선 색*/
  --navbar-light-primary: #f5f6fa;   /*사이드바 이름(MENU BOARD) 글씨 색*/
  --navbar-light-secondary: #eff1f3;    /*사이드바 메뉴 글씨 색*/
}

html, body {
  margin: 0;
  background: var(--background);
}


#nav-toggle:checked ~ main {
  width: calc(100% - var(--navbar-width-min));
  /* margin-left: var(--navbar-width-min); */
}

h1 {
  font-size: 4rem;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  margin-bottom: 2rem;
  text-align: center;
  width: 100%;
}

/* Navigation bar styles */
#nav-toggle:checked ~ #nav-header {
  width: calc(var(--navbar-width-min) - 16px);
}

#nav-toggle:checked ~ #nav-content,
#nav-toggle:checked ~ #nav-footer {
  width: var(--navbar-width-min);
}

#nav-toggle:checked ~ #nav-header #nav-title {
  opacity: 0;
  pointer-events: none;
  transition: opacity .1s;
}

#nav-toggle:checked ~ #nav-header label[for="nav-toggle"] {
  left: calc(50% - 8px);
  transform: translate(-50%);
}

#nav-toggle:checked ~ #nav-header #nav-toggle-burger {
  background: var(--navbar-light-primary);
}

#nav-toggle:checked ~ #nav-header #nav-toggle-burger:before,
#nav-toggle:checked ~ #nav-header #nav-toggle-burger:after {
  width: 16px;
  background: var(--navbar-light-secondary);
  transform: translate(0, 0) rotate(0deg);
}

#nav-toggle:checked ~ #nav-content .nav-button span {
  opacity: 0;
  transition: opacity .1s;
}

#nav-toggle:checked ~ #nav-content .nav-button .fas {
  min-width: calc(100% - 16px);
}

#nav-toggle:checked ~ #nav-footer #nav-footer-avatar {
  margin-left: 0;
  left: 50%;
  transform: translate(-50%);
}

#nav-toggle:checked ~ #nav-footer #nav-footer-titlebox,
#nav-toggle:checked ~ #nav-footer label[for="nav-footer-toggle"] {
  opacity: 0;
  transition: opacity .1s;
  pointer-events: none;
}

#nav-bar {
  position: fixed;
  left: 1vw;
  top: 1vw;
  height: calc(100% - 2vw);
  background: var(--navbar-dark-primary);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  color: var(--navbar-light-primary);
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  overflow: hidden;
  user-select: none;
  z-index: 3; /*APP.vue를 통해 각 페이지마다 연결했을 때 사이드바가 희미하게 보이면서 정상작동을 하지 않을때 z-index의 숫자를 높여야했음.*/
}

#nav-bar hr {
  margin: 0;
  position: relative;
  left: 16px;
  width: calc(100% - 32px);
  border: none;
  border-top: solid 1px var(--navbar-dark-secondary);
}

#nav-bar a {
  color: inherit;
  text-decoration: inherit;
}

#nav-bar input[type="checkbox"] {
  display: none;
}

#nav-header {
  position: relative;
  width: var(--navbar-width);
  left: 16px;
  width: calc(var(--navbar-width) - 16px);
  min-height: 80px;
  background: var(--navbar-dark-primary);
  border-radius: 16px;
  z-index: 2;
  display: flex;
  align-items: center;
  transition: width .2s;
}

#nav-header hr {
  position: absolute;
  bottom: 0;
}

#nav-title {
  font-size: 1.5rem;
  transition: opacity 1s;
}

label[for="nav-toggle"] {
  position: absolute;
  right: 0;
  width: 3rem;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

#nav-toggle-burger {
  position: relative;
  width: 16px;
  height: 2px;
  background: var(--navbar-dark-primary);
  border-radius: 99px;
  transition: background .2s;
}

#nav-toggle-burger:before,
#nav-toggle-burger:after {
  content: '';
  position: absolute;
  top: -6px;
  width: 10px;
  height: 2px;
  background: var(--navbar-light-primary);
  border-radius: 99px;
  transform: translate(2px, 8px) rotate(30deg);
  transition: .2s;
}

#nav-toggle-burger:after {
  top: 6px;
  transform: translate(2px, -8px) rotate(-30deg);
}

#nav-content {
  margin: -16px 0;
  padding: 16px 0;
  position: relative;
  flex: 1;
  width: var(--navbar-width);
  background: var(--navbar-dark-primary);
  box-shadow: 0 0 0 16px var(--navbar-dark-primary);
  direction: rtl;
  overflow-x: hidden;
  transition: width .2s;
}

#nav-content::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

#nav-content::-webkit-scrollbar-thumb {
  border-radius: 99px;
  background-color: #D62929;
}

#nav-content::-webkit-scrollbar-button {
  height: 16px;
}

#nav-content-highlight {
  position: absolute;
  left: 16px;
  top: -70px;
  width: calc(100% - 16px);
  height: 54px;
  background: var(--background);
  background-attachment: fixed;
  border-radius: 16px 0 0 16px;
  transition: top .2s;
}

#nav-content-highlight:before,
#nav-content-highlight:after {
  content: '';
  position: absolute;
  right: 0;
  bottom: 100%;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  box-shadow: 16px 16px var(--background);
}

#nav-content-highlight:after {
  top: 100%;
  box-shadow: 16px -16px var(--background);
}

.nav-button {
  position: relative;
  margin-left: 16px;
  height: 54px;
  display: flex;
  align-items: center;
  color: var(--navbar-light-secondary);
  direction: ltr;
  cursor: pointer;
  z-index: 1;
  transition: color .2s;
}

.nav-button span {
  transition: opacity 1s;
}

.nav-button .fas {
  transition: min-width .2s;
}

.nav-button:nth-of-type(1):hover,
.nav-button:nth-of-type(2):hover,
.nav-button:nth-of-type(3):hover,
.nav-button:nth-of-type(4):hover,
.nav-button:nth-of-type(5):hover,
.nav-button:nth-of-type(6):hover,
.nav-button:nth-of-type(7):hover,
.nav-button:nth-of-type(8):hover {
  color: var(--navbar-dark-primary);
}

.nav-button:nth-of-type(1):hover ~ #nav-content-highlight { top: 16px; }
.nav-button:nth-of-type(2):hover ~ #nav-content-highlight { top: 70px; }
.nav-button:nth-of-type(3):hover ~ #nav-content-highlight { top: 124px; }
.nav-button:nth-of-type(4):hover ~ #nav-content-highlight { top: 178px; }
.nav-button:nth-of-type(5):hover ~ #nav-content-highlight { top: 232px; }
.nav-button:nth-of-type(6):hover ~ #nav-content-highlight { top: 286px; }
.nav-button:nth-of-type(7):hover ~ #nav-content-highlight { top: 340px; }
.nav-button:nth-of-type(8):hover ~ #nav-content-highlight { top: 394px; }

#nav-bar .fas {
  min-width: 3rem;
  text-align: center;
}

#nav-footer {
  position: relative;
  width: var(--navbar-width);
  height: 54px;
  background: var(--navbar-dark-secondary);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  z-index: 2;
  transition: width .2s, height .2s;
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
  left: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  transform: translate(0);
  transition: .2s;
}

#nav-footer-avatar img {
  height: 100%;
}

#nav-footer-titlebox {
  position: relative;
  margin-left: 16px;
  width: 10px;
  display: flex;
  flex-direction: column;
  transition: opacity 1s;
}

#nav-footer-subtitle {
  color: var(--navbar-light-secondary);
  font-size: .6rem;
}
</style>