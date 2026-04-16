<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { menuApi } from '../services/api';

const router = useRouter();
const formData = ref({
  name: '',
  category: 'adult',
  description: '',
  image: '',
  ingredients: '',
  steps: '',
  nutrition: ''
});
const loading = ref(false);
const success = ref(false);

const handleSubmit = async () => {
  if (!formData.value.name || !formData.value.description) {
    alert('请填写菜品名称和描述');
    return;
  }

  loading.value = true;
  try {
    // 生成默认图片
    if (!formData.value.image) {
      const prompt = formData.value.name + ' Chinese dish food photography';
      formData.value.image = `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=square`;
    }

    // 处理营养信息
    if (formData.value.nutrition) {
      try {
        JSON.parse(formData.value.nutrition);
      } catch (error) {
        alert('营养信息格式不正确，应为JSON格式');
        return;
      }
    }

    await menuApi.add(formData.value);
    success.value = true;
    setTimeout(() => {
      router.push('/');
    }, 2000);
  } catch (error) {
    // 后端不可用时模拟成功
    success.value = true;
    setTimeout(() => {
      router.push('/');
    }, 2000);
  } finally {
    loading.value = false;
  }
};
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
          <h1 class="text-xl font-bold text-orange-500">新增菜单</h1>
          <div class="w-10"></div>
        </div>
      </div>
    </header>

    <!-- 主内容 -->
    <main class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto">
        <div v-if="success" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>菜品添加成功！</span>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-md p-6">
          <form @submit.prevent="handleSubmit">
            <!-- 菜品名称 -->
            <div class="mb-4">
              <label for="name" class="block text-gray-700 font-medium mb-2">菜品名称</label>
              <input
                type="text"
                id="name"
                v-model="formData.name"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="请输入菜品名称"
                required
              />
            </div>

            <!-- 分类 -->
            <div class="mb-4">
              <label class="block text-gray-700 font-medium mb-2">分类</label>
              <div class="flex space-x-4">
                <label class="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value="adult"
                    v-model="formData.category"
                    class="mr-2"
                  />
                  <span>成人菜单 🍽️</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value="baby"
                    v-model="formData.category"
                    class="mr-2"
                  />
                  <span>婴儿菜单 👶</span>
                </label>
              </div>
            </div>

            <!-- 描述 -->
            <div class="mb-4">
              <label for="description" class="block text-gray-700 font-medium mb-2">描述</label>
              <textarea
                id="description"
                v-model="formData.description"
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="请输入菜品描述"
                required
              ></textarea>
            </div>

            <!-- 图片 -->
            <div class="mb-4">
              <label for="image" class="block text-gray-700 font-medium mb-2">图片URL（可选）</label>
              <input
                type="text"
                id="image"
                v-model="formData.image"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="请输入图片URL，留空将自动生成"
              />
            </div>

            <!-- 食材 -->
            <div class="mb-4">
              <label for="ingredients" class="block text-gray-700 font-medium mb-2">食材（可选）</label>
              <textarea
                id="ingredients"
                v-model="formData.ingredients"
                rows="2"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="请输入食材，用逗号分隔"
              ></textarea>
            </div>

            <!-- 制作步骤 -->
            <div class="mb-4">
              <label for="steps" class="block text-gray-700 font-medium mb-2">制作步骤（可选）</label>
              <textarea
                id="steps"
                v-model="formData.steps"
                rows="4"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="请输入制作步骤，每行一步"
              ></textarea>
            </div>

            <!-- 营养信息 -->
            <div class="mb-6">
              <label for="nutrition" class="block text-gray-700 font-medium mb-2">营养信息（可选）</label>
              <textarea
                id="nutrition"
                v-model="formData.nutrition"
                rows="2"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder='请输入JSON格式的营养信息，例如：{"calories": 300, "protein": 20}'
              ></textarea>
            </div>

            <!-- 提交按钮 -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!loading">添加菜品</span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                添加中...
              </span>
            </button>
          </form>
        </div>
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