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

    <v-layout v-show="isSignIn" row align-center mt-3>
      <v-flex>
        <v-btn fab dark color="green" @click="incTeamAScore(teamAScore)">
          <v-icon dark>add</v-icon>
        </v-btn>
        <v-btn fab dark color="red" @click="decTeamAScore(teamAScore)">
          <v-icon dark>remove</v-icon>
        </v-btn>
      </v-flex>

      <v-spacer></v-spacer>
      <v-flex shrink>
        <v-btn fab dark color="green" @click="incTeamBScore(teamBScore)">
          <v-icon dark>add</v-icon>
        </v-btn>
        <v-btn fab dark color="red" @click="decTeamBScore(teamBScore)">
          <v-icon dark>remove</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>

    <v-form ref="eventForm" v-model="valid" v-show="isSignIn">
      <v-layout row mt-5>
        <v-flex offset-md2 md2>
          <v-select
            ref="selectEventType"
            v-model="eventType"
            :items="eventTypes"
            label="Type"
            color="cyan"
            outline
          ></v-select>
        </v-flex>

        <v-flex ml-3 md5>
          <v-text-field
            ref="tfEvent"
            v-model="eventText"
            label="Event"
            required
            :rules="baseRules"
          />
        </v-flex>

        <v-flex ml-3 md1>
          <v-btn fab dark color="cyan" small outline @click="saveEvent">
            <v-icon dark>add</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-form>

    <v-layout row mt-5>
      <v-flex offset-md2>
        <v-timeline align-top dense v-for="event in events" :key="event.time" xs3 pa-1>
          <v-timeline-item color="teal lighten-3" small>
            <v-layout wrap pt-3>
              <v-flex xs3>
                <strong>{{event.time}}</strong>
              </v-flex>
              <v-flex>
                <strong>{{event.text}}</strong>
                <div class="caption mb-2">{{event.type}}</div>
                <v-avatar v-show="event.type == 'GOAL'">
                  <v-img :src="require('@/assets/icon_goal.png')"></v-img>
                </v-avatar>
                <v-avatar v-show="event.type == 'FOUL'">
                  <v-img :src="require('@/assets/icon_red_card.png')"></v-img>
                </v-avatar>
              </v-flex>
            </v-layout>
          </v-timeline-item>
        </v-timeline>
      </v-flex>
    </v-layout>

    <v-btn id="fabAdd" v-show="isSignIn" fab dark large color="cyan" @click="onEditClicked">
      <v-icon dark>edit</v-icon>
    </v-btn>

    <v-btn id="fabDelete" v-show="isSignIn" fab dark large color="cyan" @click="onDeleteClicked">
      <v-icon dark>delete</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
const EVENT_TYPE_GENERAL = "GENERAL";
const EVENT_TYPE_GOAL = "GOAL";
const EVENT_TYPE_FOUL = "FOUL";

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
      .get()
      .then(doc => {
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
            // deleteMessage(change.doc.id);
          } else {
            const event = change.doc.data();
            events.push(event);
            this.eventType = EVENT_TYPE_GENERAL;
            this.eventText = "";
          }
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
    incTeamAScore(teamAScore) {
      const score = { teamAScore: ++teamAScore };
      updateScore(score, this.matchId);
    },
    decTeamAScore(teamAScore) {
      const score = { teamAScore: --teamAScore };
      updateScore(score, this.matchId);
    },
    incTeamBScore(teamBScore) {
      const score = { teamBScore: ++teamBScore };
      updateScore(score, this.matchId);
    },
    decTeamBScore(teamBScore) {
      const score = { teamBScore: --teamBScore };
      updateScore(score, this.matchId);
    },
    saveEvent() {
      if (this.$refs.eventForm.validate()) {
        const d = new Date();
        const eventTime = `${d.getHours()}:${("0" + d.getMinutes()).slice(-2)}`;
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
