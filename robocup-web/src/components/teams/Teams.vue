<template>
  <v-container ref="container" fluid grid-list-xl style="padding: 0">
    <v-layout row wrap style="margin: 0">
      <v-flex v-for="(team, index) in teams" :key="team.teamName" xs3 style="padding: 1px">
        <v-card hover light ripple height="150px" tile :img="team.logo">
          <!-- <v-img :src="team.logo" aspect-ratio="4.75"></v-img> -->

          <v-card-title style="background-color: #FFFFFFF4;position: absolute;bottom: 0;width: 100%;">
            <v-list-tile-avatar>
              <img :src="team.logo" />
            </v-list-tile-avatar>
            <div>
              <h3>{{team.teamName}}</h3>
              <div>{{ team.teamLeader }}</div>
            </div>
            <v-spacer />
            <v-btn v-show="isSignIn" flat color="cyan" @click="deleteTeam(team, index)">Delete</v-btn>
          </v-card-title>
        </v-card>
      </v-flex>

      <v-flex xs3 style="padding: 1px">
        <v-card hover light ripple height="150px">
          <v-card-title>
            <v-list-tile-avatar>
              <img :src="opTeam.logo" />
            </v-list-tile-avatar>
            <div>
              <h3>{{opTeam.teamName}}</h3>
              <div>{{ opTeam.teamLeader }}</div>
            </div>
            <v-spacer />
            <v-btn v-show="isSignIn" flat color="cyan" @click="deleteTeam(opTeam, index)">Delete</v-btn>
          </v-card-title>
        </v-card>
      </v-flex>

      <v-flex xs6>
        <h1>HPPK 2019</h1>
        <h2>Robocup</h2>
      </v-flex>

      <v-flex xs3 style="padding: 1px">
        <v-card hover light ripple height="150px">
          <v-card-title>
            <v-list-tile-avatar>
              <img :src="jnTeam.logo" />
            </v-list-tile-avatar>
            <div>
              <h3>{{jnTeam.teamName}}</h3>
              <div>{{ jnTeam.teamLeader }}</div>
            </div>
            <v-spacer />
            <v-btn v-show="isSignIn" flat color="cyan" @click="deleteTeam(jnTeam, index)">Delete</v-btn>
          </v-card-title>
        </v-card>
      </v-flex>

      <v-btn id="btnAddTeams" v-show="isSignIn" fab dark large color="cyan" href="/teams/add">
        <v-icon dark>add</v-icon>
      </v-btn>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    isSignIn: false,
    teams: [],
    opTeam: {},
    jnTeam: {},
    ref: firebase.firestore().collection("teams")
  }),
  created() {
    this.isSignIn =
      localStorage.getItem("firebaseui::rememberedAccounts") != null;

    this.ref.where("type", "==", "DEV").onSnapshot(querySnapshot => {
      this.teams = [];
      querySnapshot.forEach(doc => {
        const team = doc.data();
        this.teams.push({
          id: team.id,
          teamName: team.teamName,
          teamLeader: team.members.filter(m =>
            m.roles.filter(r => r == "Team Leader")
          )[0].name,
          logo: getTeamLogo(team)
        });
      });
    });

    this.ref.where("type", "==", "OP").onSnapshot(querySnapshot => {
      querySnapshot.forEach(doc => {
        const team = doc.data();
        this.opTeam = {
          id: team.id,
          teamName: team.teamName,
          teamLeader: team.members.filter(m =>
            m.roles.filter(r => r == "Team Leader")
          )[0].name,
          logo: getTeamLogo(team)
        };
      });
    });

    this.ref.where("type", "==", "JN").onSnapshot(querySnapshot => {
      querySnapshot.forEach(doc => {
        const team = doc.data();
        this.jnTeam = {
          id: team.id,
          teamName: team.teamName,
          teamLeader: team.members.filter(m =>
            m.roles.filter(r => r == "Team Leader")
          )[0].name,
          logo: getTeamLogo(team)
        };
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
