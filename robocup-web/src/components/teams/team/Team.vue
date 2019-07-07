<template>
  <v-container fluid pa-0 style="background-color: #3A6031;">
    <v-layout fill-height>
      <!-- <v-flex v-for="(team, index) in teams" :key="team.teamName" xs3 style="padding: 1px"> -->
      <v-flex offset-xs2 xs4>
        <h1>{{teamName}}</h1>
        <v-avatar size="72px" color="grey lighten-4">
          <img :src="logo" />
        </v-avatar>

        <p>Leader</p>
        <h2>{{ teamLeader }}</h2>

        <p>Architect</p>
        <h2>{{ architect }}</h2>

        <p>Player</p>
        <h2>{{ players }}</h2>

        <p>Sw Engineer</p>
        <h2>{{ swEngineers }}</h2>

        <p>Mechanical Engineer</p>
        <h2>{{ mechanicalEngineers }}</h2>

        <p>Marketer</p>
        <h2>{{ marketers }}</h2>
      </v-flex>
      <v-flex xs6 style="position:relative; color:white" pa-5>
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
              style="position:relative; top:24px"
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
          <v-layout justify-space-around style="position:absolute; bottom:72px; width:100%">
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
              style="position:relative; top:50px;"
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
              style="position:relative; top:122px"
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
          console.log("Document data:", team);

          self.teamName = team.teamName;
          self.logo = getTeamLogo(team);
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

          // self.writer = team.writerName;
          // self.contents = team.contents;

          // team.attachments
          //   .filter(a => a.path.length > 0 && a.type == "img")
          //   .map(a => {
          //     return {
          //       src: `${BASE_FIREBASE_STORAGE_URL}${a.path.replace("/", "%2F")}?alt=media`
          //     };
          //   })
          //   .forEach(item => {
          //     self.items.push(item);
          //   });
        } else {
          console.error("No such document!");
        }
      })
      .catch(function(error) {
        console.error("Error getting document:", error);
      });
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