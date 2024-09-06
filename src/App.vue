<template>
  <v-app>
    <custom-side-bar />
    <v-main>
      <ContactButton></ContactButton>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CustomSideBar from '@/sidebar/CustomSideBar.vue'
import ContactButton from '@/contact/pages/ContactButton.vue'
import { mapActions } from 'vuex'

const authenticationModule = "authenticationModule";

export default defineComponent({
  components: { CustomSideBar, ContactButton },
  name: 'App',

  data() {
    return {
      //
    }
  },
  methods: {
    ...mapActions(authenticationModule, ['requestRedisGetTicketToDjango']),
  },
  created() {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      this.requestRedisGetTicketToDjango(userToken.trim());
    }
  },
})
</script>
