<template>
  <div class="notification-manager position-fixed top-0 end-0 p-3" style="z-index: 9999;">
    <Toast v-for="(toast, index) in toasts" :key="index" :toast="toast" />
  </div>
</template>

<script>
import { computed } from 'vue';
import { useNotificationManager } from '@/composables/useNotificationManager';
import Toast from './Toast.vue';

export default {
  name: 'NotificationManager',
  components: {
    Toast
  },
  setup() {
    const { toasts } = useNotificationManager();

    return {
      toasts: computed(() => toasts.value)
    };
  }
};
</script>