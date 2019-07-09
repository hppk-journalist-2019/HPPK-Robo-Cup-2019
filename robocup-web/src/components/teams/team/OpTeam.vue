<template>
  <v-flex offset-xs2 xs4>
    <v-layout row wrap>
      <v-flex xs2 pa-3>
        <v-avatar size="72px" color="grey lighten-4">
          <img :src="opTeam.logo" />
        </v-avatar>
      </v-flex>
      <v-flex xs10 pa-4>
        <h1 class="display-2">{{opTeam.name}}</h1>
      </v-flex>

      <v-flex text-xs-center xs12 ma-3>
        <span class="title">
          <i>"{{opTeam.goal}}"</i>
        </span>
      </v-flex>

      <v-flex xs6 mt-3>
        <v-card style="margin: 4px">
          <v-card-title>
            <h3>Team Leader</h3>
          </v-card-title>
          <v-card-text>
            <h2>{{ opTeam.leader.toString() }}</h2>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 ma-3>
        <h1>Members</h1>
      </v-flex>

      <!-- Referee -->
      <v-flex xs6>
        <v-card style="margin: 4px">
          <v-card-title>
            <v-list-tile-avatar size="36">
              <img :src="require('@/assets/icon_role_player.png')" alt="avatar" />
            </v-list-tile-avatar>
            <h3>Referee</h3>
          </v-card-title>
          <v-card-text>
            <h2>{{ opTeam.referee.toString() }}</h2>
          </v-card-text>
        </v-card>
      </v-flex>

      <!-- Operator -->
      <v-flex xs6>
        <v-card style="margin: 4px">
          <v-card-title>
            <v-list-tile-avatar size="36">
              <img :src="require('@/assets/icon_role_software_eng.png')" alt="avatar" />
            </v-list-tile-avatar>
            <h3>Operator</h3>
          </v-card-title>
          <v-card-text>
            <h2>{{ opTeam.operator.toString() }}</h2>
          </v-card-text>
        </v-card>
      </v-flex>

      <!-- Setter -->
      <v-flex xs6 mt-3>
        <v-card style="margin: 4px">
          <v-card-title>
            <v-list-tile-avatar size="36">
              <img :src="require('@/assets/icon_role_mechanical_eng.png')" alt="avatar" />
            </v-list-tile-avatar>
            <h3>Setter</h3>
          </v-card-title>
          <v-card-text>
            <h2>{{ opTeam.setter.toString() }}</h2>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script>
const BASE_FIREBASE_STORAGE_URL =
  "https://firebasestorage.googleapis.com/v0/b/hppk-robocup-2019.appspot.com/o/";

export default {
  props: ["opTeam"],
  data() {
    return {
      isSignIn: false,
      heightStyle: "800px"
    };
  },
  created() {
    this.isSignIn =
      localStorage.getItem("firebaseui::rememberedAccounts") != null;
  },
  methods: {
    editTeam() {
      this.$router.push({
        name: "edit team",
        params: { teamId: this.$route.params.teamId }
      });
    }
  }
};

function getTeamLogo(team) {
  if (team.teamLogoPath == "icon_hp.png") {
    return "../icon_hp.png";
  } else {
    return `${BASE_FIREBASE_STORAGE_URL}${team.teamLogoPath.replace(
      /['/']/gi,
      "%2F"
    )}?alt=media`;
  }
}
</script>

<style>
#btnEditTeam {
  position: fixed;
  bottom: 0px;
  right: 0px;
  margin: 56px;
}
</style>
