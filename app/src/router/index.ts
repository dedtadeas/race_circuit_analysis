import { createRouter, createWebHistory } from "vue-router";
import { useAppOptionStore } from '@/stores/app-option';
import CircuitPage from '@/views/CircuitPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/Home', component: () => import('../views/Home.vue') },
    { path: '/', component: () => import('../views/Home.vue') },
    { path: '/Circuits', component: () => import('../views/Circuits.vue') },
    { path: '/Circuits/:id', component: CircuitPage, props: true },
    // { path: '/overview', component: () => import('../views/UavControlOverview.vue') },
    // // { path: '/contact', component: () => import('../views/Contact.vue') },
    // { path: '/:pathMatch(.*)*', component: () => import('../views/PageError.vue') }
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
