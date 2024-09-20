<template>
  <div class="map-control-panel">
    <Logo />
    <LayerControl />
  </div>
</template>

<script>
import Logo from './MapControlPanelComps/Logo.vue';
import LayerControl from './MapControlPanelComps/LayerControl.vue';

export default {
  name: 'MapControlPanel',
  components: {
    Logo,
    LayerControl,
  },
  methods: {
  },
};
</script>

<style scoped>
.map-control-panel {
  position: absolute;
  top: 0px;
  display: flex;
  right: 0px;
  z-index: 2000;
  padding: 10px;

  flex-direction: column;
  align-items: right;
}

.settings-button {
  position: relative;
  cursor: pointer;
  margin-bottom: 10px;
}
</style>
