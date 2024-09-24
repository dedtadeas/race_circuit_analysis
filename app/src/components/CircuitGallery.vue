<template>
  <div v-if="images && images.length" id="imageListWidget" class="mb-5">
    <card>
      <card-body>
        <div class="row">
          <div class="col-xl-8">
            <card>
              <div class="list-group list-group-flush">
                <a href="#" class="list-group-item list-group-item-action d-flex align-items-center text-inverse">
                  <div class="flex-fill pe-3">
                    <div class="fw-bold">Library ({{ images.length }})</div>
                    <div class="small text-inverse text-opacity-50">{{ images.length * 10 }} Images Found</div>
                  </div>
                  <div>
                    <i class="fa fa-chevron-right fa-lg text-inverse text-opacity-50"></i>
                  </div>
                </a>
              </div>
              <hr class="m-0">
              <card-body>
                <div class="widget-img-list">
                  <div v-for="(image, index) in images" :key="index" class="widget-img-list-item">
                    <a :href="image" data-lity>
                      <span class="img" :style="{ backgroundImage: 'url(' + image + ')' }"></span>
                    </a>
                  </div>
                </div>
              </card-body>
            </card>
          </div>
        </div>
      </card-body>
    </card>
  </div>
</template>

<script>
import 'lity';
import 'lity/dist/lity.min.css';
export default {
  name: "CircuitGallery",
  props: {
    images: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.widget-img-list {
  display: flex;
  flex-wrap: wrap;
}

.widget-img-list-item {
  margin: 5px;
  width: 100px; /* Adjust as necessary */
  height: 100px; /* Adjust as necessary */
  background-size: cover;
  background-position: center;
  cursor: pointer; /* Indicate clickable */
}
</style>
