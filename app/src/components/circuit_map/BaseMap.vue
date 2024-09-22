<template>
  <div ref="baseMap" class="base-map">
    <!-- Position the slider properly using CSS -->
    <div class="slider-container">
      <input type="range" min="100" max="2000" v-model="bufferDistance" @input="updateBuffer" />
      <p>Buffer Radius: {{ bufferDistance }} meters</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-fullscreen';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';
import * as turf from '@turf/turf';
import config from '@/config';

export default {
  name: 'BaseMap',
  props: {
    zoom: {
      type: Number,
      default: 16,
    },
    center: {
      type: Array,
      default: () => [47.2197, 14.7647], // RedBull Ring approximate center
    },
  },
  setup(props) {
    const baseMap = ref(null);
    const bufferDistance = ref(500); // Default radius (in meters)
    let map = null;
    let circleLayer = null;

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

    onMounted(() => {
      // Initialize the map
      map = L.map(baseMap.value, {
        center: props.center,
        zoom: props.zoom,
        layers: [baseLayers.Satellite],
      });

      // Add fullscreen control
      map.addControl(new L.Control.Fullscreen());

      // Add layer control
      L.control.layers(baseLayers).addTo(map);

      // Draw initial circle around RedBull Ring center
      updateBuffer();
    });

    const updateBuffer = () => {
      if (circleLayer) {
        map.removeLayer(circleLayer);
      }

      // Draw a new circle using the buffer distance from the slider
      circleLayer = L.circle(props.center, {
        radius: bufferDistance.value,
        color: 'blue',
      }).addTo(map);
    };

    return {
      baseMap,
      bufferDistance,
      updateBuffer,
    };
  },
};
</script>

<style>
.base-map {
  width: 100%;
  height: 500px;
  position: relative;
}

.leaflet-fullscreen-on .base-map {
  width: 100%;
  height: 100%;
}

/* Position the slider on top of the map */
.slider-container {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 4px;
  z-index: 1000;
}

input[type='range'] {
  width: 150px;
}
</style>
