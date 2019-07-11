<template>
  <v-container pa-5>
    <v-layout pa-2>
      <v-flex>
        <h1 class="body-1">{{matchDate}} {{matchTime}} | {{stadium}}</h1>
      </v-flex>
    </v-layout>

    <v-layout pa-2>
      <v-flex>
        <h1 class="title">{{type}}</h1>
      </v-flex>
    </v-layout>

    <v-layout row align-center pt-5 mt-5>
      <v-flex>
        <v-avatar :size="128">
          <img :src="getLogo(teamALogo)" />
        </v-avatar>
        <span class="title" style="margin-left: 32px">{{teamAName}}</span>
      </v-flex>

      <v-flex text-md-center>
        <h1 class="display-4 font-weight-bold">{{teamAScore}} : {{teamBScore}}</h1>
      </v-flex>

      <v-spacer></v-spacer>
      <v-flex shrink>
        <span class="title" style="margin-right: 32px">{{teamBName}}</span>
        <v-avatar :size="128">
          <img :src="getLogo(teamBLogo)" />
        </v-avatar>
      </v-flex>
    </v-layout>

    <v-btn id="fabAdd" v-show="isSignIn" fab dark large color="cyan" @click="onEditClicked">
      <v-icon dark>edit</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
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
    teamAScore: 0,
    teamALogo: "icon_help.png",
    teamBName: "",
    teamBScore: 0,
    teamBLogo: "icon_help.png"
  }),
  created() {
    this.isSignIn =
      localStorage.getItem("firebaseui::rememberedAccounts") != null;

    this.matchId = this.$route.params.matchId;
    firebase
      .firestore()
      .collection("matches")
      .where("id", "==", this.matchId)
      .onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
          const match = doc.data();

          const d = new Date(match.dateTime);
          this.matchDate = `${d.getFullYear()}. ${d.getMonth() +
            1}. ${d.getDate()}.`;
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
    onEditClicked() {
      this.$router.push({
        name: "edit match",
        params: { matchId: this.matchId }
      });
    },
    getLogo(logo) {
      if (logo === undefined || logo === null || logo.length == 0 || logo == "icon_hp.png") {
        return "https://firebasestorage.googleapis.com/v0/b/hppk-robocup-2019.appspot.com/o/teams%2Flogo%2Flogo.png?alt=media";
      } else {
        return logo;
      }
    }
  }
};
</script>

<style>
</style>
