<template>
    <v-app :theme="themeMode" :style="{ background: themeColors.background }">
    <v-app-bar :color="themeColors.appBar" elevation="2" class="rounded-b-2xl shadow-md">
      <v-app-bar-title class="text-white font-bold text-lg">設定</v-app-bar-title>
      <v-spacer></v-spacer>

      <v-menu transition="slide-y-transition">
        <template v-slot:activator="{ props }">
          <v-btn class="text-capitalize" @click="homePage">Home</v-btn>
          <v-btn class="text-capitalize">Contact</v-btn>
          <v-btn class="text-capitalize">My Account</v-btn>
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn class="text-capitalize" v-bind="props">
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
          <v-btn icon v-bind="props">
            <v-icon icon="mdi-theme-light-dark" class="text-white"></v-icon>
          </v-btn>
        </template>
        <v-list class="py-2">
          <v-list-subheader class="text-grey">テーマ設定</v-list-subheader>
          <v-list-item @click="themeMode = 'light'">
            <template v-slot:prepend>
              <v-icon :color="themeMode === 'light' ? 'primary' : '#ffc107'" icon="mdi-weather-sunny"></v-icon>
            </template>
            <v-list-item-title>明るい</v-list-item-title>
          </v-list-item>
          <v-list-item @click="themeMode = 'dark'">
            <template v-slot:prepend>
              <v-icon :color="themeMode === 'dark' ? '#fff1c1' : ''" icon="mdi-weather-night"></v-icon>
            </template>
            <v-list-item-title>黒い</v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-subheader class="text-grey">テーマ色</v-list-subheader>
          <v-list-item v-for="theme in availableThemes" :key="theme.name" @click="setTheme(theme.name)"
            class="rounded hover:bg-grey-lighten-4">
            <template v-slot:prepend>
              <v-icon :color="theme.primary" icon="mdi-circle"></v-icon>
            </template>
            <v-list-item-title>{{ theme.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
        <v-container>
        
        <div class="text-subtitle-2 mt-4 mb-2">FAQ</div>

<v-expansion-panels variant="accordion">
  <v-expansion-panel
    v-for="i in 3"
    :key="i"
    text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    title="Item"
  ></v-expansion-panel>
</v-expansion-panels>
    </v-container>

    <v-footer :color="themeColors.footer" app class="px-4 py-2">
      <div class="d-flex flex-wrap justify-center w-100">
        <v-btn v-for="link in links" :key="link" :text="link" variant="text" rounded class="mx-2 text-blue"></v-btn>
        <div class="w-100 text-center mt-2 text-grey">
          {{ new Date().getFullYear() }} — <strong>Vuetify</strong>
        </div>
      </div>
    </v-footer>
    </v-app>
</template>
<script setup>

import { ref, computed } from 'vue';
import { router } from "@inertiajs/vue3"
// Theme state
const themeMode = ref('light');
const currentTheme = ref('Default');

// User info
const userName = ref('山田 太郎');
const email = ref('example@example.com');
const password = ref('');
const address = ref('東京都千代田区');
const phone = ref('090-1234-5678');

// Theme list
const availableThemes = [
  {
    name: 'Default',
    primary: '#1976D2',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107',
    contentArea: '#F5F5F5'
  },
  {
    name: 'Nature',
    primary: '#4CAF50',
    secondary: '#8BC34A',
    accent: '#CDDC39',
    error: '#FF5722',
    info: '#00BCD4',
    success: '#009688',
    warning: '#FF9800',
    contentArea: '#F1F8E9'
  },
  {
    name: 'Royal',
    primary: '#673AB7',
    secondary: '#9C27B0',
    accent: '#3F51B5',
    error: '#F44336',
    info: '#2196F3',
    success: '#8BC34A',
    warning: '#FFEB3B',
    contentArea: '#EDE7F6'
  },
  {
    name: 'Vintage',
    primary: '#795548',
    secondary: '#5D4037',
    accent: '#A1887F',
    error: '#D32F2F',
    info: '#607D8B',
    success: '#388E3C',
    warning: '#FFA000',
    contentArea: '#EFEBE9'
  }
];

const helpItems = [
  { title: 'Documentation' },
  { title: 'Support' },
  { title: 'Feedback' },
]

// location home page
const homePage = () => {
  router.visit("/");
}

// Computed colors
const themeColors = computed(() => {
  const theme = availableThemes.find(t => t.name === currentTheme.value);
  const isDark = themeMode.value === 'dark';
  return {
    ...theme,
    background: isDark ? '#121212' : '#FFFFFF',
    appBar: isDark ? '#1E1E1E' : theme.primary,
    navDrawer: isDark ? '#212121' : '#FFFFFF',
    contentArea: isDark ? '#1E1E1E' : theme.contentArea,
    footer: isDark ? '#1E1E1E' : '#F5F5F5'
  };
});

// Main content styles
const mainStyles = computed(() => ({
  'min-height': 'calc(100vh - 64px - 48px)', // Adjust based on your app-bar and footer heights
  'background': themeColors.value.contentArea,
  'transition': 'background 0.3s ease'
}));

// Set theme
const setTheme = (themeName) => {
  currentTheme.value = themeName;
};

// Click 確認 button
const eventSave = (isActive) => {
  if (userName.value === '' || email.value === '' || password.value === '' || address.value === '' || phone.value === '') {
    alert('全てのフィールドを入力してください。');
  } else {
    saveSettings();
  }
  closeDialog(isActive);
};

// Close Dialog
const closeDialog = (isActive) => {
  isActive.value = false;
};

// Save mock
const saveSettings = () => {
  localStorage.setItem("user", JSON.stringify({
    name: userName.value,
    email: email.value,
    password: password.value,
    address: address.value,
    phone: phone.value
  }));
};

// Footer links
const links = ['ホーム', 'サポート', 'お問い合わせ'];
</script>