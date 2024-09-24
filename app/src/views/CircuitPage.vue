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

    <!-- Reference Section -->
    <div class="reference-section mt-4">
      <h2>References</h2>

      <!-- Gallery Section -->
      <CircuitGallery :images="circuitImages" />

      <!-- YouTube Video Section -->
      <CircuitVideo :videos="circuitVideos" />
    </div>
  </div>
</template>

<script>
import BaseMap from '../components/circuit_map/BaseMap.vue';
import CircuitVideo from '../components/CircuitVideo.vue';
import CircuitGallery from '../components/CircuitGallery.vue'; // Import the new component

export default {
  name: "CircuitPage",
  components: {
    BaseMap,
    CircuitVideo,
    CircuitGallery // Register the new component
  },
  data() {
    return {
      circuitName: '',
      circuitInfo: '',
      mapZoom: 16, // Default zoom level
      mapCenter: [0, 0], // Default center (lat, lng)
      circuitImages: [], // Array to hold image URLs
      circuitVideos: [], // Array to hold video details
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
      this.circuitImages = circuitDetails.images; // Set circuit images
      this.circuitVideos = circuitDetails.videos; // Set circuit videos
    }
  },
  methods: {
    getCircuitById(id) {
      const circuits = [
        { 
          id: '1', 
          name: 'RedBull Ring', 
          info: 'RedBull Ring in Austria is a fast track with a lot of elevation changes.', 
          coordinates: [47.2197, 14.7646], 
          zoom: 14,
          images: [
            '/data/images/1/1.jpg',
            '/data/images/1/2.jpg',
          ],
          videos: [
            { title: 'RedBull Highlights', url: 'https://www.youtube.com/watch?v=-4FPIL6e4SQ', views: '1M', time: '2 days ago', thumbnail: '/assets/img/thumbnails/redbull-video-1.jpg' },
            { title: 'RedBull Onboard Lap', url: 'https://www.youtube.com/watch?v=-4FPIL6e4SQ', views: '500K', time: '1 week ago', thumbnail: '/assets/img/thumbnails/redbull-video-2.jpg' }
          ]
        },
        { 
          id: '2', 
          name: 'Silverstone Circuit', 
          info: 'Silverstone is the home of British motorsport.', 
          coordinates: [52.0786, -1.0169], 
          zoom: 15,
          images: [
            '/assets/img/gallery/silverstone-1.jpg', 
            '/assets/img/gallery/silverstone-2.jpg'
          ],
          videos: [
            { title: 'Silverstone Recap', url: 'https://www.youtube.com/watch?v=ghi789', views: '2M', time: '3 days ago', thumbnail: '/assets/img/thumbnails/silverstone-video-1.jpg' }
          ]
        }
      ];
      return circuits.find(circuit => circuit.id === id);
    }
  }
};
</script>
