<template>
    <v-app :theme="themeMode" :style="{ background: themeColors.background }">
      <v-app-bar :color="themeColors.appBar" elevation="1">
        <v-app-bar-title>ログインページ</v-app-bar-title>
        <v-spacer></v-spacer>
  
        <!-- Переключатель темы -->
        <v-btn icon @click="toggleTheme">
          <v-icon>{{ themeMode === 'dark' ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
        </v-btn>
      </v-app-bar>
  
      <v-main>
        <v-container class="d-flex justify-center align-center" style="min-height: 100vh;">
          <v-card class="pa-8" elevation="8" max-width="448" rounded="lg">
            <div class="text-subtitle-1 text-medium-emphasis text-start mb-4">
              アカウントにログイン
            </div>
  
            <v-text-field
              density="compact"
              placeholder="メールアドレス"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
              v-model="email"
              class="mb-6"
            ></v-text-field>
  
            <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between mb-2">
              パスワード
              <a class="text-caption text-decoration-none text-blue" href="#" rel="noopener noreferrer">
                パスワードを忘れた場合
              </a>
            </div>
  
            <v-text-field
              :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
              :type="visible ? 'text' : 'password'"
              density="compact"
              placeholder="パスワードを入力"
              prepend-inner-icon="mdi-lock-outline"
              variant="outlined"
              v-model="password"
              @click:append-inner="visible = !visible"
              class="mb-6"
            ></v-text-field>
  
            <v-card color="surface-variant" variant="tonal" class="mb-6">
              <v-card-text class="text-medium-emphasis text-caption">
                ⚠️ 3回連続でログインに失敗した場合、アカウントは3時間ロックされます。ログインできない場合は、「パスワードを忘れた場合」をクリックしてください。
              </v-card-text>
            </v-card>
  
            <v-btn
              class="mb-6"
              color="blue"
              size="large"
              variant="tonal"
              block
              @click="login"
              :loading="loading"
            >
              ログイン
            </v-btn>
  
            <v-card-text class="text-center">
              <a class="text-blue text-decoration-none" href="/register">
                新規登録 <v-icon icon="mdi-chevron-right"></v-icon>
              </a>
            </v-card-text>
          </v-card>
        </v-container>
      </v-main>
  
      <v-footer :color="themeColors.footer" app class="px-4">
        <div class="d-flex flex-wrap justify-center w-100">
          <v-btn v-for="link in links" :key="link" :text="link" variant="text" rounded class="mx-2"></v-btn>
          <div class="w-100 text-center mt-2">
            {{ new Date().getFullYear() }} — <strong>Vuetify</strong>
          </div>
        </div>
      </v-footer>
    </v-app>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { router } from '@inertiajs/vue3';
  // Поля формы
  const email = ref('');
  const password = ref('');
  const visible = ref(false);
  const loading = ref(false);
  
  // Тема (light/dark)
  const themeMode = ref('light');
  
  // Переключение темы
  const toggleTheme = () => {
    themeMode.value = themeMode.value === 'light' ? 'dark' : 'light';
  };
  
  // Текущая тема
  const currentTheme = ref('Default');
  
  // Доступные цветовые схемы
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
    }
  ];
  
  // Получение текущих цветов темы
  const themeColors = computed(() => {
    const theme = availableThemes.find(t => t.name === currentTheme.value);
    const isDark = themeMode.value === 'dark';
  
    return {
      primary: theme.primary,
      secondary: theme.secondary,
      accent: theme.accent,
      error: theme.error,
      info: theme.info,
      success: theme.success,
      warning: theme.warning,
      background: isDark ? '#121212' : '#FFFFFF',
      appBar: isDark ? '#1E1E1E' : theme.primary,
      navDrawer: isDark ? '#212121' : '#FFFFFF',
      contentArea: isDark ? '#333333' : '#F5F5F5',
      footer: isDark ? '#1E1E1E' : '#F5F5F5'
    };
  });
  
  // Функция входа
  const login = async () => {
    if (email.value && password.value) {
      loading.value = true;
      try{
        const user = localStorage.getItem('user');
        if(!user){
            alert('ユーザーが見つかりません');
            return;
        }else{
            const parsedUser = JSON.parse(user);
            if(parsedUser.email !== email.value || parsedUser.password !== password.value){
                alert('メールアドレスまたはパスワードが間違っています');
                return;
            }
        }
        router.visit("/");
      }catch (error) {
        console.error('Login error:', error);
      } finally {
        loading.value = false;
      }
    } else {
      console.log('フォームを入力してください');
    }
  };
  
  // Навигационные ссылки
  const links = ['ホーム', 'サポート', 'お問い合わせ'];
  </script>
  
  <style>
  @import "https://cdn.jsdelivr.net/npm/@mdi/font@7.2.96/css/materialdesignicons.min.css";
  
  .text-primary {
    color: #1976D2 !important;
  }
  
  .text-white {
    color: white !important;
  }
  
  .text-center {
    text-align: center !important;
  }
  
  .btn-primary {
    background-color: #1976D2 !important;
    color: white !important;
  }
  
  .mb-6 {
    margin-bottom: 24px;
  }
  
  .w-100 {
    width: 100%;
  }
  
  .v-card {
    max-width: 448px;
    padding: 24px;
  }
  
  .v-text-field {
    margin-bottom: 24px;
  }
  </style>
  