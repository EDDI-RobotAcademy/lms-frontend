<template>
  <v-app>
    <custom-side-bar/>
    <v-main>
      <ContactButton></ContactButton>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CustomSideBar from '@/sidebar/CustomSideBar.vue'
import ContactButton from '@/contact/pages/ContactButton.vue'

export default defineComponent({
  components: { CustomSideBar, ContactButton },
  name: 'App',

  data () {
    return {
      //
    }
  },
})
</script>
