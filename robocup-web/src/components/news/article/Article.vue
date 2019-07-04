<template>
  <div id="article-view"></div>
</template>

<script>
const BASE_FIREBASE_STORAGE_URL =
  "https://firebasestorage.googleapis.com/v0/b/hppk-robocup-2019.appspot.com/o/";

export default {
  data() {
    return {
      isSignIn: false,
      title: null,
      writer: null,
      ref: firebase
        .firestore()
        .collection("articles")
        .doc(this.$route.params.newsId.toString()),
      items: [
        {
          src: "https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg"
        }
      ]
    };
  },
  created() {
    console.log("created");
    this.isSignIn =
      localStorage.getItem("firebaseui::rememberedAccounts") != null;

    var totalDoc;
    var articleView = document.getElementById("article-view");

    this.ref
      .get()
      .then(function(doc) {
        if (doc.exists) {
          const article = doc.data();
          totalDoc = article.title;
          firebase
            .firestore()
            .collection("articles-contents")
            .doc(this.$route.params.newsId.toString())
            .get()
            .then(function(doc) {
              if (doc.exists) {
                const articleContents = doc.data();
                totalDoc = totalDoc + articleContents.contents;
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