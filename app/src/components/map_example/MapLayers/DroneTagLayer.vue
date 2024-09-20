<template>
  <div></div>
</template>

<script>
import { onMounted, watch, markRaw, ref } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMapStore } from '@/stores/backend-map';
import { useDroneTagStore } from '@/stores/backend-drone-tag';
import DroneTagLayerSidePanelContent from './SidePanelContents/DroneTagLayerSidePanelContent.vue';
import { useAppVariableStore } from '@/stores/app-variable';
const appVariable = useAppVariableStore();

export default {
  name: 'DroneTagLayer',
  setup() {
    const mapStore = useMapStore();
    const droneTagStore = useDroneTagStore();
    const droneTagLayer = L.layerGroup();
    const droneMarkers = {};
    const panelContent = ref(null);



    function updateMarkers(data) {
      if (!data) {
        console.error('No DroneTag data available to update markers.');
        droneTagLayer.clearLayers();
        return;
      }

      const openPopups = {};

      // Store open popup state
      Object.keys(droneMarkers).forEach(id => {
        if (droneMarkers[id].isPopupOpen()) {
          openPopups[id] = true;
        }
      });

      // Process existing markers for removal or update
      Object.keys(droneMarkers).forEach((id) => {
        if (!data[id]) {
          droneTagLayer.removeLayer(droneMarkers[id]);
          delete droneMarkers[id];
        }
      });

      // Process new or updated data
      Object.entries(data).forEach(([id, tag]) => {
        if (tag && tag.location.latitude && tag.location.longitude) {
          if (droneMarkers[id]) {
            // Update existing marker
            droneMarkers[id].setLatLng([tag.location.latitude, tag.location.longitude]);
          } else {
            // Create new marker and add to the DroneTag layer
            droneMarkers[id] = createMarker(tag);
          }
        }
      });

      // Reopen popups that were open before
      Object.keys(openPopups).forEach(id => {
        if (droneMarkers[id]) {
          droneMarkers[id].openPopup();
        }
      });
    }

    function createMarker(tag) {
      if (!tag || !tag.location.latitude || !tag.location.longitude) {
        console.error('Invalid drone tag data:', tag);
        return null;
      }

      const iconHtml = `<i class="fas fa-lg fa-fw me-2 fa-square layer-icon"></i>`;
      const icon = L.divIcon({
        html: iconHtml,
        className: 'drone-tag-marker-icon',
        iconSize: [20, 20],
      });

      const marker = L.marker([tag.location.latitude, tag.location.longitude], {
        icon: icon,
        rotationAngle: 0,
        rotationOrigin: 'center center',
        className: 'drone-tag-marker',
      });

      let short_id = tag.short_id || "";
      if (short_id) {
        marker.bindTooltip(short_id.toString(), {
          permanent: true,
          direction: 'right',
          className: 'custom-tooltip-no-bg drone-tag-tooltip',
          offset: [0, -15],
        });
      }

      marker.bindPopup(`
        <b>UAS ID:</b> ${tag.uas_id}<br>
        <b>Location:</b> ${tag.location.latitude}, ${tag.location.longitude}<br>
        <b>Altitude:</b> ${tag.altitude} m <br>
        <b>Short ID:</b> ${short_id}
      `);

      droneTagLayer.addLayer(marker);

      return marker;
    }

    onMounted(() => {
      watch([() => mapStore.sidePanel.isOpen, () => mapStore.sidePanel.layerName], ([isOpen, layerName]) => {
        if (isOpen && layerName === 'DroneTag') {
          panelContent.value = {
            component: markRaw(DroneTagLayerSidePanelContent),
            props: {}
          };
          mapStore.setSidePanelContent(panelContent);
        }
      });

      watch(() => mapStore.isMapReady, (newValue) => {
        if (newValue) {
          mapStore.addOverlayLayer('DroneTag Layer', droneTagLayer, 'fas fa-lg fa-fw me-2 fa-square', true, appVariable.color.droneTagColor);
          mapStore.map.addLayer(droneTagLayer);

          watch(() => droneTagStore.items, updateMarkers, { deep: true });

          if (droneTagStore.items && Object.keys(droneTagStore.items).length > 0) {
            updateMarkers(droneTagStore.items);
          }
        }
      }, { immediate: true });
    });

    return {
      droneTagLayer
    };
  }
};
</script>

<style>
.drone-tag-tooltip {
  font-size: 14px;
  font-weight: bold;
  color: var(--drone-tag-color);
  filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.6));
}

.drone-tag-marker-icon {
  filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.6));
    color: var(--drone-tag-color);
}


</style>
