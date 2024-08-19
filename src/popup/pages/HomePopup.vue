<template>
    <v-dialog v-model="dialog" max-width="400">
        <v-card>
            <v-card-title class="headline grey lighten-2">
                서비스 이용 안내
                <v-spacer></v-spacer>
                <v-btn icon @click="closeModal">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>

            <v-card-text class="pa-4">
                <p class="text-body-1">
                    본 서비스는 베타 버전으로 운영되고 있습니다. 관련 개선사항이나 문의사항은 아래 링크로 의견을 주시면 감사하겠습니다.
                </p>
                <v-btn color="primary" text block class="mt-4" @click="openLink">
                    <v-icon left>mdi-link-variant</v-icon>
                    링크 바로가기
                </v-btn>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="dialog = false">
                    회사명
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    data() {
        return {
            dialog: true,
        };
    },
    methods: {
        openLink() {
            console.log('링크 바로가기 클릭됨');
        },
        closeModal() {
            this.$emit('sendClose', false)
        },
    },
};
</script>

<style scoped>
.v-card__title {
    font-size: 1.25rem;
    font-weight: 500;
}
</style>