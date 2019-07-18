<template>
  <v-container>
    <v-layout row>
      <v-flex offset-md2 md8 id="article-view"></v-flex>
    </v-layout>
    <CommentContainer :type="type" :parentId="newsID"></CommentContainer>
  </v-container>
</template>

<script>
const BASE_FIREBASE_STORAGE_URL =
  "https://firebasestorage.googleapis.com/v0/b/hppk-robocup-2019.appspot.com/o/";

import CommentContainer from "../../comments/CommentContainer";

export default {
  components: {
    CommentContainer
  },
  data() {
    return {
      type: "articles",
      isSignIn: false,
      title: null,
      writer: null,
      newsID: this.$route.params.newsId.toString(),
      ref: firebase
        .firestore()
        .collection("articles")
        .doc(this.$route.params.newsId.toString()),
      items: [
        {
          src: "https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg"
        }
      ],
    };
  },
  created() {
    console.log("created");
    this.isSignIn =
      localStorage.getItem("firebaseui::rememberedAccounts") != null;

    var totalDoc;

    this.ref
      .get()
      .then(doc => {
        if (doc.exists) {
          const article = doc.data();
          totalDoc = "<h1>" + article.title + "</h1>";
          console.log(totalDoc);

          firebase
            .firestore()
            .collection("articles-contents")
            .doc(this.newsID)
            .get()
            .then(function(doc) {
              if (doc.exists) {
                const articleContents = doc.data();
                totalDoc = totalDoc + articleContents.contents;
                console.log(totalDoc);
                var articleView = document.getElementById("article-view");
                articleView.innerHTML = totalDoc;
              } else {
                console.error("No such Contents!");
              }
            })
            .catch(function(error) {
              console.error("Error getting Contents:", error);
            });
        } else {
          console.error("No such Title!");
        }
      })
      .catch(function(error) {
        console.error("Error getting Title:", error);
      });
  }
};
</script>