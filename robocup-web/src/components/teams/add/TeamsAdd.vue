<template>
  <v-container style="max-width: 800px" grid-list-xl>
    <v-layout wrap align-center>
      <v-form ref="form" v-model="valid">
        <h1>Resgister a new Team</h1>
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
        <v-icon>group</v-icon>
        <input id="teamLogo" type="file" accept="image" @change="selectTeamLogo" ref="file" />

        <h1>Team's Goal (포부, 한마디)</h1>
        <v-text-field v-model="teamsGoal" :rules="baseRules" label="Team's Goal" required></v-text-field>
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

        <v-btn fab dark small color="cyan" @click="deleteMember(member, index)">
          <v-icon dark>delete</v-icon>
        </v-btn>
      </v-list-tile>
    </template>
    <!-- <v-icon @click="uploadImage">image</v-icon> -->
    <!-- <input type="file" accept="image" @change="uploadImage" /> -->
    <v-btn dark large color="cyan" @click="save">Save</v-btn>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    valid: true,
    valid2: true,
    isSignIn: false,
    teamIds: [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
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
    opRoles: ["Setting", "Manage", "Rule Maker"],
    jnRoles: ["Team Leader", "취재", "웹 개발"],
    roles: [],
    baseRules: [
      v => !!v || "required",
      v => (v && v.length <= 30) || "Team name must be less than 30 characters"
    ],
    teamId: null,
    teamName: null,
    teamsGoal: null,
    userName: null,
    userRoles: null,
    teamMembers: [],
    teamLogoImage: null
  }),
  created() {
    this.isSignIn =
      localStorage.getItem("firebaseui::rememberedAccounts") != null;
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
        console.log(this.teamMembers);

        // Upload team logo
        const teamLogoPath = getTeamLogoPath(
          this.teamName,
          this.teamLogoImage.name
        );
        const storageRef = firebase.storage().ref();
        const ref = storageRef.child(teamLogoPath);
        ref.put(this.teamLogoImage).then(function(snapshot) {
          console.log("Uploaded a blob or file");
        });

        const teamId = `team_${this.teamId}`;
        // Save into the Fiebase Firestore
        firebase
          .firestore()
          .collection("teams")
          .doc(teamId)
          .set({
            id: teamId,
            teamName: this.teamName,
            teamLogoPath: teamLogoPath,
            members: this.teamMembers
          })
          .then(function() {
            router.push("/teams");
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
      this.teamLogoImage = e.target.files[0];
    }
  }
};

function getTeamLogoPath(teamName, originName) {
  const ext = originName.split(".").splice(-1)[0];
  return `teams/logo/${teamName}.${ext}`;
}
</script>

<style>
</style>
