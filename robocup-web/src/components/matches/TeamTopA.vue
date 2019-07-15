<template>
  <v-container fluid pa-0 ma-0>
    <v-layout row wrap align-center text-xs-center text-sm-center text-md-center justify-space-around>
      <v-flex class="hidden-md-and-down" sm12 md12>{{team.name}}</v-flex>
      <v-flex class="hidden-lg-and-up" xs12 sm12 md12>{{team.id}}</v-flex>
      <v-flex sm12 md12>
        <v-avatar :size="teamLogoSize">
          <img :src="getLogo(team.logo)" />
        </v-avatar>
      </v-flex>
    </v-layout>
    <v-flex class="m16-a"></v-flex>
  </v-container>
</template>

<script>
export default {
  props: ["team"],
  computed: {
    teamLogoSize() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "24";
        case "sm":
          return "36";
        case "md":
          return "52";
        case "lg":
          return "72";
        case "xl":
          return "72";
      }
    }
  },
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
