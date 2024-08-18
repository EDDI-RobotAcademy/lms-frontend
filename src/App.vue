<template>
  <v-app>
    <v-main>
      <ContactButton></ContactButton>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ContactButton from './contact/pages/ContactButton.vue'
export default defineComponent({
  components: {ContactButton},
  name: 'App',

  data () {
    return {
      //
    }
  },
})
</script>
