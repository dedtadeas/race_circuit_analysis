<!-- vi: set et sw=2 ts=2: -->
<template>
  <div ref="baseMap" class="base-map">
    <!-- Loading or error overlay -->
    <div v-if="fetchStatus !== 0" class="loading-overlay">
      <p :class="{ 'error-message': fetchStatus === 2 }">
        {{ fetchStatus === 2 ? 'Error fetching data!' : 'Loading data...' }}
      </p>
    </div>
    <!-- Buffer size sliders for each layer -->
    <div class="slider-container" @mousedown.stop>
      <!-- Section for Layers with Buffer Enabled -->
      <div class="legend-section">
        <h6>Layers with Buffer</h6>
        <div class="slider" v-for="(buffer, index) in buffers" :key="index">
          <strong>
            <span class="color-box" :style="{ backgroundColor: buffer.color }"></span>
            {{ formatLabel(buffer.label) }}
          </strong>
          <div class="slider-input-container">
            <input type="range" min="0" max="200" step="5" v-model="buffer.size" @input="updateBuffer(buffer)" @mousedown.stop class="slider-range" />
            <input type="number" min="0" max="200" v-model="buffer.size" @input="updateBuffer(buffer)" @mousedown.stop @dblclick.stop class="ms-2 buffer-input" />
            <span class="unit">m</span>
          </div>
        </div>
      </div>

      <!-- Section for Layers without Buffer -->
      <div class="legend-section">
        <h6>Layers without Buffer</h6>
        <ul>
          <li v-for="layer in layersWithoutBuffer" :key="layer.label">
            <span class="color-box" :style="{ backgroundColor: getColor(layer.label) }"></span>
            {{ formatLabel(layer.label) }}
          </li>
          <button @click="toggleOpacity">Toggle Opacity/Color</button>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
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
    const fetchStatus = ref(1); // loading: 1, success: 0, error: 2
    let map = null; // Cannot be ref, otherwise causes crashes after switching tile layers
    const layers = [];
    const layerBuffers = [];
    const buffers = ref([]);

    let freeFlyLayer = null;
    const layerViewOn = ref(false);
    const unToggledLayerStyle = { weight: 2, opacity: 1, fillOpacity: 0.4 }; // Default style for layers
    const toggledLayerStyle = { weight: 1, opacity: 0.1, fillOpacity: 0.2 }; // Toggled style for layers
    const freeFlyVisibleStyle = {weight: 2, opacity: 1, fillOpacity: 0.3}; // Style for the FreeFly layer
    const freeFlyHiddenStyle = { weight: 1, opacity: 0, fillOpacity: 0 }; // Style for the FreeFly layer


    // Define color dictionary
    const colorDict = {
      track: '#fff600',
      parking: '#9fe7f5',
      paddock: '#B1FF10',
      roads: '#FFFFFF',
      'spectators AC': '#007bff',
      'spectators stand': '#ffa652',
      'spectators tribune': '#ff7b00',
      civil: '#3357FF',
      other: '#6700b6',
      freefly: '#33FF57',
    };

    // Function to get color for a layer
    const getColor = (label) => colorDict[label] || '#000000'; // Fallback to black if color not found

    const updateBuffer = (buffer) => {
      if (buffer.layerBuffer) { // Only non-zero buffers have extra layer
        map.removeLayer(buffer.layerBuffer);
        buffer.layerBuffer = null; // Remove bufferlayer
      }

      if (buffer.size > 0) { // Fixes crash when selecting 0 sized buffer
        let features = layers[buffer.layer].toGeoJSON().features.map(
          (feature) => turf.buffer(feature, buffer.size, { units: 'meters' }));

        if (features.length > 1) { // Fixes crash when creating union with one polygon
          features = turf.union(turf.featureCollection(features));
        }

        const newStyle = layerViewOn.value ? toggledLayerStyle : unToggledLayerStyle;
        buffer.layerBuffer = L.geoJSON(features, { style: { color: buffer.color, ...newStyle } }).addTo(map);
      }

      const existingBufferIndex = layerBuffers.findIndex(lb => lb && lb.layer === buffer.layer);
      if (existingBufferIndex !== -1) {
        layerBuffers[existingBufferIndex] = buffer.layerBuffer;
      } else {
        layerBuffers.push(buffer.layerBuffer);
      }

      updateFreeFlyLayer();
    };

    const updateFreeFlyLayer = () => {
      if (freeFlyLayer) {
        map.removeLayer(freeFlyLayer);
        freeFlyLayer = null;
      }

      const unionLayers = layers.flatMap((layer, index) => {
        const buffer = buffers.value.find((b) => b.layer === index && b.size > 0);
        if (buffer) {
          return layer.toGeoJSON().features.map((feature) =>
            turf.buffer(feature, buffer.size, { units: 'meters' })
          );
        } else {
          return layer.toGeoJSON().features;
        }
      });

      const filteredUnionLayers = unionLayers.filter(
        (feature) => feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon'
      );

      const allPolygons = turf.union(turf.featureCollection(filteredUnionLayers));
      const fullMap = turf.bboxPolygon(turf.bbox(allPolygons));

      const inverted = turf.difference(turf.featureCollection([fullMap, allPolygons]));

      if (inverted) {
        const newStyle = layerViewOn.value ? freeFlyVisibleStyle : freeFlyHiddenStyle;
        freeFlyLayer = L.geoJSON(inverted, {
          style: { color: colorDict.freefly, ...newStyle },
        }).addTo(map);
      }
    };

    const formatLabel = (label) => {
      return label.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    onMounted(() => {
      const tileStyles = {
        Satellite: L.tileLayer(`https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=${config.mapTilerApiKey}`, { tileSize: 512, zoomOffset: -1, minZoom: 1, maxZoom: 19, crossOrigin: true }),
        OpenStreetMap: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { minZoom: 1, maxZoom: 19, attribution: 'Map data &copy; OpenStreetMap contributors' }),
        Positron: L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', { 
          minZoom: 1, 
          maxZoom: 19, 
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>' 
        }),
      };

      const overlapStyles = {
        OpenAIP: L.tileLayer(`https://a.api.tiles.openaip.net/api/data/openaip/{z}/{x}/{y}.png?apiKey=${config.openaipApiKey}`, { minZoom: 1, maxZoom: 19, attribution: 'Map data &copy; <a href="https://www.openaip.net/">OpenAIP</a>', crossOrigin: true }),
      };

      map = L.map(baseMap.value, { center: props.center, zoom: props.zoom, layers: [tileStyles.Satellite], zoomAnimation: false,  attributionControl: false });
      map.addControl(new L.Control.Fullscreen());
      map.addControl(new L.Control.Layers(tileStyles, overlapStyles));

      const basePath = process.env.NODE_ENV === 'production' ? '/race_circuit_analysis' : '';

      console.log('Fetching data...', props.layers);

      Promise.all(props.layers.map(
        (layer) => fetch(`${basePath}/${layer['file_path']}`).then(x => x.json())
      )).then((data) => {
        const tmpBuffers = [];
        for (let i = 0; i < data.length; ++i) {
          const color = colorDict[props.layers[i].label] || '#000000';
          const newStyle = layerViewOn.value ? toggledLayerStyle : unToggledLayerStyle;
          layers.push(L.geoJSON(data[i], { style: { color: color, ...newStyle } }).addTo(map));
          if (props.layers[i].has_buffer) {
            tmpBuffers.push({ layer: i, size: 0, color: color, ...props.layers[i] });
          }
        }
        buffers.value = tmpBuffers;
        fetchStatus.value = 0;
        updateFreeFlyLayer();
      }).catch((e) => {
        console.error('Error fetching data:', e);
        fetchStatus.value = 2;
      });
    });

