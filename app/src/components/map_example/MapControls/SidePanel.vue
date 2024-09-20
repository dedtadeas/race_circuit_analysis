<template>
  <div :class="['side-panel', { 'side-panel-open': isOpen }]">
    <div class="side-panel-header">
      <button @click="closePanel" class="close-button">&times;</button>
    </div>
    <div class="side-panel-content">
      <slot></slot>
      <component :is="sidePanelContent.component" v-bind="sidePanelContent.props" v-if="sidePanelContent" />
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useMapStore } from '@/stores/backend-map';

export default {
  name: 'SidePanel',
  setup() {
    const mapStore = useMapStore();

    const isOpen = computed(() => mapStore.sidePanel.isOpen);
    const sidePanelContent = computed(() => mapStore.sidePanel.content);

    const closePanel = () => {
      mapStore.setSidePanelOpen(false);
    };

    return {
      isOpen,
      closePanel,
      sidePanelContent
    };
  }
};
</script>

<style scoped>
.side-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 25%;
  height: 100%;
  background-color: var(--bs-secondary-bg);
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
  z-index: 900;
  transition: transform 0.3s ease-in-out;
  transform: translateX(100%);
}

.side-panel-open {
  transform: translateX(0);
}

.side-panel-header {
  display: flex;
  justify-content: flex-end;
  padding: 10px;
}

.side-panel-content {
  padding: 10px;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}
</style>
