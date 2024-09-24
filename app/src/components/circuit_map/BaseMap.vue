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
import { ref, onMounted, watch } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-fullscreen';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';
import * as turf from '@turf/turf';
import config from '@/config';

export default {
  name: 'BaseMap',
  props: {
    center: Array,
    zoom: Number,
    trackGeojson: {
      type: [Object, String],
      required: false,
    },
    spectatorsGeojson: {
      type: [Object, String],
      required: false,
    },
    civilGeojson: {
      type: [Object, String],
      required: false,
    },
  },
  setup(props) {
    const baseMap = ref(null);
    const bufferSizeMeters = ref(0);
    const fetchStatus = ref(1); // loading: 1, success: 0, error: 2
    let map = null;
    let track = null;
    let buffer = null;
    let spectators = null;

    const loadGeoJsonLayers = () => {
      const basePath = process.env.NODE_ENV === 'production' ? '/race_circuit_analysis' : '';
      console.log('basePath:', basePath);
      console.log('props:', props);

      // Process trackGeojson (object or fetch string)
      const loadLayer = (geoJsonData) => {
        if (typeof geoJsonData === 'string') {
          return fetch(`${basePath}${geoJsonData}`).then((r) => r.json());
        }
        return Promise.resolve(geoJsonData);
      };

      const fetchPromises = [
        props.trackGeojson ? loadLayer(props.trackGeojson) : Promise.resolve(null),
        props.spectatorsGeojson ? loadLayer(props.spectatorsGeojson) : Promise.resolve(null),
        props.civilGeojson ? loadLayer(props.civilGeojson) : Promise.resolve(null),
      ];

      Promise.all(fetchPromises).then(([trackData, spectatorsData, civilData]) => {
        if (track) map.removeLayer(track);
        if (spectators) map.removeLayer(spectators);
        if (buffer) map.removeLayer(buffer);

        // Add track layer
        if (trackData) {
          track = L.geoJSON(trackData, { style: { color: 'orange' } }).addTo(map);
        }

        // Add spectators layer and buffer
        if (spectatorsData) {
          spectators = L.geoJSON(spectatorsData, { style: { color: 'red' } }).addTo(map);
          buffer = L.geoJSON(spectatorsData, { style: { color: 'blue', fillOpacity: 0.2 } }).addTo(map);
          map.fitBounds(spectators.getBounds());
        }

        // Add civil layer
        if (civilData) {
          L.geoJSON(civilData, { style: { color: 'green' } }).addTo(map);
        }

        fetchStatus.value = 0;
      }).catch((e) => {
        console.error('Error fetching data:', e);
        fetchStatus.value = 2;
      });
    };

    onMounted(() => {
      const layers = {
        Satellite: L.tileLayer(
          `https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=${config.mapTilerApiKey}`,
          { tileSize: 512, zoomOffset: -1, minZoom: 1, maxZoom: 19, crossOrigin: true }
        ),
        OpenStreetMap: L.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          { minZoom: 1, maxZoom: 19, attribution: 'Map data &copy; OpenStreetMap contributors' }
        ),
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

      map = L.map(baseMap.value, {
        center: props.center,
        zoom: props.zoom,
        layers: [layers.Satellite],
      });

      map.addControl(new L.Control.Fullscreen());
      map.addControl(new L.Control.Layers(layers, overlayLayers));

      loadGeoJsonLayers(); // Load the layers when the map is mounted
    });

    // Watch for changes in the props (if switching circuits dynamically)
    watch(() => [props.trackGeojson, props.spectatorsGeojson, props.civilGeojson], loadGeoJsonLayers);

    const resizeBuffer = () => {
      const distance = parseInt(bufferSizeMeters.value, 10);
      const resized = turf.union(turf.featureCollection(
        spectators.toGeoJSON().features.map(
          (feature) => turf.buffer(feature, distance, { units: 'meters' })
        )
      ));

      if (buffer) map.removeLayer(buffer);
      buffer = L.geoJSON(resized, { style: { color: 'blue', fillOpacity: 0.2 } }).addTo(map);
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
  height: 70vh;
  position: relative;
}

.leaflet-fullscreen-on .base-map {
  width: 100%;
  height: 100%;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 2em;
  z-index: 2000;
}

.error-message {
  color: red;
}

.slider-container {
  position: absolute;
  bottom: 10px;
  left: 10px;
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
