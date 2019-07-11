<template>
  <div class="modal" v-if="show">
    <div>
      <div>
        <img id="imageView" :src="imageSrc" @load="resizeImage" @click="closeModal" />
      </div>
      <div>
        <center>
          <button @click="closeModal">
            <v-icon x-large dark>close</v-icon>
          </button>
          <button @click="showFullSizeImage">
            <v-icon x-large dark>fullscreen</v-icon>
          </button>
        </center>
      </div>
    </div>
  </div>
</template>

<script>
const MAX_WIDTH = 700;
const MAX_HEIGHT = 700;
export default {
  components: {},
  data() {
    return {
      imageSrc: null,
      show: false
    };
  },
  methods: {
    showModal(imageSrc) {
      this.imageSrc = imageSrc;
      this.show = true;

      //console.log("width : " + imageView.width);
      //console.log("height : " + imageView.getAttribute("height"));
    },
    closeModal() {
      this.imageSrc = "";
      this.show = false;
    },
    resizeImage() {
      var imageView = document.getElementById("imageView");
      var originalWidth = imageView.width;
      var originalHeight = imageView.height;
      var scale = 0.0;
      if (originalWidth <= MAX_WIDTH && originalHeight <= MAX_HEIGHT) return;
      if (originalWidth < originalHeight) {
        imageView.height = Math.min(originalHeight, MAX_HEIGHT);
        scale = imageView.height / originalHeight;
        imageView.width = originalWidth * scale;
      } else {
        imageView.width = Math.min(originalWidth, MAX_WIDTH);
        scale = imageView.width / originalWidth;
        imageView.height = originalHeight * scale;
      }
    },
    showFullSizeImage() {
      var fileName = this.imageSrc.toString();
      fileName = fileName.split("%2F")[1].split("?")[0];
      let routeData = this.$router.resolve({
        name: "fullSizeImageViewer",
        params: { imgSrc: fileName }
      });
      window.open(routeData.href, "_blank","location=no");
    }
  }
};
</script>
<style scoped>
.modal {
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>