<template>
  <div id="article-view" style="margin:20px 20px 20px 20px"></div>
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
      newsID : this.$route.params.newsId.toString(),
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
    
    var newsID = this.newsID;

    this.ref
      .get()
      .then(function(doc) {
        if (doc.exists) {
          const article = doc.data();
          totalDoc = "<h1>" + article.title + "</h1>";
          console.log(totalDoc);
          
          firebase
            .firestore()
            .collection("articles-contents")
            .doc(newsID)
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