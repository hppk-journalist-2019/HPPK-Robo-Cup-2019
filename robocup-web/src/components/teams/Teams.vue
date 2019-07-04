<template>
  <div>
    <div>Teams</div>
    <v-btn v-show="isSignIn" fab dark large color="cyan" href="/teams/add">
      <v-icon dark>add</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  data: () => ({
    isSignIn: false,
    // teams: [],
    // ref: firebase.firestore().collection("teams")
  }),
  created() {
    this.isSignIn =
      localStorage.getItem("firebaseui::rememberedAccounts") != null;

    // todo: Get team list
    // this.ref.onSnapshot(querySnapshot => {
    //   this.articles = [];
    //   querySnapshot.forEach(doc => {
    //     const article = doc.data();
    //     this.articles.push({
    //       id: article.id,
    //       thumbnailUrl: getThumbnailUrl(article),
    //       title: article.title,
    //       subtitle: article.contents,
    //       writer: article.writerName
    //     });
    //   });
    // });
  }
};
</script>

<style>
</style>
