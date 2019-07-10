<template>
  <v-container>
    <v-layout row wrap>
      <v-flex>Friendly Matches</v-flex>
      <v-btn id="fabAdd" v-show="isSignIn" fab dark large color="cyan" href="/friendlyMatches/add">
        <v-icon dark>add</v-icon>
      </v-btn>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    isSignIn: false
  }),
  created() {
    this.isSignIn =
      localStorage.getItem("firebaseui::rememberedAccounts") != null;
  }
};
</script>

<style>
</style>
