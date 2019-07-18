<template>
  <v-container>
    <v-form ref="eventForm" v-model="valid" v-show="isSignIn">
      <v-layout row wrap mt-5>
        <v-flex offset-md1 offset-xl3 sm6 md5>
          <v-radio-group v-model="eventType" row>
            <v-radio label="GENERAL" value="GENERAL"></v-radio>
            <v-radio label="GOAL" value="GOAL"></v-radio>
            <v-radio label="FOUL" value="FOUL"></v-radio>
          </v-radio-group>
        </v-flex>
        <v-spacer></v-spacer>
        <v-flex v-show="eventType == 'GOAL'" sm3>
          <v-select v-model="goalPlayer" :items="players" label="Player" outline></v-select>
        </v-flex>
        <v-flex offset-md1 offset-xl3 xs12 sm12 md9 xl5>
          <v-text-field
            ref="tfEvent"
            v-model="eventText"
            label="Event"
            required
            :rules="baseRules"
          />
        </v-flex>
        <v-flex xs1 pl-3>
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
                <span style="color: gray">{{event.time}}"</span>
              </v-flex>
              <v-flex ml-2>
                <strong>{{event.text}}</strong>{{getGoalPlayerName(event.goalPlayer)}}
                <div class="caption mb-2">{{event.type}}</div>
                <v-avatar v-show="event.type == 'GOAL'">
                  <v-img :src="require('@/assets/icon_goal.png')"></v-img>
                </v-avatar>
                <v-avatar v-show="event.type == 'FOUL'">
                  <v-img :src="require('@/assets/icon_red_card.png')"></v-img>
                </v-avatar>
              </v-flex>
              <v-btn
                v-show="isSignIn"
                fab
                dark
                small
                outline
                color="cyan"
                @click="deleteEvent(event)"
              >
                <v-icon dark>remove</v-icon>
              </v-btn>
            </v-layout>
          </v-timeline-item>
        </v-timeline>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
const EVENT_TYPE_GENERAL = "GENERAL";
const EVENT_TYPE_GOAL = "GOAL";
const EVENT_TYPE_FOUL = "FOUL";

export default {
  props: ["matchId", "teamAId", "teamBId"],
  data: () => ({
    writerName: "",
    comment: "",
    comments: [],
    isSignIn: false,
    events: [],
    eventTypes: [EVENT_TYPE_GENERAL, EVENT_TYPE_GOAL, EVENT_TYPE_FOUL],
    eventType: EVENT_TYPE_GENERAL,
    eventText: "",
    baseRules: [
      v => !!v || "required",
      v => (v && v.length <= 50) || "Text must be less than 50 characters"
    ],
    valid: true,
    players: ["Own Goal by A", "Own Goal by B"],
    goalPlayer: ""
  }),
  created() {
    this.isSignIn =
      localStorage.getItem("firebaseui::rememberedAccounts") != null;

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
  updated() {
    if (this.teamAId.length <= 0 || this.teamBId.length <= 0) {
      return;
    }

    if (this.players.length == 2) {
      getPlayers(this.teamAId, this.players);
      getPlayers(this.teamBId, this.players);
    }
  },
  methods: {
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

        if (this.eventType == EVENT_TYPE_GOAL) {
          event.goalPlayer = this.goalPlayer;
        }

        firebase
          .firestore()
          .collection("matches")
          .doc(this.matchId)
          .collection("events")
          .doc(eventTime)
          .set(event)
          .then(function() {
            this.goalPlayer = "";
          })
          .catch(function(error) {
            console.error("Error writing document: ", error);
            this.goalPlayer = "";
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
    getGoalPlayerName(playerName) {
      if (playerName === undefined) {
        return ""
      } else {
        return ` (${playerName})`
      }
    }
  }
};

function getPlayers(teamId, player) {
  console.log("getPlayers - " + teamId);
  firebase
    .firestore()
    .collection("teams")
    .doc(teamId)
    .onSnapshot(doc => {
      const team = doc.data();
      team.members
        .filter(m => m.roles.includes("Player"))
        .map(m => team.teamName + " - " + m.name)
        .forEach(name => {
          if (!player.includes(name)) {
            player.push(name);
          }
        });
      console.log(teamId + ": " + JSON.stringify(player));
    });
}
</script>

<style>
</style>
