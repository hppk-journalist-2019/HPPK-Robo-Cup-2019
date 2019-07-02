<template>
  <div>
    <div id="firebaseui-auth-container"></div>
  </div>
</template>

<script>
export default {
  mounted: function() {
    // FirebaseUI config.
    var uiConfig = {
      signInSuccessUrl: "/",
      signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
      // tosUrl and privacyPolicyUrl accept either url string or a callback
      // function.
      // Terms of service url/callback.
      tosUrl: "/",
      // Privacy policy url/callback.
      privacyPolicyUrl: function() {
        window.location.assign("/");
      }
    };

    // Initialize the FirebaseUI Widget using Firebase.
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    // The start method will wait until the DOM is loaded.
    ui.start("#firebaseui-auth-container", uiConfig);
  }
};
</script>

<style>
</style>
