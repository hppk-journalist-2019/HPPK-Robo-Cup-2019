<template>
  <v-container
    ref="tContainer"
    fluid
    pa-0
    fill-height
    :style="{ 'background-image': 'url(' + team.logo + ')'}"
  >
    <v-layout row wrap fill-height :style="{ 'background-color': '#FFFFFFA0'}">
      <OpTeam v-show="showOpTeam" id="opTeamContainer" :opTeam="team"></OpTeam>
      <JnTeam v-show="showJnTeam" id="jnTeamContainer" :jnTeam="team"></JnTeam>
      <DevTeam v-show="showDevTeam" id="devTeamContainer" :devTeam="team"></DevTeam>

      <!-- Right side -->
      <v-flex
        xs12
        offset-md1
        md6
        offset-lg1
        lg5
        :style="{
        'position': 'relative',
        'color':'white',
        'background-color':'#3A6031',
        'height':rightSideHeight}"
        pa-5
      >
        <v-flex
          style="border:solid white 2px; height:50%; border-bottom-width:1px; padding:0; position:relative"
        >
          <v-flex offset-xs5 xs2 style="border:solid white 2px; border-top-width:0px; height:20%;"></v-flex>

          <!-- 1. Players -->
          <v-layout justify-space-around>
            <v-flex
              class="text-xs-center"
              v-for="member in team.players"
              :key="member.name"
              style="position:relative; top:4px"
            >
              <v-layout column>
                <v-flex>
                  <v-avatar size="56px">
                    <img :src="require('@/assets/icon_role_player.png')" alt="avatar" />
                  </v-avatar>
                </v-flex>
                {{member}}
              </v-layout>
            </v-flex>
          </v-layout>

          <!-- 2. SW Engineers -->
          <v-layout justify-space-around style="position:absolute; bottom:56px; width:100%">
            <v-flex class="text-xs-center" v-for="member in team.swEngineers" :key="member.name">
              <v-layout column>
                <v-flex>
                  <v-avatar size="56px">
                    <img :src="require('@/assets/icon_role_software_eng.png')" alt="avatar" />
                  </v-avatar>
                </v-flex>
                {{member}}
              </v-layout>
            </v-flex>
          </v-layout>

          <!-- Center Circle -->
          <v-flex
            offset-xs6
            style="border:solid white 2px; border-radius:50%; position:absolute; bottom:-50px; left:-50px;height:100px; width: 100px; "
          ></v-flex>
        </v-flex>

        <v-flex
          style="border:solid white 2px; height:50%; border-top-width:1px; padding:0; position:relative"
        >
          <!-- 3. Mechanical Engineers -->
          <v-layout justify-space-around>
            <v-flex
              class="text-xs-center"
              v-for="member in team.mechanicalEngineers"
              :key="member.name"
              style="position:relative; top:56px;"
            >
              <v-layout column>
                <v-flex>
                  <v-avatar size="56px" align-self-center>
                    <img :src="require('@/assets/icon_role_mechanical_eng.png')" alt="avatar" />
                  </v-avatar>
                </v-flex>
                {{member}}
              </v-layout>
            </v-flex>
          </v-layout>

          <!-- 4. Marketers -->
          <v-layout justify-space-around>
            <v-flex
              class="text-xs-center"
              v-for="member in team.marketers"
              :key="member.name"
              style="position:relative; top:72px"
            >
              <v-layout column>
                <v-flex>
                  <v-avatar size="56px">
                    <img :src="require('@/assets/icon_role_marketer.png')" alt="avatar" />
                  </v-avatar>
                </v-flex>
                {{member}}
              </v-layout>
            </v-flex>
          </v-layout>

          <v-flex
            offset-xs5
            xs2
            style="border:solid white 2px; border-bottom-width:0px; position:absolute; bottom:0; height:20%; width: 20%; "
          ></v-flex>
        </v-flex>
      </v-flex>
      <v-btn id="btnEditTeam" v-show="isSignIn" fab dark large color="cyan" @click="editTeam()">
        <v-icon dark>edit</v-icon>
      </v-btn>
    </v-layout>
  </v-container>
