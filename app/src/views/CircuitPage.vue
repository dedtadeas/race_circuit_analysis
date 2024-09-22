<template>
  <div>
    <ul class="breadcrumb">
      <li class="breadcrumb-item"><router-link to="/">>></router-link></li>
      <li class="breadcrumb-item"><router-link to="/Circuits">Circuits</router-link></li>
      <li class="breadcrumb-item active">{{ circuitName }}</li>
    </ul>

    <h1>{{ circuitName }}</h1>
    <p>{{ circuitInfo }}</p>

    <!-- Pass the zoom and center as props to the map -->
    <BaseMap :zoom="mapZoom" :center="mapCenter" />

  </div>
</template>

<script>
import BaseMap from '../components/circuit_map/BaseMap.vue';

export default {
  name: "CircuitPage",
  components: {
    BaseMap,
  },
  data() {
    return {
      circuitName: '',
      circuitInfo: '',
      mapZoom: 16, // Default zoom level
      mapCenter: [0, 0], // Default center (lat, lng)
    };
  },
  created() {
    // Access the id from route params
    const circuitDetails = this.getCircuitById(this.$route.params.id);
    if (circuitDetails) {
      this.circuitName = circuitDetails.name;
      this.circuitInfo = circuitDetails.info;
      this.mapCenter = circuitDetails.coordinates; // Update map center based on circuit details
      this.mapZoom = circuitDetails.zoom; // Optional: You can customize the zoom for each circuit
    }
  },
  methods: {
    getCircuitById(id) {
      const circuits = [
        { id: '1', name: 'RedBull Ring', info: 'RedBull Ring in Austria is a fast track with a lot of elevation changes.', coordinates: [47.2197, 14.7646], zoom: 14 },
        { id: '2', name: 'Silverstone Circuit', info: 'Silverstone is the home of British motorsport.', coordinates: [52.0786, -1.0169], zoom: 15 },
        { id: '3', name: 'Suzuka Circuit', info: 'Suzuka is a challenging track with a figure-eight layout.', coordinates: [34.8431, 136.541], zoom: 16 },
        { id: '4', name: 'Spa-Francorchamps', info: 'Spa is a high-speed track known for its elevation changes.', coordinates: [50.4372, 5.9713], zoom: 13 },
      ];
      return circuits.find(circuit => circuit.id === id);
    }
  }
};
</script>
