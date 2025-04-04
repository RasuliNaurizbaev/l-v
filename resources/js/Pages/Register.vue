<template>
    <v-app :theme="themeMode" :style="{ background: themeColors.background }">
      <!-- Верхняя панель -->
      <v-app-bar :color="themeColors.appBar" elevation="1">
        <v-app-bar-title>新規登録</v-app-bar-title>
        <v-spacer></v-spacer>
  
        <!-- Переключатель темы -->
        <v-btn icon @click="toggleTheme">
          <v-icon>{{ themeMode === 'dark' ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
        </v-btn>
      </v-app-bar>
  
      <v-main>
        <v-container class="d-flex justify-center align-center" style="min-height: 100vh;">
          <v-card class="pa-8" elevation="8" width="448" rounded="lg">
            <div class="text-subtitle-1 text-medium-emphasis text-start mb-4">
              新しいアカウントを作成
            </div>
  
            <v-form ref="form" v-model="valid">
              <v-text-field
                v-model="firstName"
                label="名前"
                placeholder="あなたの名前を入力してください"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                :rules="[rules.required]"
              ></v-text-field>
  
              <v-text-field
                v-model="lastName"
                label="苗字"
                placeholder="あなたの苗字を入力してください"
                prepend-inner-icon="mdi-account-outline"
                variant="outlined"
                :rules="[rules.required]"
              ></v-text-field>
  
              <v-text-field
                v-model="email"
                label="メールアドレス"
                placeholder="メールアドレスを入力してください"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                :rules="[rules.required, rules.email]"
              ></v-text-field>
  
              <v-text-field
                v-model="password"
                label="パスワード"
                placeholder="パスワードを入力してください"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                :type="showPassword ? 'text' : 'password'"
                variant="outlined"
                @click:append-inner="showPassword = !showPassword"
                :rules="[rules.required, rules.passwordStrength]"
              ></v-text-field>
  
              <v-checkbox
                v-model="termsAccepted"
                label="利用規約に同意します"
                :rules="[rules.requiredCheckbox]"
              ></v-checkbox>
  
              <v-btn
                color="blue"
                size="large"
                variant="tonal"
                block
                :loading="loading"
                :disabled="!valid || loading"
                class="mt-4"
                @click="register"
              >
                登録
              </v-btn>
            </v-form>
  
            <v-card-text class="text-center mt-3">
              すでにアカウントをお持ちですか？
              <a href="/login" class="text-blue">ログイン</a>
            </v-card-text>
          </v-card>
        </v-container>
      </v-main>
  
      <!-- Нижний футер -->
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
  
  // Поля формы
  const firstName = ref('');
  const lastName = ref('');
  const email = ref('');
  const password = ref('');
  const termsAccepted = ref(false);
  const showPassword = ref(false);
  const valid = ref(false);
  const loading = ref(false);
  
  // Тема (light/dark)
  const themeMode = ref('light');
  
  // Переключение темы
  const toggleTheme = () => {
    themeMode.value = themeMode.value === 'light' ? 'dark' : 'light';
  };
  
  // Текущая тема
  const currentTheme = ref('Default');
  
  // Доступные темы
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
  
  // Валидационные правила
  const rules = {
    required: value => !!value || '必須フィールド',
    requiredCheckbox: value => value || '利用規約に同意する必要があります',
    email: value => /.+@.+\..+/.test(value) || '正しいメールアドレスを入力してください',
    passwordStrength: value =>
      (value.length >= 6 && /[A-Za-z]/.test(value) && /\d/.test(value)) ||
      'パスワードは6文字以上で、数字と文字を含める必要があります'
  };
  
  // Функция регистрации
  const register = async () => {
    if (!valid.value) return;
    loading.value = true;
    console.log('Registering...', {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
      termsAccepted: termsAccepted.value
    });
    
    setTimeout(() => {
      console.log('Registration successful');
    }, 2000);
    
    localStorage.setItem("user", JSON.stringify({
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value
    }));
    
  
    setTimeout(() => {
      loading.value = false;
      alert('登録が完了しました！');
    }, 2000);
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
  