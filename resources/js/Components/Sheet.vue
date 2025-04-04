<template>
  <v-sheet :color="themeColors.background" elevation="3" rounded="lg" class="news">
    <v-tabs
      v-model="tab"
      :items="tabs"
      align-tabs="center"
      :color="themeColors.text"
      height="60"
      :slider-color="themeColors.accent"
    >
      <template v-slot:tab="{ item }">
        <v-tab :prepend-icon="item.icon" :text="item.text" :value="item.value" class="text-none"></v-tab>
      </template>

      <template v-slot:item="{ item }">
        <v-tabs-window-item :value="item.value" class="pa-4" :style="{ color: themeColors.text }">
          <v-container>
            <v-row v-if="news[item.value].length">
              <v-col v-for="article in visibleNews[item.value]" :key="article.title" cols="12" md="6" lg="4">
                <v-card>
                  <v-img :src="article.urlToImage" height="200px" cover></v-img>
                  <v-card-title>{{ article.title }}</v-card-title>
                  <v-card-text>{{ article.description }}</v-card-text>
                  <v-card-actions>
                    <v-btn :href="article.url" target="_blank">
                      <v-icon left>mdi-open-in-new</v-icon> Read More
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
              <v-col cols="12" class="text-center" v-if="news[item.value].length > visibleCount[item.value]">
                <v-btn variant="tonal" @click="showMore(item.value)">
                  <v-icon left>mdi-dots-horizontal</v-icon> More News
                </v-btn>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col>
                <p>No news available.</p>
              </v-col>
            </v-row>
          </v-container>
        </v-tabs-window-item>
      </template>
    </v-tabs>
  </v-sheet>
</template>

<script setup>
import { ref, computed, onMounted, defineProps } from 'vue'

const props = defineProps({
  themeColors: Object
});

const tab = ref('tab-1');

const tabs = [
  { icon: 'mdi-code-braces', text: 'In IT', value: 'tab-1' },
  { icon: 'mdi-earth', text: 'In World', value: 'tab-2' },
  { icon: 'mdi-book-open-page-variant', text: 'Others', value: 'tab-3' }
];

const news = ref({
  'tab-1': [],
  'tab-2': [],
  'tab-3': []
});

const visibleCount = ref({
  'tab-1': 6,
  'tab-2': 6,
  'tab-3': 6
});

const visibleNews = computed(() => ({
  'tab-1': news.value['tab-1'].slice(0, visibleCount.value['tab-1']),
  'tab-2': news.value['tab-2'].slice(0, visibleCount.value['tab-2']),
  'tab-3': news.value['tab-3'].slice(0, visibleCount.value['tab-3'])
}));

const showMore = (tabKey) => {
  visibleCount.value[tabKey] += 6;
};

const API_KEY = '388eb2d2e94948f9af6de910a7b539bd';
const BASE_URL = 'https://newsapi.org/v2/top-headlines';

const fetchNews = async (category, tabKey) => {
  try {
    const response = await fetch(`${BASE_URL}?category=${category}&country=us&apiKey=${API_KEY}`);
    const data = await response.json();
    news.value[tabKey] = data.articles || [];
  } catch (error) {
    console.error("Error fetching news:", error);
  }
};

onMounted(() => {
  fetchNews('technology', 'tab-1');
  fetchNews('general', 'tab-2');
  fetchNews('science', 'tab-3');
});
</script>

<style scoped>
.news {
  margin-top: 20px;
  transition: background 0.3s ease-in-out, color 0.3s ease-in-out;
}
</style>