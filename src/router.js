
import { createRouter, createWebHistory } from 'vue-router';
import Home from './components/RickAndMorty.vue';
import DetailView from './components/MountainDetail.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/detail/:id',
    name: 'Detail',
    component: DetailView
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;