</template>

<script>
const BASE_FIREBASE_STORAGE_URL =
  "https://firebasestorage.googleapis.com/v0/b/hppk-robocup-2019.appspot.com/o/";

import DevTeam from "./DevTeam";
import OpTeam from "./OpTeam";
import JnTeam from "./JnTeam";

export default {
  components: {
    DevTeam,
    OpTeam,
    JnTeam
  },
  data() {
    return {
      isSignIn: false,
      ref: firebase
        .firestore()
        .collection("teams")
        .doc(this.$route.params.teamId),
      showOpTeam: false,
      showJnTeam: false,
      showDevTeam: true,
      team: {
        id: "team_OP",
        name: "",
        logo: "",
        goal: "",
        leader: "",
        architect: "",
        mechanicalEngineers: "",
        swEngineers: "",
        players: "",
        marketers: ""
      }
    };
  },
  created() {
    this.isSignIn =
      localStorage.getItem("firebaseui::rememberedAccounts") != null;

    let self = this;
    this.ref
      .get()
      .then(function(doc) {
        if (doc.exists) {
          const team = doc.data();
          if (team.id == "team_OP") {
            self.showOpTeam = true;
            self.showJnTeam = false;
            self.showDevTeam = false;
          } else if (team.id == "team_JN") {
            self.showJnTeam = true;
            self.showOpTeam = false;
            self.showDevTeam = false;
          } else {
            self.showDevTeam = true;
            self.showJnTeam = false;
            self.showOpTeam = false;
          }

          self.team.name = team.teamName;
          self.team.logo = getTeamLogo(team);
          self.team.goal = team.teamsGoal;
          self.team.leader = team.members
            .filter(m => m.roles.includes("Team Leader"))
            .map(m => m.name);
          self.team.architect = team.members
            .filter(m => m.roles.includes("Architect"))
            .map(m => m.name);
          self.team.mechanicalEngineers = team.members
            .filter(m => m.roles.includes("Mechanical Engineer"))
            .map(m => m.name);
          self.team.swEngineers = team.members
            .filter(m => m.roles.includes("SW Engineer"))
            .map(m => m.name);
          self.team.players = team.members
            .filter(m => m.roles.includes("Player"))
            .map(m => m.name);
          self.team.marketers = team.members
            .filter(m => m.roles.includes("Marketing"))
            .map(m => m.name);

          self.team.journalist = team.members
            .filter(m => m.roles.includes("Journalist"))
            .map(m => m.name);
          self.team.platformDeveloper = team.members
            .filter(m => m.roles.includes("Platform Developer"))
            .map(m => m.name);
          self.team.referee = team.members
            .filter(m => m.roles.includes("Referee"))
            .map(m => m.name);
          self.team.setter = team.members
            .filter(m => m.roles.includes("Setter"))
            .map(m => m.name);
          self.team.operator = team.members
            .filter(m => m.roles.includes("Operator"))
            .map(m => m.name);
        } else {
          console.error("No such document!");
        }
      })
      .catch(function(error) {
        console.error("Error getting document:", error);
      });
  },
  methods: {
    editTeam() {
      this.$router.push({
        name: "edit team",
        params: { teamId: this.$route.params.teamId }
      });
    }
  },
  computed: {
    rightSideHeight() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "700px";
        case "sm":
          return "800px";
      }
    }
  }
};

function getTeamLogo(team) {
  if (team.teamLogoPath == "icon_hp.png") {
    return "../icon_hp.png";
  } else {
    return `${BASE_FIREBASE_STORAGE_URL}${team.teamLogoPath.replace(
      /['/']/gi,
      "%2F"
    )}?alt=media`;
  }
}
</script>

<style>
#btnEditTeam {
  position: fixed;
  bottom: 0px;
  right: 0px;
  margin: 56px;
}
</style>
