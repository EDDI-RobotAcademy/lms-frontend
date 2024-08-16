<template>
  <div>
    <div class="background">
      <div class="stars"></div>
      <v-row justify="center" align="center" style="height: 100vh; position: relative;">
        <v-col cols="12">
          <h2 class="text-center">조보아씨 봇 메인 페이지</h2>
          <br><br>
          <div class="button-container">
            <v-img alt="Button" class="button-image" @click="goToChatbotPage" />
          </div>
        </v-col>
      </v-row>
    </div>
    <PopUpView v-if="openModal == true" @sendClose="closeModalView" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import PopUpView from '@/popup/pages/HomePopup.vue'
const authenticationModule = "authenticationModule";

export default {
  components: {
    PopUpView
  },
  data() {
    return {
      openModal: false,
    }
  },
  methods: {
    ...mapActions(authenticationModule, ['requestRedisGetPaidMemberTypeToDjango']),
    goToChatbotPage() {
      console.log('페이지 이동')
    },
    closeModalView(data) {
      this.openModal = data
    },
    async requestUserToken() {
      const userToken = localStorage.getItem("userToken");
      if (userToken) {
        console.log("유저 토큰이 이미 있습니다!");
        this.$store.state.authenticationModule.isAuthenticated = true;
        try {
          const response = await this.requestRedisGetPaidMemberTypeToDjango(userToken.trim());
          console.log("requestRedisGetPaidMemberTypeToDjango:", response.PaidMemberTypeInfo)
          const paidMemberType = response.PaidMemberTypeInfo;
          console.log("paidMemberType입니다",paidMemberType)
          if (paidMemberType === 0) {
            this.openModal = false;
          }
        } catch (error) {
          console.error("Error fetching paid member type:", error);
        }
      }
    },
  },
  mounted() {
    this.requestUserToken();
  },
  computed: {
    ...mapState(authenticationModule, ["isAuthenticated"]),
  },
};
</script>

<style scoped></style>
