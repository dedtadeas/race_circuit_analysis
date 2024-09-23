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
    let polygonLayer_2 = null; // Layer to hold the polygons
    let polygonLayer = null; // Layer to hold the polygons
    const additionalData = ref(null); // Ref to store fetched data
    const loading = ref(true); // Ref to manage loading state
    const errorOccurred = ref(false); // Ref to manage error state

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

    const fetchData_2 = async () => {
      try {
        const response = await fetch('http://localhost:5173/data/x1_RedBullRing_Track.geojson');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        additionalData.value = data;
        displayPolygons_2(data); // Call the function to display polygons
        loading.value = false; // Hide loading overlay when data is fetched (success or error)
      } catch (error) {
        console.error('Error fetching data:', error);
        errorOccurred.value = true; // Set error state to true if an error occurs
      }
    };

    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5173/data/x1_RedBullRing_Spectators.geojson');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        additionalData.value = data;
        displayPolygons(data); // Call the function to display polygons
        loading.value = false; // Hide loading overlay when data is fetched (success or error)
      } catch (error) {
        console.error('Error fetching data:', error);
        errorOccurred.value = true; // Set error state to true if an error occurs
      }
    };

    // Function to display polygons on the map
    const displayPolygons_2 = (geojsonData) => {
      if (polygonLayer_2) {
        map.removeLayer(polygonLayer_2); // Remove existing polygon layer if it exists
      }

      // Use Leaflet to add the GeoJSON layer (polygons) to the map
      polygonLayer_2 = L.geoJSON(geojsonData, {
        style: {
          color: 'red',
          weight: 2,
          fillOpacity: 0.4,
        },
      }).addTo(map);

      // Optionally, fit the map bounds to the polygons
      map.fitBounds(polygonLayer_2.getBounds());
    };

    const displayPolygons = (geojsonData) => {
      if (polygonLayer) {
        map.removeLayer(polygonLayer); // Remove existing polygon layer if it exists
      }

      // Use Leaflet to add the GeoJSON layer (polygons) to the map
      polygonLayer = L.geoJSON(geojsonData, {
        style: {
          color: 'blue',
          weight: 2,
          fillOpacity: 0.4,
        },
      }).addTo(map);

      // Optionally, fit the map bounds to the polygons
      map.fitBounds(polygonLayer.getBounds());
    };

    onMounted(() => {
      // Show loading layer while fetching data
      fetchData();
      fetchData_2();

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

/* Loading overlay styling */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7); /* Dark transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 1.5em;
  z-index: 2000; /* Higher than other elements */
}

/* Error message style */
.error-message {
  color: red;
}

/* Position the slider on top of the map */
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

