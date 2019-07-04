<template>
  <div class="details">
    <div class="container">
      <h1 class="text-primary text-center">{{teamName}}</h1>Leader
      <p></p>
      <h2>{{ teamLeader }}</h2>
      <p></p>
      <p>Architect</p>
      <h2>{{ architect }}</h2>
      <p></p>
      <p>Mechanical Engineer</p>
      <h2>{{ mechanicalEngineer }}</h2>
      <p></p>
      <p>Sw Engineer</p>
      <h2>{{ swEngineer }}</h2>
      <p></p>
      <p>Player</p>
      <h2>{{ player }}</h2>
      <p></p>
      <p>Marketing</p>
      <h2>{{ marketing }}</h2>
    </div>
  </div>
</template>

<script>
// const BASE_FIREBASE_STORAGE_URL = "https://firebasestorage.googleapis.com/v0/b/hppk-robocup-2019.appspot.com/o/";

export default {
  data() {
    return {
      isSignIn: false,
      teamName: null,
      teamLeader: null,
      architect: null,
      mechanicalEngineer: null,
      swEngineer: null,
      player: null,
      marketing: null,
      ref: firebase
        .firestore()
        .collection("teams")
        .doc(this.$route.params.teamId)
    };
  },
  created() {
    this.isSignIn =
      localStorage.getItem("firebaseui::rememberedAccounts") != null;

    let self = this;

    this.ref
      .get()
      .then(function(doc) {
        if (doc.exists) {
          const team = doc.data();
          console.log("Document data:", team);
          self.teamName = team.teamName;
          self.teamLeader = team.members.teamLeader[0];
          self.architect = team.members.architect[0];
          self.mechanicalEngineer = team.members.mechanicalEngineer;
          self.swEngineer = team.members.swEngineer;
          self.player = team.members.player;
          self.marketing = team.members.marketing;

          // self.writer = team.writerName;
          // self.contents = team.contents;

          // team.attachments
          //   .filter(a => a.path.length > 0 && a.type == "img")
          //   .map(a => {
          //     return {
          //       src: `${BASE_FIREBASE_STORAGE_URL}${a.path.replace("/", "%2F")}?alt=media`
          //     };
          //   })
          //   .forEach(item => {
          //     self.items.push(item);
          //   });
        } else {
          console.error("No such document!");
        }
      })
      .catch(function(error) {
        console.error("Error getting document:", error);
      });
  }
};
</script>