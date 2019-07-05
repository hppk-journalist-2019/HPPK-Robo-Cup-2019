<template>
  <v-app>
    <v-toolbar>
      <v-toolbar-title class="headline text-uppercase">
        <v-btn flat href="/" large>
          <span>HPPK 2019 Robocup</span>
        </v-btn>
      </v-toolbar-title>

      <v-btn flat href="/news">
        <span class="mr-2">News</span>
      </v-btn>

      <v-btn flat href="/teams">
        <span class="mr-2">Teams</span>
      </v-btn>

      <v-btn flat href="/matches">
        <span class="mr-2">Matches</span>
      </v-btn>

      <v-spacer></v-spacer>
      <v-avatar v-show="isSignIn" :size="32" color="grey lighten-4" style="margin-right: 16px">
        <img v-bind:src="userIcon" alt="avatar" />
      </v-avatar>
      <span v-show="isSignIn" class="mr-2">{{ userName }}</span>

      <v-btn v-show="isSignIn" flat>
        <span class="mr-2" @click="signOut()">Sign Out</span>
      </v-btn>
    </v-toolbar>

    <v-snackbar v-model="snackbar" :timeout="3000">You have successfully signed out!</v-snackbar>
    <router-view></router-view>
  </v-app>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "App",
  components: {},
  data() {
    return {
      snackbar: false,
      isSignIn: false
    };
  },
  mounted() {
    this.isSignIn = this.isSignInUser;
  },
  computed: {
    userInfo() {
      return JSON.parse(localStorage.getItem("firebaseui::rememberedAccounts"));
    },

    isSignInUser() {
      return this.userInfo != null;
    },
    userName() {
      if (this.isSignInUser) {
        return this.userInfo[0].displayName;
      } else {
        return null;
      }
    },
    userIcon() {
      if (this.isSignInUser) {
        return this.userInfo[0].photoUrl;
      } else {
        return null;
      }
    }
  },
  methods: {
    signOut() {
      this.isSignIn = false;
      this.$store.dispatch("signOut");
      this.snackbar = true;
    }
  }
};
</script>
