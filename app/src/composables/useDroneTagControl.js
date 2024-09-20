import { useDroneTagStore } from '@/stores/backend-drone-tag';

export function useDroneTagControl() {
    const droneTagStore = useDroneTagStore();

    const updateDroneTagData = (data) => {
        droneTagStore.updateDroneTagData(data);
    };

    return {
        updateDroneTagData,
    };
}
