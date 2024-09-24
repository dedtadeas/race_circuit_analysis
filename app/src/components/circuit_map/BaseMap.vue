<!-- vi: set et sw=2 ts=2: -->
<template>
  <div ref="baseMap" class="base-map">
    <!-- Loading or error overlay -->
    <div v-if="fetchStatus !== 0" class="loading-overlay">
      <p :class="{ 'error-message': fetchStatus === 2 }">
        {{ fetchStatus === 2 ? 'Error fetching data!' : 'Loading data...' }}
      </p>
    </div>
    <!-- Buffer size slider -->
    <div class="slider-container" @input.stop @mousedown.stop @mouseup="resizeBuffer">
      <input type="range" min="0" max="500" v-model="bufferSizeMeters" />
      <p>Buffer: {{ bufferSizeMeters }} m</p>
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
    const bufferSizeMeters = ref(0);
    const fetchStatus = ref(1); // Tracks fetch status - loading: 1, success: 0, or error: 2
    let map = null;
    let track            = null;
    let spectators       = null;
    let spectatorGeoJson = null;

    onMounted(() => {
      const layers = {
        Satellite: L.tileLayer(
          `https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=${config.mapTilerApiKey}`,
          { tileSize: 512, zoomOffset: -1, minZoom: 1, maxZoom: 19, crossOrigin: true }),
        OpenStreetMap: L.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          { minZoom: 1, maxZoom: 19, attribution: 'Map data &copy; OpenStreetMap contributors' }),
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

      map = L.map(baseMap.value, { center: props.center, zoom: props.zoom, layers: [layers.Satellite] });
      map.addControl(new L.Control.Fullscreen());
      map.addControl(new L.Control.Layers(layers, overlayLayers));

      // Fetch and draw Polygons
      const basePath = process.env.NODE_ENV === 'production' ? '/race_circuit_analysis' : '';
      Promise.all([
        fetch(`${basePath}/assets/c_data/x1_RedBullRing_Track.geojson`).then(r => r.json()),
        fetch(`${basePath}/assets/c_data/x1_RedBullRing_Spectators.geojson`).then(r => r.json())
      ]).then(([t, s]) => {
          track      = L.geoJSON(t, { style: { color: 'orange' , fillOpacity: 0.5 } }).addTo(map);
          spectators = L.geoJSON(s, { style: { color: 'blue', fillOpacity: 0.4 } }).addTo(map);
          map.fitBounds(spectators.getBounds());
          fetchStatus.value = 0;
          spectatorGeoJson  = spectators.toGeoJSON();
      }).catch((e) => {
          console.error('Error fetching data:', e);
          fetchStatus.value = 2;
      });
    });

    const resizeBuffer = (event) => {
      event.stopPropagation();
      const distance = parseInt(bufferSizeMeters.value);
      const resized  = turf.union(turf.featureCollection(
          spectatorGeoJson.features.map(
            (feature) => turf.buffer(feature, distance, { units: 'meters' }))
      ));
      map.removeLayer(spectators);
      spectators = L.geoJSON(resized, { style: { color: 'blue', fillOpacity: 0.4 } }).addTo(map);
    };

    return {
      baseMap,
      resizeBuffer,
      bufferSizeMeters,
      fetchStatus,
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

