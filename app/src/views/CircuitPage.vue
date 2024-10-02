<!-- vi: set et sw=2 ts=2: -->
<template>
  <div>
    <ul class="breadcrumb">
      <li class="breadcrumb-item"><router-link to="/">&gt;&gt;</router-link></li>
      <li class="breadcrumb-item"><router-link to="/circuits">Circuits</router-link></li>
      <li class="breadcrumb-item active">{{ circuitName }}</li>
    </ul>
    <h1>{{ circuitName }}</h1>
    <p>{{ circuitInfo }}</p>
    <BaseMap 
      :zoom="mapZoom"
      :center="mapCenter"
      :layers="mapLayers"
      :trackGeojson="trackGeojson"
      :spectatorsGeojson="spectatorsGeojson"
      :civilGeojson="civilGeojson"
      :parkingGeojson="parkingGeojson"
      :otherGeojson="otherGeojson"
    />
    <div class="reference-section mt-4">
      <h2>References</h2>
      <div v-if="circuitDetails.links && circuitDetails.links.length > 0">
      <h3>Links</h3>
      <ul>
        <li v-for="link in circuitDetails.links" :key="link.url">
          <a :href="link.url" target="_blank">{{ link.title }}</a>
        </li>
      </ul>
    </div>
      <CircuitGallery :images="circuitImages" />
      <CircuitVideo :videos="circuitVideos" />
    </div>
  </div>
</template>

<script>
import BaseMap from '../components/circuit_map/BaseMap.vue';
import CircuitVideo from '../components/CircuitVideo.vue';
import CircuitGallery from '../components/CircuitGallery.vue'; // Import the new component

