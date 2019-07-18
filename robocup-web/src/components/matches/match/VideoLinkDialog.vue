<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn class="hidden-sm-and-down" v-show="isSignIn" dark small color="cyan" v-on="on">
        <v-icon dark>video_call</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Facebook Video (Live)</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field label="URL" required v-model="facebookVideoUrl"></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
        <v-btn color="blue darken-1" flat @click="onLiveVideoClicked">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["facebookVideoUrl"],
  data: () => ({
    facebookVideoUrl: "",
    dialog: false,
    isSignIn: false,
  }),
  created() {
    this.isSignIn =
      localStorage.getItem("firebaseui::rememberedAccounts") != null;
  },
  methods: {
    onLiveVideoClicked() {
      this.dialog = false
      console.log("facebook url: " + this.facebookVideoUrl)
      this.$emit('addVideo', this.facebookVideoUrl);
    }
  },
};
</script>

<style>
</style>
