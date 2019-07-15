<template>
  <v-container fluid pa-0 ma-0>
    <v-flex class="m16-bottom-b"></v-flex>
    <v-layout row wrap align-center text-sm-center text-md-center justify-space-around>
      <v-flex sm 12md12>
        <v-avatar>
          <img :src="getLogo(team.logo)" />
        </v-avatar>
      </v-flex>
      <v-flex sm12 md12>{{team.name}}</v-flex>
    </v-layout>
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
