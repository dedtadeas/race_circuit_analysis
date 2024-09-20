<template>
  <!-- No HTML needed as this component will only control map behavior -->
</template>

<script>
import { inject, watch, onMounted } from 'vue';
import axios from 'axios';
import config from '@/config';
import { useMap } from '@/stores/backend-map'; // Adjust the path as necessary     const { map } = useMap();

export default {
  name: 'MapZoomMoveHandler',
  setup() {
    const { map } = useMap();
    const isMapReady = inject('isMapReady');

    const sendAreaOfInterest = (lat, lon) => {
      const areaOfInterest = {
        "AreaOfInterest": {
          "lat": lat,
          "lon": lon,
          "radius_m": 200000
        }
      };
      let url = config.u_eagle_vision_data_api_url + '/area_of_interest';
      console.log('Setting Area of Interest on url:', url);
      axios.post(config.u_eagle_vision_data_api_url+'/area_of_interest', areaOfInterest, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        console.log('Area of Interest set successfully:', response.data);
      })
      .catch(error => {
        console.error('Error setting Area of Interest:', error);
      });
    };

    const handleMapEvent = () => {
      console.log('Map event detected');
      const zoomLevel = map.value.getZoom();
      const center = map.value.getCenter();
      console.log('Zoom level:', zoomLevel);
      console.log('Center of map:', center);

      if (zoomLevel > config.minZoomLevelForAreaOfInterestADSB) {
        sendAreaOfInterest(center.lat, center.lng);
      }
    };

    const setupMapEventListeners = () => {
      if (map.value) {
        map.value.on('zoomend', handleMapEvent);
        map.value.on('moveend', handleMapEvent);
      }
    };

    onMounted(() => {
      // Watch for isMapReady to become true
      watch(isMapReady, (newValue) => {
        if (newValue) {
          setupMapEventListeners();
        }
      }, { immediate: true });
    });

    return {};
  }
};
</script>
