<template>
  <div>
    <ImageViewerModal ref="ImageViewerModal" />
    <div>
      <span v-for="item in viewImageUrls">
        <img v-bind:src="item" width="300px" height="200px" @click="showImage(item)" />&nbsp;&nbsp;&nbsp;
      </span>
      <infinite-loading @infinite="infiniteHandler"></infinite-loading>
    </div>
  </div>
</template>

<script>
const BASE_FIREBASE_STORAGE_URL =
  "https://firebasestorage.googleapis.com/v0/b/hppk-robocup-2019.appspot.com/o/";
const BASE_FIREBASE_STORAGE_URL_SUFFIX = "?alt=media";
import InfiniteLoading from "vue-infinite-loading";
import ImageViewerModal from "./ImageViewer";

export default {
  components: { InfiniteLoading, ImageViewerModal},
  data() {
    return {
      viewImageUrls: [],
      totalImageUrls: [],
      index: null,
      list: []
    };
  },
  created() {
    var imageUrls = this.totalImageUrls;
    var storageRef = firebase.storage().ref("/images");
    this.image = storageRef.list().then(function(result) {
      result.items.forEach(function(imageRef) {
        if(imageRef.fullPath.indexOf("thumb") == -1){
        imageUrls.push(
          BASE_FIREBASE_STORAGE_URL +
            imageRef.fullPath.replace("/", "%2F") +
            BASE_FIREBASE_STORAGE_URL_SUFFIX
        );
        }
      });
    });
  },
  mounted() {},
  methods: {
    showImage(imageSrc) {
      //open image uploading pop-up      
      this.$refs.ImageViewerModal.showModal(imageSrc);
    },
    infiniteHandler($state) {
      setTimeout(() => {
        const temp = [];
        var i;
        for (
          i = this.viewImageUrls.length;
          i <
          Math.min(this.viewImageUrls.length + 10, this.totalImageUrls.length);
          i++
        ) {
          temp.push(this.totalImageUrls[i]);
        }
        this.viewImageUrls = this.viewImageUrls.concat(temp);
        $state.loaded();
      }, 1000);
    },   
  }
};

</script>
<style scoped>
.image {
  float: left;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  border: 1px solid #ebebeb;
  margin: 5px;
}
</style> 