<template>
  <div>
    <v-dialog v-model="dialog" max-width="600px" transition="dialog-bottom-transition">
      <v-card class="cherry-shop" color="#F6F1EB">
        <v-card-title class="headline text-center py-4 relative mt-10" style="color: #444444;">
          체리 상점
        </v-card-title>
        <v-btn icon @click="closeDialog" class="close-btn" text>
          <v-icon color="#444444">mdi-close</v-icon>
        </v-btn>
        <v-card-text class="pt-6">
          <v-container>
            <v-row justify="center">
              <v-col cols="12" sm="4" v-for="option in cherryOptions" :key="option.amount">
                <v-hover v-slot="{ hover }">
                  <v-card class="cherry-option mx-auto" :class="{ 'on-hover': hover }" :elevation="hover ? 12 : 2"
                    height="100%" color="#FFFCF7">
                    <v-card-text class="text-center">
                      <v-avatar size="80" color="#BAA28C" class="mb-4">
                        <v-icon dark x-large>cherry</v-icon>
                      </v-avatar>
                      <h2 class="text-h5 font-weight-bold mb-6">{{ option.amount }}개</h2>
                      <v-btn block x-large color="#444444" :loading="option.loading" @click="purchaseCherrys(option)"
                        class="mt-4">
                        구매
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

    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000" top rounded="pill">
      <div class="d-flex align-center">
        <v-icon left color="white">mdi-check-circle</v-icon>
        {{ snackbarText }}
      </div>
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">
          닫기
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
const authenticationModule = "authenticationModule";
import { mapActions, mapState } from "vuex";
export default {
  name: 'CherryShopPopup',
  data() {
    return {
      dialog: true,
      cherryOptions: [
        { amount: 10, loading: false},
        { amount: 30, loading: false},
        { amount: 50, loading: false},
      ],
      snackbar: false,
      snackbarText: '',
      snackbarColor: 'success',
    }
  },
  methods: {
    ...mapActions(authenticationModule, ['requestRedisPurchaseCherryToDjango']),
    async purchaseCherrys(option) {
      option.loading = true;
      try {
        const userToken = localStorage.getItem("userToken");
        const cherryInfo = {
          usertoken: userToken,
          cherry: option.amount,
        }
        if (userToken) {
          try {
            await new Promise(resolve => setTimeout(resolve, 1500));
              await this.requestRedisPurchaseCherryToDjango(cherryInfo);
              this.showSuccessMessage(option);
          } catch (error) {
            console.error("Error requestUserToken:", error);
          }
        }
      } catch (error) {
        console.error('구매 중 오류 발생:', error);
        this.showErrorMessage();
      } finally {
        option.loading = false;
      }
    },
    closeDialog() {
      this.dialog = false;
      this.$emit('close');
    },
    showSuccessMessage(option) {
      this.snackbarText = `🎉 ${option.amount}개의 체리 구매가 완료되었습니다!`;
      this.snackbarColor = 'success';
      this.snackbar = true;
    },
    showErrorMessage() {
      this.snackbarText = '구매 중 오류가 발생했습니다. 다시 시도해 주세요.';
      this.snackbarColor = 'error';
      this.snackbar = true;
    }
  }
}
</script>

<style scoped>
.cherry-shop {
  border-radius: 20px;
  overflow: hidden;
}

.cherry-option {
  transition: all 0.3s cubic-bezier(.25, .8, .25, 1);
  border-radius: 15px !important;
}

.cherry-option.on-hover {
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

.cherry {
  width: 50px;
  height: 50px;
  background-image: url('~@/assets/images/fixed/cherry.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin-right: 5px;
}
</style>