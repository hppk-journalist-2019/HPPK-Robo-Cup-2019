<template>
  <v-container fluid pa-0 style="background:white">
    <v-layout row fill-height>
      <v-flex>
        <v-list>
          <v-flex v-for="(article, index) in articles" :key="article.title" sm6 offset-sm3 mt-3>
            <v-card
              hover="true"
              :img="article.thumbnailUrl"
              height="351px"
              style="position: relative"
              @click="showArticle(article)"
            >
              <v-card-title class="newsCardTitleStyle" @click="showArticle(article)">
                <div>
                  <span class="grey--text">{{ article.createdAt }}</span>
                  <br />
                  <h1>{{article.title}}</h1>
                </div>
              </v-card-title>
              <v-card-actions class="newsCardActionStyle">
                <v-spacer></v-spacer>
                <v-list-tile-avatar>
                  <img :src="article.writerPhotoUrl" />
                </v-list-tile-avatar>
                {{ article.writer }}
                <v-btn
                  v-show="isSignIn"
                  flat
                  color="cyan"
                  @click="deleteArticle(article, index)"
                >delete</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-list>
      </v-flex>
      <v-btn id="btnAddNews" v-show="isSignIn" fab dark large color="cyan" href="/news/add">
        <v-icon dark>add</v-icon>
      </v-btn>
    </v-layout>
  </v-container>
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

const BASE_FIREBASE_STORAGE_URL =
  "https://firebasestorage.googleapis.com/v0/b/hppk-robocup-2019.appspot.com/o/";

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
        const createdAt = `${d.getFullYear()}. ${d.getMonth() +
          1}. ${d.getDate()} ${d.getHours()}:${d.getMinutes()}`;

        this.articles.push({
          id: article.id,
          thumbnailUrl: getThumbnailUrl(article),
          title: article.title,
          subtitle: article.contents,
          writer: article.writerName,
          writerPhotoUrl: article.writerPhotoUrl,
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
  if (article.thumbnailUrl) {
    return `${BASE_FIREBASE_STORAGE_URL}${article.thumbnailUrl.replace(
      "/",
      "%2F"
    )}?alt=media`;
  } else {
    return "icon_hp.png";
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

.newsCardTitleStyle {
  padding-top: 8px;
  padding-bottom: 0;
  background-color: #ffffffdd;
  position: absolute;
  bottom: 48px;
  width: 100%;
}

.newsCardActionStyle {
  padding-top: 0;
  padding-bottom: 8px;
  background-color: #ffffffdd;
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>
