<template>
  <div>
    <v-form ref="form" v-model="valid">
      <h1>Resgister a new Team</h1>
      <v-text-field v-model="teamName" :rules="teamNameRules" label="Team Name" required></v-text-field>
    </v-form>
    <v-form ref="form2" v-model="valid2">
      <v-flex xs10>
        <h2>Add Members</h2>
        <v-layout align-center justify-center row fill-height>
          <v-text-field v-model="userName" label="Name" required :rules="memberNameRules"></v-text-field>
          <v-select
            v-model="userRoles"
            :items="roles"
            label="Role"
            multiple
            chips
            persistent-hint
            :rules="memberRoleRules"
          ></v-select>

          <v-btn fab dark small color="cyan" @click="addMember">
            <v-icon dark>add</v-icon>
          </v-btn>
        </v-layout>
      </v-flex>
    </v-form>

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
  </div>
</template>

<script>
export default {
  data: () => ({
    valid: true,
    valid2: true,
    isSignIn: false,
    roles: [
      "Team Leader",
      "Architect",
      "Mechanical Engineer",
      "SW Engineer",
      "Player",
      "Marketing"
    ],
    teamNameRules: [
      v => !!v || "Team name is required",
      v => (v && v.length <= 30) || "Team name must be less than 30 characters"
    ],
    memberNameRules: [
      v => !!v || "Member name is required",
      v =>
        (v && v.length <= 20) || "Member name must be less than 30 characters"
    ],
    memberRoleRules: [
      v => !!v || "Member role is required",
      v =>
        (v && v.length <= 20) || "Member role must be less than 30 characters"
    ],
    teamName: null,
    userName: null,
    userRoles: null,
    teamMembers: []
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

        const members = {
          teamLeader: [],
          architect: [],
          mechanicalEngineer: [],
          swEngineer: [],
          player: [],
          markting: []
        };
        this.teamMembers.forEach(m => {
          m.roles.forEach(r => {
            switch (r) {
              case "Team Leader":
                members.teamLeader.push(m.name);
                break;
              case "Architect":
                members.architect.push(m.name);
                break;
              case "Mchanical Engineer":
                members.mechanicalEngineer.push(m.name);
                break;
              case "SW Engineer":
                members.swEngineer.push(m.name);
                break;
              case "Player":
                members.player.push(m.name);
                break;
              default:
                members.markting.push(m.name);
                break;
            }
          });
        });

        // Save into the Fiebase Firestore
        firebase
          .firestore()
          .collection("teams")
          .doc(this.teamName)
          .set({
            teamName: this.teamName,
            members: members
          })
          .then(function() {
            router.push("/teams");
          })
          .catch(function(error) {
            console.error("Error writing document: ", error);
            // todo: Show error popup
          });
      }
    }
  }
};
</script>

<style>
</style>
