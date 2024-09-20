<template>
  <div class="map-container" :class="{ 'map-container-side-panel-open': isMapSidePanelOpen }">
    <BaseMap>
      <template v-if="mapReady">
        <MapControlPanel />
        <V2airUavLayer />
        <ADSBLayer />
        <DroneTagLayer />
        <OpenAipLayer />
        <MapFocusControls />
      </template>
    </BaseMap>
    <SidePanel />
  </div>
</template>

<script>
import { ref, watch, computed, onMounted } from 'vue';
import BaseMap from './MapLayers/BaseMap.vue';
import OpenAipLayer from './MapLayers/OpenAipLayer.vue';
import SidePanel from './MapControls/SidePanel.vue';
import { useMapStore } from '@/stores/backend-map';
import MapControlPanel from './MapControls/MapControlPanel/MapControlPanel.vue';
import ADSBLayer from './MapLayers/ADSBLayer.vue';
import DroneTagLayer from './MapLayers/DroneTagLayer.vue';
import V2airUavLayer from './MapLayers/V2airUavLayer.vue';
import MapFocusControls from './MapControls/MapControls.vue';

export default {
  name: 'MapContainer',
  components: {
    BaseMap,
    MapControlPanel,
    V2airUavLayer,
    ADSBLayer,
    DroneTagLayer,
    OpenAipLayer,
    SidePanel,
    MapFocusControls,
  },
  setup() {
    const mapStore = useMapStore();
    const mapReady = computed(() => mapStore.isMapReady);
    const { focusOnAllOnlineDrones } = MapFocusControls.setup();

    onMounted(() => {
      // Focus on all online drones when the map is ready
      watch(mapReady, (ready) => {
        if (ready) {
          setTimeout(() => {
            focusOnAllOnlineDrones();
          }, 2000); // Wait for 2 seconds before zooming to all active drones
        }
      }, { immediate: true });
    });

    return {
      isMapSidePanelOpen: computed(() => mapStore.sidePanel.isOpen),
      mapReady,
    };
  }
};
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  display: flex;
  transition: width 0.3s ease-in-out;
}

.map-container-side-panel-open {
  width: 75%;
}

</style>