const basePath = process.env.NODE_ENV === 'production' ? '/race_circuit_analysis' : '';
const circuits = [
{id: '1',
  name: 'RedBull Ring',
  info: 'RedBull Ring in Austria is a fast track with a lot of elevation changes.',
  links: [
    { title: 'Official website', url: 'https://www.projekt-spielberg.com/en' },
  ],
  coordinates: [47.2197, 14.7646],
  zoom: 14,
  layers: [
    {'label': 'spectators', 'has_buffer': true , 'file_path': 'assets/c_data/1/geojsons/x1_RedBullRing_Spectators.geojson'},
    {'label': 'track'     , 'has_buffer': false, 'file_path': 'assets/c_data/1/geojsons/x1_RedBullRing_Track.geojson'},
  ],
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
{id: '2',
  name: 'Circuit de Spa-Francorchamps',
  info: 'Circuit de Spa-Francorchamps in Belgium is known for its high-speed corners and unpredictable weather.',
    links: [
    { title: 'Official website', url: 'https://www.spa-francorchamps.be/' },
  ],
  coordinates: [50.4372, 5.9715],
  zoom: 14,
  layers: [
    { 'label': 'parking', 'has_buffer': true, 'file_path': 'assets/c_data/2/geojsons/x2_Spa_Parking.geojson' },
    { 'label': 'paddock', 'has_buffer': false, 'file_path': 'assets/c_data/2/geojsons/x2_Spa_Paddock.geojson' },
    {'label': 'roads'             , 'has_buffer': true, 'file_path': 'assets/c_data/2/geojsons/x2_Spa_Roads.geojson'},
    {'label': 'spectators AC'     , 'has_buffer': true, 'file_path': 'assets/c_data/2/geojsons/x2_Spa_Spectators_AC.geojson'},
    {'label': 'spectators stand'  , 'has_buffer': true, 'file_path': 'assets/c_data/2/geojsons/x2_Spa_Spectators_Stand.geojson'},
    {'label': 'spectators tribune', 'has_buffer': true, 'file_path': 'assets/c_data/2/geojsons/x2_Spa_Spectators_Tribune.geojson'},
  ],
  images: [
    `${basePath}/assets/c_data/2/images/1.jpg`,
    `${basePath}/assets/c_data/2/images/2.jpg`,
    `${basePath}/assets/c_data/2/images/3.jpg`,
    `${basePath}/assets/c_data/2/images/4.jpg`,
    `${basePath}/assets/c_data/2/images/5.jpg`,
    `${basePath}/assets/c_data/2/images/6.jpg`,
    `${basePath}/assets/c_data/2/images/7.jpg`,
    `${basePath}/assets/c_data/2/images/8.jpg`,
    `${basePath}/assets/c_data/2/images/9.jpg`,
    `${basePath}/assets/c_data/2/images/10.jpg`
  ],
  // videos: [
  //   { title: 'Spa-Francorchamps Highlights', url: 'https://www.youtube.com/watch?v=-4FPIL6e4SQ', views: '2M', time: '3 days ago', thumbnail: '/assets/img/thumbnails/spa-video-1.jpg' },
  //   { title: 'Spa-Francorchamps Onboard Lap', url: 'https://www.youtube.com/watch?v=-4FPIL6e4SQ', views: '1M', time: '1 week ago', thumbnail: '/assets/img/thumbnails/spa-video-2.jpg' }
  // ]
},
{id: '5',
  name: 'Sachsenring',
  info: 'Sachsenring in Germany is a technical track with a lot of elevation changes.',
    links: [
    { title: 'Official website', url: 'https://www.sachsenring-circuit.com/' },
  ],
  coordinates: [50.7916, 12.6868],
  zoom: 14,
  layers: [
    {'label': 'civil'             , 'has_buffer': true , 'file_path': 'assets/c_data/5/geojsons/x5_Sachsen_Civil.geojson'},
    {'label': 'other'             , 'has_buffer': true , 'file_path': 'assets/c_data/5/geojsons/x5_Sachsen_Other.geojson'},
    { 'label': 'parking', 'has_buffer': true, 'file_path': 'assets/c_data/5/geojsons/x5_Sachsen_Parking.geojson' },
    { 'label': 'paddock', 'has_buffer': false, 'file_path': 'assets/c_data/5/geojsons/x5_Sachsen_Paddock.geojson' },
    {'label': 'roads'             , 'has_buffer': true , 'file_path': 'assets/c_data/5/geojsons/x5_Sachsen_Roads.geojson'},
    {'label': 'spectators AC'     , 'has_buffer': true , 'file_path': 'assets/c_data/5/geojsons/x5_Sachsen_Spectators_AC.geojson'},
    {'label': 'spectators stand'  , 'has_buffer': true , 'file_path': 'assets/c_data/5/geojsons/x5_Sachsen_Spectators_Stand.geojson'},
    {'label': 'spectators tribune', 'has_buffer': true , 'file_path': 'assets/c_data/5/geojsons/x5_Sachsen_Spectators_Tribune.geojson'},
    {'label': 'track'             , 'has_buffer': false, 'file_path': 'assets/c_data/5/geojsons/x5_Sachsen_Track.geojson'},
  ],
  images: [
    `${basePath}/assets/c_data/5/images/1.jpg`,
    `${basePath}/assets/c_data/5/images/2.jpg`,
    `${basePath}/assets/c_data/5/images/3.jpg`,
    `${basePath}/assets/c_data/5/images/4.jpg`,
    `${basePath}/assets/c_data/5/images/5.jpg`,
    `${basePath}/assets/c_data/5/images/6.jpg`,
    `${basePath}/assets/c_data/5/images/7.jpg`,
  ],
  videos: [
    { title: 'LIVE RACE MotoGP German at Sachsenring Circuit', url: 'https://www.youtube.com/watch?v=WNrkqWkmDis', views: '1M', time: '2 days ago', thumbnail: '/assets/img/thumbnails/redbull-video-1.jpg' },
    { title: 'Highlights 2024', url: 'https://www.youtube.com/watch?v=mgDYq2O3Dog', views: '500K', time: '1 week ago', thumbnail: '/assets/img/thumbnails/redbull-video-2.jpg' },
    { title: 'Highlights 2 2024', url: 'https://www.youtube.com/watch?v=fOQTUYb_UxU', views: '500K', time: '1 week ago', thumbnail: '/assets/img/thumbnails/redbull-video-2.jpg' },
  ]
  },
{id: '6',
  name: 'Nürburgring',
  info: 'Nürburgring in Germany is a technical track with a lot of elevation changes.',
  links: [
    { title: 'Official website', url: 'https://www.nuerburgring.de/en?srsltid=AfmBOorwsXHoM22SlFEUrJ6_Y6nxecyy4gS9WRfDcf_76eoc6zSjZ2KO' },
  ],
  coordinates: [50.3356, 6.9475],
  zoom: 14,
  layers: [
    {'label': 'civil' , 'has_buffer': true , 'file_path': 'assets/c_data/6/geojsons/x6_Nurburgring_Civil.geojson'},
    {'label': 'other'             , 'has_buffer': true , 'file_path': 'assets/c_data/6/geojsons/x6_Nurburgring_Other.geojson'},
    { 'label': 'parking', 'has_buffer': true, 'file_path': 'assets/c_data/6/geojsons/x6_Nurburgring_Parking.geojson' },
    { 'label': 'paddock', 'has_buffer': false, 'file_path': 'assets/c_data/6/geojsons/x6_Nurburgring_Paddock.geojson' },
    {'label': 'roads'             , 'has_buffer': true , 'file_path': 'assets/c_data/6/geojsons/x6_Nurburgring_Roads.geojson'},
    {'label': 'spectators AC'     , 'has_buffer': true , 'file_path': 'assets/c_data/6/geojsons/x6_Nurburgring_Spectators_AC.geojson'},
    {'label': 'spectators stand'  , 'has_buffer': true , 'file_path': 'assets/c_data/6/geojsons/x6_Nurburgring_Spectators_Stand.geojson'},
    {'label': 'spectators tribune', 'has_buffer': true , 'file_path': 'assets/c_data/6/geojsons/x6_Nurburgring_Spectators_Tribune.geojson'},
    {'label': 'track'             , 'has_buffer': false, 'file_path': 'assets/c_data/6/geojsons/x6_Nurburgring_Track.geojson'},
  ],
  images: [
    `${basePath}/assets/c_data/6/images/1.jpg`,
    `${basePath}/assets/c_data/6/images/2.jpg`,
    `${basePath}/assets/c_data/6/images/3.jpg`,
    `${basePath}/assets/c_data/6/images/4.jpg`,
    `${basePath}/assets/c_data/6/images/5.jpg`,
    `${basePath}/assets/c_data/6/images/6.jpg`,
    `${basePath}/assets/c_data/6/images/7.jpg`,
    `${basePath}/assets/c_data/6/images/8.jpg`,
    `${basePath}/assets/c_data/6/images/9.jpg`,
    `${basePath}/assets/c_data/6/images/10.jpg`
  ],
  videos: [
    { title: 'LIVE RACE 24 h', url: 'https://www.youtube.com/watch?v=84N89QJUEXY', views: '1M', time: '2 days ago', thumbnail: '/assets/img/thumbnails/redbull-video-1.jpg' },
]
  },
{id: '7',
  name: 'Hockenheim',
  info: '',
  links: [
    { title: 'Official website', url: 'https://www.hockenheimring.de/en/' },
    { title: '3D Tour', url: 'https://files.hockenheimring.de/tour/HHR.html' },
  ],
  coordinates: [49.3278, 8.5656],
  zoom: 14,
  layers: [
    {'label': 'other'             , 'has_buffer': true , 'file_path': 'assets/c_data/7/geojsons/x7_Hockenheim_Other.geojson'},
    { 'label': 'parking', 'has_buffer': true, 'file_path': 'assets/c_data/7/geojsons/x7_Hockenheim_Parking.geojson' },
    { 'label': 'paddock', 'has_buffer': false, 'file_path': 'assets/c_data/7/geojsons/x7_Hockenheim_Paddock.geojson' },
    {'label': 'roads'             , 'has_buffer': true , 'file_path': 'assets/c_data/7/geojsons/x7_Hockenheim_Roads.geojson'},
    {'label': 'spectators AC'     , 'has_buffer': true , 'file_path': 'assets/c_data/7/geojsons/x7_Hockenheim_Spectators_AC.geojson'},
    {'label': 'spectators stand'  , 'has_buffer': true , 'file_path': 'assets/c_data/7/geojsons/x7_Hockenheim_Spectators_Stand.geojson'},
    {'label': 'spectators tribune', 'has_buffer': true , 'file_path': 'assets/c_data/7/geojsons/x7_Hockenheim_Spectators_Tribune.geojson'},
    {'label': 'track'             , 'has_buffer': false, 'file_path': 'assets/c_data/7/geojsons/x7_Hockenheim_Track.geojson'},
  ],
  images: [
    `${basePath}/assets/c_data/7/images/1.jpg`,
    `${basePath}/assets/c_data/7/images/2.jpg`,
    `${basePath}/assets/c_data/7/images/3.jpg`,
    `${basePath}/assets/c_data/7/images/4.jpg`,
    `${basePath}/assets/c_data/7/images/5.jpg`,
    `${basePath}/assets/c_data/7/images/6.jpg`,
    `${basePath}/assets/c_data/7/images/7.jpg`,
    `${basePath}/assets/c_data/7/images/8.jpg`,
    `${basePath}/assets/c_data/7/images/9.jpg`,
    `${basePath}/assets/c_data/7/images/10.jpg`
  ],
//   videos: [
//     { title: 'LIVE RACE 24 h', url: 'https://www.youtube.com/watch?v=84N89QJUEXY', views: '1M', time: '2 days ago', thumbnail: '/assets/img/thumbnails/redbull-video-1.jpg' },
// ]
  },
  {
    id: '24',
    name: 'Barhain International Circuit',
    info: '',
    links: [
      { title: 'Official website', url: 'https://www.bahraingp.com/' },
    ],
    coordinates: [26.0321, 50.5108],
    zoom: 14,
    layers: [
      { 'label': 'civil', 'has_buffer': true, 'file_path': 'assets/c_data/24/geojsons/x24_Bahrain_Civil.geojson' },
      { 'label': 'other', 'has_buffer': true, 'file_path': 'assets/c_data/24/geojsons/x24_Bahrain_Other.geojson' },
      { 'label': 'parking', 'has_buffer': true, 'file_path': 'assets/c_data/24/geojsons/x24_Bahrain_Parking.geojson' },
      { 'label': 'roads', 'has_buffer': true, 'file_path': 'assets/c_data/24/geojsons/x24_Bahrain_Roads.geojson' },
      { 'label': 'spectators AC', 'has_buffer': true, 'file_path': 'assets/c_data/24/geojsons/x24_Bahrain_Spectators_AC.geojson' },
      { 'label': 'spectators tribune', 'has_buffer': true, 'file_path': 'assets/c_data/24/geojsons/x24_Bahrain_Spectators_Tribune.geojson' },
      { 'label': 'track', 'has_buffer': false, 'file_path': 'assets/c_data/24/geojsons/x24_Bahrain_Track.geojson' },
    ],
    images: [
      `${basePath}/assets/c_data/24/images/1.jpg`,
      `${basePath}/assets/c_data/24/images/2.jpg`,
      `${basePath}/assets/c_data/24/images/3.jpg`,
      `${basePath}/assets/c_data/24/images/4.jpg`,
      `${basePath}/assets/c_data/24/images/5.jpg`,
      `${basePath}/assets/c_data/24/images/6.jpg`,
      `${basePath}/assets/c_data/24/images/7.jpg`,
      `${basePath}/assets/c_data/24/images/8.jpg`,
    ],
    //   videos: [
    //     { title: 'LIVE RACE 24 h', url: 'https://www.youtube.com/watch?v=84N89QJUEXY', views: '1M', time: '2 days ago', thumbnail: '/assets/img/thumbnails/redbull-video-1.jpg' },
    // ]
  },
    {
    id: '25',
    name: 'Losail International Circuit',
    info: '',
    links: [
      { title: 'Official website', url: 'https://www.circuitlosail.com/' },
    ],
    coordinates: [25.4885, 51.4505],
    zoom: 14,
    layers: [
      { 'label': 'civil', 'has_buffer': true, 'file_path': 'assets/c_data/25/geojsons/x25_Losail_Civil.geojson' },
      { 'label': 'other', 'has_buffer': true, 'file_path': 'assets/c_data/25/geojsons/x25_Losail_Other.geojson' },
      { 'label': 'parking', 'has_buffer': true, 'file_path': 'assets/c_data/25/geojsons/x25_Losail_Parking.geojson' },
      { 'label': 'paddock', 'has_buffer': false, 'file_path': 'assets/c_data/25/geojsons/x25_Losail_Paddock.geojson' },
      { 'label': 'roads', 'has_buffer': true, 'file_path': 'assets/c_data/25/geojsons/x25_Losail_Roads.geojson' },
      { 'label': 'spectators AC', 'has_buffer': true, 'file_path': 'assets/c_data/25/geojsons/x25_Losail_Spectators_AC.geojson' },
      { 'label': 'spectators tribune', 'has_buffer': true, 'file_path': 'assets/c_data/25/geojsons/x25_Losail_Spectators_Tribune.geojson' },
      { 'label': 'spectators stand', 'has_buffer': false, 'file_path': 'assets/c_data/25/geojsons/x25_Losail_Spectators_Stand.geojson' },
      { 'label': 'track', 'has_buffer': false, 'file_path': 'assets/c_data/25/geojsons/x25_Losail_Track.geojson' },
    ],
    images: [
      `${basePath}/assets/c_data/25/images/1.jpg`,
      `${basePath}/assets/c_data/25/images/2.jpg`,
      `${basePath}/assets/c_data/25/images/3.jpg`,
      `${basePath}/assets/c_data/25/images/4.jpg`,
      `${basePath}/assets/c_data/25/images/5.jpg`,
      // `${basePath}/assets/c_data/25/images/6.jpg`,
      // `${basePath}/assets/c_data/25/images/7.jpg`,
      // `${basePath}/assets/c_data/25/images/8.jpg`,
    ],
    //   videos: [
    //     { title: 'LIVE RACE 24 h', url: 'https://www.youtube.com/watch?v=84N89QJUEXY', views: '1M', time: '2 days ago', thumbnail: '/assets/img/thumbnails/redbull-video-1.jpg' },
    // ]
  },
  {id: '26',
    name: 'Jeddah Street Circuit',
    info: '',
    links: [
      { title: 'Official website', url: 'https://jeddahcircuit.com/motorsport' },
      { title: 'F1 Records', url: 'https://www.formula1.com/en/video/jeddah-street-circuit-first-look-f1s-brand-new-track-in-saudi-arabia.1715401112473745964' },
    ],
    coordinates: [21.6315, 39.1046],
    zoom: 14,
    layers: [
      {'label': 'civil'  , 'has_buffer': true , 'file_path': 'assets/c_data/26/geojsons/x26_Jeddah_Civil.geojson'},
      { 'label': 'other', 'has_buffer': true, 'file_path': 'assets/c_data/26/geojsons/x26_Jeddah_Other.geojson' },
      { 'label': 'parking', 'has_buffer': true, 'file_path': 'assets/c_data/26/geojsons/x26_Jeddah_Parking.geojson' },
      { 'label': 'paddock', 'has_buffer': false, 'file_path': 'assets/c_data/26/geojsons/x26_Jeddah_Paddock.geojson' },
      { 'label': 'roads', 'has_buffer': true, 'file_path': 'assets/c_data/26/geojsons/x26_Jeddah_Roads.geojson' },
      { 'label': 'spectators AC', 'has_buffer': true, 'file_path': 'assets/c_data/26/geojsons/x26_Jeddah_Spectators_AC.geojson' },
      { 'label': 'spectators tribune', 'has_buffer': true, 'file_path': 'assets/c_data/26/geojsons/x26_Jeddah_Spectators_Tribune.geojson' },
      { 'label': 'track', 'has_buffer': false, 'file_path': 'assets/c_data/26/geojsons/x26_Jeddah_Track.geojson' },
    ],
    images: [
      `${basePath}/assets/c_data/26/images/1.jpg`,
      `${basePath}/assets/c_data/26/images/2.jpg`,
      `${basePath}/assets/c_data/26/images/3.jpg`,
      `${basePath}/assets/c_data/26/images/4.jpg`,
      `${basePath}/assets/c_data/26/images/5.jpg`,
      `${basePath}/assets/c_data/26/images/6.jpg`,
      `${basePath}/assets/c_data/26/images/7.jpg`,
      `${basePath}/assets/c_data/26/images/8.jpg`,
      `${basePath}/assets/c_data/26/images/9.jpg`,
      `${basePath}/assets/c_data/26/images/10.jpg`
    ],
    //   videos: [
    //     { title: 'LIVE RACE 24 h', url: 'https://www.youtube.com/watch?v=84N89QJUEXY', views: '1M', time: '2 days ago', thumbnail: '/assets/img/thumbnails/redbull-video-1.jpg' },
    // ]
  },
  {
    id: '27',
    name: 'Yas Marina Circuit',
    info: '',
    links: [
      { title: 'Official website', url: 'https://www.yasmarinacircuit.com/' },
    ],
    coordinates: [24.4672, 54.6031],
    zoom: 14,
    layers: [
      { 'label': 'civil', 'has_buffer': true, 'file_path': 'assets/c_data/27/geojsons/x27_Yas_Civil.geojson' },
      { 'label': 'other', 'has_buffer': true, 'file_path': 'assets/c_data/27/geojsons/x27_Yas_Other.geojson' },
      { 'label': 'parking', 'has_buffer': true, 'file_path': 'assets/c_data/27/geojsons/x27_Yas_Parking.geojson' },
      { 'label': 'paddock', 'has_buffer': false, 'file_path': 'assets/c_data/27/geojsons/x27_Yas_Paddock.geojson' },
      { 'label': 'roads', 'has_buffer': true, 'file_path': 'assets/c_data/27/geojsons/x27_Yas_Roads.geojson' },
      { 'label': 'spectators AC', 'has_buffer': true, 'file_path': 'assets/c_data/27/geojsons/x27_Yas_Spectators_AC.geojson' },
      { 'label': 'spectators tribune', 'has_buffer': true, 'file_path': 'assets/c_data/27/geojsons/x27_Yas_Spectators_Tribune.geojson' },
      { 'label': 'track', 'has_buffer': false, 'file_path': 'assets/c_data/27/geojsons/x27_Yas_Track.geojson' },
    ],
    images: [
      `${basePath}/assets/c_data/27/images/1.jpg`,
      `${basePath}/assets/c_data/27/images/2.jpg`,
      `${basePath}/assets/c_data/27/images/3.jpg`,
      `${basePath}/assets/c_data/27/images/4.jpg`,
      `${basePath}/assets/c_data/27/images/5.jpg`,
      `${basePath}/assets/c_data/27/images/6.jpg`,
      `${basePath}/assets/c_data/27/images/7.jpg`,
      // `${basePath}/assets/c_data/27/images/8.jpg`,
      // `${basePath}/assets/c_data/27/images/9.jpg`,
      // `${basePath}/assets/c_data/27/images/10.jpg`
    ],
    //   videos: [
    //     { title: 'LIVE RACE 24 h', url: 'https://www.youtube.com/watch?v=84N89QJUEXY', views: '1M', time: '2 days ago', thumbnail: '/assets/img/thumbnails/redbull-video-1.jpg' },
    // ]
  },
];

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
      mapLayers: [],
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
      this.mapZoom = circuitDetails.zoom; // Optional: You can customize the zoom for each circuit
      this.mapCenter = circuitDetails.coordinates; // Update map center based on circuit details
      this.mapLayers = circuitDetails.layers

      this.circuitName = circuitDetails.name;
      this.circuitInfo = circuitDetails.info;
      this.circuitImages = circuitDetails.images; // Set circuit images
      this.circuitVideos = circuitDetails.videos; // Set circuit videos
      this.circuitDetails = circuitDetails; // Set circuit details
    }
  },
  methods: {
    getCircuitById(id) {
      return circuits.find(circuit => circuit.id === id);
    },
  }
};
</script>
