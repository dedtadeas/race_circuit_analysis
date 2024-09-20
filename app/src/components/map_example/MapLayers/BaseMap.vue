<template>
  <div ref="baseMap" class="base-map app-content-container-full-height">
    <slot></slot> <!-- This slot will be used to inject additional layers/components -->
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import config from '@/config';
import { useMapStore } from '@/stores/backend-map';

export default {
  name: 'BaseMap',
  setup() {
    const baseMap = ref(null);
    const mapStore = useMapStore();

    const baseLayers = {
      'MapTiler Satellite': L.tileLayer(
        `https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=${config.mapTilerApiKey}`,
        {
          tileSize: 512,
          opacity: 1,
          zoomOffset: -1,
          minZoom: 1,
          maxZoom: 80,
          //attribution: 'Map data &copy; <a href="https://www.maptiler.com/">MapTiler</a>',
          attributionControl: 0,
          crossOrigin: true,
        }
      ),
      OpenStreetMap: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 1,
        maxZoom: 19,
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      }),
    };

    onMounted(() => {
      mapStore.map = L.map(baseMap.value, {
        center: [0, 0], // Set an initial center
        zoom: 3, // Set an initial zoom level
        zoomControl: false,
        zoomAnimation:false,fadeAnimation:false,markerZoomAnimation:false, 
        
      });

      baseLayers['MapTiler Satellite'].addTo(mapStore.map);
      L.control.zoom({ position: 'bottomright' }).addTo(mapStore.map);

      const layerControl = L.control.layers(baseLayers, {}, { position: 'bottomright' });
      layerControl.addTo(mapStore.map);

      mapStore.setMap(mapStore.map);
      mapStore.setMapReady(); // Correctly set the map as ready

      mapStore.layers.forEach((layer) => {
        if (layer.visible) {
          mapStore.map.addLayer(layer.layer);
        }
      });
    });

    onUnmounted(() => {
      if (mapStore.map) {
        mapStore.map.eachLayer((layer) => {
          mapStore.map.removeLayer(layer);
        });
        mapStore.map.off();
        mapStore.map.remove();
        mapStore.map = null;
      }
      mapStore.setMapReady(false); // Ensure isMapReady is reset properly
    });

    return {
      baseMap,
    };
  },
};
</script>

<style>
.base-map {
  width: 100%;
  height: 100%;
}

.custom-tooltip-no-bg {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  color: #222;
  font-size: 16px;
  font-weight: bold;
  font-family: var(--font-family-base);
}

.leaflet-tooltip-top:before,
.leaflet-tooltip-bottom:before,
.leaflet-tooltip-left:before,
.leaflet-tooltip-right:before {
  border: none !important;
}

.leaflet-tooltip.custom-tooltip-no-bg {
  transform: translateX(120%) translateY(-100%);
  margin-left: 0;
}

.leaflet-container a.leaflet-popup-close-button {
  color: var(--bs-secondary-text);
}

.leaflet-container .no-close-button .leaflet-popup-close-button {
  display: none;
}

.leaflet-popup-content-wrapper {
  font-family: var(--font-family-base);
  border-radius: 5px;
  background-color: var(--bs-secondary-bg);
  color: var(--bs-secondary-text);
}

.leaflet-popup-tip {
  background-color: var(--bs-secondary-bg);
}

/* Override Leaflet's default zoom control styles */
.leaflet-control-zoom {
  display: flex;
  flex-direction: row;
}

.leaflet-control-zoom-in, .leaflet-control-zoom-out {
  display: inline-block;
  margin: 0;
}

.leaflet-control-zoom-in {
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
}

.leaflet-control-zoom-out {
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
}

.leaflet-control-zoom-out:hover {
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
}

.leaflet-control-zoom-in:hover {
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
}

.leaflet-control-zoom-in:hover + .leaflet-control-zoom-out:hover {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.leaflet-control-zoom-out:hover + .leaflet-control-zoom-in:hover {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.leaflet-popup-content-wrapper {
    font-family: 'SpaceGrotesk', sans-serif;
}
</style>
