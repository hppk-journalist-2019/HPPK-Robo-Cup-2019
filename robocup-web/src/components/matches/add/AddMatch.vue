<template>
  <v-container>
    <v-layout row wrap>
      <v-flex offset-md2 md3 lg3 xl3>
        <v-menu v-model="matchDateMenu" :close-on-content-click="false" min-width="290px">
          <template v-slot:activator="{ on }">
            <v-text-field v-model="matchDate" label="Date" prepend-icon="event" readonly v-on="on"></v-text-field>
          </template>
          <v-date-picker v-model="matchDate" @input="matchDateMenu = false"></v-date-picker>
        </v-menu>
      </v-flex>

      <v-flex offset-md2 md3 lg3 xl3>
        <v-menu
          ref="menu"
          v-model="matchTimeMenu"
          :close-on-content-click="false"
          :return-value.sync="matchTime"
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="matchTime"
              label="Time"
              prepend-icon="access_time"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-time-picker
            v-if="matchTimeMenu"
            v-model="matchTime"
            full-width
            @click:minute="$refs.menu.save(matchTime)"
          ></v-time-picker>
        </v-menu>
      </v-flex>
    </v-layout>

    <v-layout row wrap pt-5>
      <v-flex offset-md2 md4 lg4 xl4 pr-3>
        <v-select v-model="stadium" :items="stadiums" label="Stadium" outline></v-select>
      </v-flex>

      <v-flex md4 lg4 xl4 pl-3>
        <v-select v-model="type" :items="types" label="Type" outline></v-select>
      </v-flex>
    </v-layout>

    <v-layout row wrap pt-5>
      <v-flex offset-md2 md3 lg3 xl3>
        <v-select v-model="teamAName" :items="teams.map(t => t.teamName)" label="Team A" outline></v-select>
      </v-flex>

      <v-flex md2 text-md-center pa-2>
        <h1>VS.</h1>
      </v-flex>

      <v-flex md3 lg3 xl3>
        <v-select v-model="teamBName" :items="teams.map(t => t.teamName)" label="Team B" outline></v-select>
      </v-flex>
    </v-layout>

    <v-btn id="fabAdd" v-show="isSignIn" fab dark large color="cyan" @click="save">
      <v-icon dark>check</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
const BASE_FIREBASE_STORAGE_URL =
  "https://firebasestorage.googleapis.com/v0/b/hppk-robocup-2019.appspot.com/o/";

export default {
  data: () => ({
    isSignIn: false,
    teams: [],
    stadiums: ["St-1", "St-2", "Prt Bd. 1F C9-10"],
    stadium: "St-1",
    types: ["Friendly Match (친선)", "Preliminary Round (예선)", "Quarter-Finals (8강)", "Semifinals (준결승)", "Final (결승)"],
    type: "Preliminary Round (예선)",
    matchDate: new Date("2019-07-19").toISOString().substr(0, 10),
    matchDateMenu: false,
    matchTime: "14:00",
    matchTimeMenu: false,
    teamAName: "",
    teamBName: ""
  }),
  created() {
    this.isSignIn =
      localStorage.getItem("firebaseui::rememberedAccounts") != null;

    firebase
      .firestore()
      .collection("teams")
      .where("type", "==", "DEV")
      .onSnapshot(querySnapshot => {
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
  },
  methods: {
    save() {
      const router = this.$router;
      const matchId = `fm-${new Date().getTime()}`;
      const dateTime = Date.parse(`${this.matchDate} ${this.matchTime}`);
      const teamA = this.teams.find(t => t.teamName == this.teamAName);
      const teamB = this.teams.find(t => t.teamName == this.teamBName);

      firebase
        .firestore()
        .collection("matches")
        .doc(matchId)
        .set({
          id: matchId,
          dateTime: Date.parse(`${this.matchDate} ${this.matchTime}`),
          teamAId: teamA.id,
          teamAName: teamA.teamName,
          teamALogo: teamA.logo,
          teamAScore: 0,
          teamBId: teamB.id,
          teamBName: teamB.teamName,
          teamBLogo: teamB.logo,
          teamBScore: 0,
          state: "SCHEDULED",
          stadium: this.stadium,
          type: this.type
        })
        .then(function() {
          router.push("/matches");
        })
        .catch(function(error) {
          console.error("Error writing document: ", error);
          // todo: Show error popup
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
</style>
