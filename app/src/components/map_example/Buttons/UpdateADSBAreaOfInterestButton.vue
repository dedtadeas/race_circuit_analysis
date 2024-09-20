<template>
  <div class="button-container">
    <button type="button" class="btn btn-outline-yellow" @click="setAreaOfInterest" :disabled="isButtonDisabled">
      {{ isProcessing ? 'Setting Area...' : 'Set ADSB Area of Interest' }}
    </button>
  </div>
</template>

<script>
import { ref, watch, computed } from 'vue';
import axios from 'axios';
import config from '@/config';
import { useMapStore } from '@/stores/backend-map';
import { useADSBStore } from "@/stores/backend-adsb";
import { useNotificationManager } from '@/composables/useNotificationManager';

export default {
  name: 'UpdateADSBAreaOfInterestButton',
  setup() {
    const mapStore = useMapStore();
    const adsbStore = useADSBStore();
    const isProcessing = ref(false);
    const lastSetAreaOfInterest = ref(null);
    const { addToast } = useNotificationManager();

    const adsbVisible = computed(() => adsbStore.visible);
    const isButtonDisabled = computed(() => isProcessing.value || !adsbVisible.value);

    const setAreaOfInterest = async () => {
      if (!mapStore.map) return;

      const center = mapStore.map.getCenter();
      const areaOfInterest = {
        lat: center.lat,
        lon: center.lng,
        radius_m: 200000
      };

      isProcessing.value = true;
      try {
        await axios.post(`${config.u_eagle_vision_data_api_url}/area_of_interest`, {
          AreaOfInterest: areaOfInterest
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        addToast({
          title: 'Success',
          message: 'ADSB Area of Interest set successfully.',
          delay: null
        });

        adsbStore.updateAreaOfInterestData(areaOfInterest);
        lastSetAreaOfInterest.value = areaOfInterest;
      } catch (error) {
        addToast({
          title: 'Error',
          message: `Failed to set Area of Interest: ${error.message}`
        }); // Persistent toast when delay is not specified
      } finally {
        isProcessing.value = false;
      }
    };

    watch(() => adsbStore.adsbAreaOfInterestData, (newVal) => {
      if (lastSetAreaOfInterest.value && (
        newVal.lat !== lastSetAreaOfInterest.value.lat ||
        newVal.lon !== lastSetAreaOfInterest.value.lon ||
        newVal.radius_m !== lastSetAreaOfInterest.value.radius_m
      )) {
        addToast({
          title: 'Alert',
          message: 'ADSB Area of Interest has been changed.',
          delay: null
        });
      }
    }, { deep: true });

    return { setAreaOfInterest, isProcessing, adsbVisible, isButtonDisabled };
  }
};
</script>

<style scoped>
.button-container {
  padding: 10px;
}

.btn-outline-yellow {
  color: #ffc107;
  border-color: #ffc107;
}

.btn-outline-yellow:hover {
  color: #212529;
  background-color: #ffc107;
  border-color: #ffc107;
}

.btn:disabled {
  opacity: 0.65;
}
</style>
