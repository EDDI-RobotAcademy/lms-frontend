<template>
  <div>
    <v-dialog v-model="dialog" max-width="600px" transition="dialog-bottom-transition" persistent>
      <v-card class="ticket-shop" color="#F6F1EB">
        <v-card-title class="headline text-center py-4 relative mt-10" style="color: #444444;">
          티켓 상점
        </v-card-title>
        <v-btn icon @click="closeDialog" class="close-btn" text>
          <v-icon color="#444444">mdi-close</v-icon>
        </v-btn>
        <v-card-text class="pt-6">
          <v-container>
            <v-row justify="center">
              <v-col cols="12" sm="4" v-for="option in ticketOptions" :key="option.amount">
                <v-hover v-slot="{ hover }">
                  <v-card class="ticket-option mx-auto" :class="{ 'on-hover': hover }" :elevation="hover ? 12 : 2"
                    height="100%" color="#FFFCF7">
                    <v-card-text class="text-center">
                      <v-avatar size="80" color="#BAA28C" class="mb-4">
                        <v-icon dark x-large>{{ option.icon }}</v-icon>
                      </v-avatar>
                      <h2 class="text-h4 font-weight-bold mb-6">{{ option.amount }}개</h2>
                      <v-chip color="secondary" label x-large class="px-4 mb-4">
                        <v-icon left> cherry </v-icon>
                        {{ option.price }}개
                      </v-chip>
                      <v-btn block x-large color="#444444" :loading="option.loading" @click="purchaseTickets(option)"
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
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const authenticationModule = "authenticationModule";

export default {
  name: 'TicketShopPopup',
  data() {
    return {
      dialog: true,
      ticketOptions: [
        { amount: 1, price: 10, loading: false, icon: 'mdi-ticket-outline' },
        { amount: 5, price: 50, loading: false, icon: 'mdi-ticket-outline' },
        { amount: 10, price: 100, loading: false, icon: 'mdi-ticket-outline' },
      ],
    }
  },
  methods: {
    ...mapActions(authenticationModule, ['requestRedisPurchaseTicketToDjango','requestRedisUpdateCherryToDjango', 'requestRedisGetCherryToDjango']),
    async purchaseTickets(option) {
      option.loading = true;
      try {
        const userToken = localStorage.getItem("userToken");
        const ticketInfo = {
          usertoken: userToken,
          ticket: option.amount,
        }
        const cherryInfo = {
          usertoken: userToken,
          cherry: option.price,
        }
        if (userToken) {
          try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            const checkCherry = await this.requestRedisGetCherryToDjango(userToken.trim());
            console.log("옵션 프라이스", option.price)
            console.log("체크 체리", checkCherry.cherry)
            if (checkCherry.cherry >= option.price)
            {
              await this.requestRedisUpdateCherryToDjango(cherryInfo);
              await this.requestRedisPurchaseTicketToDjango(ticketInfo);
              this.showSuccessMessage(option);
            }
            else
            {
              this.showFailedMessage(option, checkCherry.cherry);
            }
          } catch (error) {
            console.error("Error requestUserToken:", error);
            this.showErrorMessage();
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
      toast.success(`${option.amount}개의 티켓 구매 완료`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    },
    showFailedMessage(option, userCherry) {
      const cherryNeeded = option.price - userCherry;
      toast.warn(`🍒 ${cherryNeeded}개의 체리가 부족합니다.`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    },
    showErrorMessage() {
      toast.error('구매 중 오류가 발생했습니다. 다시 시도해 주세요.', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    }
  }
}
</script>

<style scoped>
.ticket-shop {
  border-radius: 20px;
  overflow: hidden;
}

.ticket-option {
  transition: all 0.3s cubic-bezier(.25, .8, .25, 1);
  border-radius: 15px !important;
}

.ticket-option.on-hover {
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
  width: 20px;
  height: 20px;
  background-image: url('~@/assets/images/fixed/cherry.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin-right: 5px;
}

:global(.Vue-Toastification__toast) {
  min-width: 0 !important;
  width: fit-content !important;
  max-width: none !important;
  padding: 10px 15px !important;
  border-radius: 20px !important;
}

:global(.Vue-Toastification__toast-body) {
  margin: 0 !important;
  padding: 0 !important;
  width: auto !important;
  flex: 0 0 auto !important;
}

:global(.Vue-Toastification__toast-container) {
  width: auto !important;
  max-width: 100% !important;
}
</style>