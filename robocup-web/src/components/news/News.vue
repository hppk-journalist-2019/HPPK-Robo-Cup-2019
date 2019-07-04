<template>
  <div>
    <v-list two-line>
      <template v-for="(article, index) in articles">
        <v-subheader v-if="article.header" :key="article.header">{{ article.header }}</v-subheader>

        <v-divider v-else-if="article.divider" :key="index" :inset="article.inset"></v-divider>

        <v-list-tile v-else :key="article.title" avatar @click="showArticle(article)">
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

    this.ref.onSnapshot(querySnapshot => {
      this.articles = [];
      querySnapshot.forEach(doc => {
        const article = doc.data();
        this.articles.push({
          id: article.id,
          thumbnailUrl: getThumbnailUrl(article),
          title: article.title,
          subtitle: article.contents,
          writer: article.writerName
        });
      });
    });
  },
  methods: {
    showArticle(article) {
      this.$router.push({ name: "article", params: { newsId: article.id } });
    }
  }
};

function getThumbnailUrl(article) {
  // const article = {
  //   attachments: generateAttachments(this.imageFilePath)
  // };
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
</style>
