import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export interface Menu {
  id: number;
  name: string;
  category: string;
  description: string;
  image: string;
  ingredients?: string;
  steps?: string;
  nutrition?: string;
  createdAt?: string;
}

export const menuApi = {
  getAll: (): Promise<Menu[]> => api.get('/menus').then(res => res.data),
  getByCategory: (category: string): Promise<Menu[]> => api.get(`/menus/category/${category}`).then(res => res.data),
  getRandom: (): Promise<Menu> => api.get('/menus/random').then(res => res.data),
  getRandomByCategory: (category: string): Promise<Menu> => api.get(`/menus/random/${category}`).then(res => res.data),
  getById: (id: number): Promise<Menu> => api.get(`/menus/${id}`).then(res => res.data),
  add: (menu: Omit<Menu, 'id' | 'createdAt'>): Promise<Menu> => api.post('/menus', menu).then(res => res.data)
};