<template>
  <div class="layer-sidepanel-content-top">
    <div class="header mb-3">
      <h2>{{ title }}</h2>
      <div class="header-buttons">
        <i class="fas fa-info-circle info-icon" @click="toggleInfo"></i>
      </div>
      <button
        type="button"
        class="btn btn-outline-default btn-sm btn-outline-yellow"
        @click="toggleLayer"
      >
        {{ layerVisible ? 'Turn ' + title + ' OFF' : 'Turn ' + title + ' ON' }}
      </button>
    </div>
    <hr class="mb-3" />
    <p v-if="showInfo" class="layer-info">
      {{ infoText }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'LayerSidePanelContentTop',
  props: {
    title: {
      type: String,
      required: true
    },
    infoText: {
      type: String,
      required: true
    },
    layerVisible: {
      type: Boolean,
      required: true
    },
    toggleLayer: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      showInfo: false
    };
  },
  methods: {
    toggleInfo() {
      this.showInfo = !this.showInfo;
    }
  }
};
</script>

<style scoped>
.layer-sidepanel-content-top {
  width: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  margin: 0;
}

.header-buttons {
  display: flex;
  align-items: center;
}

.info-icon {
  cursor: pointer;
  background-color: -var(--bg-color);
}

.layer-info {
  margin-top: 10px;
}
</style>
