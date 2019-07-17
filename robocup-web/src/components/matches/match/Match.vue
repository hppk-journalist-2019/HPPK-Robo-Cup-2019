<template>
  <v-container pa-3>
    <v-layout>
      <v-flex pt-5>
        <h1 class="body-1">{{matchDate}} {{matchTime}} | {{stadium}}</h1>
      </v-flex>
      <v-spacer></v-spacer>

      <VideoLinkDialog v-on:addVideo="addVideo"></VideoLinkDialog>

      <v-btn v-show="isSignIn" dark small color="cyan" @click="onEditClicked">
        <v-icon dark>edit</v-icon>
      </v-btn>

      <v-btn v-show="isSignIn" dark small color="cyan" @click="onDeleteClicked">
        <v-icon dark>delete</v-icon>
      </v-btn>
    </v-layout>

    <v-layout>
      <v-flex>
        <h1 class="title">{{type}}</h1>
      </v-flex>
    </v-layout>

    <v-layout pt-3>
      <!-- Load Facebook SDK for JavaScript -->
      <div id="fb-root"></div>

      <!-- Your embedded video player code -->
      <div class="fb-video" :data-href="facebookVideoUrl" data-show-text="false"></div>
    </v-layout>

    <v-layout row align-center pt-3>
      <v-flex>
        <v-avatar :size="teamLogoSize">
          <img :src="getLogo(teamALogo)" />
        </v-avatar>
        <span :style="teamNameStyle">{{teamAName}}</span>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex text-sm-center>
        <h1
          class="font-weight-bold"
          :style="{
        'font-size':scoreSize}"
        >{{teamAScore}} : {{teamBScore}}</h1>
      </v-flex>

      <v-spacer></v-spacer>
      <v-flex text-sm-right>
        <span :style="teamNameStyle">{{teamBName}}</span>
        <v-avatar :size="teamLogoSize">
          <img :src="getLogo(teamBLogo)" />
        </v-avatar>
      </v-flex>
    </v-layout>

    <v-layout v-show="isSignIn" row align-center mt-3>
      <v-flex>
        <v-btn fab dark small outline color="green" @click="incTeamAScore">
          <v-icon dark>keyboard_arrow_up</v-icon>
        </v-btn>
        <v-btn fab dark small outline color="red" @click="decTeamAScore">
          <v-icon dark>keyboard_arrow_down</v-icon>
        </v-btn>
      </v-flex>

      <v-spacer></v-spacer>
      <v-flex shrink>
        <v-btn fab dark small outline color="green" @click="incTeamBScore">
          <v-icon dark>keyboard_arrow_up</v-icon>
        </v-btn>
        <v-btn fab dark small outline color="red" @click="decTeamBScore">
          <v-icon dark>keyboard_arrow_down</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>

    <v-form ref="eventForm" v-model="valid" v-show="isSignIn">
      <v-layout row wrap mt-5>
        <v-flex offset-md2 sm2 md2 lg3 xl3>
          <v-select
            ref="selectEventType"
            v-model="eventType"
            :items="eventTypes"
            label="Type"
            color="cyan"
            outline
          ></v-select>
        </v-flex>

        <v-flex ml-3>
          <v-text-field
            ref="tfEvent"
            v-model="eventText"
            label="Event"
            required
            :rules="baseRules"
          />
        </v-flex>

        <v-flex ml-3>
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
                <strong>{{event.text}}</strong>
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
import VideoLinkDialog from "./VideoLinkDialog";

const EVENT_TYPE_GENERAL = "GENERAL";
const EVENT_TYPE_GOAL = "GOAL";
const EVENT_TYPE_FOUL = "FOUL";

export default {
  components: {
    VideoLinkDialog
  },
  data: () => ({
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
    valid: true,
    facebookVideoUrl: ""
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
        this.facebookVideoUrl = match.facebookVideoUrl;
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
    addVideo(url) {
      this.facebookVideoUrl = url;

      const fbVideoUrl = { facebookVideoUrl: url };

      firebase
        .firestore()
        .collection("matches")
        .doc(this.matchId)
        .update(fbVideoUrl)
        .then(function() {})
        .catch(function(error) {
          console.error("Error writing document: ", error);
        });
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
