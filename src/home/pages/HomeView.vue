<template>
  <div>
    <div class="background">
      <div class="stars"></div>
      <v-row justify="center" align="center" style="height: 100vh; position: relative;">
        <v-col cols="12">
          <h2 class="text-center">조보아씨 봇 메인 페이지</h2>
            <br><br>
            <div class="button-container">
              <v-img alt="Button" class="button-image" @click="goToChatbotPage"/>
            </div>
        </v-col>
      </v-row>
    </div>
    <PopUpView v-if="openModal == true" @sendClose="closeModalView" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import PopUpView from '@/popup/pages/HomePopup.vue'
const authenticationModule = "authenticationModule";

export default {
  components: {
    PopUpView
  },
  data () {
    return {
      openModal: true
    }
  },
  methods: {
    goToChatbotPage() {
        console.log('페이지 이동')
    },
    closeModalView(data){
      this.openModal = data
    },
  },
  mounted(){
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      console.log("You already has a userToken!");
      this.$store.state.authenticationModule.isAuthenticated = true;
    }
  },
  computed: {
    ...mapState(authenticationModule, ["isAuthenticated"]),
  },
};
</script>

<style scoped>

</style>
