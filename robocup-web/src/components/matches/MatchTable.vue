<template>
  <v-flex offset-md2 md8 pt-3>
    <v-data-table
      :headers="headers"
      :items="matches"
      class="elevation-1"
      :rows-per-page-items="rowsPerPageItems"
    >
      <!-- 
        <v-flex class="hidden-md-and-down" sm12 md12>{{getTeamName()}}</v-flex>
        <v-flex class="hidden-lg-and-up" xs12 sm12 md12>{{getTeamId()}}</v-flex> 
      -->
      <template v-slot:items="props">
        <tr hover @click="onMatchClicked(props.item)">
          <td
            class="text-sm-center hidden-xs-only"
          >{{ parseDate(props.item.dateTime) }} {{ parseTime(props.item.dateTime) }}</td>
          <td class="text-sm-center hidden-xs-only">{{ props.item.stadium }}</td>
          <td class="text-xs-right">
            <span class="hidden-md-and-down" style="padding-right:32px">{{props.item.teamAName}}</span>
            <span
              class="hidden-lg-and-up"
              style="padding-right:4px"
            >{{getShortTeamName(props.item.teamAId)}}</span>
            <v-avatar :size="logoSize">
              <img :src="getLogo(props.item.teamALogo)" />
            </v-avatar>
          </td>
          <td class="text-xs-center">{{ props.item.teamAScore }} : {{ props.item.teamBScore }}</td>
          <td class="text-xs-left">
            <v-avatar :size="logoSize">
              <img :src="getLogo(props.item.teamBLogo)" />
            </v-avatar>
            <span class="hidden-md-and-down" style="padding-left:32px">{{props.item.teamBName}}</span>
            <span
              class="hidden-lg-and-up"
              style="padding-left:4px"
            >{{getShortTeamName(props.item.teamBId)}}</span>
          </td>
          <td class="text-xs-center hidden-xs-only">{{ props.item.state }}</td>
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
    xsHeaders: [
      { text: "Team A", align: "right", value: "teamA", sortable: false },
      { text: "Score", align: "center", value: "", sortable: false },
      { text: "Team B", align: "left", value: "teamB", sortable: false }
    ],
    smHeaders: [
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
    ],
    mdHeaders: [
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
    ],
    lgHeaders: [
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
  computed: {
    headers() {
      console.log(this.$vuetify.breakpoint.name);
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return this.xsHeaders;
        case "sm":
          return this.smHeaders;
        case "md":
          return this.mdHeaders;
        default:
          return this.lgHeaders;
      }
    },
    logoSize() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
        case "sm":
          return 24;
        default:
          return 32;
      }
    }
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
    getShortTeamName(id) {
      return id.slice(5);
    }
  }
};
</script>

<style>
</style>
