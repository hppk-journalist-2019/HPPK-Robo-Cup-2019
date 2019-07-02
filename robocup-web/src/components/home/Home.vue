<template>
  <v-container>
    <v-layout text-xs-center wrap>
      {{ userName }}
      <v-flex xs12>
        <v-img :src="require('../../assets/logo.svg')" class="my-3" contain height="200"></v-img>
      </v-flex>

      <v-flex mb-4>
        <h1 class="display-2 font-weight-bold mb-3">Welcome to HPPK 2019 Robocup</h1>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
let displayName = "";
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;
    console.log(displayName);
  } else {
  }
});

export default {
  data: () => ({}),
  watch: {
    userName: displayName
  }
};
</script>

<style>
</style>
