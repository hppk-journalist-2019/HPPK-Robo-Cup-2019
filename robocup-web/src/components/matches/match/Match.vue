<template>
  <v-container pa-3>
    <v-layout>
      <v-btn v-show="isSignIn && state!='DONE'" dark small color="cyan" @click="doneMatch">경기 종료</v-btn>

      <VideoLinkDialog
        v-show="isSignIn"
        v-on:addVideo="addVideo"
        :facebookVideoUrl="facebookVideoUrl"
      ></VideoLinkDialog>

      <v-btn v-show="isSignIn" dark small color="cyan" @click="onEditClicked">
        <v-icon dark>edit</v-icon>
      </v-btn>

      <v-btn v-show="isSignIn" dark small color="cyan" @click="onDeleteClicked">
        <v-icon dark>delete</v-icon>
      </v-btn>
    </v-layout>
    <v-layout>
      <v-flex pt-5>
        <h1 class="body-1">{{matchDate}} {{matchTime}} | {{stadium}}</h1>
      </v-flex>
    </v-layout>

    <v-layout>
      <v-flex>
        <h1 class="title">{{type}}</h1>
      </v-flex>
    </v-layout>

    <v-layout pa-4>
      <v-flex>
        <!-- Load Facebook SDK for JavaScript -->
        <div id="fb-root"></div>

        <!-- Your embedded video player code -->
        <div
          class="fb-video"
          :data-href="facebookVideoUrl"
          data-show-text="false"
          :data-width="liveWidth"
        ></div>
      </v-flex>
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

    <ReportContainer :matchId="matchId" :teamAId="teamAId" :teamBId="teamBId"></ReportContainer>
    <CommentContainer :type="collectionName" :parentId="matchId"></CommentContainer>
  </v-container>
</template>


<script>
import CommentContainer from "../../comments/CommentContainer";
import VideoLinkDialog from "./VideoLinkDialog";
import ReportContainer from "./report/ReportContainer";

export default {
  components: {
    CommentContainer,
    VideoLinkDialog,
    ReportContainer
  },
  data: () => ({
    collectionName: "matches",
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
    teamAId: "",
    teamAName: "",
    teamAScore: 0,
    teamALogo: "icon_help.png",
    teamBId: "",
    teamBName: "",
    teamBScore: 0,
    teamBLogo: "icon_help.png",
    facebookVideoUrl: "",
    state: "SCHEDULED"
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
        this.teamAId = match.teamAId;
        this.teamAName = match.teamAName;
        this.teamAScore = match.teamAScore;
        this.teamALogo = match.teamALogo;
        this.teamBId = match.teamBId;
        this.teamBName = match.teamBName;
        this.teamBScore = match.teamBScore;
        this.teamBLogo = match.teamBLogo;
        this.facebookVideoUrl = match.facebookVideoUrl;
        this.state = match.state;
      });
  },
  updated() {
    FB.XFBML.parse();
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
    },
    liveWidth() {
      console.log(this.$vuetify.breakpoint.name)
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "400";
        case "sm":
          return "600";
        case "md":
          return "600";
        case "lg":
          return "800";
        case "xl":
        default:
          return "800";
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
    addVideo(url) {
      this.facebookVideoUrl = url;

      const fbVideoUrl = { facebookVideoUrl: url };

      firebase
        .firestore()
        .collection("matches")
        .doc(this.matchId)
        .update(fbVideoUrl)
        .then(function() {
          FB.XFBML.parse();
          console.log("addVideo: " + this.facebookVideoUrl);
        })
        .catch(function(error) {
          console.error("Error addVideo: ", error);
        });
    },
    doneMatch() {
      firebase
        .firestore()
        .collection("matches")
        .doc(this.matchId)
        .update({ state: "DONE" })
        .then(function() {})
        .catch(function(error) {
          console.error("Error doneMatch: ", error);
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
      console.error("Error updateScore: ", error);
    });
}
</script>

<style>
</style>
