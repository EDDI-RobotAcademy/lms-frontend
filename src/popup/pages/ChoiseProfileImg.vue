<template>
  <div>
    <v-dialog v-model="dialog" max-width="600px" transition="dialog-bottom-transition">
      <v-card class="profile-selection" color="#F6F1EB">
        <v-card-title class="headline text-center py-4 relative mt-10" style="color: #444444;">
          프로필 선택
        </v-card-title>
        <v-btn icon @click="closeDialog" class="close-btn" text>
          <v-icon color="#444444">mdi-close</v-icon>
        </v-btn>
        <v-card-text class="pt-6">
          <v-container>
            <v-row justify="center">
              <v-col cols="12" sm="6" v-for="(image, index) in profileImages" :key="index">
                <v-hover v-slot="{ hover }">
                  <v-card class="profile-option mx-auto" :class="{ 'on-hover': hover }" :elevation="hover ? 12 : 2"
                    height="100%" color="#FFFCF7">
                    <v-card-text class="text-center">
                      <v-avatar size="120" class="mb-4">
                        <v-img :src="image" alt="Profile Image"></v-img>
                      </v-avatar>
                      <v-btn block x-large color="#444444" @click="selectProfile(index)" class="mt-4">
                        선택
                      </v-btn>
                    </v-card-text>
                  </v-card>
                </v-hover>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
const accountModule = "accountModule";
import { mapActions } from "vuex";

export default {
  name: 'ChoiseProfileImg',
  props: {
    userEmail: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      dialog: true,
      profileImages: [
        require('@/assets/images/fixed/img0.jpg'),
        require('@/assets/images/fixed/img1.jpg'),
        require('@/assets/images/fixed/img2.jpg'),
        require('@/assets/images/fixed/img3.jpg'),
      ],
      email: this.userEmail,
    }
  },
  methods: {
    ...mapActions(accountModule, ['requestSetProfileImgToDjango']),
    async selectProfile(index) {
      const accountInfo = {
        email: this.email,
        img_id: index,
      }
      const response = await this.requestSetProfileImgToDjango(accountInfo)
      console.log("프로필 이미지 선택 완료", response)
      this.$emit('profile-changed', index);
      this.closeDialog();
    },
    closeDialog() {
      this.dialog = false;
      this.$emit('close');
    },
  }
}
</script>

<style scoped>
.profile-selection {
  border-radius: 20px;
  overflow: hidden;
}

.profile-option {
  transition: all 0.3s cubic-bezier(.25, .8, .25, 1);
  border-radius: 15px !important;
}

.profile-option.on-hover {
  transform: translateY(-10px);
}

.relative {
  position: relative;
}

.close-btn {
  position: absolute !important;
  top: 8px;
  right: 8px;
  background-color: transparent !important;
}
</style>