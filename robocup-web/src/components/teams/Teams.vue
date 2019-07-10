<template>
  <v-container ref="container" grid-list-xl pa-0>
    <v-layout row wrap ma-0>
      <v-flex v-for="(team, index) in teams" :key="team.teamName" xs3 pa-1>
        <v-card
          class="hidden-sm-and-down"
          hover
          ripple
          :height="cardHeightStyle"
          tile
          :img="team.logo"
          @click="showTeam(team)"
        >
          <v-card-title class="cardTitleStyle">
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

        <v-card
          class="hidden-md-and-up"
          hover
          ripple
          :height="cardHeightStyle"
          tile
          :img="team.logo"
          @click="showTeam(team)"
        >
          <v-card-title class="cardTitleStyle" fill-height>
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
        <v-card
          hover
          ripple
          :height="cardHeightStyle"
          tile
          :img="opTeam.logo"
          @click="showTeam(opTeam)"
        >
          <v-card-title class="cardTitleStyle">
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

      <v-flex xs6 pa-4>
        <v-img :src="require('@/assets/trophy.png')" max-height="56" contain></v-img>
        <h3 class="text-xs-center">HPPK 2019 Robocup</h3>
      </v-flex>

      <v-flex xs3 style="padding: 1px">
        <v-card
          hover
          ripple
          :height="cardHeightStyle"
          tile
          :img="jnTeam.logo"
          @click="showTeam(jnTeam)"
        >
          <v-card-title class="cardTitleStyle">
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

      <v-btn id="fabAdd" v-show="isSignIn" fab dark large color="cyan" href="/teams/add">
        <v-icon dark>add</v-icon>
      </v-btn>
    </v-layout>
  </v-container>
</template>

<script>
const BASE_FIREBASE_STORAGE_URL =
  "https://firebasestorage.googleapis.com/v0/b/hppk-robocup-2019.appspot.com/o/";

export default {
  data: () => ({
    isSignIn: false,
    teams: [],
    opTeam: {},
    jnTeam: {},
    ref: firebase.firestore().collection("teams"),
    cardHeightStyle: "256px"
  }),
  created() {
    this.isSignIn =
      localStorage.getItem("firebaseui::rememberedAccounts") != null;

    const ref = this.$refs;
    let height = this.cardHeightStyle;
    this.cardHeightStyle = "128px";

    this.ref.where("type", "==", "DEV").onSnapshot(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.cardHeightStyle = ref.container.clientHeight / 5 - 4 + "px";

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
  if (team.teamLogoPath == "icon_hp.png") {
    return "icon_hp.png";
  } else {
    return `${BASE_FIREBASE_STORAGE_URL}${team.teamLogoPath.replace(
      /['/']/gi,
      "%2F"
    )}?alt=media`;
  }
}
</script>

<style>
.cardTitleStyle {
  background-color: #ffffffe4;
  position: absolute;
  bottom: 0;
  width: 100%;
}

</style>
