<template>
  <div class="button-container">
    <button type="button" class="btn btn-outline-danger" @click="terminateUav" :disabled="isProcessing">
      {{ isProcessing ? 'Terminating...' : 'Terminate' }}
    </button>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useUavControl } from '@/composables/useUavControl'; // Adjust the path as necessary
import { useNotificationManager } from '@/composables/useNotificationManager'; // Adjust the path as necessary

export default {
  name: 'TerminateButton',
  props: {
    droneSn: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { terminateUav } = useUavControl();
    const isProcessing = ref(false);
    const { addToast } = useNotificationManager();

    const terminateUavHandler = async () => {
      isProcessing.value = true;
      try {
        await terminateUav(props.droneSn);
        addToast({
          title: 'Success',
          message: 'UAV has been successfully terminated.',
          delay: 5000
        });
      } catch (error) {
        addToast({
          title: 'Error',
          message: `Failed to terminate UAV: ${error.message}`,
          delay: 5000
        });
      } finally {
        isProcessing.value = false;
      }
    };

    return {
      terminateUav: terminateUavHandler,
      isProcessing
    };
  }
};
</script>
