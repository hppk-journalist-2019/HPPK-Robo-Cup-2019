<template>
  <v-flex offset-md2 md8 pt-3>
    <v-data-table
      :headers="headers"
      :items="matches"
      class="elevation-1"
      :rows-per-page-items="rowsPerPageItems"
    >
      <template v-slot:items="props">
        <tr hover @click="onMatchClicked(props.item)">
          <td
            class="text-xs-center"
          >{{ parseDate(props.item.dateTime) }} {{ parseTime(props.item.dateTime) }}</td>
          <td class="text-xs-center">{{ props.item.stadium }}</td>
          <td class="text-xs-right">
            <span style="padding-right:32px">{{props.item.teamAName}}</span>
            <v-avatar :size="32">
              <img :src="getLogo(props.item.teamALogo)" />
            </v-avatar>
          </td>
          <td class="text-xs-center">{{ props.item.teamAScore }} : {{ props.item.teamBScore }}</td>
          <td class="text-xs-left">
            <v-avatar :size="32">
              <img :src="getLogo(props.item.teamBLogo)" />
            </v-avatar>
            <span style="padding-left:32px">{{props.item.teamBName}}</span>
          </td>
          <td class="text-xs-center">{{ props.item.state }}</td>
        </tr>
      </template>
    </v-data-table>
  </v-flex>
</template>

<script>
export default {
  props: ["matches"],
  data: () => ({
    isSignIn: false,
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
