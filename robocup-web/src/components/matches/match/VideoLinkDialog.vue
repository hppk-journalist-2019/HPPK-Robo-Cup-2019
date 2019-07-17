<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn v-show="isSignIn" dark small color="cyan" v-on="on">
        <v-icon dark>video_call</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Facebook Video (Live)</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field label="URL" required v-model="facebookVideoUrl"></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
        <v-btn color="blue darken-1" flat @click="onLiveVideoClicked">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
const EVENT_TYPE_GENERAL = "GENERAL";
const EVENT_TYPE_GOAL = "GOAL";
const EVENT_TYPE_FOUL = "FOUL";

export default {
  data: () => ({
    facebookVideoUrl: "",
    dialog: false,
    items: [
      { title: "Click Me" },
      { title: "Click Me" },
      { title: "Click Me" },
      { title: "Click Me 2" }
    ],
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
    teamBLogo: "icon_help.png",
    baseRules: [
      v => !!v || "required",
      v => (v && v.length <= 50) || "Text must be less than 50 characters"
    ],
    events: [],
    eventTypes: [EVENT_TYPE_GENERAL, EVENT_TYPE_GOAL, EVENT_TYPE_FOUL],
    eventType: EVENT_TYPE_GENERAL,
    eventText: "",
    valid: true
  }),
  created() {
    this.isSignIn =
      localStorage.getItem("firebaseui::rememberedAccounts") != null;

    this.matchId = this.$route.params.matchId;
    firebase
      .firestore()
      .collection("matches")
      .doc(this.matchId)
      .onSnapshot(doc => {
        const match = doc.data();

        const d = new Date(match.dateTime);
        this.matchDate = `${d.getFullYear()}. ${d.getMonth() +
          1}. ${d.getDate()}.`;
        this.matchTime = `${d.getHours()}:${("0" + d.getMinutes()).slice(-2)}`;
        this.stadium = match.stadium;
        this.type = match.type;
        this.teamAName = match.teamAName;
        this.teamAScore = match.teamAScore;
        this.teamALogo = match.teamALogo;
        this.teamBName = match.teamBName;
        this.teamBScore = match.teamBScore;
        this.teamBLogo = match.teamBLogo;
      });

    let events = this.events;
    firebase
      .firestore()
      .collection("matches")
      .doc(this.matchId)
      .collection("events")
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === "removed") {
            const event = change.doc.data();
            const idx = events.findIndex(function(e) {
              return e.time === event.time;
            });
            if (idx > -1) events.splice(idx, 1);
          } else {
            const event = change.doc.data();
            events.push(event);
            this.eventType = EVENT_TYPE_GENERAL;
            this.eventText = "";
          }
        });
      });
  },
  computed: {
    teamLogoSize() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "36";
        case "sm":
          return "52";
        case "md":
          return "128";
        case "lg":
          return "128";
        case "xl":
          return "128";
      }
    },
    scoreSize() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "16px";
        case "sm":
          return "20px";
        case "md":
          return "56px";
        case "lg":
          return "128px";
        case "xl":
          return "128px";
      }
    },
    teamNameStyle() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return { margin: "4px", fontSize: "12px" };
        case "sm":
          return { margin: "16px", fontSize: "16px" };
        case "md":
          return { margin: "20px", fontSize: "20px" };
        case "lg":
          return { margin: "32px", fontSize: "20px" };
        case "xl":
          return { margin: "32px", fontSize: "20px" };
      }
    }
  },
  methods: {
    onEditClicked() {
      this.$router.push({
        name: "edit match",
        params: { matchId: this.matchId }
      });
    },
    onDeleteClicked() {
      const router = this.$router;
      firebase
        .firestore()
        .collection("matches")
        .doc(this.matchId)
        .delete()
        .then(function() {
          router.push({ name: "matches" });
        })
        .catch(function(error) {
          console.error("Error removing document: ", error);
        });
    },
    getLogo(logo) {
      if (
        logo === undefined ||
        logo === null ||
        logo.length == 0 ||
        logo == "icon_hp.png"
      ) {
        return "https://firebasestorage.googleapis.com/v0/b/hppk-robocup-2019.appspot.com/o/teams%2Flogo%2Flogo.png?alt=media";
      } else {
        return logo;
      }
    },
    incTeamAScore() {
      this.teamAScore++;
      const score = { teamAScore: this.teamAScore };
      updateScore(score, this.matchId);
    },
    decTeamAScore() {
      this.teamAScore--;
      const score = { teamAScore: this.teamAScore };
      updateScore(score, this.matchId);
    },
    incTeamBScore() {
      this.teamBScore++;
      const score = { teamBScore: this.teamBScore };
      updateScore(score, this.matchId);
    },
    decTeamBScore() {
      this.teamBScore--;
      const score = { teamBScore: this.teamBScore };
      updateScore(score, this.matchId);
    },
    saveEvent() {
      if (this.$refs.eventForm.validate()) {
        const d = new Date();
        const eventTime = `${d.getHours()}:${("0" + d.getMinutes()).slice(
          -2
        )}:${("0" + d.getSeconds()).slice(-2)}`;
        const event = {
          time: eventTime,
          text: this.eventText,
          type: this.eventType
        };

        firebase
          .firestore()
          .collection("matches")
          .doc(this.matchId)
          .collection("events")
          .doc(eventTime)
          .set(event)
          .then(function() {})
          .catch(function(error) {
            console.error("Error writing document: ", error);
          });
      }
    },
    deleteEvent(event) {
      firebase
        .firestore()
        .collection("matches")
        .doc(this.matchId)
        .collection("events")
        .doc(event.time)
        .delete()
        .then(function() {
          console.log("Document successfully deleted!");
        })
        .catch(function(error) {
          console.error("Error removing document: ", error);
        });
    },
    onLiveVideoClicked() {
      this.dialog = false
      console.log("facebook url: " + this.facebookVideoUrl)
      this.$emit('addVideo', this.facebookVideoUrl);
    }
  }
};

function updateScore(score, matchId) {
  firebase
    .firestore()
    .collection("matches")
    .doc(matchId)
    .update(score)
    .then(function() {})
    .catch(function(error) {
      console.error("Error writing document: ", error);
    });
}
</script>

<style>
</style>
