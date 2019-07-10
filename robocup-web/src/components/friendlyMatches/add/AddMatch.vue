<template>
  <v-container>
    <v-layout row wrap>
      <v-flex>Add Friendly Match</v-flex>
      <v-btn id="fabAdd" v-show="isSignIn" fab dark large color="cyan" @click="save">
        <v-icon dark>check</v-icon>
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
  },
  methods: {
      save() {
          this.$router.push("/friendlyMatches");
      }
  }
};
</script>

<style>
</style>
