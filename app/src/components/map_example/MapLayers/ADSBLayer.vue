<template>
  <div></div>
</template>

<script>
import { watch, onMounted, nextTick, ref, markRaw } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMapStore } from '@/stores/backend-map';
import { useADSBStore } from '@/stores/backend-adsb';
import ADSBLayerPanelContent from './SidePanelContents/ADSBLayerSidePanelContent.vue';
import { useAppVariableStore } from '@/stores/app-variable';

const appVariable = useAppVariableStore();

export default {
  name: 'ADSBLayer',
  components: {
    ADSBLayerPanelContent
  },
  setup() {
    const mapStore = useMapStore();
    const adsbStore = useADSBStore();
    const adsbLayer = L.layerGroup();
    const aircraftMarkers = {};
    let currentCircle = null;
    let currentCircleCenter = null;
    let isFirstLoad = true;
    const adsbPanelContent = ref(null); // New reactive property for the side panel content

    function updateMarkers(data) {
      if (!data) {
        console.error('No ADS-B data available to update markers.');
        return;
      }

      Object.keys(aircraftMarkers).forEach((icao) => {
        if (!data[icao]) {
          adsbLayer.removeLayer(aircraftMarkers[icao]);
          delete aircraftMarkers[icao];
        }
      });

      Object.entries(data).forEach(([icao, aircraft]) => {
        if (aircraft && aircraft.latitude && aircraft.longitude) {
          if (aircraftMarkers[icao]) {
            aircraftMarkers[icao].setLatLng([aircraft.latitude, aircraft.longitude]);
            setMarkerRotation(aircraftMarkers[icao], aircraft.heading);
          } else {
            aircraftMarkers[icao] = createMarker(aircraft);
          }
        }
      });
    }

    function generateAircraftSvgIcon() {
      return `
        <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
         width="30" height="30" viewBox="0 0 512.000000 512.000000"
         preserveAspectRatio="xMidYMid meet">
          <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
          fill="${appVariable.color.adsbColor}" stroke="none">
            <path d="M2484 5091 c-101 -26 -194 -102 -241 -199 l-28 -57 -3 -750 -3 -750
            -1085 -694 c-597 -382 -1094 -706 -1105 -719 -18 -23 -19 -43 -19 -272 0 -233
            1 -249 20 -273 11 -14 33 -28 48 -32 31 -6 18 -11 1377 479 l760 273 3 -599
            c2 -468 -1 -606 -11 -626 -7 -15 -100 -100 -207 -190 -107 -89 -221 -185 -252
            -213 l-58 -50 0 -179 0 -178 31 -26 c17 -14 38 -26 48 -26 10 0 191 52 403
            115 212 63 392 115 399 115 8 0 188 -52 402 -116 258 -77 396 -114 412 -110
            13 3 34 16 45 28 19 20 20 35 20 199 l0 178 -57 50 c-32 28 -146 124 -253 213
            -107 90 -200 175 -207 190 -10 20 -13 158 -11 626 l3 600 1054 -379 c813 -293
            1061 -378 1082 -374 16 4 38 18 49 32 19 24 20 40 20 275 l0 250 -32 32 c-18
            17 -515 339 -1105 716 l-1072 685 -3 755 -3 755 -29 58 c-57 112 -172 187
            -295 193 -36 2 -80 0 -97 -5z"/>
          </g>
        </svg>`;
    }

    function generateAircraftSvgMenuIcon() {
      return `<svg viewBox="4.6531 13.1835 485.298 480.2253" width="485.298" height="480.2253" xmlns="http://www.w3.org/2000/svg">
          <g transform="matrix(0, 0.093794003129, 0.095404013991, 0, -2312.698305046375, -2300.083740234375)" fill="${appVariable.color.adsbColor}" stroke="none" style="transform-origin: 2560px 2553.38px;">
            <path d="M2484 5091 c-101 -26 -194 -102 -241 -199 l-28 -57 -3 -750 -3 -750&#10;            -1085 -694 c-597 -382 -1094 -706 -1105 -719 -18 -23 -19 -43 -19 -272 0 -233&#10;            1 -249 20 -273 11 -14 33 -28 48 -32 31 -6 18 -11 1377 479 l760 273 3 -599&#10;            c2 -468 -1 -606 -11 -626 -7 -15 -100 -100 -207 -190 -107 -89 -221 -185 -252&#10;            -213 l-58 -50 0 -179 0 -178 31 -26 c17 -14 38 -26 48 -26 10 0 191 52 403&#10;            115 212 63 392 115 399 115 8 0 188 -52 402 -116 258 -77 396 -114 412 -110&#10;            13 3 34 16 45 28 19 20 20 35 20 199 l0 178 -57 50 c-32 28 -146 124 -253 213&#10;            -107 90 -200 175 -207 190 -10 20 -13 158 -11 626 l3 600 1054 -379 c813 -293&#10;            1061 -378 1082 -374 16 4 38 18 49 32 19 24 20 40 20 275 l0 250 -32 32 c-18&#10;            17 -515 339 -1105 716 l-1072 685 -3 755 -3 755 -29 58 c-57 112 -172 187&#10;            -295 193 -36 2 -80 0 -97 -5z"/>
          </g>
          </svg>`;
    }


    function createMarker(aircraft) {
      if (!aircraft || !aircraft.latitude || !aircraft.longitude) {
        console.error('Invalid aircraft data:', aircraft);
        return null;
      }

      const svgIcon = generateAircraftSvgIcon();

      const icon = L.divIcon({
        className: 'adsb-marker-icon',
        html: svgIcon,
        iconSize: [30, 30]
      });

      const marker = L.marker([aircraft.latitude, aircraft.longitude], {
        icon: icon,
        rotationAngle: aircraft.heading || 0,
        rotationOrigin: 'center center'
      });

      marker.bindPopup(`Aircraft Code: ${aircraft.aircraft_code}<br>Registration: ${aircraft.registration}<br>Type: ${aircraft.type}<br>Altitude: ${aircraft.altitude_m} m`, {
        closeButton: true,
        autoClose: true,
        closeOnClick: true,
        className: 'custom-popup'
      });
      // marker.on('mouseover', function () {
      //   this.openPopup();
      // });
      // marker.on('mouseout', function () {
      //   this.closePopup();
      // });
      adsbLayer.addLayer(marker);

      nextTick(() => {
        setMarkerRotation(marker, aircraft.heading);
      });

      return marker;
    }

    function setMarkerRotation(marker, heading) {
      if (marker._icon) {
        marker._icon.style.transformOrigin = 'center';
        marker._icon.style.transform += ' rotate(' + heading + 'deg)';
      }
    }

    function getIconSizeInPixels(map, latLng, meters) {
      const pointA = map.latLngToLayerPoint(latLng);
      const latLngB = L.latLng(latLng.lat, latLng.lng + (meters / 111319.9)); // 111319.9 meters = 1 degree of longitude
      const pointB = map.latLngToLayerPoint(latLngB);
      const distanceInPixels = pointA.distanceTo(pointB);
      return distanceInPixels * 2; // Diameter
    }

    function createSvgIcon(width, height, lineAttrs) {
      return `
        <svg width="${width}" height="${height}" viewBox="0 0 100 100" style="position: absolute; pointer-events: none; opacity: 0.8;">
          <line ${lineAttrs} style="stroke:#1a50db; stroke-width:2; pointer-events: all;" class="custom-cross-icon-line"/>
        </svg>`;
    }


    function updateCircleCenterIconSize() {
      if (currentCircleCenter) {
        const spread = 100; // Spread in meters
        const iconSize = getIconSizeInPixels(mapStore.map, currentCircleCenter.getLatLng(), spread); // Adjust the size here if needed

        const horizontalLineIconHtml = createSvgIcon(iconSize, iconSize, 'x1="0" y1="50" x2="100" y2="50"');
        const verticalLineIconHtml = createSvgIcon(iconSize, iconSize, 'x1="50" y1="0" x2="50" y2="100"');

        const horizontalIcon = L.divIcon({
          className: 'custom-horizontal-cross-icon',
          html: horizontalLineIconHtml,
          iconSize: [iconSize, iconSize],
          iconAnchor: [iconSize / 2, iconSize / 2],
        });

        const verticalIcon = L.divIcon({
          className: 'custom-vertical-cross-icon',
          html: verticalLineIconHtml,
          iconSize: [iconSize, iconSize],
          iconAnchor: [iconSize / 2, iconSize / 2],
        });

        if (currentCircleCenter.horizontalMarker) {
          currentCircleCenter.horizontalMarker.setIcon(horizontalIcon);
        } else {
          currentCircleCenter.horizontalMarker = L.marker(currentCircleCenter.getLatLng(), { icon: horizontalIcon, interactive: false }).addTo(adsbLayer);
        }

        if (currentCircleCenter.verticalMarker) {
          currentCircleCenter.verticalMarker.setIcon(verticalIcon);
        } else {
          currentCircleCenter.verticalMarker = L.marker(currentCircleCenter.getLatLng(), { icon: verticalIcon, interactive: false }).addTo(adsbLayer);
        }

        // Add event listeners to the custom icon lines
        nextTick(() => {
          const customCrossIconLines = document.querySelectorAll('.custom-cross-icon-line');
          customCrossIconLines.forEach(line => {
            line.addEventListener('mouseenter', () => {
              currentCircleCenter.openPopup();
            });
            line.addEventListener('mouseleave', () => {
              currentCircleCenter.closePopup();
            });
          });
        });
      }
    }


    function updateAreaOfInterest(newVal) {
      console.log('Area of interest changed:', newVal);
      if (currentCircle) {
        adsbLayer.removeLayer(currentCircle);
        adsbLayer.removeLayer(currentCircleCenter);
      }
      if (newVal && newVal.radius_m && newVal.lat && newVal.lon) {
        currentCircle = L.circle([newVal.lat, newVal.lon], {
          radius: newVal.radius_m,
          color: '#1a50db',
          fillColor: 'none',
          fillOpacity: 0
        });
        currentCircle.addTo(adsbLayer);
        
        currentCircle.bindPopup(`ADSB Area of Interest<br>Radius: ${newVal.radius_m} m`, {
          closeButton: false,
          autoClose: false,
          closeOnClick: false,
          className: 'custom-popup'
        });
        currentCircle.on('mouseover', function () {
          this.openPopup();
        });
        currentCircle.on('mouseout', function () {
          this.closePopup();
        });

        currentCircleCenter = L.marker([newVal.lat, newVal.lon], {
          icon: L.divIcon({ 
            className: 'custom-cross-icon',
            html: '<div style="border: 1px solid black;"></div>',
            iconSize: [0, 0], 
            iconAnchor: [0, 0]
          })
        });
        currentCircleCenter.bindPopup(`ADSB Area of Interest - Center`, {
          closeButton: false,
          autoClose: false,
          closeOnClick: false,
        });
        currentCircleCenter.addTo(adsbLayer);
        updateCircleCenterIconSize();
        mapStore.map.on('zoomend', updateCircleCenterIconSize);
      }
    }

    onMounted(() => {
      watch([() => mapStore.sidePanel.isOpen, () => mapStore.sidePanel.layerName], ([isOpen, layerName]) => {
        if (isOpen && layerName === 'ADSB') {
          adsbPanelContent.value = {
            component: markRaw(ADSBLayerPanelContent),
            props: {}
          };
          mapStore.setSidePanelContent(adsbPanelContent.value);
        }
      });

      watch(() => mapStore.isMapReady, (newValue) => {
        if (newValue) {
          const menuSVGicon = generateAircraftSvgMenuIcon()
          mapStore.addOverlayLayer('ADSB Layer', adsbLayer, 'fas fa-lg fa-fw me-2 fa-plane', true, appVariable.color.adsbColor);
          mapStore.map.addLayer(adsbLayer);

          watch(() => adsbStore.adsbData, updateMarkers, { deep: true });

          if (adsbStore.adsbData && Object.keys(adsbStore.adsbData).length > 0) {
            updateMarkers(adsbStore.adsbData);
          }

          watch(() => adsbStore.visible, (newVal) => {
            if (newVal) {
              adsbLayer.addTo(mapStore.map);
            } else {
              mapStore.map.removeLayer(adsbLayer);
            }
          }, { immediate: true });

          watch(() => adsbStore.adsbAreaOfInterestData, (newVal) => {
            updateAreaOfInterest(newVal);
          }, { deep: true });

          if (isFirstLoad && adsbStore.adsbAreaOfInterestData) {
            updateAreaOfInterest(adsbStore.adsbAreaOfInterestData);
            isFirstLoad = false;
          }
        }
      }, { immediate: true });
    });

    return {
      adsbLayer
    };
  }
};
</script>

<style>
.adsb-marker-icon {
  filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.6));
}
</style>
