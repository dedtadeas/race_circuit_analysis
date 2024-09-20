<template>
  <div class="layer-buttons">
    <div
      class="layer-control"
      v-for="layer in layers"
      :key="layer.name"
      :class="{ 'layer-control-active': mapStore.sidePanel.layerName === layer.name && mapStore.sidePanel.isOpen }"
    >
      <div
        class="layer-button"
        @click="handleLayerClick(layer.name)"
        :class="{ 'layer-button-inactive': !layer.visible }"
        :style="{ color: layer.color || 'black' }"
      >
        <div class="icon-and-text">
          <span
            class="layer-name"
            :class="{ 'layer-name-active': mapStore.sidePanel.layerName === layer.name && mapStore.sidePanel.isOpen }"
          >
            {{ layer.name }}
          </span>
          <div class="spacer"></div>
          <i
            v-if="layer.icon"
            :class="[layer.icon, { 'icon-active': mapStore.sidePanel.layerName === layer.name && mapStore.sidePanel.isOpen }]"
            class="layer-icon"
            :style="{ color: layer.color || 'black' }"
          ></i>
          <i
            v-else
            class="fas fa-lg fa-fw me-2 fa-layer-group layer-icon"
            :class="{ 'icon-active': mapStore.sidePanel.layerName === layer.name && mapStore.sidePanel.isOpen }"
            :style="{ color: layer.color || 'black' }"
          ></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useMapStore } from '@/stores/backend-map';

export default {
  name: 'LayerControl',
  setup(props, { emit }) {
    const mapStore = useMapStore();
    const layers = computed(() => mapStore.layers);

    const handleLayerClick = (layerName) => {
      if (mapStore.sidePanel.layerName === layerName) {
        mapStore.setSidePanelOpen(!mapStore.sidePanel.isOpen, layerName);
      } else {
        mapStore.setSidePanelOpen(true, layerName);
      }
    };

    return {
      layers,
      handleLayerClick,
      mapStore,
    };
  },
};
</script>

<style scoped>
.custom-layer-controls {
  width: 100px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  color: black;
  background-color: rgba(255, 255, 255, 0.15) !important;
  z-index: 1000;
}

.layer-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-end;
}

.layer-control {
  display: flex;
  align-items: center;
}

.layer-control-active {
  background-color: rgba(0, 0, 0, 0.4); /* Keep the background with opacity */
}

.layer-button {
  display: flex;
  align-items: center;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  height: 40px; /* Set a fixed height for consistent spacing */
}

.layer-button:hover {
  background-color: rgba(0, 0, 0, 0.4);
}

.layer-button:hover .layer-icon {
  transform: scale(1.2); /* Enlarge the icon a bit when hovered */
}

.icon-and-text {
  display: flex;
  align-items: center;
  position: relative;
  width: 100%; /* Make sure the width is 100% */
}


.layer-icon {
  font-size: 24px;
  z-index: 1;
  margin-right: 10px; /* Adjust as necessary */
  transition: font-size 0.2s ease, text-shadow 0.2s ease;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5), 
               0 0 10px rgba(255, 255, 255, 0.4), 
               0 0 15px rgba(255, 255, 255, 0.3), 
               0 0 20px rgba(255, 255, 255, 0.2);
}

.icon-active {
  font-size: 32px;
  transition: font-size 0.2s ease, text-shadow 0.2s ease;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.7), 
               0 0 10px rgba(255, 255, 255, 0.6), 
               0 0 15px rgba(255, 255, 255, 0.5), 
               0 0 20px rgba(255, 255, 255, 0.4), 
               0 0 25px rgba(255, 255, 255, 0.3);
}

.layer-name {
  position: absolute;
  right: 200px;
  white-space: nowrap;
  transition: transform 0.2s ease, font-size 0.2s ease;
  z-index: 2; /* Ensure the text is above other elements */
  font-weight: bold;
  color: white;
}

.layer-name-active {
  transform: translateX(150px); /* Keep the text expanded */
  font-size: 16px; /* Optional: Adjust the font size for the active state */
}

.layer-button:hover .layer-name {
  transform: translateX(150px); /* Slide the text into view */
}

.spacer {
  width: 100px; /* Adjust the width of the spacer as necessary */
}

.layer-button-inactive {
  opacity: 0.5;
}
</style>
