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
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default {
  data () {
    return {

    }
  },
  methods: {
    goToChatbotPage() {
        // this.$router.push({ name: 'ChatbotPage' }); 
        console.log('페이지 이동')
    }

}
};
</script>

<style scoped>

</style>
