<template>
  <div>
    <v-list two-line style="width:800px; position:relative;margin:8px auto;">
      <template v-for="(article, index) in articles">
        <v-list-tile :key="article.title" avatar @click>
          <v-list-tile-avatar>
            <img :src="article.thumbnailUrl" />
          </v-list-tile-avatar>

          <v-list-tile-content @click="showArticle(article)">
            <v-list-tile-title v-html="article.title"></v-list-tile-title>
            <v-list-tile-sub-title v-html="article.writer"></v-list-tile-sub-title>
          </v-list-tile-content>

          <span>{{ article.createdAt }}</span>

          <v-btn v-show="isSignIn" fab dark small color="cyan" @click="deleteArticle(article, index)">
            <v-icon dark>delete</v-icon>
          </v-btn>
        </v-list-tile>
      </template>
    </v-list>
    <v-btn id="btnAddNews" v-show="isSignIn" fab dark large color="cyan" href="/news/add">
      <v-icon dark>add</v-icon>
    </v-btn>
  </div>
</template>

<script>
//Basic Editor
import { Editor, EditorContent, EditorMenuBar } from "tiptap";

//Title & Contents
import { Placeholder } from "tiptap-extensions";
import Contents from "./Contents";
import Title from "./Title";

//Button
import {
  Image,
  Bold,
  Italic,
  Strike,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  Code,
  Underline,
  History,
  Blockquote,
  Link
} from "tiptap-extensions";
import Modal from "./ImageUploadModal";

export default {
  data: () => ({
    isSignIn: false,
    articles: [],
    ref: firebase.firestore().collection("articles")
  }),
  created() {
    this.isSignIn =
      localStorage.getItem("firebaseui::rememberedAccounts") != null;

    this.ref.orderBy("createdAt", "desc").onSnapshot(querySnapshot => {
      this.articles = [];
      querySnapshot.forEach(doc => {
        const article = doc.data();

        const d = new Date(article.createdAt);
        const createdAt = `${d.getFullYear()}. ${d.getMonth()+1}. ${d.getDate()} ${d.getHours()}:${d.getMinutes()}`

        this.articles.push({
          id: article.id,
          thumbnailUrl: getThumbnailUrl(article),
          title: article.title,
          subtitle: article.contents,
          writer: article.writerName,
          createdAt: createdAt
        });
      });
    });
  },
  methods: {
    showArticle(article) {
      this.$router.push({ name: "article", params: { newsId: article.id } });
    },
    deleteArticle(article, index) {
      this.ref
        .doc(article.id.toString())
        .delete()
        .then(function() {
          console.log("Article successfully deleted!");
        })
        .catch(function(error) {
          console.error("Error removing article: ", error);
        });
    }
  }
};

function getThumbnailUrl(article) {
  if (!article.thumbnailUrl) {
    return "icon_hp.png";
  } else {
    return article.thumbnailUrl;
  }
}
</script>

<style lang="scss">
// Title & Content
.editor *.is-empty:nth-child(1)::before,
.editor *.is-empty:nth-child(2)::before {
  content: attr(data-empty-text);
  float: left;
  color: #aaa;
  pointer-events: none;
  height: 0;
  font-style: italic;
}

#btnAddNews {
  position: fixed;
  bottom: 0px;
  right: 0px;
  margin: 56px;
}
</style>
