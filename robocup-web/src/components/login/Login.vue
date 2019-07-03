<template>
  <v-container fill-height style="max-width: 450px">
    <v-layout align-center row wrap>
      <div id="firebaseui-auth-container"></div>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  mounted() {
    // FirebaseUI config.
    const uiConfig = {
      signInSuccessUrl: "/",
      signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
      // Terms of service url/callback.
      tosUrl: "/",
      // Privacy policy url/callback.
      privacyPolicyUrl: function() {
        window.location.assign("/");
      }
    };

    const ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start("#firebaseui-auth-container", uiConfig);
  }
};
</script>

<style>
</style>
