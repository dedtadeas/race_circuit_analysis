<template>
  <div></div>
</template>

<script>
import { onMounted, watch, ref, markRaw } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMapStore } from '@/stores/backend-map';
import { useV2airUavStore } from '@/stores/backend-uavs';
import V2airUAVLayerSidePanelContent from './SidePanelContents/V2airUAVLayerSidePanelContent.vue';
import { useAppVariableStore } from '@/stores/app-variable';

const appVariable = useAppVariableStore();

export default {
  name: 'UavLayer',
  components: {
    V2airUAVLayerSidePanelContent
  },
  setup() {
    const mapStore = useMapStore();
    const uavStore = useV2airUavStore();
    const uavLayer = L.layerGroup();
    const uavMarkers = {};
    const uavPanelContent = ref(null);

    function updateMarkerPositionAndRotation(marker, vehicle_info) {
      marker.setLatLng([vehicle_info.lat, vehicle_info.lon]);
      setMarkerRotation(marker, vehicle_info.heading);
    }

    function createMarker(vehicle_info) {
      const marker = L.marker([vehicle_info.lat, vehicle_info.lon], {
        icon: L.divIcon({
          className: `uav-marker ${determineIconClass(vehicle_info)}`,
          html: generateSvgIcon(determineIconColor(vehicle_info)),
          iconSize: [30, 30]
        }),
        title: vehicle_info.drone_sn
      });

      marker.uavData = vehicle_info; // Attach UAV data to the marker

      marker.bindTooltip(vehicle_info.drone_sn, {
        permanent: true,
        direction: 'right',
        className: 'custom-tooltip-no-bg uav-tooltip',
        offset: [0, -15]
      });

      // Bind a popup with a function to generate content dynamically
      marker.bindPopup(generatePopupContent(vehicle_info));

      return marker;
    }

    function determineIconClass(vehicle_info) {
      return vehicle_info.drone_name.startsWith('Simulated') ? 'uav-simulated' : 'uav-real';
    }

    function determineIconColor(vehicle_info) {
      if (vehicle_info.drone_sn === uavStore.activeUav) {
        return 'purple'; // Color for selected UAV
      }
      return vehicle_info.drone_name.startsWith('Simulated') ? appVariable.color.uavSimulatedColor : appVariable.color.uavColor;
    }

    function generateSvgIcon(color) {
      return `
<?xml version="1.0" encoding="utf-8"?>
<svg viewBox="36.7308 17.8368 417.8897 461.4893" width="30" height="30" xmlns="http://www.w3.org/2000/svg">
  <g transform="matrix(0, 0.036076001823, 0.032655000687, 0, -6152.413967591594, -6151.358362399477)" fill="${color}" stroke="none" style="transform-origin: 6398.09px 6399.94px;">
    <path d="M12316 12793 c-16 -3 -2759 -1370 -6096 -3038 -5803 -2901 -6069 -3036 -6110 -3082 -56 -63 -98 -154 -106 -229 -13 -121 39 -260 125 -336 35 -31 1508 -771 6106 -3070 5849 -2924 6062 -3029 6126 -3035 172 -15 325 75 403 237 28 59 31 73 30 160 0 79 -5 104 -26 150 -13 30 -894 1359 -1956 2953 l-1932 2897 1932 2897 c1062 1594 1943 2923 1957 2953 21 47 25 70 25 150 0 86 -3 101 -30 160 -83 175 -250 262 -448 233z"/>
  </g>
</svg>`;
    }

    function generatePopupContent(vehicle_info) {
      return `UAV: ${vehicle_info.drone_name} (SN: ${vehicle_info.drone_sn})<br>Connection: ${vehicle_info.drone_connection_status}<br>Altitude: ${vehicle_info.alt} m<br>Ground Speed: ${vehicle_info.groundspeed} km/h<br>Heartbeat Age: ${vehicle_info.heartbeat_age_s} s`;
    }

    function setMarkerRotation(marker, heading) {
      if (marker._icon) {
        marker._icon.style.transformOrigin = 'center';
        marker._icon.style.transform += ' rotate(' + heading + 'deg)';
      }
    }

    function updateMarkers() {
      Object.values(uavStore.uavs).forEach(uav => {
        const { vehicle_info } = uav;
        if (vehicle_info.drone_sn === "2310-XXXX") return;
        let marker = uavMarkers[vehicle_info.drone_sn];

        // Create or update the marker
        if (!marker) {
          marker = createMarker(vehicle_info);
          uavMarkers[vehicle_info.drone_sn] = marker;
          uavLayer.addLayer(marker);
        } else {
          marker.setIcon(L.divIcon({
            className: `uav-marker ${determineIconClass(vehicle_info)}`,
            html: generateSvgIcon(determineIconColor(vehicle_info)),
            iconSize: [30, 30]
          }));
          marker.setPopupContent(generatePopupContent(vehicle_info)); // Update the popup content
          updateMarkerPositionAndRotation(marker, vehicle_info);
        }

        // Manage visibility of the marker on the map
        if (uav.visible && !uavLayer.hasLayer(marker)) {
          uavLayer.addLayer(marker);
        } else if (!uav.visible && uavLayer.hasLayer(marker)) {
          uavLayer.removeLayer(marker);
        }
      });
    }

    onMounted(() => {
      watch([() => mapStore.sidePanel.isOpen, () => mapStore.sidePanel.layerName], ([isOpen, layerName]) => {
        if (isOpen && layerName === 'UAV') {
          uavPanelContent.value = {
            component: markRaw(V2airUAVLayerSidePanelContent),
            props: {}
          };
          mapStore.setSidePanelContent(uavPanelContent.value);
        }
      });

      watch(() => mapStore.isMapReady, (ready) => {
        if (ready && mapStore.map) {
          mapStore.addOverlayLayer('UAV Layer', uavLayer, 'fas fa-lg fa-fw me-2 fa-paper-plane', true, appVariable.color.uavColor);
          mapStore.map.addLayer(uavLayer);

          watch(
            () => uavStore.uavs,
            (uavs) => {
              updateMarkers();
            },
            { deep: true, immediate: true }
          );

          // watch(
          //   () => uavStore.activeUav,
          //   () => {
          //     updateMarkers();
          //   }
          // );
        }
      }, { immediate: true });
    });

    return {
      uavLayer
    };
  }
};
</script>

<style>
/* Add shadow to the marker */
.uav-marker {
  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.9));
}

.uav-tooltip {
  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.9));
}

.uav-real .uav-arrow {
  fill: var(--uavColor) !important;
}

.uav-simulated .uav-arrow {
  fill: var(--uavSimulatedColor) !important;
}
</style>
