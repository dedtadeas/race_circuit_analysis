<!-- vi: set et sw=2 ts=2: -->
<template>
  <div ref="baseMap" class="base-map">
    <!-- Loading or error overlay -->
    <div v-if="loading" class="loading-overlay">
      <p :class="{ 'error-message': errorOccurred }">
        {{ errorOccurred ? 'Error fetching data!' : 'Loading data...' }}
      </p>
    </div>
    <!-- Buffer size slider -->
    <div class="slider-container" @input="updateBuffer" @mousedown.stop @mouseup.stop>
      <input type="range" min="100" max="2000" v-model="bufferDistance" />
      <p>Buffer Radius: {{ bufferDistance }} m</p>
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
  setup(props) {
    const baseMap = ref(null);
    const bufferDistance = ref(500); // Default radius (in meters)
    let map = null;
    let trackLayer = null;
    let spectatorLayer = null;
    const loading = ref(true); // Ref to manage loading state
    const errorOccurred = ref(false); // Ref to manage error state

    onMounted(() => {
      // Map layers
      const layers = {
        Satellite: L.tileLayer(
          `https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=${config.mapTilerApiKey}`,
          { tileSize: 512, zoomOffset: -1, minZoom: 1, maxZoom: 19, crossOrigin: true }),
        OpenStreetMap: L.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          { minZoom: 1, maxZoom: 19, attribution: 'Map data &copy; OpenStreetMap contributors' }),
      };

      // Initialize the map
      map = L.map(baseMap.value, { center: props.center, zoom: props.zoom, layers: [layers.Satellite] });
      // Add fullscreen control
      map.addControl(new L.Control.Fullscreen());
      // Add layer control
      L.control.layers(layers).addTo(map);

      // Fetch and draw Polygons
      Promise.all([
        fetch('http://localhost:5173/data/x1_RedBullRing_Track.geojson')     .then(r => r.json()),
        fetch('http://localhost:5173/data/x1_RedBullRing_Spectators.geojson').then(r => r.json())
      ]).then(([t, s]) => {
          trackLayer     = L.geoJSON(t, { style: { color: 'red' , fillOpacity: 0.4 } }).addTo(map);
          spectatorLayer = L.geoJSON(s, { style: { color: 'blue', fillOpacity: 0.4 } }).addTo(map);
          map.fitBounds(spectatorLayer.getBounds());
          loading.value = false;
        })
        .catch((e) => {
          console.error('Error fetching data:', e);
          errorOccurred.value = true; // Set error state to true if an error occurs
        });
    });

    const updateBuffer = (event) => {
      event.stopPropagation(); // Prevent propagation to leaflet
    };

    return {
      baseMap,
      bufferDistance,
      updateBuffer,
      loading, // Return loading ref to manage the overlay in the template
      errorOccurred, // Return errorOccurred ref to manage error state in the template
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

.loading-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex; justify-content: center; align-items: center;
  color: white; font-size: 2em;
  z-index: 2000;
}

.error-message {
  color: red;
}

.slider-container {
  position: absolute; bottom: 10px; left: 10px;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 5px;
  z-index: 1000;
}

.slider-container > input[type='range'] {
  width: 150px;
}

.slider-container > p {
  color: black;
  margin: 0;
}
</style>

