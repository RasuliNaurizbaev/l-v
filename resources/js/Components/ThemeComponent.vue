<!-- js/Components/ThemeComponent.vue -->
<template>
  <v-app :theme="themeStore.themeMode" :style="{ background: themeStore.themeColors.background }">
    <slot />
  </v-app>
</template>

<script setup>
import { useThemeStore } from '../stores/theme';
const themeStore = useThemeStore();
</script>
