<template>
  <div class="modal fade" id="settingsModal" tabindex="-1" aria-labelledby="settingsModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="settingsModalLabel">Map Settings</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <card>
            <card-header class="card-header fw-bold small">ADS-B Layer</card-header>
            <card-body>
              <p>Set the area of interest for ADS-B data to current map view.</p>
              <UpdateADSBAreaOfInterestButton />
            </card-body>
          </card>

          <card>
            <card-header class="card-header fw-bold small">Other</card-header>
            <card-body>
              <p>Other settings go here.</p>
            </card-body>
          </card>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UpdateADSBAreaOfInterestButton from '@/components/map/Buttons/UpdateADSBAreaOfInterestButton.vue';

export default {
  name: 'SettingsModal',
  components: {
    UpdateADSBAreaOfInterestButton,
  },
};
</script>
