import axios from 'axios';
import config from '@/config';
import { useADSBStore } from '@/stores/backend-adsb';

export function useADSBControl() {
    const adsbStore = useADSBStore();

    const updateADSBData = (data) => {
        adsbStore.updateADSBData(data);
    };

    const updateAreaOfInterestData = (data) => {
        adsbStore.updateAreaOfInterestData(data);
    };

    return {
        updateADSBData,
        updateAreaOfInterestData,
    };
}
