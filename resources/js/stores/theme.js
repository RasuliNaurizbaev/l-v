
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  const themeMode = ref('light');
  const currentTheme = ref('Default');

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
      contentArea: '#F5F5F5',
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
      contentArea: '#F1F8E9',
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
      contentArea: '#EDE7F6',
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
      contentArea: '#EFEBE9',
    },
  ];

  const themeColors = computed(() => {
    const theme = availableThemes.find((t) => t.name === currentTheme.value);
    const isDark = themeMode.value === 'dark';
    return {
      ...theme,
      background: isDark ? '#121212' : '#FFFFFF',
      appBar: isDark ? '#1E1E1E' : theme.primary,
      navDrawer: isDark ? '#212121' : '#FFFFFF',
      contentArea: isDark ? '#1E1E1E' : theme.contentArea,
      footer: isDark ? '#1E1E1E' : '#F5F5F5',
    };
  });

  return {
    themeMode,
    currentTheme,
    availableThemes,
    themeColors,
  };
});
