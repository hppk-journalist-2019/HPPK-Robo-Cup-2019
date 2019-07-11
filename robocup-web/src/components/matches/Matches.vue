<template>
  <v-container fluid pa-0>
    <v-layout row wrap>
      <v-flex offset-md1 md10>
        <v-data-table
          :headers="headers"
          :items="matches"
          class="elevation-1"
          :rows-per-page-items="rowsPerPageItems"
        >
          <template v-slot:items="props">
            <tr hover @click="onMatchClicked(props.item)">
              <td class="text-xs-center">{{ parseDate(props.item.dateTime) }}</td>
              <td class="text-xs-center">{{ parseTime(props.item.dateTime) }}</td>
              <td class="text-xs-center">{{ props.item.type }}</td>
              <td class="text-xs-center">{{ props.item.stadium }}</td>
              <td class="text-xs-right">
                {{props.item.teamAName}}
                <v-avatar :size="32">
                  <img :src="getLogo(props.item.teamALogo)" />
                </v-avatar>
              </td>
              <td class="text-xs-center">{{ props.item.teamAScore }} : {{ props.item.teamBScore }}</td>
              <td class="text-xs-left">
                <v-avatar :size="32">
                  <img :src="getLogo(props.item.teamBLogo)" />
                </v-avatar>
                {{props.item.teamBName}}
              </td>
              <td class="text-xs-center">{{ props.item.state }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-flex>

      <v-btn id="fabAdd" v-show="isSignIn" fab dark large color="cyan" href="/matches/add">
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
    rowsPerPageItems: [20],
    headers: [
      { text: "Date", align: "center", value: "date", sortable: false },
      { text: "Time", align: "center", value: "time", sortable: false },
      { text: "Type", align: "center", value: "type", sortable: false },
      { text: "Stadium", align: "center", value: "stadium", sortable: false },
      { text: "Team A", align: "center", value: "teamA", sortable: false },
      { text: "Score", align: "center", value: "", sortable: false },
      { text: "Team B", align: "center", value: "teamB", sortable: false },
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
          this.matches.push({
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
    },
    onMatchClicked(match) {
      this.$router.push({ name: "match", params: { matchId: match.id } });
    },
    getLogo(logo) {
      if (logo === undefined || logo === null) {
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
