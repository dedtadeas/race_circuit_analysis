// V2airDroneKitClientWrapper.ts

import { V2airDroneKitClient } from '@/proto_ts/v2air_drone_kit.client';
import {
    GeofenceDownloadResponse, GeofenceDownloadRequest,
    GeofenceUploadResponse, GeofenceUploadRequest,
    GeofenceClearRequest, GeofenceClearResponse,
    DroneMoveGoToGpsAndAltRequest, DroneMoveGoToGpsAndAltResponse,
    SetGuidedModeRequest, DroneMoveTakeOffRequest, DroneMoveChangeAltRequest,
    SetRtlModeRequest, SetGuidedModeResponse, DroneMoveTakeOffResponse,
    DroneMoveChangeAltResponse, SetRtlModeResponse
} from '@/proto_ts/v2air_drone_kit';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';

class V2airDroneKitClientWrapper {
    private client: V2airDroneKitClient;

    constructor(envoyUrl: string, droneSn: string) {
        const baseUrl = `${envoyUrl}/${droneSn}`;
        console.log('V2airDroneKitClientWrapper url', baseUrl);
        const transport = new GrpcWebFetchTransport({ baseUrl: `${envoyUrl}${droneSn}` });
        this.client = new V2airDroneKitClient(transport);
    }

    async setGuidedMode(): Promise<SetGuidedModeResponse> {
        const request: SetGuidedModeRequest = {};
        const { response } = await this.client.setGuidedMode(request);
        return response;
    }

    async takeOff(altitude: number, pilotConfirmRequired: boolean = true, playTune: boolean = true): Promise<DroneMoveTakeOffResponse> {
        const request: DroneMoveTakeOffRequest = { altitude, pilotConfirmRequired, playTune };
        const { response } = await this.client.droneMoveTakeoff(request);
        return response;
    }

    async changeAlt(alt: number): Promise<DroneMoveChangeAltResponse> {
        const request: DroneMoveChangeAltRequest = { alt };
        const { response } = await this.client.droneMoveChangeAlt(request);
        return response;
    }

    async setRtlMode(): Promise<SetRtlModeResponse> {
        const request: SetRtlModeRequest = {};
        const { response } = await this.client.setRtlMode(request);
        return response;
    }

    async droneMoveGoToGpsAndAlt(lat: number, lon: number, alt: number): Promise<DroneMoveGoToGpsAndAltResponse> {
        alt = Math.round(alt);
        const request: DroneMoveGoToGpsAndAltRequest = { lat, lon, alt };
        const { response } = await this.client.droneMoveGoToGpsAndAlt(request);
        return response;
    }

    async geofenceClear(): Promise<GeofenceClearResponse> {
        const request: GeofenceClearRequest = {};
        const { response } = await this.client.geofenceClear(request);
        return response;
    }

    async geofenceUpload(wktData: string): Promise<GeofenceUploadResponse> {
        const request: GeofenceUploadRequest = { wkt: wktData };
        const { response } = await this.client.geofenceUpload(request);
        return response;
    }

    async geofenceDownload(): Promise<string> {
        const request: GeofenceDownloadRequest = {};
        const call = this.client.geofenceDownload(request);
        const points: { lat: number, lon: number }[] = [];
        for await (const response of call.responses) {
            points.push({ lat: response.point.lat, lon: response.point.lon });
        }
        const wkt = `POLYGON((${points.map(p => `${p.lon} ${p.lat}`).join(', ')}))`;
        return wkt;
    }
}

export default V2airDroneKitClientWrapper;
