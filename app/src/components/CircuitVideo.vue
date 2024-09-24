<template>
  <div v-if="videos && videos.length" class="mt-3">
    <h3>YouTube Videos</h3>
    <div v-for="(video, index) in videos" :key="index" class="mb-3">
      <card class="p-5px">
        <div style="max-height: 250px" class="overflow-hidden z-1">
          <img src="/assets/img/gallery/widget-cover-1.jpg" alt="Video Thumbnail" class="card-img">
        </div>
        <card-img-overlay class="d-flex flex-column bg-gray-700 bg-opacity-75 m-5px z-2" data-bs-theme="dark">
          <div class="flex-fill">
            <div class="d-flex align-items-center">
              <h6>YouTube</h6>
              <div class="dropdown dropdown-icon ms-auto">
                <a href="#" class="text-white" data-bs-toggle="dropdown">
                  <i class="fa fa-ellipsis-h"></i>
                </a>
                <div class="dropdown-menu dropdown-menu-end" data-bs-theme="light">
                  <a :href="video.url" class="dropdown-item" target="_blank">View</a>
                </div>
              </div>
            </div>
          </div>
          <div>
            <a :href="video.url" class="text-white text-decoration-none d-flex align-items-center" target="_blank">
              <div class="bg-gradient-blue-cyan w-50px h-50px rounded-3 d-flex align-items-center justify-content-center">
                <i class="fa fa-play fa-lg"></i>
              </div>
              <div class="ms-3 flex-1">
                <div class="fw-bold">{{ video.title }}</div>
                <div class="fs-13px text-inverse text-opacity-75">
                  <i class="far fa-eye"></i> {{ video.views }} views 
                  <i class="far fa-clock ms-3"></i> {{ video.time }}
                </div>
              </div>
            </a>
          </div>
        </card-img-overlay>
      </card>
    </div>
  </div>
</template>

<script>
import 'lity';
import 'lity/dist/lity.min.css';
export default {
  name: 'CircuitVideo',
  props: {
    videos: {
      type: Array,
      required: true
    }
  }
}
</script>
