<template>
  <v-app>
    <v-toolbar>
      <v-toolbar-title class="headline text-uppercase hidden-sm-and-down">
        <v-btn flat href="/" large>
          <span>HPPK 2019 Robocup</span>
        </v-btn>
      </v-toolbar-title>

      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat href="/news">
          <span class="mr-2">News</span>
        </v-btn>

        <v-btn flat href="/teams">
          <span class="mr-2">Teams</span>
        </v-btn>

        <v-btn flat href="/friendlyMatches">
          <span class="mr-2">Friendly Matches</span>
        </v-btn>

        <v-btn flat href="/rule">
          <span class="mr-2">Rule</span>
        </v-btn>
        <v-btn flat href="/gallery">
          <span class="mr-2">Gallery</span>
        </v-btn>
      </v-toolbar-items>

      <v-btn icon class="hidden-md-and-up" href="/" hover ripple>
        <v-icon>home</v-icon>
      </v-btn>

      <v-menu class="hidden-md-and-up">
        <v-toolbar-side-icon slot="activator"></v-toolbar-side-icon>
        <v-list>
          <v-list-tile href="/" hover ripple>Home</v-list-tile>
          <v-list-tile href="/news" hover ripple>News</v-list-tile>
          <v-list-tile href="/teams" hover ripple>Teams</v-list-tile>
          <v-list-tile href="/friendlyMatches" hover ripple>Friendly Matches</v-list-tile>
          <v-list-tile href="/rule" hover ripple>Rule</v-list-tile>
          <v-list-tile href="/gallery" hover ripple>Gallery</v-list-tile>
        </v-list>
      </v-menu>

      <v-spacer></v-spacer>
      <v-avatar v-show="isSignIn" :size="32" color="grey lighten-4" style="margin-right: 16px">
        <img v-bind:src="userIcon" alt="avatar" />
      </v-avatar>
      <span v-show="isSignIn" class="mr-2 hidden-sm-and-down">{{ userName }}</span>

      <v-btn v-show="isSignIn" flat class="hidden-sm-and-down">
        <span class="mr-2" @click="signOut()">Sign Out</span>
      </v-btn>
      <v-btn v-show="isSignIn" flat class="hidden-md-and-up" @click="signOut()">
        <v-icon>exit_to_app</v-icon>
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
