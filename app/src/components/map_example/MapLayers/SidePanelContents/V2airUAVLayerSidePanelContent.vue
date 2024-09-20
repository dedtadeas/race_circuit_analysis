<template>
  <LayerSidePanelContentTop
    :title="layerTitle"
    :infoText="layerInfoText"
    :layerVisible="layerVisible"
    :toggleLayer="toggleLayerVisibility"
  />
  <V2airUAVsList />
</template>


<script>
import { ref, computed } from 'vue';
import LayerSidePanelContentTop from './LayerSidePanelContentTop.vue';
import { useMapStore } from '@/stores/backend-map';
import V2airUAVsList from './V2airUAVsList.vue';

export default {
  name: 'V2airUAVLayerSidePanelContent',
  components: {
    LayerSidePanelContentTop,
    V2airUAVsList
  },
  setup() {
    const mapStore = useMapStore();
    const layerTitle = 'UAV Layer';
    const layerInfoText = 'This panel displays information about the V2air UAV Layer. Use the toggle button to turn the layer on or off.';
    const layerVisible = computed(() => mapStore.layers.find(layer => layer.name === 'UAV')?.visible || false);

    const toggleLayerVisibility = () => {
      const layer = mapStore.layers.find(layer => layer.name === 'UAV');
      if (layer) {
        mapStore.toggleLayer(layer);
      }
    };

    return {
      layerTitle,
      layerInfoText,
      layerVisible,
      toggleLayerVisibility
    };
  }
};
</script>