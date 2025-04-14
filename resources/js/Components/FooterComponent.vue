<!-- js/Components/FooterComponent.vue -->
<template>
  <v-footer :color="themeStore.themeColors.footer" app class="px-4 py-2">
    <div class="d-flex flex-wrap justify-center w-100">
      <v-btn v-for="link in links" :key="link" text variant="text" rounded class="mx-2 text-blue">
        {{ link }}
      </v-btn>
      <div class="w-100 text-center mt-2 text-grey">
        {{ new Date().getFullYear() }} — <strong>Vuetify</strong>
      </div>
    </div>
  </v-footer>
</template>

<script setup>
import { useThemeStore } from '../stores/theme';
const themeStore = useThemeStore();
const links = ['ホーム', 'サポート', 'お問い合わせ'];
</script>
