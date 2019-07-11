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

    <v-layout row wrap pt-5 justify-between>
      <v-flex offset-md2 md1 lg1 xl1>
        <v-select v-model="stadium" :items="stadiums" label="Stadium" outline></v-select>
      </v-flex>

      <v-flex offset-md1 md3 lg3 xl3>
        <v-select v-model="type" :items="types" label="Type" outline></v-select>
      </v-flex>

      <v-flex offset-md1 md2 lg2 xl2>
        <v-select v-model="state" :items="states" label="State" outline></v-select>
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

    <v-layout row wrap pt-5>
      <v-flex offset-md2 md3 lg3 xl3>
        <v-select v-model="teamAScore" :items="scores" label="Score" outline></v-select>
      </v-flex>

      <v-flex offset-md2 md3 lg3 xl3>
        <v-select v-model="teamBScore" :items="scores" label="Score" outline></v-select>
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
    matchId: "",
    teams: [],
    stadiums: ["St-1", "St-2", "Prt Bd. 1F C9-10"],
    stadium: "St-1",
    types: [
      "Friendly Match (친선)",
      "Preliminary Round (예선)",
      "Quarter-Finals (8강)",
      "Semifinals (준결승)",
      "Final (결승)"
    ],
    type: "Preliminary Round (예선)",
    states: ["SCHEDULED", "PLAYING", "DONE"],
    state: "SCHEDULED",
    scores: Array.from(Array(20), (x, index) => index),
    matchDate: new Date("2019-07-19").toISOString().substr(0, 10),
    matchDateMenu: false,
    matchTime: "14:00",
    matchTimeMenu: false,
    teamAName: "",
    teamBName: "",
    teamAScore: "",
    teamBScore: ""
  }),
  created() {
    this.isSignIn =
      localStorage.getItem("firebaseui::rememberedAccounts") != null;

    this.matchId = this.$route.params.matchId;

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

    firebase
      .firestore()
      .collection("matches")
      .where("id", "==", this.matchId)
      .onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
          const match = doc.data();

          const d = new Date(match.dateTime);
          this.matchDate = `${d.getFullYear()}-${d.getMonth() +
            1}-${d.getDate()}`;
          this.matchTime = `${d.getHours()}:${("0" + d.getMinutes()).slice(
            -2
          )}`;
          this.stadium = match.stadium;
          this.type = match.type;
          this.teamAName = match.teamAName;
          this.teamAScore = match.teamAScore;
          this.teamALogo = match.teamALogo;
          this.teamBName = match.teamBName;
          this.teamBScore = match.teamBScore;
          this.teamBLogo = match.teamBLogo;
        });
      });
  },
  methods: {
    save() {
      const router = this.$router;
      const dateTime = Date.parse(`${this.matchDate} ${this.matchTime}`);
      const teamA = this.teams.find(t => t.teamName == this.teamAName);
      const teamB = this.teams.find(t => t.teamName == this.teamBName);

      firebase
        .firestore()
        .collection("matches")
        .doc(this.matchId)
        .set({
          id: this.matchId,
          dateTime: Date.parse(`${this.matchDate} ${this.matchTime}`),
          teamAId: teamA.id,
          teamAName: teamA.teamName,
          teamALogo: teamA.logo,
          teamAScore: this.teamAScore,
          teamBId: teamB.id,
          teamBName: teamB.teamName,
          teamBLogo: teamB.logo,
          teamBScore: this.teamBScore,
          state: this.state,
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
