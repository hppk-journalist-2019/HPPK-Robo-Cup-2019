<template>
  <div>
    <v-container
      fluid
      pa-0
      style="max-width:100%;height:800px; background-image: url('bg_home.jpg'); background-size: cover; "
    >
      <v-layout
        pa-5
        text-xs-center
        style="background-color: #00000055; color:#FFFFFF; height:800px"
      >
        <v-flex>
          <h1 class="display-3 font-weight-bold" style="margin-top:150px">Welcome to</h1>
          <h1 class="display-4 font-weight-bold mt-5">HPPK 2019 Robocup</h1>
          <h1 class="title" align="center" style="margin-top:150px">2019. 7. 19 (Fri)</h1>
          <h2 class="title mt-3" align="center">12:00 ~ 16:00</h2>
          <h1 class="title mt-3" align="center">Hotel IBIS AMBASSADOR SUWON (이비스 앰배서더 수원)</h1>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- 1. 대진표 -->
    <v-layout pa-5 text-xs-center>
      <v-flex>
        <img src="tournament.png" style="max-width:100%; width:960px" />
      </v-flex>
    </v-layout>

    <!-- 2. Lunch 행사 일정 및 장소 -->
    <v-container
      fluid
      pa-0
      style="max-width:100%;height:800px; background-image: url('hotel.jpg'); background-size: cover; "
    >
      <v-layout
        pa-5
        text-xs-center
        style="background-color: #000000AA; height:800px; color:#FFFFFF"
      >
        <v-flex>
          <h1 class="display-4 font-weight-bold" align="center" style="margin-top:150px">Lunch</h1>
          <h1 class="display-1 ma-5" align="center">12:00 - 13:30 / 3F</h1>
          <h1 class="title" align="center" style="margin-top:150px">Meal coupon will be distributed on event day</h1>
          <h1 class="title ma-3" align="center">Layout: Seperated space</h1>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- 3. Location Google Map -->
    <google-map />

    <!-- 4. Robocup 행사 일정 및 장소 -->
    <v-container
      fluid
      pa-0
      style="max-width:100%;height:800px; background-image: url('robocup.jpg'); background-size: cover; "
    >
      <v-layout
        pa-5
        text-xs-center
        style="background-color: #000000AA; height:800px; color:#FFFFFF"
      >
        <v-flex>
          <h1 class="display-4 font-weight-bold" align="center" style="margin-top:150px">Robocup</h1>
          <h1 class="display-1 ma-5" align="center">14:00 - 16:00</h1>
          <h1 class="display-1 ma-5" align="center">6F Hall Rion</h1>
          <h1 class="title" align="center" style="margin-top:150px">Providing coffee, beverages and snacks</h1>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- 5. 이동 방법 -->
    <v-container
      fluid
      pa-0
      style="max-width:100%;height:800px; background-image: url('transportation.jpg'); background-size: cover; "
    >
      <v-layout pa-5 style="background-color: #000000AA; height:800px; color:#FFFFFF">
        <v-flex>
          <h1 class="display-4 font-weight-bold" align="center" style="margin-top:150px">How to go</h1>
          <h1 class="display-1 mt-5" align="center">Own car or Hotel Bus</h1>
          <h1 class="display-1 ma-3" align="center">11:40 / at East gate</h1>
          <h1 class="title mt-5" align="center" style="margin-top:150px">1 Bus(25person capacity) / 3 Small Bus</h1>
          <h1 class="title ma-3" align="center">Car parking is available at the hotel parking lot (parking ticket will be provided)</h1>
          <h1
            class="body-1 ma-5"
            align="center"
          >호텔 정보 : https://www.ambatel.com/ibis/suwon/ko/main.do</h1>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import GoogleMap from "../../components/googleMap/GoogleMap";

export default {
  components: {
    GoogleMap
  }
};
</script>
</script>

<style>
</style>
