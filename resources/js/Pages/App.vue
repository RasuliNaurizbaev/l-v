<template>
    <v-app :theme="themeMode" :style="{ background: themeColors.background }">
        <v-app-bar :color="themeColors.appBar" elevation="1">
            <v-app-bar-title>ダッシュボード</v-app-bar-title>
            <v-spacer></v-spacer>
            <v-menu>
                <template v-slot:activator="{ props }">
                    <v-btn icon v-bind="props">
                        <v-icon icon="mdi-theme-light-dark"></v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-subheader>テーマ設定</v-list-subheader>
                    <v-list-item @click="themeMode = 'light'">
                        <template v-slot:prepend>
                            <v-icon :color="themeMode === 'light' ? 'primary' : '#ffc107'"
                                icon="mdi-weather-sunny"></v-icon>
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

                    <v-list-subheader>テーマ色</v-list-subheader>
                    <v-list-item v-for="theme in availableThemes" :key="theme.name" @click="setTheme(theme.name)">
                        <template v-slot:prepend>
                            <v-icon :color="theme.primary" icon="mdi-circle"></v-icon>
                        </template>
                        <v-list-item-title>{{ theme.name }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-app-bar>

        <v-navigation-drawer :color="themeColors.navDrawer" location="right" permanent>
            <v-list>
                <v-list-item prepend-avatar="https://randomuser.me/api/portraits/women/82.jpg" title="Jane Smith"
                    subtitle="ログインした"></v-list-item>
            </v-list>

            <v-divider></v-divider>

            <v-list density="compact" nav class="navbar-list">
                <v-list-item prepend-icon="mdi-home-city" title="ホーム" value="home" :active="currentPage === 'home'"
                    @click="currentPage = 'home'"></v-list-item>
                <v-list-item prepend-icon="mdi-account" title="マイアッカウンター" value="account"
                    :active="currentPage === 'account'" @click="currentPage = 'account'"></v-list-item>
                <v-list-item prepend-icon="mdi-account-group-outline" title="ユーザー" value="users"
                    :active="currentPage === 'users'" @click="currentPage = 'users'"></v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-main>
            <v-container fluid>
                <v-sheet class="pa-4 rounded" elevation="1" height="100%" :color="themeColors.contentArea">
                    <div class="text-center text-body-1">
                        <h2 :class="`text-${themeColors.primary}`">ようこそ {{ currentTheme }} テーマへ</h2>
                        <p class="mt-4">これは {{ currentPage }} ページと {{ themeMode }} モデ</p>

                        <v-row class="mt-8">
                            <v-col v-for="(color, name) in themeColors" :key="name" cols="6" md="4">
                                <v-card :color="color" height="100" class="d-flex align-center justify-center">
                                    <span class="text-caption font-weight-bold"
                                        :class="name === 'primary' || name === 'secondary' ? 'text-white' : ''">
                                        {{ name }}: {{ color }}
                                    </span>
                                </v-card>
                            </v-col>
                        </v-row>
                    </div>
                </v-sheet>

                <v-layout class="border rounded transition-height" :style="{
                    height: active ? '120px' : '60px',
                    backgroundColor: themeColors.contentArea,
                    color: themeMode === 'dark' ? '#fff' : '#000'
                }">
                    <div class="d-flex justify-center align-center" style="width: 100%; height: 60px;">
                        <v-btn class="btn-game"
                            :class="{ 'light-theme': themeMode === 'light', 'dark-theme': themeMode === 'dark' }"
                            variant="outlined" @click="active = !active">
                            オフラインゲーム
                        </v-btn>
                    </div>

                    <v-bottom-navigation v-if="active" color="indigo" class="link-container">
                        <Link href="/game1" class="no-style-link"
                            :class="{ 'light-theme': themeMode === 'light', 'dark-theme': themeMode === 'dark' }">
                        <v-btn>
                            <v-icon>mdi-gamepad-outline</v-icon>
                            2048
                        </v-btn>
                        </Link>
                        <Link href="/" class="no-style-link"
                            :class="{ 'light-theme': themeMode === 'light', 'dark-theme': themeMode === 'dark' }">
                        <v-btn>
                            <v-icon>mdi-gamepad-outline</v-icon>
                            まだ無い
                        </v-btn>
                        </Link>
                        <Link href="/" class="no-style-link"
                            :class="{ 'light-theme': themeMode === 'light', 'dark-theme': themeMode === 'dark' }">
                        <v-btn>
                            <v-icon>mdi-gamepad-outline</v-icon>
                            まだ無い
                        </v-btn>
                        </Link>
                    </v-bottom-navigation>
                </v-layout>

                <Sheet :themeColors="themeColors" />
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
import { Link } from '@inertiajs/vue3';
import '@mdi/font/css/materialdesignicons.css'; // Import MDI icons
import Sheet from '../Components/Sheet.vue';
const active = ref(false)

// Theme mode (light/dark)
const themeMode = ref('light');

// Current active page
const currentPage = ref('home');

// Available color themes
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

// Current theme
const currentTheme = ref('Default');

// Get current theme colors
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

// Set theme function
const setTheme = (themeName) => {
    currentTheme.value = themeName;
};

// Navigation links
const links = [
    'ホーム',
    '我が達',
    'チーム',
    'サービス',
    'ブログ',
    '連絡先',
];
</script>

<style>
@import "https://cdn.jsdelivr.net/npm/@mdi/font@7.2.96/css/materialdesignicons.min.css";

.navbar-list i {
    color: #1976D2;
}

.dark-layout {
    background-color: #1e1e1e;
    color: white;
}

.light-layout {
    background-color: #f5f5f5;
    color: #000;
}

.link-container {
    display: flex;
    justify-content: center;
    align-items: center;
}


.transition-height {
    transition: height 0.3s ease-in-out;
}


.btn-game.light-theme {
    background-color: #fff; 
    color: indigo; 
}

.btn-game.dark-theme {
    background-color: #333; 
    color: #6ff8da;
}

.no-style-link {
    list-style: none;
    text-decoration: none;
}

.no-style-link.light-theme {
    color: indigo;
}

.no-style-link.dark-theme {
    color: #6ff8da;
}


.no-style-link:active {
    color: red;
}
</style>