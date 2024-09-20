<template>
  <div
    ref="toastElement"
    class="toast fade"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
    :data-bs-autohide="toast.delay !== null"
    :data-bs-delay="toast.delay !== null ? toast.delay : 0"
  >
    <div class="toast-header">
      <i class="far fa-bell text-muted me-2"></i>
      <strong class="me-auto">{{ toast.title || 'Notification' }}</strong>
      <small>{{ toast.timestamp }}</small>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">
      {{ toast.message || '' }}
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { Toast as BSToast } from 'bootstrap';

export default {
  name: 'Toast',
  props: {
    toast: {
      type: Object,
      required: true,
      default: () => ({
        title: 'Notification',
        message: '',
        delay: null,
        timestamp: new Date().toLocaleTimeString()
      })
    }
  },
  setup(props) {
    const toastElement = ref(null);

    console.log('Toast setup', props.toast);

    onMounted(() => {
      console.log('Toast mounted');
      if (toastElement.value) {
        const bsToast = new BSToast(toastElement.value);
        bsToast.show();
      } else {
        console.error('Toast element is not defined');
      }
    });

    return {
      toastElement
    };
  }
};
</script>

<style scoped>
.toast {
  margin-bottom: 10px;
}
</style>
