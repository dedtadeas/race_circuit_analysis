import axios from 'axios';
import config from '@/config';
import { useV2airUavStore } from '@/stores/backend-uavs';
import { useAppOptionStore } from '@/stores/app-option';
import V2airDroneKitClientWrapper from '@/grpc/grpcClientWrapper';

export function useUavControl() {
    const uavStore = useV2airUavStore();
    const appOptionStore = useAppOptionStore();

    // Function to transform the UAV data as needed
    const transformUavData = (data) => {
        if (data.vehicle_info.groundspeed) {
            // Convert groundspeed from m/s to km/h
            data.vehicle_info.groundspeed = (data.vehicle_info.groundspeed * 3.6).toFixed(2);
        }
        if (data.vehicle_info.alt) {
            // Fix altitude precision
            data.vehicle_info.alt = data.vehicle_info.alt.toFixed(2);
        }
        return data;
    };

    // Function to get the gRPC client for a specific drone serial number
    const getClient = (droneSn) => {
        return new V2airDroneKitClientWrapper(config['grpcWebProxyUrl'], droneSn);
    };

    // Function to update the UAV data in the store
    const updateUavData = (newData) => {
        const activeUav = uavStore.activeUav;

        // Transform the incoming data for consistency
        newData = transformUavData(newData);
        const droneSn = newData?.vehicle_info?.drone_sn;

        if (droneSn) {
            const defaults = {
                visible: true,
                simulated: false,
                volumesVisible: true,
                waypointsVisible: true,
                geofence_info: { geometry_wkt: null, enabled: false },
            };
            const existingUav = uavStore.uavs[droneSn] || {};
            const isSimulated = newData.vehicle_info.drone_name.startsWith('Simulated');

            // Check if the UAV is simulated and not in test mode
            if (!appOptionStore.testMode && isSimulated) {
                console.log('Ignoring simulated UAV:', droneSn);
                return;
            }

            // console.log('Updating UAV:', droneSn, newData);

            // Update the UAV data in the store
            uavStore.uavs[droneSn] = {
                ...defaults,
                ...existingUav,
                ...newData,
                simulated: isSimulated,
                visible: existingUav.visible ?? (isSimulated ? config.simulated_uavs_visible_default : true),
                volumesVisible: existingUav.volumesVisible ?? true,
                waypointsVisible: existingUav.waypointsVisible ?? true,
                geofence_info: existingUav.geofence_info ?? defaults.geofence_info,
            };

            // Update status text FIFO
            if (newData.vehicle_info.status_text) {
                // console.log('Updating status text:', droneSn, newData.vehicle_info.status_text);
                uavStore.updateStatusText(droneSn, newData.vehicle_info.status_text);
            }

            // Check if a gRPC client exists for this UAV and create one if not
            const droneConfig = config.droneConnection.find(drone => drone.sn === droneSn);
            if (droneConfig) {
                if (!uavStore.uavs[droneSn].grpClient) {
                    console.log('Creating new grpc client for:', droneSn);
                    uavStore.uavs[droneSn].grpClient = getClient(droneSn);
                    console.log('grpc client created:', uavStore.uavs[droneSn].grpClient);
                }
            }
        }
    };

    return {
        transformUavData,
        updateUavData,
    };
}
