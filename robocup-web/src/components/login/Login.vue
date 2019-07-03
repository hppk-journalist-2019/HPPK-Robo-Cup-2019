<template>
  <div>
    <div id="firebaseui-auth-container"></div>
  </div>
</template>

<script>
export default {
  mounted: function() {
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
