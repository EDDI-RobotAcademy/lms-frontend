import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import "aos/dist/aos.css";
import AOS from 'aos';

loadFonts();

const app = createApp(App);

app.use(router)
   .use(store)
   .use(vuetify);

app.mount('#app');

AOS.init(); // AOS 초기화
