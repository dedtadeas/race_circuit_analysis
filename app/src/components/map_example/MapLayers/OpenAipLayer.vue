<template>
  <div></div>
</template>

<script>
import { onMounted, watch, ref, markRaw } from 'vue';
import L from 'leaflet';
import config from '@/config';
import { useMapStore } from '@/stores/backend-map';
import openAipLayerSidePanelContent from './SidePanelContents/OpenAIPLayerSidePanelContent.vue';

export default {
  name: 'OpenAipLayer',
  setup() {
    const mapStore = useMapStore();
    const sidePanelContent = ref(null);
    console.log('OpenAipLayer setup');
    const openAipLayer = L.tileLayer(
      `https://a.api.tiles.openaip.net/api/data/openaip/{z}/{x}/{y}.png?apiKey=${config.openaipApiKey}`,
      {
        minZoom: 1,
        maxZoom: 19,
        attribution: 'Map data &copy; <a href="https://www.openaip.net/">OpenAIP</a>',
        crossOrigin: true,
      }
    );

    // Add watch on mapStore.sidePanel.isOpen adn mapStore.sidePanel.layerName
    watch([() => mapStore.sidePanel.isOpen, () => mapStore.sidePanel.layerName], ([isOpen, layerName]) => {
      if (isOpen && layerName === 'OpenAIP') {
        sidePanelContent.value = {
            component: markRaw(openAipLayerSidePanelContent),
            props: {}
          };
        mapStore.setSidePanelContent(sidePanelContent);
      }
    });

    onMounted(() => {
      if (mapStore.map) {
        mapStore.addOverlayLayer('OpenAIP Layer', openAipLayer, 'fas fa-lg fa-fw me-2 fa-layer-group', false);
      }
    });

    return {
      openAipLayer,
    };
  },
};
</script>
