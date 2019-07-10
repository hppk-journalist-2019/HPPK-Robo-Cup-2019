<template>
  <v-container fluid pa-0>
    <v-layout row wrap>
      <v-flex offset-md1 md10>
        <v-list>
          <v-list-tile v-for="m in matches" :key="m.title" avatar>
            <v-list-tile-content>
              <v-list-tile-title v-text="parseDate(m.dateTime)"></v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-content>
              <v-list-tile-title v-text="parseTime(m.dateTime)"></v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-content>
              <v-list-tile-title v-text="m.stadium"></v-list-tile-title>
            </v-list-tile-content>

            <v-spacer></v-spacer>

            <v-list-tile>
              <v-list-tile-title v-text="m.teamAName"></v-list-tile-title>
            </v-list-tile>

            <v-list-tile-avatar>
              <img :src="m.teamALogo" />
            </v-list-tile-avatar>

            <v-list-tile>
              <v-list-tile-title v-text="m.teamAScore"></v-list-tile-title>
            </v-list-tile>

            <v-list-tile>
              <v-list-tile-title>VS.</v-list-tile-title>
            </v-list-tile>

            <v-list-tile>
              <v-list-tile-title v-text="m.teamBScore"></v-list-tile-title>
            </v-list-tile>

            <v-list-tile-avatar>
              <img :src="m.teamBLogo" />
            </v-list-tile-avatar>

            <v-list-tile>
              <v-list-tile-title v-text="m.teamBName"></v-list-tile-title>
            </v-list-tile>

            <v-list-tile-content>
              <v-list-tile-title v-text="m.state"></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-flex>

      <v-btn id="fabAdd" v-show="isSignIn" fab dark large color="cyan" href="/friendlyMatches/add">
        <v-icon dark>add</v-icon>
      </v-btn>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    isSignIn: false,
    matches: [],
  }),
  created() {
    this.isSignIn =
      localStorage.getItem("firebaseui::rememberedAccounts") != null;

    firebase
      .firestore()
      .collection("friendlyMatches")
      .onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
          const m = doc.data();
          this.matches.push({
            id: m.id,
            dateTime: m.dateTime,
            stadium: m.stadium,
            state: m.state,
            teamAId: m.teamAId,
            teamAName: m.teamAName,
            teamALogo: m.teamALogo,
            teamAScore: m.teamAScore,
            teamBId: m.teamBId,
            teamBName: m.teamBName,
            teamBLogo: m.teamBLogo,
            teamBScore: m.teamBScore
          });
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
    }
  }
};
</script>

<style>
</style>
