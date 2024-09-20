<script>
import { defineComponent, inject, watch, reactive, onUnmounted, ref } from 'vue';
import { useV2airUavStore } from "@/stores/backend-uavs";
import L from 'leaflet';
import { useMap } from '@/stores/backend-map'; // Adjust the path as necessary     const { map } = useMap();

export default defineComponent({
    name: 'UAVsVolumeLayerManager',
    setup() {
        const store = useV2airUavStore();
        const { map } = useMap();
        const v2airUAVsVolumeLayer = inject('v2airUAVsVolumeLayer');

        // Local reactive state to store references to the layer objects
        const layerRefs = reactive({});
        // Storing previous states to check for changes
        const prevStates = ref({});

        watch(() => store.uavs, (newUavs) => {
            Object.keys(newUavs).forEach(droneSn => {
                const uav = newUavs[droneSn];
                const prevState = prevStates.value[droneSn] || {};

                const currentFlightPlanDataJSON = uav.flightPlanData ? JSON.stringify(uav.flightPlanData) : null;
                const previousFlightPlanDataJSON = prevState.flightPlanDataJSON;

                // Check if there's a change in flightPlanData or volumesVisible
                if (uav.volumesVisible !== prevState.volumesVisible || currentFlightPlanDataJSON !== previousFlightPlanDataJSON) {
                    if (!uav.volumesVisible) {
                        if (layerRefs[droneSn]) {
                            for (const layer of Object.values(layerRefs[droneSn])) {
                                v2airUAVsVolumeLayer.value.removeLayer(layer);
                            }
                            delete layerRefs[droneSn];
                        }
                    } else if (uav.flightPlanData) {
                        if (layerRefs[droneSn]) {
                            //remove the old layers
                            for (const layer of Object.values(layerRefs[droneSn])) {
                                v2airUAVsVolumeLayer.value.removeLayer(layer);
                            }
                            console.log('Updating volume layer for drone:', droneSn);
                            // Create layers for polygons other than type 1
                            const regularPolygons = L.geoJSON(uav.flightPlanData, {
                                style: (feature) => {
                                    return {
                                        color: feature.properties.color || '#ff7AAA',
                                        weight: 3,
                                        opacity: 0.4,
                                        fillOpacity: 0.4 
                                    };
                                },
                                filter: (feature) => {
                                    return feature.geometry.type === 'Polygon' && feature.properties.type !== 1;
                                }
                            }).addTo(v2airUAVsVolumeLayer.value);

                            // Create a separate layer for type 1 polygons to ensure it's on top
                            const typeOnePolygons = L.geoJSON(uav.flightPlanData, {
                                style: (feature) => {
                                    return {
                                        color: '#000000', // Border color for type 1
                                        weight: 2,
                                        opacity: 1,
                                        fillOpacity: 0 // No fill for type 1 polygons
                                    };
                                },
                                filter: (feature) => {
                                    return feature.geometry.type === 'Polygon' && feature.properties.type === 1;
                                }
                            }).addTo(v2airUAVsVolumeLayer.value);

                            // Store references to the new layers
                            layerRefs[droneSn] = {
                                regular: regularPolygons,
                                typeOne: typeOnePolygons
                            };
                        } else {
                            console.log('Creating volume layer for drone:', droneSn);
                            // Create layers for polygons other than type 1
                            const regularPolygons = L.geoJSON(uav.flightPlanData, {
                                style: (feature) => {
                                    return {
                                        color: feature.properties.color || '#ff7AAA',
                                        weight: 3,
                                        opacity: 0.4,
                                        fillOpacity: 0.4 
                                    };
                                },
                                filter: (feature) => {
                                    return feature.geometry.type === 'Polygon' && feature.properties.type !== 1;
                                }
                            }).addTo(v2airUAVsVolumeLayer.value);

                            // Create a separate layer for type 1 polygons to ensure it's on top
                            const typeOnePolygons = L.geoJSON(uav.flightPlanData, {
                                style: (feature) => {
                                    return {
                                        color: '#000000', // Border color for type 1
                                        weight: 2,
                                        opacity: 1,
                                        fillOpacity: 0 // No fill for type 1 polygons
                                    };
                                },
                                filter: (feature) => {
                                    return feature.geometry.type === 'Polygon' && feature.properties.type === 1;
                                }
                            }).addTo(v2airUAVsVolumeLayer.value);

                            // Store references to the new layers
                            layerRefs[droneSn] = {
                                regular: regularPolygons,
                                typeOne: typeOnePolygons
                            };
                        }
                    }
                    // Update previous state for this drone
                    prevStates.value[droneSn] = {
                        volumesVisible: uav.volumesVisible,
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
