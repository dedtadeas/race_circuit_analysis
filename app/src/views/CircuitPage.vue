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
    <BaseMap 
      :zoom="mapZoom" 
      :center="mapCenter" 
      :trackGeojson="trackGeojson"
      :spectatorsGeojson="spectatorsGeojson"
      :civilGeojson="civilGeojson"
      :parkingGeojson="parkingGeojson"
      :otherGeojson="otherGeojson"
    />

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
      circuitDetails: {}, // Object to hold circuit details
      trackGeojson: null, // Hold the actual GeoJSON data
      spectatorsGeojson: null, // Hold the actual GeoJSON data
      civilGeojson: null, // Hold the actual GeoJSON data
      parkingGeojson: null, // Hold the actual GeoJSON data
      otherGeojson: null, // Hold the actual GeoJSON data
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
      this.circuitDetails = circuitDetails; // Set circuit details

      // Fetch the GeoJSON data
      this.loadGeoJSON(circuitDetails.track_geojson, 'trackGeojson');
      this.loadGeoJSON(circuitDetails.spectators_geojson, 'spectatorsGeojson');
      this.loadGeoJSON(circuitDetails.civil_geojson, 'civilGeojson');
      this.loadGeoJSON(circuitDetails.parking_geojson, 'parkingGeojson');
      this.loadGeoJSON(circuitDetails.other_geojson, 'otherGeojson');
    }
  },
  methods: {
    getCircuitById(id) {
      const basePath = process.env.NODE_ENV === 'production' ? '/race_circuit_analysis' : '';
      const circuits = [
        {
          id: '1',
          name: 'RedBull Ring',
          info: 'RedBull Ring in Austria is a fast track with a lot of elevation changes.',
          coordinates: [47.2197, 14.7646],
          zoom: 14,
          track_geojson: '/assets/c_data/1/geojsons/x1_RedBullRing_Track.geojson',
          spectators_geojson: '/assets/c_data/1/geojsons/x1_RedBullRing_Spectators.geojson',
          civil_geojson: '/assets/c_data/1/geojsons/x1_RedBullRing_Civil.geojson',
          parking_geojson: '/assets/c_data/2/geojsons/x1_RedBullRing_Parking.geojson',
          other_geojson: '/assets/c_data/2/geojsons/x1_RedBullRing_Other.geojson',
          images: [
            `${basePath}/assets/c_data/1/images/1.jpg`,
            `${basePath}/assets/c_data/1/images/2.jpg`,
            `${basePath}/assets/c_data/1/images/3.jpg`,
          ],
          videos: [
            { title: 'RedBull Highlights', url: 'https://www.youtube.com/watch?v=ndfU8ezntys', views: '1M', time: '2 days ago', thumbnail: '/assets/img/thumbnails/redbull-video-1.jpg' },
            { title: 'RedBull Ring Experience', url: 'https://www.youtube.com/watch?v=qCKmLYFfKfk', views: '500K', time: '1 week ago', thumbnail: '/assets/img/thumbnails/redbull-video-2.jpg' },
            { title: 'RedBull Ring', url: 'https://www.youtube.com/watch?v=Ayro0rKQeWg', views: '500K', time: '1 week ago', thumbnail: '/assets/img/thumbnails/redbull-video-2.jpg' },
            { title: 'RedBull Ring', url: 'https://www.youtube.com/watch?v=gvEYw-L9dek', views: '500K', time: '1 week ago', thumbnail: '/assets/img/thumbnails/redbull-video-2.jpg' }
          ]
        },
        {
          id: '2',
          name: 'Circuit de Spa-Francorchamps',
          info: 'Circuit de Spa-Francorchamps in Belgium is known for its high-speed corners and unpredictable weather.',
          coordinates: [50.4372, 5.9715],
          zoom: 14,
          track_geojson: '/assets/c_data/2/geojsons/x2_Spa_Track.geojson',
          spectators_geojson: '/assets/c_data/2/geojsons/x2_Spa_Spectators.geojson',
          civil_geojson: '/assets/c_data/2/geojsons/x2_Spa_Civil.geojson',
          parking_geojson: '/assets/c_data/2/geojsons/x2_Spa_Parking.geojson',
          other_geojson: '/assets/c_data/2/geojsons/x2_Spa_Other.geojson',
          images: [
            `${basePath}/assets/c_data/2/images/1.jpg`,
            `${basePath}/assets/c_data/2/images/2.jpg`,
            `${basePath}/assets/c_data/2/images/3.jpg`,
            `${basePath}/assets/c_data/2/images/4.jpg`,
            `${basePath}/assets/c_data/2/images/5.jpg`,
            `${basePath}/assets/c_data/2/images/6.jpg`,
            `${basePath}/assets/c_data/2/images/7.jpg`,
            `${basePath}/assets/c_data/2/images/8.jpg`,
            `${basePath}/assets/c_data/2/images/9.jpg`
          ],
          // videos: [
          //   { title: 'Spa-Francorchamps Highlights', url: 'https://www.youtube.com/watch?v=-4FPIL6e4SQ', views: '2M', time: '3 days ago', thumbnail: '/assets/img/thumbnails/spa-video-1.jpg' },
          //   { title: 'Spa-Francorchamps Onboard Lap', url: 'https://www.youtube.com/watch?v=-4FPIL6e4SQ', views: '1M', time: '1 week ago', thumbnail: '/assets/img/thumbnails/spa-video-2.jpg' }
          // ]
        },
        {
          id: '3',
          name: 'Sachsenring',
          info: 'Sachsenring in Germany is a technical track with a lot of elevation changes.',
          coordinates: [50.7322, 12.7956],
          zoom: 14,
          track_geojson: '/assets/c_data/1/geojsons/x1_RedBullRing_Track.geojson',
          spectators_geojson: '/assets/c_data/1/geojsons/x1_RedBullRing_Spectators.geojson',
          civil_geojson: '/assets/c_data/1/geojsons/x1_RedBullRing_Civil.geojson',
          parking_geojson: '/assets/c_data/2/geojsons/x1_RedBullRing_Parking.geojson',
          other_geojson: '/assets/c_data/2/geojsons/x1_RedBullRing_Other.geojson',
          images: [
            `${basePath}/assets/c_data/3/images/1.jpg`,
            `${basePath}/assets/c_data/3/images/2.jpg`,
            `${basePath}/assets/c_data/3/images/3.jpg`,
            `${basePath}/assets/c_data/3/images/4.jpg`,
            `${basePath}/assets/c_data/3/images/5.jpg`,
            `${basePath}/assets/c_data/3/images/6.jpg`,
            `${basePath}/assets/c_data/3/images/7.jpg`,
          ],
          videos: [
            { title: 'LIVE RACE MotoGP German at Sachsenring Circuit', url: 'https://www.youtube.com/watch?v=WNrkqWkmDis', views: '1M', time: '2 days ago', thumbnail: '/assets/img/thumbnails/redbull-video-1.jpg' },
            { title: 'Highlights 2024', url: 'https://www.youtube.com/watch?v=mgDYq2O3Dog', views: '500K', time: '1 week ago', thumbnail: '/assets/img/thumbnails/redbull-video-2.jpg' },
            { title: 'Highlights 2 2024', url: 'https://www.youtube.com/watch?v=fOQTUYb_UxU', views: '500K', time: '1 week ago', thumbnail: '/assets/img/thumbnails/redbull-video-2.jpg' },
          ]
        },
      ];
      return circuits.find(circuit => circuit.id === id);
    },
    // Fetch GeoJSON data from the provided URL

    loadGeoJSON(url, targetProperty) {
      const basePath = process.env.NODE_ENV === 'production' ? '/race_circuit_analysis' : '';
      fetch(`${basePath}${url}`)
        .then(response => response.json())
        .then(data => {
          this[targetProperty] = data; // Update the component data with the fetched GeoJSON
        })
        .catch(error => {
          console.error(`Failed to load GeoJSON from ${url}`, error);
        });
    }
  }
};
</script>
