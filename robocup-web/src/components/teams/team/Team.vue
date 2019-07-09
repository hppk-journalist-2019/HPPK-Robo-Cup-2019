<template>
  <v-container fluid pa-0>
    <v-layout fill-height>
      <!-- Left side -->
      <v-flex offset-xs2 xs4>
        <v-layout row wrap>
          <v-flex xs2 pa-3>
            <v-avatar size="72px" color="grey lighten-4">
              <img :src="logo" />
            </v-avatar>
          </v-flex>
          <v-flex xs10 pa-4>
            <h1 class="display-2">{{teamName}}</h1>
          </v-flex>

          <v-flex text-xs-center xs12 ma-3>
            <span class="title">
              <i>"{{teamsGoal}}"</i>
            </span>
          </v-flex>

          <v-flex xs6 mt-3>
            <v-card style="margin: 4px">
              <v-card-title><h3>Team Leader</h3></v-card-title>
              <v-card-text><h2>{{ teamLeader.toString() }}</h2></v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs6 mt-3>
            <v-card style="margin: 4px">
              <v-card-title><h3>Architect</h3></v-card-title>
              <v-card-text><h2>{{ architect.toString() }}</h2></v-card-text>
            </v-card>
          </v-flex>

          <v-flex xs12 ma-3>
            <h1>Members</h1>
          </v-flex>

          <!-- Player -->
          <v-flex xs6>
            <v-card style="margin: 4px">
              <v-card-title>
                <v-list-tile-avatar size="36">
                  <img :src="require('@/assets/icon_role_player.png')" alt="avatar" />
                </v-list-tile-avatar>
                <h3>Player</h3>
              </v-card-title>
              <v-card-text><h2>{{ players.toString() }}</h2></v-card-text>
            </v-card>
          </v-flex>

          <!-- SW Engineer -->
          <v-flex xs6>
            <v-card style="margin: 4px">
              <v-card-title>
                <v-list-tile-avatar size="36">
                  <img :src="require('@/assets/icon_role_software_eng.png')" alt="avatar" />
                </v-list-tile-avatar>
                <h3>SW Engineer</h3>
              </v-card-title>
              <v-card-text><h2>{{ swEngineers.toString() }}</h2></v-card-text>
            </v-card>
          </v-flex>

          <!-- Mechanical Engineer -->
          <v-flex xs6 mt-3>
            <v-card style="margin: 4px">
              <v-card-title>
                <v-list-tile-avatar size="36">
                  <img :src="require('@/assets/icon_role_mechanical_eng.png')" alt="avatar" />
                </v-list-tile-avatar>
                <h3>Mechanical Engineer</h3>
              </v-card-title>
              <v-card-text><h2>{{ mechanicalEngineers.toString() }}</h2></v-card-text>
            </v-card>
          </v-flex>

          <!-- Marketer -->
          <v-flex xs6 mt-3>
            <v-card style="margin: 4px">
              <v-card-title>
                <v-list-tile-avatar size="36">
                  <img :src="require('@/assets/icon_role_software_eng.png')" alt="avatar" />
                </v-list-tile-avatar>
                <h3>Marketer</h3>
              </v-card-title>
              <v-card-text><h2>{{ marketers.toString() }}</h2></v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>

      <!-- Right side -->
      <v-flex offset-xs1 xs5 style="position:relative; color:white;background-color: #3A6031;" pa-5>
        <v-flex
          style="border:solid white 2px; height:50%; border-bottom-width:1px; padding:0; position:relative"
        >
          <v-flex offset-xs5 xs2 style="border:solid white 2px; border-top-width:0px; height:20%;"></v-flex>

          <!-- 1. Players -->
          <v-layout justify-space-around>
            <v-flex
              class="text-xs-center"
              v-for="member in players"
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
            <v-flex class="text-xs-center" v-for="member in swEngineers" :key="member.name">
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
              v-for="member in mechanicalEngineers"
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
              v-for="member in marketers"
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

export default {
  data() {
    return {
      isSignIn: false,
      teamName: null,
      logo: null,
      teamsGoal: null,
      teamLeader: null,
      architect: null,
      mechanicalEngineers: null,
      swEngineers: null,
      players: null,
      marketers: null,
      ref: firebase
        .firestore()
        .collection("teams")
        .doc(this.$route.params.teamId),
      heightStyle: "800px"
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

          self.teamName = team.teamName;
          self.logo = getTeamLogo(team);
          self.teamsGoal = team.teamsGoal;
          self.teamLeader = team.members
            .filter(m => m.roles.includes("Team Leader"))
            .map(m => m.name);
          self.architect = team.members
            .filter(m => m.roles.includes("Architect"))
            .map(m => m.name);
          self.mechanicalEngineers = team.members
            .filter(m => m.roles.includes("Mechanical Engineer"))
            .map(m => m.name);
          self.swEngineers = team.members
            .filter(m => m.roles.includes("SW Engineer"))
            .map(m => m.name);
          self.players = team.members
            .filter(m => m.roles.includes("Player"))
            .map(m => m.name);
          self.marketers = team.members
            .filter(m => m.roles.includes("Marketing"))
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
.cardTitleStyle {
  background-color: #fffffff4;
  position: absolute;
  bottom: 0;
  width: 100%;
}

#btnEditTeam {
  position: fixed;
  bottom: 0px;
  right: 0px;
  margin: 56px;
}
</style>
