import { createRouter, createWebHashHistory } from "vue-router";
import { useAppOptionStore } from '@/stores/app-option';
import CircuitPage from '@/views/CircuitPage.vue';

const basePath = process.env.NODE_ENV === 'production' ? '/race_circuit_analysis/' : '/';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/Home', component: () => import('../views/Home.vue') },
    { path: '/', component: () => import('../views/Circuits.vue') },
    { path: '/circuits', component: () => import('../views/Circuits.vue') },
    { path: '/circuits/:id', component: CircuitPage, props: true }
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
