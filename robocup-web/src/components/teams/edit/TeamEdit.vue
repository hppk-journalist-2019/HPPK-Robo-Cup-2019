<template>
  <v-container style="max-width: 800px" grid-list-xl>
    <v-layout wrap align-center>
      <v-form ref="form" v-model="valid">
        <h1>Edit Team</h1>
        <v-select
          style="display:inline"
          class="ml-5 mr-5"
          v-model="teamId"
          :items="teamIds"
          label="Team Id"
          :rules="baseRules"
          @change="selectTeamId()"
          required
        />
        <v-text-field v-model="teamName" :rules="baseRules" label="Team Name" required></v-text-field>

        <h1>Team Logo</h1>
        <v-avatar size="56px" color="grey lighten-4">
          <img :src="logo" />
        </v-avatar>
        <input id="teamLogo" type="file" accept="image" @change="selectTeamLogo" ref="file" />

        <h1>Team's Goal (포부, 한마디)</h1>
        <v-text-field v-model="teamsGoal" label="Team's Goal"></v-text-field>
      </v-form>

      <v-form ref="form2" v-model="valid2" class="mt-5">
        <v-flex xs10>
          <h2>Add Members</h2>
          <v-layout align-center justify-center row fill-height>
            <v-text-field class="mr-5" v-model="userName" label="Name" required :rules="baseRules" />
            <v-select
              class="ml-5 mr-5"
              v-model="userRoles"
              :items="roles"
              label="Role"
              multiple
              chips
              :rules="baseRules"
            />

            <v-btn fab outline small color="cyan" @click="addMember">
              <v-icon>add</v-icon>
            </v-btn>
          </v-layout>
        </v-flex>
      </v-form>
    </v-layout>

    <template v-for="(member, index) in teamMembers">
      <v-subheader v-if="member.header" :key="member.header">{{ member.header }}</v-subheader>
      <v-divider v-else-if="member.divider" :key="index" :inset="member.inset"></v-divider>
      <v-list-tile v-else :key="member.name" avatar style="height: 76px">
        <v-list-tile-avatar>
          <img :src="member.avatar" />
        </v-list-tile-avatar>
        <v-list-tile-content style="height: 76px">
          <v-list-tile-title v-html="member.name"></v-list-tile-title>
          <v-layout>
            <template column v-for="role in member.roles">
              <div class="text-xs-center" :key="role">
                <v-chip>{{ role }}</v-chip>
              </div>
            </template>
          </v-layout>
        </v-list-tile-content>

        <v-btn fab outline dark small color="cyan" @click="deleteMember(member, index)">
          <v-icon dark>remove</v-icon>
        </v-btn>
      </v-list-tile>
    </template>
    <v-btn dark large color="cyan" @click="save">Save</v-btn>
  </v-container>
</template>

<script>
const BASE_FIREBASE_STORAGE_URL =
  "https://firebasestorage.googleapis.com/v0/b/hppk-robocup-2019.appspot.com/o/";

export default {
  data() {
    return {
      valid: true,
      valid2: true,
      isSignIn: false,
      teamIds: [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "OP",
        "JN"
      ],
      devRoles: [
        "Team Leader",
        "Architect",
        "Mechanical Engineer",
        "SW Engineer",
        "Player",
        "Marketing"
      ],
      opRoles: ["Team Leader", "Setting", "Manage", "Rule Maker"],
      jnRoles: ["Team Leader", "취재", "웹 개발"],
      roles: [],
      baseRules: [
        v => !!v || "required",
        v =>
          (v && v.length <= 30) || "Team name must be less than 30 characters"
      ],
      teamId: null,
      teamName: null,
      logo: null,
      logoPath: null,
      isLogoChanged: false,
      teamsGoal: null,
      userName: null,
      userRoles: null,
      teamMembers: [],
      teamLogoImage: null,
      ref: firebase
        .firestore()
        .collection("teams")
        .doc(this.$route.params.teamId)
    };
  },
  created() {
    console.log("teamId: " + this.$route.params.teamId);
    this.isSignIn =
      localStorage.getItem("firebaseui::rememberedAccounts") != null;

    let self = this;
    this.ref
      .get()
      .then(function(doc) {
        if (doc.exists) {
          const team = doc.data();
          console.log("team: " + team);
          self.teamId = getTeamIdText(team.id);
          self.teamName = team.teamName;
          self.logo = getTeamLogo(team);
          self.logoPath = team.teamLogoPath;
          self.teamsGoal = team.teamsGoal;
          self.teamMembers = team.members;
        } else {
          console.error("No such document!");
        }
      })
      .catch(function(error) {
        console.error("Error getting document:", error);
      });
  },
  methods: {
    addMember() {
      if (this.$refs.form2.validate()) {
        const member = {
          name: this.userName,
          roles: this.userRoles
        };
        this.teamMembers.push(member);
        this.userName = null;
        this.userRoles = null;
        this.$refs.form2.resetValidation();
      }
    },
    deleteMember(member, index) {
      this.teamMembers.splice(index, 1);
    },
    save() {
      if (this.$refs.form.validate()) {
        const router = this.$router;
        console.log("member: " + JSON.stringify(this.teamMembers));

        // Upload team logo
        const teamLogoPath = this.logoPath

        if (this.isLogoChanged) {
          if (!teamLogoPath.includes("icon_hp.png")) {
            const ref = firebase.storage().ref().child(teamLogoPath);
            ref.put(this.teamLogoImage).then(function(snapshot) {
              console.log("Uploaded a blob or file");
            });
          }
        }

        const teamId = `team_${this.teamId}`;
        const type = getTeamType(this.teamId);
        // Save into the Fiebase Firestore
        firebase
          .firestore()
          .collection("teams")
          .doc(teamId)
          .set({
            id: teamId,
            teamName: this.teamName,
            teamLogoPath: teamLogoPath,
            teamsGoal: this.teamsGoal,
            members: this.teamMembers,
            type: type
          })
          .then(function() {
            router.push({ name: "team", params: { teamId: teamId } });
          })
          .catch(function(error) {
            console.error("Error writing document: ", error);
            // todo: Show error popup
          });
      }
    },
    selectTeamId() {
      console.log(this.teamId);
      if (this.teamId == "OP") {
        this.roles = this.opRoles;
      } else if (this.teamId == "JN") {
        this.roles = this.jnRoles;
      } else {
        this.roles = this.devRoles;
      }
    },
    selectTeamLogo(e) {
      this.isLogoChanged = true;
      this.teamLogoImage = e.target.files[0];
      this.logoPath = `teams/logo/${e.target.files[0].name}`;
    }
  }
};

function getTeamIdText(id) {
  if (id.includes("team")) {
    return id.slice(5);
  } else {
    return id;
  }
}

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

function getTeamType(teamId) {
  switch (teamId) {
    case "OP":
      return "OP";
    case "JN":
      return "JN";
    default:
      return "DEV";
  }
}

function getTeamLogoPath(teamName, originFile) {
  if (originFile === undefined || originFile === null) {
    return "icon_hp.png";
  }

  const ext = originFile.name.split(".").splice(-1)[0];
  return `teams/logo/${teamName}.${ext}`;
}
</script>

<style>
</style>
