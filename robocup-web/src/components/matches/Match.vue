<template>
  <v-container>
    <v-layout row wrap>
      <v-flex offset-md2 md4 lg4 xl4 pr-3>
        <h1 class="display-1">{{matchDate}} {{matchTime}}</h1>
      </v-flex>
    </v-layout>

    <v-layout row wrap pt-3>
      <v-flex offset-md2 md4 lg4 xl4 pr-3>
        <v-select v-model="stadium" :items="stadiums" label="Stadium" outline readonly></v-select>
      </v-flex>

      <v-flex md4 lg4 xl4 pl-3>
        <v-select v-model="type" :items="types" label="Type" outline readonly></v-select>
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

    <v-btn id="fabAdd" v-show="isSignIn" fab dark large color="cyan" @click="onEditClicked">
      <v-icon dark>edit</v-icon>
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
    stadiums: ["Prt Bd. 1F C9-10"],
    stadium: "Prt Bd. 1F C9-10",
    types: ["Friendly Match"],
    type: "Friendly Match",
    matchDate: "",
    matchTime: "",
    teamAName: "",
    teamBName: ""
  }),
  created() {
    this.isSignIn =
      localStorage.getItem("firebaseui::rememberedAccounts") != null;

    this.matchId = this.$route.params.matchId;
    firebase
      .firestore()
      .collection("matches")
      .where("id", "==", matchId)
      .onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
          const match = doc.data();

          const d = new Date(match.dateTime);
          this.matchDate = `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`
          this.matchTime = `${d.getHours()}:${("0" + d.getMinutes()).slice(-2)}`
          console.log(JSON.stringify(match));
        });
      });
  },
  methods: {
    onEditClicked() {
      this.$router.push({ name: "add match", params: { matchId: this.matchId } });
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
