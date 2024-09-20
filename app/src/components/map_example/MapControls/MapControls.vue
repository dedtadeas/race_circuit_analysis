<template>
  <!-- No HTML needed as this component will only control map behavior -->
</template>

<script>
import { watch } from 'vue';
import L from 'leaflet';
import { useV2airUavStore } from "@/stores/backend-uavs";
import { useMapStore } from "@/stores/backend-map";

export default {
  name: 'MapFocusControls',
  setup() {
    const mapStore = useMapStore();
    const store = useV2airUavStore();

    const focusOnLatLonZoom = (lat, lon, zoom) => {
      if (mapStore.map && lat && lon) {
        mapStore.map.setView([lat, lon], zoom);
      }
    };

    const focusOnAllOnlineDrones = () => {
      console.log('Focusing on all ONLINE and visible drones');
      // Filter drones that are visible and ONLINE
      const uavs = store.uavs;
      const activeDrones = Object.values(uavs).filter(drone => drone.visible && drone.vehicle_info.drone_connection_status === 'online');

      if (activeDrones.length > 0) {
        // Create a new LatLngBounds object
        const bounds = activeDrones.reduce((acc, drone) => {
          return acc.extend([drone.vehicle_info.lat, drone.vehicle_info.lon]);
        }, L.latLngBounds([activeDrones[0].vehicle_info.lat, activeDrones[0].vehicle_info.lon]));

        // Fit the map to the bounds calculated from active drones
        mapStore.map.flyToBounds(bounds, {
          padding: [50, 50],
          maxZoom: 18,
          duration: 1
        });
      }
    };

    return { focusOnLatLonZoom, focusOnAllOnlineDrones };
  }
};
</script>
