<template>
  <div>
    <ul class="breadcrumb">
      <li class="breadcrumb-item"><router-link to="/">>></router-link></li>
      <li class="breadcrumb-item"><router-link to="/Circuits">Circuits</router-link></li>
      <li class="breadcrumb-item active">{{ circuitName }}</li>
    </ul>

    <h1>{{ circuitName }}</h1>
    <p>{{ circuitInfo }}</p>

    <!-- Include the map here -->
    
    <BaseMap />

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
    };
  },
  created() {
    // Access the id from route params
    const circuitDetails = this.getCircuitById(this.$route.params.id);
    if (circuitDetails) {
      this.circuitName = circuitDetails.name;
      this.circuitInfo = circuitDetails.info;
    }
  },
  methods: {
    getCircuitById(id) {
      const circuits = [
        { id: '1', name: 'RedBull Ring', info: 'RedBull Ring in Austria is a fast track with a lot of elevation changes.' },
        { id: '2', name: 'Silverstone Circuit', info: 'Silverstone is the home of British motorsport.' },
        { id: '3', name: 'Suzuka Circuit', info: 'Suzuka is a challenging track with a figure-eight layout.' },
        { id: '4', name: 'Spa-Francorchamps', info: 'Spa is a high-speed track known for its elevation changes.' },
      ];
      return circuits.find(circuit => circuit.id === id);
    }
  }
};
</script>
