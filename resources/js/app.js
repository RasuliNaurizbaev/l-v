import { createApp, h, ref, provide } from 'vue'
import { createPinia } from 'pinia';
import { createInertiaApp } from '@inertiajs/vue3'
import vuetify from './vuetify'

createInertiaApp({
  resolve: name => {
    const pages = import.meta.glob('./Pages/**/*.vue', { eager: true })
    return pages[`./Pages/${name}.vue`]
  },
  setup({ el, App, props, plugin }) {
    const isDark = ref(localStorage.getItem('theme') === 'dark');

    const toggleTheme = () => {
        isDark.value = !isDark.value;
        localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
    };
    const pinia = createPinia();
    const app = createApp({ render: () => h(App, props) });

    app.provide('theme', { isDark, toggleTheme });

    app.use(plugin).use(vuetify).use(pinia).mount(el);
  },
})
