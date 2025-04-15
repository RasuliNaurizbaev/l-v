<template>
  <ThemeComponent>
    <NavAppComponent />
    <v-main>
      <v-container :style="{ 'dark-theme': themeColors.contentArea, minHeight: 'calc(100vh - 128px)' }">
        <div class="text-subtitle-2  mb-2">FAQ</div>

        <v-expansion-panels variant="accordion">
          <v-expansion-panel v-for="i in 3" :key="i"
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            title="Item"></v-expansion-panel>
        </v-expansion-panels>
      </v-container>
    </v-main>
    <FooterComponent />
  </ThemeComponent>
</template>

<script setup>
import ThemeComponent from '../Components/ThemeComponent.vue';
import NavAppComponent from '../Components/NavAppComponent.vue';
import FooterComponent from '../Components/FooterComponent.vue';
import { useThemeStore } from '../stores/theme.js';

const themeStore = useThemeStore();
const themeColors = themeStore.themeColors;
</script>

<style scoped>
.dark-theme {
  background-color: #121212;
}
</style>