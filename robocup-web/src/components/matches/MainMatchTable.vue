<template>
  <v-container fluid pa-0 ma-0>
    <v-layout row>
      <v-flex offset-md2 md1>
        <TeamTopA :team="getTeamA(matches1[0])"></TeamTopA>
      </v-flex>
      <v-flex md1>
        <TeamTopB :team="getTeamB(matches1[0])"></TeamTopB>
      </v-flex>
      <v-flex md1>
        <TeamTopA :team="getTeamA(matches1[1])"></TeamTopA>
      </v-flex>
      <v-flex md1>
        <TeamTopB :team="getTeamB(matches1[1])"></TeamTopB>
      </v-flex>
      <v-flex md1>
        <TeamTopA :team="getTeamA(matches1[2])"></TeamTopA>
      </v-flex>
      <v-flex md1>
        <TeamTopB :team="getTeamB(matches1[2])"></TeamTopB>
      </v-flex>
      <v-flex md1>
        <TeamTopA :team="getTeamA(matches1[3])"></TeamTopA>
      </v-flex>
      <v-flex md1>
        <TeamTopB :team="getTeamB(matches1[3])"></TeamTopB>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex offset-md2 md2>
        <TeamTopA :team="getTeamA(matches2[0])"></TeamTopA>
      </v-flex>
      <v-flex md2>
        <TeamTopB :team="getTeamB(matches2[0])"></TeamTopB>
      </v-flex>
      <v-flex md2>
        <TeamTopA :team="getTeamA(matches2[1])"></TeamTopA>
      </v-flex>
      <v-flex md2>
        <TeamTopB :team="getTeamB(matches2[1])"></TeamTopB>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex offset-md2 md4>
        <TeamTopA :team="getTeamA(matches3[0])"></TeamTopA>
      </v-flex>
      <v-flex md4>
        <TeamTopB :team="getTeamB(matches3[0])"></TeamTopB>
      </v-flex>
    </v-layout>

    <v-layout xs12 text-xs-center ma-4>
      <v-flex>
        <img :src="require('@/assets/trophy.png')" width="56px" />
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex offset-md2 md4>
        <TeamBottomA :team="getTeamA(matches3[1])"></TeamBottomA>
      </v-flex>
      <v-flex md4>
        <TeamBottomB :team="getTeamB(matches3[1])"></TeamBottomB>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex offset-md2 md2>
        <TeamBottomA :team="getTeamA(matches2[2])"></TeamBottomA>
      </v-flex>
      <v-flex md2>
        <TeamBottomB :team="getTeamB(matches2[2])"></TeamBottomB>
      </v-flex>
      <v-flex md2>
        <TeamBottomA :team="getTeamA(matches2[3])"></TeamBottomA>
      </v-flex>
      <v-flex md2>
        <TeamBottomB :team="getTeamB(matches2[3])"></TeamBottomB>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex offset-md2 md1>
        <TeamBottomA :team="getTeamA(matches1[4])"></TeamBottomA>
      </v-flex>
      <v-flex md1>
        <TeamBottomB :team="getTeamB(matches1[4])"></TeamBottomB>
      </v-flex>
      <v-flex md1>
        <TeamBottomA :team="getTeamA(matches1[5])"></TeamBottomA>
      </v-flex>
      <v-flex md1>
        <TeamBottomB :team="getTeamB(matches1[5])"></TeamBottomB>
      </v-flex>
      <v-flex md1>
        <TeamBottomA :team="getTeamA(matches1[6])"></TeamBottomA>
      </v-flex>
      <v-flex md1>
        <TeamBottomB :team="getTeamB(matches1[6])"></TeamBottomB>
      </v-flex>
      <v-flex md1>
        <TeamBottomA :team="getTeamA(matches1[7])"></TeamBottomA>
      </v-flex>
      <v-flex md1>
        <TeamBottomB :team="getTeamB(matches1[7])"></TeamBottomB>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import TeamTopA from "./TeamTopA";
import TeamTopB from "./TeamTopB";
import TeamBottomA from "./TeamBottomA";
import TeamBottomB from "./TeamBottomB";

export default {
  components: {
    TeamTopA,
    TeamTopB,
    TeamBottomA,
    TeamBottomB
  },
  data: () => ({
    isSignIn: false,
    matches1: [],
    matches2: [],
    matches3: [],
    matches4: []
  }),
  created() {
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
            case "Preliminary Round (예선)":
              this.matches1.push(match);
              break;
            case "Quarter-Finals (8강)":
              this.matches2.push(match);
              break;
            case "Semifinals (준결승)":
              this.matches3.push(match);
              break;
            case "Final (결승)":
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
    },
    getTeamA(match) {
      return {
        id: match.teamAId.slice(5),
        name: match.teamAName,
        logo: match.teamALogo
      };
    },
    getTeamB(match) {
      return {
        id: match.teamBId.slice(5),
        name: match.teamBName,
        logo: match.teamBLogo
      };
    }
  }
};
</script>

<style>
.m16-a {
  margin-left: 50%;
  height: 20px;
  border-left: 1px solid;
  border-bottom: 1px solid;
}

.m16-b {
  width: 50%;
  height: 20px;
  border-right: 1px solid;
  border-bottom: 1px solid;
}

.m16-bottom-a {
  margin-left: 50%;
  height: 20px;
  border-left: 1px solid;
  border-top: 1px solid;
}

.m16-bottom-b {
  width: 50%;
  height: 20px;
  border-right: 1px solid;
  border-top: 1px solid;
}
</style>
