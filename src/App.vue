<template>
  <v-app>
    <custom-side-bar/>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CustomSideBar from '@/sidebar/CustomSideBar.vue'

export default defineComponent({
  components: { CustomSideBar },
  name: 'App',

  data () {
    return {
      //
    }
  },
})
</script>
