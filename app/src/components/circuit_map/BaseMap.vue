<template>
  <div ref="baseMap" class="base-map">
    <!-- Loading or error overlay -->
    <div v-if="fetchStatus !== 0" class="loading-overlay">
      <p :class="{ 'error-message': fetchStatus === 2 }">
        {{ fetchStatus === 2 ? 'Error fetching data!' : 'Loading data...' }}
      </p>
    </div>
    <!-- Buffer size sliders for each layer -->
    <div class="slider-container">
      <div class="slider" v-for="(buffer, index) in buffers" :key="index">
        <strong>{{ buffer.label.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
          }}</strong>

        <div class="slider-input-container">
          <input type="range" min="0" max="200" v-model="buffer.size" @input="updateBuffer(buffer)"
            @mousedown="stopMapMovement" class="slider-range" />
          <input type="number" min="0" max="200" v-model="buffer.size" @input="updateBuffer(buffer)"
            class="ms-2 buffer-input " />
          <span class="unit">m</span>
        </div>
      </div>
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
  props: { center: Array, zoom: Number, layers: Array },
  setup(props) {
    const baseMap = ref(null);
    const map = ref(null);
    const fetchStatus = ref(1); // loading: 1, success: 0, error: 2
    const layers = [];
    const buffers = ref([]);
    const pallete = ['#FF0000', '#00FF00', '#FFFF00', '#0000FF', '#FF00FF', '#00FFFF', '#FFFFFF'];

    const updateBuffer = (buffer) => {
      if (buffer.layerBuffer) {
        map.value.removeLayer(buffer.layerBuffer);
        buffer.layerBuffer = null;
      }

      if (buffer.size > 0) {
        const features = layers[buffer.layer].features.map(
          (feature) => turf.buffer(feature, buffer.size, { units: 'meters' })
        );

        if (features.length >= 2) {
          // Union only if there are 2 or more geometries
          const resized = turf.union(turf.featureCollection(features));
          buffer.layerBuffer = L.geoJSON(resized, { style: { color: buffer.color } }).addTo(map.value);
        } else if (features.length === 1) {
          // No need for union, just use the buffered feature
          buffer.layerBuffer = L.geoJSON(features[0], { style: { color: buffer.color } }).addTo(map.value);
        }
      }
    };
    const stopMapMovement = (event) => {
      console.log('stopMapMovement');
      event.stopPropagation();
    };
    onMounted(() => {
      const tileStyles = {
        Satellite: L.tileLayer(`https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=${config.mapTilerApiKey}`, { tileSize: 512, zoomOffset: -1, minZoom: 1, maxZoom: 19, crossOrigin: true }),
        OpenStreetMap: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { minZoom: 1, maxZoom: 19, attribution: 'Map data &copy; OpenStreetMap contributors' }),
      };
      const overlapStyles = {
        OpenAIP: L.tileLayer(`https://a.api.tiles.openaip.net/api/data/openaip/{z}/{x}/{y}.png?apiKey=${config.openaipApiKey}`, { minZoom: 1, maxZoom: 19, attribution: 'Map data &copy; <a href="https://www.openaip.net/">OpenAIP</a>', crossOrigin: true }),
      };
      map.value = L.map(baseMap.value, { center: props.center, zoom: props.zoom, layers: [tileStyles.Satellite], zoomAnimation: false });
      map.value.addControl(new L.Control.Fullscreen());
      map.value.addControl(new L.Control.Layers(tileStyles, overlapStyles));

      const basePath = process.env.NODE_ENV === 'production' ? '/race_circuit_analysis' : '';
      Promise.all(props.layers.map(
        (layer) => fetch(`${basePath}/${layer['file_path']}`).then(x => x.json())
      )).then((data) => {
        const tmpBuffers = [];
        for (let i = 0; i < data.length; ++i) {
          const color = pallete[i % pallete.length];
          layers.push(L.geoJSON(data[i], { style: { color: color } }).addTo(map.value).toGeoJSON());
          if (props.layers[i].has_buffer)
            tmpBuffers.push({ layer: i, size: 0, color: color, ...props.layers[i] });
        }
        buffers.value = tmpBuffers;
        fetchStatus.value = 0;
      }).catch((e) => {
        console.error('Error fetching data:', e);
        fetchStatus.value = 2;
      });
    });

    return {
      baseMap,
      buffers,
      fetchStatus,
      updateBuffer,
      stopMapMovement, 
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
  background-color: rgba(58, 58, 58, 0.7);
  position: absolute;
  bottom: 10px;
  left: 10px;
  z-index: 1000;
  padding: 10px;
}

.slider {
  margin-bottom: 10px;
}

.slider>strong {
  display: block;
  margin-bottom: 5px;
}

.slider-input-container {
  padding: 2px;
  display: flex;
  align-items: center;
}

.slider-range {
  -webkit-appearance: none;
  /* Override default styling */
  appearance: none;
  width: 100%;
  /* Full width */
  height: 8px;
  /* Height of the track */
  background: #ddd;
  /* Track color */
  border-radius: 5px;
  /* Round corners of the track */
  outline: none;
  /* Remove outline */
}

/* Style the thumb */
.slider-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  /* Override default styling */
  appearance: none;
  width: 16px;
  /* Thumb width */
  height: 16px;
  /* Thumb height */
  border-radius: 50%;
  /* Round thumb */
  background: var(--bs-theme);
  /* Thumb color */
  cursor: pointer;
  /* Pointer cursor on hover */
}

.slider-range::-moz-range-thumb {
  width: 16px;
  /* Thumb width */
  height: 16px;
  /* Thumb height */
  border-radius: 50%;
  /* Round thumb */
  background: var(--bs-theme);
  /* Thumb color */
  cursor: pointer;
  /* Pointer cursor on hover */
}

/* Optional: Change thumb color on hover */
.slider-range::-webkit-slider-thumb:hover {
  background: var(--bs-theme);
  /* Darker green on hover */
}

.slider-range::-moz-range-thumb:hover {
  background: var(--bs-theme);
  /* Darker green on hover */
}


.unit {
  margin-left: 5px;
  /* Space between input and unit */
}

.leaflet-control-attribution {
  display: none;
}
</style>
