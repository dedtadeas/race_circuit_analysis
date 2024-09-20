<script>
import { defineComponent, inject, watch, reactive, onUnmounted, ref } from 'vue';
import { useV2airUavStore } from "@/stores/backend-uavs";
import L from 'leaflet';
import { useMap } from '@/stores/backend-map'; // Adjust the path as necessary     const { map } = useMap();

export default defineComponent({
    name: 'UAVsWaypointsPathLayerManager',
    setup() {
        const store = useV2airUavStore();
        const { map } = useMap();
        const v2airUAVsWaypointsPathLayer = inject('v2airUAVsWaypointsPathLayer');

        // Local reactive state to store references to the waypoint path layers
        const layerRefs = reactive({});
        // Storing previous states to check for changes
        const prevStates = ref({});

        watch(() => store.uavs, (newUavs) => {
            Object.keys(newUavs).forEach(droneSn => {
                const uav = newUavs[droneSn];
                const prevState = prevStates.value[droneSn] || {};

                const currentFlightPlanDataJSON = uav.flightPlanData ? JSON.stringify(uav.flightPlanData) : null;
                const previousFlightPlanDataJSON = prevState.flightPlanDataJSON;

                // Check if there's a change in flightPlanData or waypointsVisible
                if (uav.waypointsVisible !== prevState.waypointsVisible || currentFlightPlanDataJSON !== previousFlightPlanDataJSON) {
                    if (!uav.waypointsVisible) {
                        if (layerRefs[droneSn]) {
                            v2airUAVsWaypointsPathLayer.value.removeLayer(layerRefs[droneSn]);
                            delete layerRefs[droneSn];
                        }
                    } else if (uav.flightPlanData) {
                        if (layerRefs[droneSn]) {
                            // Remove the old layer
                            v2airUAVsWaypointsPathLayer.value.removeLayer(layerRefs[droneSn]);
                            console.log('Updating waypoint path layer for drone:', droneSn);
                        }
                        // Add new waypoint path layer
                        // Add dashed line style
                        const layer = L.geoJSON(uav.flightPlanData, {
                            style: (feature) => ({
                                color: feature.properties.color || '#0078A8', // Default color
                                weight: 4,
                                opacity: 0.75,
                                dashArray: '10, 30'
                            }),
                            filter: feature => feature.geometry.type === 'LineString'
                        }).addTo(v2airUAVsWaypointsPathLayer.value);
                        layerRefs[droneSn] = layer;
                    }
                    // Update previous state for this drone
                    prevStates.value[droneSn] = {
                        waypointsVisible: uav.waypointsVisible,
                        flightPlanDataJSON: currentFlightPlanDataJSON  // Store the serialized form
                    };
                }
            });
        }, { deep: true });

        onUnmounted(() => {
            Object.values(layerRefs).forEach(layer => {
                if (map.value.hasLayer(layer)) {
                    map.value.removeLayer(layer);
                }
            });
        });

        return {};
    }
});
</script>
