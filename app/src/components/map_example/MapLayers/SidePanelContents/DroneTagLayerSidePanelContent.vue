<template>
  <LayerSidePanelContentTop
    :title="layerTitle"
    :infoText="layerInfoText"
    :layerVisible="layerVisible"
    :toggleLayer="toggleLayerVisibility"
  />
  <!-- Add your layer-specific content here -->
</template>

<script>
import { ref, computed } from 'vue';
import LayerSidePanelContentTop from './LayerSidePanelContentTop.vue';
import { useMapStore } from '@/stores/backend-map';

export default {
  name: 'DroneTagLayerSidePanelContent',
  components: {
      LayerSidePanelContentTop,
  },
  setup() {
    const mapStore = useMapStore();
    const layerTitle = 'DroneTag Layer';
    const layerInfoText = 'This panel displays information about the DroneTag Layer. Use the toggle button to turn the layer on or off.';
    const layerVisible = computed(() => mapStore.layers.find(layer => layer.name === 'DroneTag')?.visible || false);

    const toggleLayerVisibility = () => {
      const layer = mapStore.layers.find(layer => layer.name === 'DroneTag');
      if (layer) {
        mapStore.toggleLayer(layer);
      }
    };

    return {
      layerTitle,
      layerInfoText,
      layerVisible,
      toggleLayerVisibility,
    };
  }
};
</script>
