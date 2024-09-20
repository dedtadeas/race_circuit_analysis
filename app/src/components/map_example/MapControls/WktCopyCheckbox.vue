<template>
  <div class="leaflet-bottom leaflet-right">
    <div class="leaflet-control leaflet-bar">
      <label>
        <input type="checkbox" :checked="isCopyingEnabled" @change="updateCopyingEnabled"> Enable WKT Copy
      </label>
    </div>
  </div>
</template>

<script>
import { inject, watch } from 'vue';
import { useNotificationManager } from '@/composables/useNotificationManager'; // Adjust the path as necessary
import { useMap } from '@/stores/backend-map'; // Adjust the path as necessary     const { map } = useMap();

export default {
  name: 'WktCopyCheckbox',
  props: {
    isCopyingEnabled: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['update:isCopyingEnabled'],
  setup(props, { emit }) {
    const { map } = useMap();
    const isMapReady = inject('isMapReady');
    const { addToast } = useNotificationManager();

    const updateCopyingEnabled = (event) => {
      emit('update:isCopyingEnabled', event.target.checked);
    };

    const addClickListener = () => {
      if (map && map.value) {
        console.log('Adding map click listener');
        map.value.on('click', (e) => {
          if (props.isCopyingEnabled) {
            const wktString = `"POINT(${e.latlng.lng} ${e.latlng.lat})"`;
            navigator.clipboard.writeText(wktString)
              .then(() => {
                addToast({
                  title: 'Coords Copied to Clipboard',
                  message: wktString,
                  delay: 2000
                });
              })
              .catch(err => {
                addToast({
                  title: 'Error',
                  message: 'Failed to copy WKT coordinates to clipboard',
                  delay: 3000
                });
              });
          }
        });
      }
    };

    // Watch for the map to be ready
    watch(isMapReady, (newVal) => {
      if (newVal) {
        addClickListener();
      }
    }, { immediate: true });

    return {
      updateCopyingEnabled
    };
  }
};
</script>
