<!-- vi: set et sw=2 ts=2: -->
<template>
  <div ref="baseMap" class="base-map">
    <!-- Loading or error overlay -->
    <div v-if="fetchingStatus !== 0" class="loading-overlay">
      <p :class="{ 'error-message': fetchingStatus === 2 }">
        {{ fetchingStatus === 2 ? 'Error fetching data!' : 'Loading data...' }}
      </p>
    </div>
    <!-- Buffer size slider -->
    <div class="slider-container" @input.stop @mousedown.stop @mouseup="updateAreas">
      <input type="range" min="0" max="1000" v-model="areasGrowMeters" />
      <p>Areas grow: {{ areasGrowMeters }} m</p>
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
    const areasGrowMeters = ref(0);
    const fetchingStatus = ref(1); // Tracks fetch status loading: 1, success: 0, or error: 2
    let map = null;
    let trackLayer = null;
    let spectatorLayer        = null;
    let spectatorLayerGeoJSON = null;

    onMounted(() => {
      const layers = {
        Satellite: L.tileLayer(
          `https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=${config.mapTilerApiKey}`,
          { tileSize: 512, zoomOffset: -1, minZoom: 1, maxZoom: 19, crossOrigin: true }),
        OpenStreetMap: L.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          { minZoom: 1, maxZoom: 19, attribution: 'Map data &copy; OpenStreetMap contributors' }),
      };

      map = L.map(baseMap.value, { center: props.center, zoom: props.zoom, layers: [layers.Satellite] });
      map.addControl(new L.Control.Fullscreen());
      L.control.layers(layers).addTo(map);

      // Fetch and draw Polygons
      Promise.all([
        fetch('http://localhost:5173/data/x1_RedBullRing_Track.geojson')     .then(r => r.json()),
        fetch('http://localhost:5173/data/x1_RedBullRing_Spectators.geojson').then(r => r.json())
      ]).then(([t, s]) => {
          trackLayer     = L.geoJSON(t, { style: { color: 'red' , fillOpacity: 0.4 } }).addTo(map);
          spectatorLayer = L.geoJSON(s, { style: { color: 'blue', fillOpacity: 0.4 } }).addTo(map);
          map.fitBounds(spectatorLayer.getBounds());
          fetchingStatus.value   = 0;
          spectatorLayerGeoJSON = spectatorLayer.toGeoJSON();
        })
        .catch((e) => {
          console.error('Error fetching data:', e);
          fetchingStatus.value = 2;
        });
    });

    const updateAreas = (event) => {
      event.stopPropagation();
      const distance = parseInt(areasGrowMeters.value);
      const resized  = spectatorLayerGeoJSON.features.map(
        (feature) => turf.buffer(feature, distance, { units: 'meters' }));
      // TODO: merge overlapping polygons
      map.removeLayer(spectatorLayer);
      spectatorLayer = L.geoJSON(resized, { style: { color: 'blue', fillOpacity: 0.4 } }).addTo(map);
      map.fitBounds(spectatorLayer.getBounds());
    };

    return {
      baseMap,
      updateAreas,
      areasGrowMeters,
      fetchingStatus,
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

