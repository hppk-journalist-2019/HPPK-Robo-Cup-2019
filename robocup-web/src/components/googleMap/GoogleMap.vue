<template>
  <div>
    <gmap-map :center="center" :zoom="15" style="width:100%;  height: 500px;">
      <gmap-marker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        @click="center=m.position"
      ></gmap-marker>
    </gmap-map>
  </div>
</template>

<script>
export default {
  name: "GoogleMap",
  data() {
    return {
      center: { lat: 37.259175, lng: 127.031352 },
      markers: []
    };
  },
  created() {
    this.markers.push({ position: this.center });
  }
};
</script>