const toggleOpacity = () => {
  layerViewOn.value = !layerViewOn.value;

  // Iterate over each layer in the layers array
  layers.forEach((layer, index) => {
    // Define the new style based on the layer view state
    const newStyle = layerViewOn.value ? toggledLayerStyle : unToggledLayerStyle;
    const color = colorDict[props.layers[index].label] || '#000000'; // Default color if not found
    layer.setStyle({ color: color, ...newStyle });
  });

  // Update layer buffers
  layerBuffers.forEach((buffer) => {
    if (buffer) {
      const newStyle = layerViewOn.value ? toggledLayerStyle : unToggledLayerStyle;
      buffer.setStyle({ color: buffer.options.style.color, ...newStyle });
    }
  });

  // Update the FreeFly layer style if it exists
  if (freeFlyLayer) {
    const newStyle = layerViewOn.value ? freeFlyVisibleStyle : freeFlyHiddenStyle;
    freeFlyLayer.setStyle({ color: colorDict.freefly, ...newStyle });
  }
};

    return {
      baseMap,
      fetchStatus,
      buffers,
      layers,
      toggleOpacity,
      updateBuffer,
      formatLabel,
      getColor,
      layersWithoutBuffer: props.layers.filter(layer => !layer.has_buffer),
    };
  }
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

/* .slider {
  margin-bottom: 10px;
} */

.slider>strong {
  display: block;
  /* margin-bottom: 5px; */
}

.slider-input-container {
  padding: 2px;
  display: flex;
  align-items: center;
}

.slider-range {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 8px;
  background: #ddd;
  border-radius: 5px;
  outline: none;
}

.slider-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--bs-theme);
  cursor: pointer;
}

.slider-range::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--bs-theme);
  cursor: pointer;
}

.unit {
  margin-left: 5px;
}

.legend-section {
  margin-bottom: 15px;
}

.legend-section h4 {
  margin-bottom: 10px;
  color: white;
}

.legend-section ul {
  list-style-type: none;
  padding-left: 0;
}

.legend-section ul li {
  color: white;
  padding: 5px 0;
}

.color-box {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 8px;
  vertical-align: middle;
  border: 1px solid #fff;
}
</style>
