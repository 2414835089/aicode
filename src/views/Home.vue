<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { Menu } from '../services/api';
import { menuApi } from '../services/api';

const router = useRouter();
const activeCategory = ref('adult');
const menus = ref<Menu[]>([]);
const loading = ref(false);
const randomMenu = ref<Menu | null>(null);
const showRandomResult = ref(false);

// 模拟数据，用于在后端不可用时显示
const mockMenus: Menu[] = [
  {
    id: 1,
    name: '宫保鸡丁',
    category: 'adult',
    description: '经典川菜，香辣可口',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20Kung%20Pao%20Chicken%20dish%20with%20peanuts%20and%20vegetables&image_size=square'
  },
  {
    id: 2,
    name: '麻婆豆腐',
    category: 'adult',
    description: '四川传统名菜，麻辣鲜香',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Mapo%20Tofu%20Sichuan%20dish%20with%20tofu%20and%20spicy%20sauce&image_size=square'
  },
  {
    id: 3,
    name: '胡萝卜泥',
    category: 'baby',
    description: '适合6个月以上婴儿，富含维生素A',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Carrot%20puree%20for%20baby%20food&image_size=square'
  },
  {
    id: 4,
    name: '南瓜泥',
    category: 'baby',
    description: '适合6个月以上婴儿，口感香甜',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Pumpkin%20puree%20for%20baby%20food&image_size=square'
  }
];

const loadMenus = async () => {
  loading.value = true;
  try {
    const data = await menuApi.getByCategory(activeCategory.value);
    menus.value = data;
  } catch (error) {
    // 后端不可用时使用模拟数据
    menus.value = mockMenus.filter(menu => menu.category === activeCategory.value);
  } finally {
    loading.value = false;
  }
};

const handleRandom = async () => {
  loading.value = true;
  showRandomResult.value = false;
  try {
    const data = await menuApi.getRandomByCategory(activeCategory.value);
    randomMenu.value = data;
  } catch (error) {
    // 后端不可用时使用模拟数据
    const categoryMenus = mockMenus.filter(menu => menu.category === activeCategory.value);
    const randomIndex = Math.floor(Math.random() * categoryMenus.length);
    randomMenu.value = categoryMenus[randomIndex];
  } finally {
    loading.value = false;
    showRandomResult.value = true;
  }
};

const handleCategoryChange = (category: string) => {
  activeCategory.value = category;
  loadMenus();
  showRandomResult.value = false;
};

const navigateToDetail = (id: number) => {
  router.push(`/menu/${id}`);
};

onMounted(() => {
  loadMenus();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 头部 -->
    <header class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="w-10"></div>
          <h1 class="text-2xl font-bold text-center text-orange-500">
            菜单随机选择器
          </h1>
          <router-link
            to="/add"
            class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
          >
            + 新增菜单
          </router-link>
        </div>
      </div>
    </header>

    <!-- 主内容 -->
    <main class="container mx-auto px-4 py-8">
      <!-- 分类选择 -->
      <div class="flex justify-center mb-8">
        <div class="inline-flex rounded-md shadow-sm">
          <button
            type="button"
            :class="[
              'px-6 py-3 text-sm font-medium rounded-l-lg',
              activeCategory === 'adult' 
                ? 'bg-orange-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            ]"
            @click="handleCategoryChange('adult')"
          >
            成人菜单 🍽️
          </button>
          <button
            type="button"
            :class="[
              'px-6 py-3 text-sm font-medium rounded-r-lg',
              activeCategory === 'baby' 
                ? 'bg-green-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            ]"
            @click="handleCategoryChange('baby')"
          >
            婴儿菜单 👶
          </button>
        </div>
      </div>

      <!-- 随机选择按钮 -->
      <div class="flex justify-center mb-12">
        <button
          @click="handleRandom"
          :disabled="loading"
          class="group relative flex justify-center items-center w-64 h-24 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="!loading" class="flex items-center">
            🎲 随机选择
          </span>
          <span v-else class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            生成中...
          </span>
        </button>
      </div>

      <!-- 随机结果 -->
      <div v-if="showRandomResult && randomMenu" class="mb-12">
        <div class="bg-white rounded-xl shadow-lg overflow-hidden max-w-2xl mx-auto">
          <div class="relative h-64">
            <img 
              :src="randomMenu.image" 
              :alt="randomMenu.name"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div class="p-6 text-white">
                <h3 class="text-2xl font-bold">{{ randomMenu.name }}</h3>
                <p class="mt-2">{{ randomMenu.description }}</p>
              </div>
            </div>
          </div>
          <div class="p-6">
            <button
              @click="navigateToDetail(randomMenu.id)"
              class="w-full py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              查看详情
            </button>
          </div>
        </div>
      </div>

      <!-- 菜单列表 -->
      <div>
        <h2 class="text-xl font-bold mb-4 text-center">{{ activeCategory === 'adult' ? '成人菜单' : '婴儿菜单' }}列表</h2>
        <div v-if="loading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="menu in menus"
            :key="menu.id"
            class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            @click="navigateToDetail(menu.id)"
          >
            <div class="relative h-48">
              <img 
                :src="menu.image" 
                :alt="menu.name"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="p-4">
              <h3 class="font-bold text-lg mb-2">{{ menu.name }}</h3>
              <p class="text-gray-600 text-sm">{{ menu.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 底部 -->
    <footer class="bg-white shadow-sm mt-12">
      <div class="container mx-auto px-4 py-6 text-center text-gray-600">
        <p>© 2024 菜单随机选择器</p>
        <p class="text-sm mt-2">让选择变得简单</p>
      </div>
    </footer>
  </div>
</template>