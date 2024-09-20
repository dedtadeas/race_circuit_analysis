<template>
  <div></div>
</template>

<script>
import { defineComponent, watch, inject, onMounted } from 'vue';
import { useFlightPlanningViewStore } from '@/store';
import L from 'leaflet';
import config from '@/config';
import { useMap } from '@/stores/backend-map'; // Adjust the path as necessary     const { map } = useMap();

export default defineComponent({
  name: 'RouteTemplateLayer',
  setup() {
    const store = useFlightPlanningViewStore();
    const { map } = useMap();
    const isMapReady = inject('isMapReady');
    let regularPolygonsLayer = null;
    let typeOnePolygonsLayer = null;
    let lineStrings = null;

    const fetchRouteTemplateData = (routeTemplateId) => {
      const url = `http://${config.u_flight_plan_ip}:${config.u_flight_plan_port}/flight_plan_service/get_geojson_data_for_route/${routeTemplateId}`;
      console.log('Fetching route template data:', url);

      fetch(url)
        .then(response => response.json())
        .then(data => {
          console.log('Fetched route template data:', data);
          if (regularPolygonsLayer) {
            map.value.removeLayer(regularPolygonsLayer);
          }
          if (typeOnePolygonsLayer) {
            map.value.removeLayer(typeOnePolygonsLayer);
          }
          if (lineStrings) {
            map.value.removeLayer(lineStrings);
          }

          // Create layers for polygons other than type 1
          regularPolygonsLayer = L.geoJSON(data, {
            style: feature => ({
              color: '#3388ff', // feature.properties.color || 
              weight: 2,
              opacity: 1,
              fillOpacity: 0.3,
              borderOpacity: 0.3
            }),
            filter: feature => feature.geometry.type === 'Polygon' && feature.properties.type !== 1
          }).addTo(map.value);

          // Create a separate layer for type 1 polygons to ensure it's on top
          typeOnePolygonsLayer = L.geoJSON(data, {
            style: feature => ({
              color:  '#000000', //feature.properties.color ||
              weight: 2,
              opacity: 1,
              fillOpacity: 0 // No fill for type 1 polygons
            }),
            filter: feature => feature.geometry.type === 'Polygon' && feature.properties.type === 1
          }).addTo(map.value);

          // Display also linestring features
          lineStrings = L.geoJSON(data, {
            style: feature => ({
              // yellow color for linestrings
              color: '#FFFF00', //feature.properties.color ||
              weight: 2,
              opacity: 1,
              fillOpacity: 0.3
            }),
            filter: feature => feature.geometry.type === 'LineString'
          }).addTo(map.value);

          // Fit the map bounds to the combined layers
          const allLayers = L.featureGroup([regularPolygonsLayer, typeOnePolygonsLayer]);
          map.value.fitBounds(allLayers.getBounds());
        })
        .catch(error => console.error('Failed to fetch route template data:', error));
    };

    watch(() => store.scenario.scenarioOptions.routeTemplateId, (newRouteTemplateId) => {
      if (newRouteTemplateId) {
        fetchRouteTemplateData(newRouteTemplateId);
      }
    });

    // watch on scenario type, if SimpleTakeoff is selected then remove the route template layer
    watch(() => store.scenario.scenarioType, (newScenarioType) => {
      if (newScenarioType === 'simpleTakeoff') {
        if (regularPolygonsLayer) {
          map.value.removeLayer(regularPolygonsLayer);
        }
        if (typeOnePolygonsLayer) {
          map.value.removeLayer(typeOnePolygonsLayer);
        }
        if (lineStrings) {
          map.value.removeLayer(lineStrings);
        }
      }
    });

    onMounted(() => {
      if (isMapReady.value && store.scenario.scenarioOptions.routeTemplateId) {
        fetchRouteTemplateData(store.scenario.scenarioOptions.routeTemplateId);
      }
    });

    return {};
  }
});
</script>
