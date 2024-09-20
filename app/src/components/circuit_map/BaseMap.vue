<template>
  <div ref="baseMap" class="base-map"></div>
</template>

<script>
import { ref, onMounted } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-fullscreen';  // Import the Fullscreen plugin
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';  // Import Fullscreen CSS
import config from '@/config';

export default {
  name: 'BaseMap',
  setup() {
    const baseMap = ref(null);

    // Base layers
    const baseLayers = {
      Satellite: L.tileLayer(
        `https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=${config.mapTilerApiKey}`,
        { tileSize: 512, zoomOffset: -1, minZoom: 1, maxZoom: 19, crossOrigin: true }
      ),
      OpenStreetMap: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 1,
        maxZoom: 19,
        attribution: 'Map data &copy; OpenStreetMap contributors',
      }),
    };

    // Overlay layers (OpenAIP)
    const overlayLayers = {
      OpenAIP: L.tileLayer(
        `https://a.api.tiles.openaip.net/api/data/openaip/{z}/{x}/{y}.png?apiKey=${config.openaipApiKey}`,
        {
          minZoom: 1,
          maxZoom: 19,
          attribution: 'Map data &copy; <a href="https://www.openaip.net/">OpenAIP</a>',
          crossOrigin: true,
        }
      ),
    };

    onMounted(() => {
      const map = L.map(baseMap.value, {
        center: [0, 0],
        zoom: 3,
        layers: [baseLayers.Satellite], // Default base layer
      });

      // Add fullscreen control
      map.addControl(new L.Control.Fullscreen());

      // Add layer control to switch between base layers and toggle OpenAIP overlay
      L.control.layers(baseLayers, overlayLayers).addTo(map);

      // Add fullscreen event listeners (optional)
      map.on('enterFullscreen', () => {
        console.log('Entered fullscreen mode');
      });
      map.on('exitFullscreen', () => {
        console.log('Exited fullscreen mode');
      });
    });

    return { baseMap };
  },
};
</script>

<style>
.base-map {
  width: 100%;
  height: 500px;
}

.leaflet-fullscreen-on .base-map {
  width: 100%;
  height: 100%;
}
</style>
