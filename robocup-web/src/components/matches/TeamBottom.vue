<template>
  <v-container fluid pa-0 ma-0>
    <v-flex v-bind:class="{'m16-bottom-a': isTeamA, 'm16-bottom-b': !isTeamA}"></v-flex>
    <v-layout
      row
      wrap
      align-center
      text-xs-center
      text-sm-center
      text-md-center
      justify-space-around
    >
      <v-flex xs12 sm12 md12>
        <v-avatar :size="teamLogoSize">
          <img :src="logo(team.logo)" />
        </v-avatar>
      </v-flex>
      <v-flex class="hidden-md-and-down" sm12 md12>{{getTeamName()}}</v-flex>
      <v-flex class="hidden-lg-and-up" xs12 sm12 md12>{{getTeamId()}}</v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  props: ["isTeamA", "team", "getLogo"],
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
  created() {
    if (this.team.id == "") {
      this.team.id = "?";
    }

    if (this.team.name == "") {
      this.team.name = "?";
    }
  },
  methods: {
    logo(logo) {
      return this.getLogo(logo);
    },
    getTeamName() {
      if (this.team.name == "") {
        return "?"
      } else {
        return this.team.name
      }
    },
    getTeamId() {
      if (this.team.id == "") {
        return "?"
      } else {
        return this.team.id
      }
    }
  }
};
</script>

<style>
</style>
