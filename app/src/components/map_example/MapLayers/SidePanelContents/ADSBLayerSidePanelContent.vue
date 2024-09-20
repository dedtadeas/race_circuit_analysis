<template>
  <LayerSidePanelContentTop
    :title="layerTitle"
    :infoText="layerInfoText"
    :layerVisible="layerVisible"
    :toggleLayer="toggleLayerVisibility"
  />
  <UpdateADSBAreaOfInterestButton />
  <!-- Add your layer-specific content here -->
</template>

<script>
import { ref, computed } from 'vue';
import LayerSidePanelContentTop from './LayerSidePanelContentTop.vue';
import { useMapStore } from '@/stores/backend-map';
import UpdateADSBAreaOfInterestButton from '@/components/map/Buttons/UpdateADSBAreaOfInterestButton.vue';

export default {
  name: 'ADSBLayerSidePanelContent',
  components: {
      LayerSidePanelContentTop,
      UpdateADSBAreaOfInterestButton
  },
  setup() {
    const mapStore = useMapStore();
    const layerTitle = 'ADSB Layer';
    const layerInfoText = 'This panel displays information about the ADSB Layer. Use the toggle button to turn the layer on or off.';
    const layerVisible = computed(() => mapStore.layers.find(layer => layer.name === 'ADSB')?.visible || false);

    const toggleLayerVisibility = () => {
      const layer = mapStore.layers.find(layer => layer.name === 'ADSB');
      if (layer) {
        mapStore.toggleLayer(layer);
      }
    };

    return {
      layerTitle,
      layerInfoText,
      layerVisible,
        toggleLayerVisibility,
      UpdateADSBAreaOfInterestButton
    };
  }
};
</script>
