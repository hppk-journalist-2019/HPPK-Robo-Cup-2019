<template>
  <div>
    <v-list two-line style="width:800px; position:relative;margin:8px auto;">
      <template v-for="(team, index) in teams">
        <v-list-tile :key="team.teamName" avatar @click="">
          <v-list-tile-avatar>
            <img :src="team.logo" />
          </v-list-tile-avatar>

          <v-list-tile-content @click="showTeam(team)">
            <v-list-tile-title v-html="team.teamName"></v-list-tile-title>
            <v-list-tile-sub-title v-html="team.teamLeader"></v-list-tile-sub-title>
          </v-list-tile-content>
          <v-btn v-show="isSignIn" fab dark small color="cyan" @click="deleteTeam(team, index)">
            <v-icon dark>delete</v-icon>
          </v-btn>
        </v-list-tile>
      </template>
    </v-list>
    <v-btn id="btnAddTeams" v-show="isSignIn" fab dark large color="cyan" href="/teams/add">
      <v-icon dark>add</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  data: () => ({
    isSignIn: false,
    teams: [],
    ref: firebase.firestore().collection("teams")
  }),
  created() {
    this.isSignIn =
      localStorage.getItem("firebaseui::rememberedAccounts") != null;

    this.ref.onSnapshot(querySnapshot => {
      this.teams = [];
      querySnapshot.forEach(doc => {
        const team = doc.data();
        this.teams.push({
          id: team.id,
          teamName: team.teamName,
          teamLeader: team.members.teamLeader[0],
          logo: getTeamLogo(team)
        });
      });
    });
  },
  methods: {
    showTeam(team) {
        this.$router.push({ name: "team", params: { teamId: team.id } });
    },
    deleteTeam(team, index) {
      this.ref
        .doc(team.id.toString())
        .delete()
        .then(function() {
          console.log("Team successfully deleted!");
        })
        .catch(function(error) {
          console.error("Error removing team: ", error);
        });
    }
  }
};

function getTeamLogo(team) {
  if (!team.logo) {
    return "icon_hp.png";
  } else {
    return team.logo;
  }
}
</script>

<style>
#btnAddTeams {
  position: fixed;
  bottom: 0px;
  right: 0px;
  margin: 56px;
}
</style>
