import { createRouter, createWebHistory } from "vue-router";
import { useAppOptionStore } from '@/stores/app-option';
import config from '@/config';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/Home', component: () => import('../views/Home.vue') },
    { path: '/', component: () => import('../views/UavControl.vue') },
    { path: '/overview', component: () => import('../views/UavControlOverview.vue') },
    // { path: '/contact', component: () => import('../views/Contact.vue') },
    { path: '/:pathMatch(.*)*', component: () => import('../views/PageError.vue') }
  ],
});

router.beforeEach((to, from, next) => {
  const appOptionStore = useAppOptionStore();

  if (to.query.testMode !== undefined) {
    console.log('testMode variable:', to.query.testMode);
    appOptionStore.testMode = to.query.testMode === 'true';
  }

  next();
});

export default router;
