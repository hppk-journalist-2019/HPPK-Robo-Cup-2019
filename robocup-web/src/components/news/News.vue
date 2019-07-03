<template>
  <div>
    <v-list two-line>
      <template v-for="(article, index) in articles
">
        <v-subheader v-if="article.header" :key="article.header">{{ article.header }}</v-subheader>

        <v-divider v-else-if="article.divider" :key="index" :inset="article.inset"></v-divider>

        <v-list-tile v-else :key="article.title" avatar @click>
          <v-list-tile-avatar>
            <img :src="article.avatar" />
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title v-html="article.title"></v-list-tile-title>
            <v-list-tile-sub-title v-html="article.writer"></v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>
    <v-btn v-show="isSignIn" fab dark large color="cyan" href="/news/add">
      <v-icon dark>add</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  data: () => ({
    isSignIn: false,
    articles: [],
    ref: firebase.firestore().collection("articles")
  }),
  created() {
    this.isSignIn =
      localStorage.getItem("firebaseui::rememberedAccounts") != null;

    this.ref.onSnapshot(querySnapshot => {
      this.articles = [];
      querySnapshot.forEach(doc => {
        const article = doc.data();
        this.articles.push({
          thumbnailUrl: getThumbnailUrl(article),
          title: article.title,
          subtitle: article.contents,
          writer: article.writerName
        });
      });
    });
  }
};

function getThumbnailUrl(article) {
  // const article = {
  //   attachments: generateAttachments(this.imageFilePath)
  // };
}
</script>

<style>
</style>
