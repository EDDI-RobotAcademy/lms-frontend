<template>
  <div>
    <v-dialog v-model="dialog" max-width="600px" transition="dialog-bottom-transition" persistent>
      <v-card class="grocery-shop" color="#F6F1EB">
        <v-card-title class="headline text-center py-4 relative mt-10" style="color: #444444;">
          식료품 상점
        </v-card-title>
        <v-btn icon @click="closeDialog" class="close-btn" text>
          <v-icon color="#444444">mdi-close</v-icon>
        </v-btn>
        <v-card-text class="pt-6">
          <v-tabs v-model="activeTab" centered>
            <v-tab value="meats">육류</v-tab>
            <v-tab value="vegetables">채소</v-tab>
            <v-tab value="mystery">기타</v-tab>
          </v-tabs>
          <v-container>
            <v-row justify="center">
              <v-col cols="12" sm="4" v-for="item in currentItems" :key="item.name">
                <v-card class="grocery-option mx-auto d-flex flex-column" height="100%" color="#FFFCF7">
                  <v-card-text class="text-center d-flex flex-column align-center pa-4">
                    <div class="emoji-container mb-4">
                      <span class="emoji-icon">{{ item.icon }}</span>
                    </div>
                    <h2 class="text-h5 font-weight-bold mb-4">{{ item.name }}</h2>
                    <v-chip color="secondary" label class="px-4 mb-4 price-chip">
                      <span class="won-sign">🍒</span>{{ item.price }}
                    </v-chip>
                    <v-btn block color="#444444" :loading="item.loading" @click="purchaseItem(item)"
                      class="mt-2 purchase-btn">
                      구매
                    </v-btn>
                  </v-card-text>
                </v-card>
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
  name: 'GroceryShopPopup',
  data() {
    return {
      dialog: true,
      activeTab: 'meats',
      groceryItems: {
        meats: [
          { name: '소고기', price: 5000, icon: '🥩', loading: false },
          { name: '닭고기', price: 3000, icon: '🍗', loading: false },
          { name: '돼지고기', price: 4000, icon: '🥓', loading: false },
        ],
        vegetables: [
          { name: '당근', price: 1000, icon: '🥕', loading: false },
          { name: '토마토', price: 1500, icon: '🍅', loading: false },
          { name: '오이', price: 800, icon: '🥒', loading: false },
        ],
        mystery: [
          { name: '랜덤 박스', price: 2000, icon: '📦', loading: false },
        ],
      },
    }
  },
  computed: {
    currentItems() {
      return this.groceryItems[this.activeTab];
    },
    allItems() {
      return [...this.groceryItems.meats, ...this.groceryItems.vegetables];
    },
  },
  methods: {
    ...mapActions(authenticationModule, ['requestRedisPurchaseItemToDjango', 'requestRedisUpdateCherryToDjango', 'requestRedisGetCherryToDjango']),
    async purchaseItem(item) {
      item.loading = true;
      try {
        const userToken = localStorage.getItem("userToken");
        let purchasedItem = item;

        if (this.activeTab === 'mystery') {
          purchasedItem = this.getRandomItem();
        }

        const itemInfo = {
          usertoken: userToken,
          item: purchasedItem.name,
        }
        const cherryInfo = {
          usertoken: userToken,
          cherry: item.price,
        }
        if (userToken) {
          try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            const checkCherry = await this.requestRedisGetCherryToDjango(userToken.trim());
            console.log("아이템 가격", item.price)
            console.log("보유 체리", checkCherry.cherry)
            if (checkCherry.cherry >= item.price) {
              await this.requestRedisUpdateCherryToDjango(cherryInfo);
              await this.requestRedisPurchaseItemToDjango(itemInfo);
              if (this.activeTab === 'mystery') {
                this.showRandomBoxMessage(purchasedItem);
              } else {
                this.showSuccessMessage(purchasedItem);
              }
            }
            else {
              this.showFailedMessage(item, checkCherry.cherry);
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
        item.loading = false;
      }
    },
    getRandomItem() {
      const random = Math.random();
      if (random < 0.01) {
        return { name: '골드바', icon: '🏆' };
      }
      return this.allItems[Math.floor(Math.random() * this.allItems.length)];
    },
    closeDialog() {
      this.dialog = false;
      this.$emit('close');
    },
    showSuccessMessage(item) {
      toast.success(`${item.name}를 구매 하셨습니다!`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    },
    showRandomBoxMessage(item) {
      toast.success(` 🎉${item.name} 당첨!`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    },
    showFailedMessage(item, userCherry) {
      const cherryNeeded = item.price - userCherry;
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
.grocery-shop {
  border-radius: 20px;
  overflow: hidden;
}

.grocery-option {
  transition: all 0.3s cubic-bezier(.25, .8, .25, 1);
  border-radius: 15px !important;
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

.emoji-container {
  width: 80px;
  height: 80px;
  background-color: #BAA28C;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.emoji-icon {
  font-size: 40px;
}

.price-chip {
  background-color: #E0F2F1 !important;
  color: #00897B !important;
}

.won-sign {
  font-weight: bold;
  margin-right: 2px;
}

.purchase-btn {
  text-transform: none !important;
}
</style>