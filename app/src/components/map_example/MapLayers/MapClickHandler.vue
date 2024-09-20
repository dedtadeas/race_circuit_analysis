<template>
  <div></div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import L from 'leaflet';
import { useMapStore } from '@/stores/backend-map'; // Use the map store
import { useV2airUavStore } from "@/stores/backend-uavs";
import { useNotificationManager } from '@/composables/useNotificationManager';

export default {
  name: 'MapClickHandler',
  setup() {
    const mapStore = useMapStore(); // Access the map store
    const uavStore = useV2airUavStore(); // Use the UAV store to get the client
    const { addToast } = useNotificationManager();

    const popup = L.popup();
    const selectedLat = ref(null);
    const selectedLon = ref(null);

    // Function to get the active drone client
    function getClient() {
      const client = uavStore.uavs[uavStore.activeUav]?.grpClient;
      if (!client) {
        console.error("No active UAV client");
        throw new Error("No active UAV client");
      }
      return client;
    }

    const onMapClick = (e) => {
      selectedLat.value = e.latlng.lat;
      selectedLon.value = e.latlng.lng;

      popup
        .setLatLng(e.latlng)
        .setContent(
          `<button id="go-here-button" style="width: 100px; height: 30px;">Go Here</button>`
        )
        .openOn(mapStore.map);

      // Add an event listener for the button click
      document
        .getElementById('go-here-button')
        .addEventListener('click', async () => {
          await goToLocation(selectedLat.value, selectedLon.value);
          mapStore.map.closePopup(); // Use map from the map store
        });
    };

    const goToLocation = async (lat, lon) => {
      // Get altitude from uavStore
      const altitude = uavStore.uavs[uavStore.activeUav]?.vehicle_info?.alt;
      try {
        const client = getClient(); // Get the active UAV client
        const response = await client.droneMoveGoToGpsAndAlt(lat, lon, altitude);
        addToast({
          title: 'Move Command Sent',
          message: `Drone moving to Lat: ${lat}, Lon: ${lon}, Alt: ${Math.round(altitude)}m`,
          delay: 3000
        });
        console.log('Drone move response:', response);
      } catch (error) {
        console.error('Error sending move command:', error);
        addToast({
          title: 'Error',
          message: 'Failed to send move command',
          delay: 3000
        });
      }
    };

    onMounted(() => {
      // Watch for the map to be ready and add click listener
      watch(
        () => mapStore.isMapReady,
        (isReady) => {
          if (isReady && mapStore.map) {
            mapStore.map.on('click', onMapClick);
          }
        },
        { immediate: true }
      );
    });

    onUnmounted(() => {
      if (mapStore.map) {
        mapStore.map.off('click', onMapClick);
      }
    });

    return {};
  }
};
</script>

<style scoped>
/* Add any custom styles here if needed */
</style>
