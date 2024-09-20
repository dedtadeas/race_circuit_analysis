<template>
  <div class="uav-list">
    <div class="uav-list-body border-theme">
      <table class="table table-striped">
        <thead class="table-dark">
          <tr>
            <th>Status</th>
            <th>SN</th>
            <th>Focus</th>
            <th>Visibility</th>
            <!-- <th>Actions</th> -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="drone in allDrones" :key="drone.vehicle_info.drone_sn" :class="{ 'drone-invisible': !drone.visible }">
            <td class="text-center">
              <span
                :style="{ 'background-color': getStatusColor(drone.vehicle_info.drone_connection_status) }"
                class="dot"
                :title="drone.vehicle_info.drone_connection_status"
              ></span>
            </td>
            <td class="text-center" @click.stop="toggleDroneDetail(drone.vehicle_info.drone_sn)">
              {{ drone.vehicle_info.drone_sn }}
            </td>
            <td class="text-center">
              <div class="icon-container">
              <i class="fas fa-lg fa-fw me-2 fa-crosshairs icon-hover" @click.stop="focusOnLatLonZoom(drone.vehicle_info.lat, drone.vehicle_info.lon, 19)"></i>
              </div>
            </td>
            <td class="text-center">
              <div class="icon-container" @click.stop="toggleVisibility(drone.vehicle_info.drone_sn)">
                <i :class="[drone.visible ? 'fas fa-lg fa-fw me-2 fa-eye icon-hover' : 'fas fa-lg fa-fw me-2 fa-eye-slash icon-hover']"></i>
              </div>
            </td>
            <!-- <td class="text-center">
              <terminate-button :drone-sn="drone.vehicle_info.drone_sn"></terminate-button>
            </td> -->
          </tr>
          <tr v-if="allDrones.length === 0">
            <td colspan="5" class="no-drones">No UAVs available.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { computed, ref, reactive, watch } from 'vue';
import { useV2airUavStore } from "@/stores/backend-uavs";
import { useMapStore } from "@/stores/backend-map";
import MapFocusControls from '@/components/map/MapControls/MapControls.vue';
import TerminateButton from '@/components/map/Buttons/TerminateButton.vue';

export default {
  name: 'V2airUAVsList',
  components: {
    TerminateButton,
  },
  setup() {
    const showInfo = ref(false);
    const mapStore = useMapStore();
    const uavStore = useV2airUavStore();
    const { focusOnLatLonZoom } = MapFocusControls.setup();

    const droneStates = reactive({});
    const uavLayerVisible = computed(() => {
      const uavLayer = mapStore.layers.find(layer => layer.name === 'UAV');
      return uavLayer ? uavLayer.visible : false;
    });

    const allDrones = computed(() => {
      return Object.values(uavStore.uavs)
        .sort((a, b) => (a.vehicle_info?.drone_sn || "").localeCompare(b.vehicle_info?.drone_sn || ""))
        .map((drone) => {
          if (!droneStates[drone.vehicle_info.drone_sn]) {
            droneStates[drone.vehicle_info.drone_sn] = { collapsed: true };
          }
          return drone;
        });
    });

    const allVisible = computed(() => {
      return allDrones.value.every(drone => drone.visible);
    });

    const toggleInfo = () => {
      showInfo.value = !showInfo.value;
    };

    const toggleUavLayer = () => {
      const uavLayer = mapStore.layers.find(layer => layer.name === 'UAV');
      if (uavLayer) {
        mapStore.toggleLayer(uavLayer);
      }
    };

    const toggleDroneDetail = (droneSn) => {
      if (!droneStates[droneSn]) {
        droneStates[droneSn] = { collapsed: true };
      }
      droneStates[droneSn].collapsed = !droneStates[droneSn].collapsed;
    };

    const toggleVisibility = (droneSn) => {
      const visible = uavStore.uavs[droneSn]?.visible;
      if (visible !== undefined) {
        uavStore.toggleVisibility(droneSn);
        if (droneStates[droneSn]) {
          droneStates[droneSn].visible = !visible;
        }
      }
    };

    const toggleAllVisibility = () => {
      const visibility = !allVisible.value;
      allDrones.value.forEach((drone) => {
        uavStore.setVisibility(drone.vehicle_info.drone_sn, visibility);
        if (droneStates[drone.vehicle_info.drone_sn]) {
          droneStates[drone.vehicle_info.drone_sn].visible = visibility;
        }
      });
    };

    const getStatusColor = (status) => {
      switch (status) {
        case "online":
          return "green";
        case "offline":
          return "red";
        default:
          return "gray";
      }
    };

    return {
      showInfo,
      focusOnLatLonZoom,
      droneStates,
      allDrones,
      toggleInfo,
      toggleDroneDetail,
      toggleVisibility,
      toggleAllVisibility,
      getStatusColor,
      allVisible,
      toggleUavLayer,
      uavLayerVisible,
    };
  },
};
</script>

<style scoped>
.uav-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-icon {
  cursor: pointer;
  color: var(--bg-theme);
}

.uav-info {
  margin-top: 10px;
  padding: 10px;
  border-radius: 5px;
  font-size: 14px;
}

.uav-list-body {
  padding: 0;
  display: flex;
  flex-direction: column;
}

.header-buttons {
  display: flex;
  flex-direction: row;
  gap: 10px;
}

.table th, .table td {
  text-align: center;
  vertical-align: middle; /* Center alignment for table cells */
}

.no-drones {
  color: #888;
  padding: 10px;
  text-align: center;
}

.dot {
  height: 10px;
  width: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
}

.icon-container {
  cursor: pointer;
}

.icon-hover {
  transition: transform 0.2s ease;
}

.icon-hover:hover {
  transform: scale(1.2); /* Enlarge the icon slightly on hover */
}
</style>
