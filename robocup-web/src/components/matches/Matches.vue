<template>
  <v-container fluid pa-3>
    <v-layout row wrap pt-3>
      <v-flex offset-md2>
        <h1>Friendly Match (친선)</h1>
      </v-flex>

      <MatchTable :matches="matches0"></MatchTable>
    </v-layout>

    <v-layout row wrap pt-5>
      <v-flex offset-md2>
        <h1>Preliminary Round (예선)</h1>
      </v-flex>

      <MatchTable :matches="matches1"></MatchTable>
    </v-layout>

    <v-layout row wrap pt-5>
      <v-flex offset-md2>
        <h1>Quarter-Finals (8강)</h1>
      </v-flex>

      <MatchTable :matches="matches2"></MatchTable>
    </v-layout>

    <v-layout row wrap pt-5>
      <v-flex offset-md2>
        <h1>Semifinals (준결승)</h1>
      </v-flex>

      <MatchTable :matches="matches3"></MatchTable>
    </v-layout>

    <v-layout row wrap pt-5>
      <v-flex offset-md2>
        <img :src="require('@/assets/trophy.png')" height="56" contain />
        <h1>Final (결승)</h1>
      </v-flex>

      <MatchTable :matches="matches4"></MatchTable>
    </v-layout>

    <v-btn id="fabAdd" v-show="isSignIn" fab dark large color="cyan" href="/matches/add">
      <v-icon dark>add</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
import MatchTable from "./MatchTable";

export default {
  components: {
    MatchTable
  },
  data: () => ({
    isSignIn: false,
    matches0: [],
    matches1: [],
    matches2: [],
    matches3: [],
    matches4: [],
    rowsPerPageItems: [20],
    headers: [
      {
        text: "Date Time",
        align: "center",
        value: "dateTime",
        sortable: false
      },
      { text: "Stadium", align: "center", value: "stadium", sortable: false },
      { text: "Team A", align: "right", value: "teamA", sortable: false },
      { text: "Score", align: "center", value: "", sortable: false },
      { text: "Team B", align: "left", value: "teamB", sortable: false },
      { text: "State", align: "center", value: "state", sortable: false }
    ]
  }),
  created() {
    this.isSignIn =
      localStorage.getItem("firebaseui::rememberedAccounts") != null;

    firebase
      .firestore()
      .collection("matches")
      .onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
          const m = doc.data();
          const match = {
            id: m.id,
            dateTime: m.dateTime,
            stadium: m.stadium,
            state: m.state,
            type: m.type,
            teamAId: m.teamAId,
            teamAName: m.teamAName,
            teamALogo: m.teamALogo,
            teamAScore: m.teamAScore,
            teamBId: m.teamBId,
            teamBName: m.teamBName,
            teamBLogo: m.teamBLogo,
            teamBScore: m.teamBScore
          };

          switch (m.type) {
            case "Friendly Match (친선)":
              this.matches0.push(match);
              break;
              case "Preliminary Round (예선)":
              this.matches1.push(match);
              break;
              case "Quarter-Finals (8강)":
              this.matches2.push(match);
              break;
              case "Semifinals (준결승)":
              this.matches3.push(match);
              break;
              default:
              this.matches4.push(match);
              break;
          }
        });
      });
  },
  methods: {
    parseDate(dateTime) {
      const d = new Date(dateTime);
      return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`;
    },
    parseTime(dateTime) {
      const d = new Date(dateTime);
      return `${d.getHours()}:${("0" + d.getMinutes()).slice(-2)}`;
    },
    onMatchClicked(match) {
      this.$router.push({ name: "match", params: { matchId: match.id } });
    },
    getLogo(logo) {
      if (logo === undefined || logo === null || logo.length == 0) {
        return "icon_help.png";
      } else {
        return logo;
      }
    }
  }
};
</script>

<style>
</style>
