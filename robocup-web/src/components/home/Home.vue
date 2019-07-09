<template>
  <v-container fluid pa-0>
    <v-flex
      xs12
      sm12
      md12
      lg12
      xl12
      text-xs-center
      class="home-bg"
      style="background-image: url('bg_home.jpg');"
    >
      <div class="home-wrapper light-cotton">
        <h1 class="display-3 font-weight-bold">Welcome to</h1>
        <h1 class="display-4 font-weight-bold mt-5">HPPK 2019 Robocup</h1>
        <h1 class="title" align="center" style="margin-top:150px">2019. 7. 19 (Fri)</h1>
        <h2 class="title mt-3" align="center">12:00 ~ 16:00</h2>
        <h1 class="title mt-3" align="center">Hotel IBIS AMBASSADOR SUWON (이비스 앰배서더 수원)</h1>
      </div>
    </v-flex>

    <!-- 1. 대진표 -->
    <v-flex xs10 offset-xs1 sm8 offset-sm2 md6 offset-md3 mt-5 mb-5>
      <v-layout row>
        <v-img src="tournament.png" />
      </v-layout>
    </v-flex>

    <!-- 2. Lunch 행사 일정 및 장소 -->
    <v-flex class="home-bg" style="background-image: url('hotel.jpg');">
      <div class="home-wrapper light-cotton">
        <h1 class="display-4 font-weight-bold" align="center">Lunch</h1>
        <h1 class="display-1 ma-5" align="center">12:00 - 13:30 / 3F</h1>
        <h1
          class="title"
          align="center"
          style="margin-top:150px"
        >Meal coupon will be distributed on event day</h1>
        <h1 class="title ma-3" align="center">Layout: Seperated space</h1>
      </div>
    </v-flex>

    <!-- 3. Location Google Map -->
    <google-map />

    <!-- 4. Robocup 행사 일정 및 장소 -->
    <v-flex class="home-bg" style="background-image: url('robocup.jpg');">
      <div class="home-wrapper dark-cotton">
        <h1 class="display-4 font-weight-bold" align="center" style="margin-top:150px">Robocup</h1>
        <h1 class="display-1 ma-5" align="center">14:00 - 16:00</h1>
        <h1 class="display-1 ma-5" align="center">6F Hall Rion</h1>
        <h1
          class="title"
          align="center"
          style="margin-top:150px"
        >Providing coffee, beverages and snacks</h1>
      </div>
    </v-flex>

    <!-- 5. 이동 방법 -->
    <v-flex class="home-bg" style="background-image: url('transportation.jpg');">
      <div class="home-wrapper light-cotton">
        <h1 class="display-4 font-weight-bold" align="center" style="margin-top:150px">How to go</h1>
        <h1 class="display-1 mt-5" align="center">Own car or Hotel Bus</h1>
        <h1 class="display-1 ma-3" align="center">11:40 / at East gate</h1>
        <h1
          class="title mt-5"
          align="center"
          style="margin-top:150px"
        >1 Bus(25person capacity) / 3 Small Bus</h1>
        <h1
          class="title ma-3"
          align="center"
        >Car parking is available at the hotel parking lot (parking ticket will be provided)</h1>
        <h1 class="body-1 ma-5" align="center">호텔 정보 : https://www.ambatel.com/ibis/suwon/ko/main.do</h1>
      </div>
    </v-flex>
  </v-container>
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
.home-bg {
  max-width: 100%;
  height: 800px;
  background-size: cover;
  color: white;
}

.home-wrapper {
  height: 800px;
  padding-top: 150px;
}

.dark-cotton {
  background-color: #000000aa;
}

.light-cotton {
  background-color: #00000055;
}
</style>
