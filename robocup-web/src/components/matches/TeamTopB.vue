<template>
  <v-container fluid pa-0 ma-0>
    <v-layout row wrap align-center text-sm-center text-md-center justify-space-around>
      <v-flex sm12 md12>{{team.name}}</v-flex>
      <v-flex sm12 md12>
        <v-avatar>
          <img :src="getLogo(team.logo)" />
        </v-avatar>
      </v-flex>
    </v-layout>
    <v-flex class="m16-b"></v-flex>
  </v-container>
</template>

<script>
export default {
  props: ["team"],
  methods: {
    getLogo(logo) {
      if (logo === undefined || logo === null || logo.length == 0) {
        return "icon_help.png";
      } else {
        return logo;
      }
    }
  }
};
</script>

<style>
</style>
