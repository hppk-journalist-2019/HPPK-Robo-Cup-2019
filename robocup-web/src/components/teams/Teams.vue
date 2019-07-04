<template>
  <div>
    <h1>Teams</h1>
    <v-list two-line>
      <template v-for="(team, index) in teams">
        <v-subheader v-if="team.header" :key="team.header">{{ team.header }}</v-subheader>

        <v-divider v-else-if="team.divider" :key="index" :inset="team.inset"></v-divider>

        <v-list-tile v-else :key="team.teamName" avatar @click="showTeam(team)">
          <v-list-tile-avatar>
            <img :src="team.avatar" />
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title v-html="team.teamName"></v-list-tile-title>
            <v-list-tile-sub-title v-html="team.teamLeader"></v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>
    <v-btn v-show="isSignIn" fab dark large color="cyan" href="/teams/add">
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
        });
      });
    });
  },
  methods: {
    showTeam(team) {
        this.$router.push({ name: "team", params: { teamId: team.id } });
    }
  }
};
</script>

<style>
</style>
