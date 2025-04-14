<!-- js/Components/NavAppComponent.vue -->
<template>
    <v-app-bar :color="themeStore.themeColors.appBar" elevation="2" class="rounded-b-2xl shadow-md">
      <v-app-bar-title class="text-white font-bold text-lg">設定</v-app-bar-title>
      <v-spacer></v-spacer>
  
      <!-- Main Menu -->
      <v-menu transition="slide-y-transition">
        <template #activator="{ props }">
          <v-btn class="text-capitalize" @click="goHome">Home</v-btn>
          <v-btn class="text-capitalize">Contact</v-btn>
          <v-btn class="text-capitalize">My Account</v-btn>
          <v-menu>
            <template #activator="{ props: nestedProps }">
              <v-btn class="text-capitalize" v-bind="nestedProps">
                Help
                <v-icon right>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item v-for="(item, index) in helpItems" :key="index" :value="index">
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-btn class="text-capitalize">FAQ</v-btn>
          <v-btn icon @click="toggleTheme">
            <v-icon icon="mdi-theme-light-dark" class="text-white"></v-icon>
          </v-btn>
        </template>
        <!-- Theme Settings Menu -->
        <v-list class="py-2">
          <v-list-subheader class="text-grey">テーマ設定</v-list-subheader>
          <v-list-item @click="setMode('light')">
            <template #prepend>
              <v-icon :color="themeStore.themeMode === 'light' ? 'primary' : '#ffc107'" icon="mdi-weather-sunny"></v-icon>
            </template>
            <v-list-item-title>明るい</v-list-item-title>
          </v-list-item>
          <v-list-item @click="setMode('dark')">
            <template #prepend>
              <v-icon :color="themeStore.themeMode === 'dark' ? '#fff1c1' : ''" icon="mdi-weather-night"></v-icon>
            </template>
            <v-list-item-title>黒い</v-list-item-title>
          </v-list-item>
  
          <v-divider></v-divider>
  
          <v-list-subheader class="text-grey">テーマ色</v-list-subheader>
          <v-list-item v-for="theme in themeStore.availableThemes" :key="theme.name" @click="setTheme(theme.name)"
            class="rounded hover:bg-grey-lighten-4">
            <template #prepend>
              <v-icon :color="theme.primary" icon="mdi-circle"></v-icon>
            </template>
            <v-list-item-title>{{ theme.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
  </template>
  
  <script setup>
  import { useThemeStore } from '../stores/theme';
  import { router } from '@inertiajs/vue3';
  
  const themeStore = useThemeStore();
  
  const helpItems = [
    { title: 'Documentation' },
    { title: 'Support' },
    { title: 'Feedback' }
  ];
  
  const goHome = () => {
    router.visit('/');
  };
  
  const setTheme = (themeName) => {
    themeStore.currentTheme = themeName;
  };
  
  const setMode = (mode) => {
    themeStore.themeMode = mode;
  };
  
  const toggleTheme = () => {
    themeStore.themeMode = themeStore.themeMode === 'light' ? 'dark' : 'light';
  };
  </script>
  