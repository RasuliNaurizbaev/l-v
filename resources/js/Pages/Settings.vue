<template>
  <v-app :theme="themeMode" :style="{ background: themeColors.background }">
    <v-app-bar :color="themeColors.appBar" elevation="2" class="rounded-b-2xl shadow-md">
      <v-app-bar-title class="text-white font-bold text-lg">設定</v-app-bar-title>
      <v-spacer></v-spacer>

      <v-menu transition="slide-y-transition">
        <template v-slot:activator="{ props }">
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
          <v-list-item v-for="theme in availableThemes" :key="theme.name" @click="setTheme(theme.name)" class="rounded hover:bg-grey-lighten-4">
            <template v-slot:prepend>
              <v-icon :color="theme.primary" icon="mdi-circle"></v-icon>
            </template>
            <v-list-item-title>{{ theme.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-container class="py-10">
        <v-card class="mx-auto pa-6 rounded-xl shadow-xl" max-width="600" elevation="4">
          <v-card-title class="text-h5 font-semibold mb-4">ユーザー設定</v-card-title>
          <v-divider class="my-4"></v-divider>

          <v-text-field label="名前" v-model="userName" prepend-inner-icon="mdi-account" variant="outlined" class="mb-4"></v-text-field>
          <v-text-field label="メールアドレス" v-model="email" prepend-inner-icon="mdi-email" variant="outlined" class="mb-4"></v-text-field>
          <v-text-field label="パスワード" v-model="password" prepend-inner-icon="mdi-lock" type="password" variant="outlined" class="mb-4"></v-text-field>
          <v-text-field label="住所" v-model="address" prepend-inner-icon="mdi-home" variant="outlined" class="mb-4"></v-text-field>
          <v-text-field label="電話番号" v-model="phone" prepend-inner-icon="mdi-phone" variant="outlined" class="mb-4"></v-text-field>

          <v-btn color="primary" class="mt-6" block size="large" rounded @click="saveSettings">
            保存
          </v-btn>
        </v-card>
      </v-container>
    </v-main>

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
import '@mdi/font/css/materialdesignicons.css';

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
    warning: '#FFC107'
  },
  {
    name: 'Nature',
    primary: '#4CAF50',
    secondary: '#8BC34A',
    accent: '#CDDC39',
    error: '#FF5722',
    info: '#00BCD4',
    success: '#009688',
    warning: '#FF9800'
  },
  {
    name: 'Royal',
    primary: '#673AB7',
    secondary: '#9C27B0',
    accent: '#3F51B5',
    error: '#F44336',
    info: '#2196F3',
    success: '#8BC34A',
    warning: '#FFEB3B'
  },
  {
    name: 'Vintage',
    primary: '#795548',
    secondary: '#5D4037',
    accent: '#A1887F',
    error: '#D32F2F',
    info: '#607D8B',
    success: '#388E3C',
    warning: '#FFA000'
  }
];

// Computed colors
const themeColors = computed(() => {
  const theme = availableThemes.find(t => t.name === currentTheme.value);
  const isDark = themeMode.value === 'dark';
  return {
    ...theme,
    background: isDark ? '#121212' : '#FFFFFF',
    appBar: isDark ? '#1E1E1E' : theme.primary,
    navDrawer: isDark ? '#212121' : '#FFFFFF',
    contentArea: isDark ? '#333333' : '#F5F5F5',
    footer: isDark ? '#1E1E1E' : '#F5F5F5'
  };
});

// Set theme
const setTheme = (themeName) => {
  currentTheme.value = themeName;
};

// Save mock
const saveSettings = () => {
  console.log('Saved:', {
    name: userName.value,
    email: email.value,
    password: password.value,
    address: address.value,
    phone: phone.value
  });
};

// Footer links
const links = ['ホーム', 'サポート', 'お問い合わせ'];
</script>
