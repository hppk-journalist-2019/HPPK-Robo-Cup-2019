<template>
  <v-container fluid pa-0 ma-0>
    <v-layout row>
      <v-flex offset-md2 md1>
        <TeamTop :team="getTeamA(matches1[0])" :getLogo="getLogo" :isTeamA="true"></TeamTop>
      </v-flex>
      <v-flex md1>
        <TeamTop :team="getTeamB(matches1[0])" :getLogo="getLogo" :isTeamA="false"></TeamTop>
      </v-flex>
      <v-flex md1>
        <TeamTop :team="getTeamA(matches1[1])" :getLogo="getLogo" :isTeamA="true"></TeamTop>
      </v-flex>
      <v-flex md1>
        <TeamTop :team="getTeamB(matches1[1])" :getLogo="getLogo" :isTeamA="false"></TeamTop>
      </v-flex>
      <v-flex md1>
        <TeamTop :team="getTeamA(matches1[2])" :getLogo="getLogo" :isTeamA="true"></TeamTop>
      </v-flex>
      <v-flex md1>
        <TeamTop :team="getTeamB(matches1[2])" :getLogo="getLogo" :isTeamA="false"></TeamTop>
      </v-flex>
      <v-flex md1>
        <TeamTop :team="getTeamA(matches1[3])" :getLogo="getLogo" :isTeamA="true"></TeamTop>
      </v-flex>
      <v-flex md1>
        <TeamTop :team="getTeamB(matches1[3])" :getLogo="getLogo" :isTeamA="false"></TeamTop>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex offset-md2 md2>
        <TeamTop :team="getTeamA(matches2[0])" :getLogo="getLogo" :isTeamA="true"></TeamTop>
      </v-flex>
      <v-flex md2>
        <TeamTop :team="getTeamB(matches2[0])" :getLogo="getLogo" :isTeamA="false"></TeamTop>
      </v-flex>
      <v-flex md2>
        <TeamTop :team="getTeamA(matches2[1])" :getLogo="getLogo" :isTeamA="true"></TeamTop>
      </v-flex>
      <v-flex md2>
        <TeamTop :team="getTeamB(matches2[1])" :getLogo="getLogo" :isTeamA="false"></TeamTop>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex offset-md2 md4>
        <TeamTop :team="getTeamA(matches3[0])" :getLogo="getLogo" :isTeamA="true"></TeamTop>
      </v-flex>
      <v-flex md4>
        <TeamTop :team="getTeamB(matches3[0])" :getLogo="getLogo" :isTeamA="false"></TeamTop>
      </v-flex>
    </v-layout>

    <v-layout xs12 text-xs-center ma-4>
      <v-flex>
        <img :src="require('@/assets/trophy.png')" width="56px" />
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex offset-md2 md4>
        <TeamBottom :team="getTeamA(matches3[1])" :getLogo="getLogo" :isTeamA="true"></TeamBottom>
      </v-flex>
      <v-flex md4>
        <TeamBottom :team="getTeamB(matches3[1])" :getLogo="getLogo" :isTeamA="false"></TeamBottom>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex offset-md2 md2>
        <TeamBottom :team="getTeamA(matches2[2])" :getLogo="getLogo" :isTeamA="true"></TeamBottom>
      </v-flex>
      <v-flex md2>
        <TeamBottom :team="getTeamB(matches2[2])" :getLogo="getLogo" :isTeamA="false"></TeamBottom>
      </v-flex>
      <v-flex md2>
        <TeamBottom :team="getTeamA(matches2[3])" :getLogo="getLogo" :isTeamA="true"></TeamBottom>
      </v-flex>
      <v-flex md2>
        <TeamBottom :team="getTeamB(matches2[3])" :getLogo="getLogo" :isTeamA="false"></TeamBottom>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex offset-md2 md1>
        <TeamBottom :team="getTeamA(matches1[4])" :getLogo="getLogo" :isTeamA="true"></TeamBottom>
      </v-flex>
      <v-flex md1>
        <TeamBottom :team="getTeamB(matches1[4])" :getLogo="getLogo" :isTeamA="false"></TeamBottom>
      </v-flex>
      <v-flex md1>
        <TeamBottom :team="getTeamA(matches1[5])" :getLogo="getLogo" :isTeamA="true"></TeamBottom>
      </v-flex>
      <v-flex md1>
        <TeamBottom :team="getTeamB(matches1[5])" :getLogo="getLogo" :isTeamA="false"></TeamBottom>
      </v-flex>
      <v-flex md1>
        <TeamBottom :team="getTeamA(matches1[6])" :getLogo="getLogo" :isTeamA="true"></TeamBottom>
      </v-flex>
      <v-flex md1>
        <TeamBottom :team="getTeamB(matches1[6])" :getLogo="getLogo" :isTeamA="false"></TeamBottom>
      </v-flex>
      <v-flex md1>
        <TeamBottom :team="getTeamA(matches1[7])" :getLogo="getLogo" :isTeamA="true"></TeamBottom>
      </v-flex>
      <v-flex md1>
        <TeamBottom :team="getTeamB(matches1[7])" :getLogo="getLogo" :isTeamA="false"></TeamBottom>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import TeamTop from "./TeamTop";
import TeamBottom from "./TeamBottom";

export default {
  components: {
    TeamTop,
    TeamBottom
  },
  data: () => ({
    isSignIn: false,
    matches1: [],
    matches2: [],
    matches3: [],
    matches4: []
  }),
  computed: {
    teamLogoSize() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "24";
        case "sm":
          return "36";
        case "md":
          return "52";
        case "lg":
          return "72";
        case "xl":
          return "72";
      }
    }
  },
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
      if (match === undefined) {
        return {
          id: "",
          name: "",
          logo: "",
        }
      }

      return {
        id: match.teamAId.slice(5),
        name: match.teamAName,
        logo: match.teamALogo
      };
    },
    getTeamB(match) {
      if (match === undefined) {
        return {
          id: "",
          name: "",
          logo: "",
        }
      }
      
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
