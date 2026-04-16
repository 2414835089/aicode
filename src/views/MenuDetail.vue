<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Menu } from '../services/api';
import { menuApi } from '../services/api';

const route = useRoute();
const router = useRouter();
const menu = ref<Menu | null>(null);
const loading = ref(false);

// 模拟数据
const mockMenu: Menu = {
  id: 1,
  name: '宫保鸡丁',
  category: 'adult',
  description: '经典川菜，香辣可口',
  image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20Kung%20Pao%20Chicken%20dish%20with%20peanuts%20and%20vegetables&image_size=square',
  ingredients: '鸡肉200g,花生50g,青椒50g,干辣椒10g,蒜5g,姜5g,料酒10ml,生抽15ml,老抽5ml,糖5g,盐2g',
  steps: '1. 鸡肉切丁，用料酒、生抽腌制10分钟\n2. 花生炸熟备用\n3. 锅中放油，爆香姜蒜和干辣椒\n4. 放入鸡丁翻炒至变色\n5. 加入青椒翻炒\n6. 加入调味汁和花生翻炒均匀',
  nutrition: '{"calories": 350, "protein": 25, "fat": 20, "carbs": 15}'
};

const loadMenu = async () => {
  const id = Number(route.params.id);
  if (!id) {
    router.push('/');
    return;
  }

  loading.value = true;
  try {
    const data = await menuApi.getById(id);
    menu.value = data;
  } catch (error) {
    // 后端不可用时使用模拟数据
    menu.value = mockMenu;
  } finally {
    loading.value = false;
  }
};

const getSteps = () => {
  if (!menu.value?.steps) return [];
  return menu.value.steps.split('\n');
};

const getNutrition = () => {
  if (!menu.value?.nutrition) return null;
  try {
    return JSON.parse(menu.value.nutrition);
  } catch (error) {
    return null;
  }
};

const getIngredients = () => {
  if (!menu.value?.ingredients) return [];
  return menu.value.ingredients.split(',');
};

onMounted(() => {
  loadMenu();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 头部 -->
    <header class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <button
            @click="router.push('/')"
            class="flex items-center text-gray-700 hover:text-orange-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            返回
          </button>
          <h1 class="text-xl font-bold text-orange-500">菜单详情</h1>
          <div class="w-10"></div>
        </div>
      </div>
    </header>

    <!-- 主内容 -->
    <main class="container mx-auto px-4 py-8">
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
      <div v-else-if="menu" class="max-w-4xl mx-auto">
        <!-- 菜品图片 -->
        <div class="relative h-80 mb-8 rounded-xl overflow-hidden shadow-lg">
          <img 
            :src="menu.image" 
            :alt="menu.name"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div class="p-6 text-white">
              <h2 class="text-3xl font-bold">{{ menu.name }}</h2>
              <p class="mt-2 text-lg">{{ menu.description }}</p>
              <div class="mt-4 inline-block px-4 py-2 rounded-full text-sm font-medium" :class="menu.category === 'adult' ? 'bg-orange-500' : 'bg-green-500'">
                {{ menu.category === 'adult' ? '成人菜单' : '婴儿菜单' }}
              </div>
            </div>
          </div>
        </div>

        <!-- 食材 -->
        <div class="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 class="text-xl font-bold mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            食材
          </h3>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="(ingredient, index) in getIngredients()" 
              :key="index"
              class="px-3 py-1 bg-gray-100 rounded-full text-sm"
            >
              {{ ingredient }}
            </span>
          </div>
        </div>

        <!-- 制作步骤 -->
        <div class="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 class="text-xl font-bold mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            制作步骤
          </h3>
          <ol class="list-decimal list-inside space-y-3">
            <li v-for="(step, index) in getSteps()" :key="index" class="text-gray-700">
              {{ step }}
            </li>
          </ol>
        </div>

        <!-- 营养信息 -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <h3 class="text-xl font-bold mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            营养信息
          </h3>
          <div v-if="getNutrition()" class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="(value, key) in getNutrition()" :key="key" class="bg-gray-50 p-4 rounded-lg text-center">
              <div class="text-sm text-gray-500">{{ String(key) === 'calories' ? '热量' : String(key) === 'protein' ? '蛋白质' : String(key) === 'fat' ? '脂肪' : String(key) === 'carbs' ? '碳水' : String(key) }}</div>
              <div class="text-xl font-bold mt-1">{{ value }}{{ String(key) === 'calories' ? 'kcal' : (String(key) === 'protein' || String(key) === 'fat' || String(key) === 'carbs') ? 'g' : '' }}</div>
            </div>
          </div>
          <div v-else class="text-gray-500">暂无营养信息</div>
        </div>
      </div>
      <div v-else class="text-center py-12">
        <p class="text-gray-600">菜品不存在</p>
        <button
          @click="router.push('/')"
          class="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          返回首页
        </button>
      </div>
    </main>

    <!-- 底部 -->
    <footer class="bg-white shadow-sm mt-12">
      <div class="container mx-auto px-4 py-6 text-center text-gray-600">
        <p>© 2024 菜单随机选择器</p>
      </div>
    </footer>
  </div>
</template>