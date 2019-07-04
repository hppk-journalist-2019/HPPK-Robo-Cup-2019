<template>
  <div>
    <v-container
      fluid
      pa-0
      style="max-width:100%;max-height:100%; height:400px; background-image: url('journalist.jpg'); background-size: cover; background-position: center center;"
    >
      <v-layout
        pa-5
        text-xs-center
        style="background-color: #00000099; color:#FFFFFF; height:400px"
      >
        <v-flex>
          <h1 class="font-weight-bold mt-5">Are you a journalist?</h1>
          <h1 class="display-4 font-weight-bold mt-5">Join in!</h1>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container fill-height style="max-width: 450px">
      <v-layout align-center row wrap>
        <div id="firebaseui-auth-container"></div>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  mounted() {
    // FirebaseUI config.
    const uiConfig = {
      signInFlow: 'popup',
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
