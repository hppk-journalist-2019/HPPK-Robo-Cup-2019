<template>
  <div class="details">
    <div class="container">
      <h1 class="text-primary text-center">{{title}}</h1>
      <v-carousel>
        <v-carousel-item v-for="(item,i) in items" :key="i" :src="item.src"></v-carousel-item>
      </v-carousel>
      <h4>{{ writer }}</h4>
      <h2>{{ contents }}</h2>
    </div>
  </div>
</template>

<script>
const BASE_FIREBASE_STORAGE_URL = "https://firebasestorage.googleapis.com/v0/b/hppk-robocup-2019.appspot.com/o/";

export default {
  data() {
    return {
      isSignIn: false,
      title: null,
      writer: null,
      contents: null,
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
    this.isSignIn =
      localStorage.getItem("firebaseui::rememberedAccounts") != null;

    let self = this;

    this.ref
      .get()
      .then(function(doc) {
        if (doc.exists) {
          const article = doc.data();
          console.log("Document data:", article);
          self.title = article.title;
          self.writer = article.writerName;
          self.contents = article.contents;

          article.attachments
            .filter(a => a.path.length > 0 && a.type == "img")
            .map(a => {
              return {
                src: `${BASE_FIREBASE_STORAGE_URL}${a.path.replace("/", "%2F")}?alt=media`
              };
            })
            .forEach(item => {
              self.items.push(item);
            });
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