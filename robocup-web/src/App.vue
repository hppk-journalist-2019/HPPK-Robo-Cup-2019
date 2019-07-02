<template>
  <v-app>
    <v-toolbar>
      <v-toolbar-title class="headline text-uppercase">
        <v-btn flat href="/" large>
          <span>HPPK 2019 Robocup</span>
        </v-btn>
      </v-toolbar-title>

      <v-btn flat href="/news">
        <span class="mr-2">News</span>
      </v-btn>

      <v-btn flat href="/teams">
        <span class="mr-2">Teams</span>
      </v-btn>

      <v-btn flat href="/matches">
        <span class="mr-2">Matches</span>
      </v-btn>

      <v-btn flat href="/login">
        <span class="mr-2">Login (test)</span>
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn
        flat
        href="https://github.com/hppk-journalist-2019/HPPK-Robo-Cup-2019/"
        target="_blank"
      >
        <span class="mr-2">Github Repo</span>
      </v-btn>
    </v-toolbar>

    <v-content>
      <router-view></router-view> 
    </v-content>
  </v-app>
</template>

<script>


export default {
  name: "App",
  components: {
    
  },
  data() {
    return {}
  }
};
</script>
