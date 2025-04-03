<template>
    <v-sheet
      :color="themeColors.background"
      elevation="3"
      rounded="lg"
      class="news"
    >
      <v-tabs
        v-model="tab"
        :items="tabs"
        align-tabs="center"
        :color="themeColors.text"
        height="60"
        :slider-color="themeColors.accent"
      >
        <template v-slot:tab="{ item }">
          <v-tab
            :prepend-icon="item.icon"
            :text="item.text"
            :value="item.value"
            class="text-none"
          ></v-tab>
        </template>
  
        <template v-slot:item="{ item }">
          <v-tabs-window-item :value="item.value" class="pa-4" :style="{ color: themeColors.text }">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ratione debitis
            quis est labore voluptatibus! Eaque cupiditate minima, at placeat totam, magni
            doloremque veniam neque porro libero rerum unde voluptatem!
          </v-tabs-window-item>
        </template>
      </v-tabs>
    </v-sheet>
  </template>
  
  <script setup>
  import { ref, computed, defineProps } from 'vue'
  
  // Получаем текущие настройки темы из пропсов
  const props = defineProps({
    themeColors: Object
  });
  
  const tab = ref('tab-1')
  
  const tabs = [
    { icon: 'mdi-code-braces', text: 'In IT', value: 'tab-1' },
    { icon: 'mdi-earth', text: 'In World', value: 'tab-2' },
    { icon: 'mdi-book-open-page-variant', text: 'Others', value: 'tab-3' },
    { icon: 'mdi-shield-lock-outline', text: 'Closed', value: 'tab-4' },
  ]
  </script>
  
  <style scoped>
  .news {
    margin-top: 20px;
    transition: background 0.3s ease-in-out, color 0.3s ease-in-out;
  }
  </style>
  