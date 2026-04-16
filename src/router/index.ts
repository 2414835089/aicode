import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import MenuDetail from '../views/MenuDetail.vue';
import AddMenu from '../views/AddMenu.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/menu/:id',
      name: 'MenuDetail',
      component: MenuDetail
    },
    {
      path: '/add',
      name: 'AddMenu',
      component: AddMenu
    }
  ]
});

export default router;