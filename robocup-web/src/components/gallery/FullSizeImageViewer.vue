<template>
<img :src="imgSrc" style="object-fit:none;margin-top:40px"/>
</template>
<script>
const BASE_FIREBASE_STORAGE_URL =
  "https://firebasestorage.googleapis.com/v0/b/hppk-robocup-2019.appspot.com/o/images%2F";
const BASE_FIREBASE_STORAGE_URL_SUFFIX = "?alt=media";
export default{
    data(){
        return {
            imgSrc: BASE_FIREBASE_STORAGE_URL + this.$route.params.imgSrc.toString() + BASE_FIREBASE_STORAGE_URL_SUFFIX
        };
    },
    mounted(){
        console.log(this.imgSrc);
    }

}
</script>