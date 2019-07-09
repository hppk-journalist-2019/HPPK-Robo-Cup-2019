<template>
  <div class="editor">
    <Modal ref="ytmodal" @onConfirm="addCommand" />
    <div class="header" style="height:40px">
      <editor-menu-bar
        :editor="editor"
        v-slot="{ commands, isActive}"
        style="height:35px;border-bottom:1px solid;padding-top:5px;"
      >
        <div class="menubar">
          <button @click="openModal(commands.image)">
            <v-icon color="green">add_photo_alternate</v-icon>
          </button>
          &nbsp;
          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.bold() }"
            @click="commands.bold"
          >
            <v-icon color="black">format_bold</v-icon>
          </button>
          &nbsp;
          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.italic() }"
            @click="commands.italic"
          >
            <v-icon color="black">format_italic</v-icon>
          </button>
          &nbsp;
          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.strike() }"
            @click="commands.strike"
          >
            <v-icon color="black">format_strikethrough</v-icon>
          </button>
          &nbsp;
          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.underline() }"
            @click="commands.underline"
          >
            <v-icon color="black">format_underlined</v-icon>
          </button>
          &nbsp;
          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.code() }"
            @click="commands.code"
          >
            <v-icon color="black">code</v-icon>
          </button>
          &nbsp;
          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.heading({ level: 1 }) }"
            @click="commands.heading({ level: 1 })"
          >H1</button>
          &nbsp;
          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.heading({ level: 2 }) }"
            @click="commands.heading({ level: 2 })"
          >H2</button>
          &nbsp;
          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.heading({ level: 3 }) }"
            @click="commands.heading({ level: 3 })"
          >H3</button>
          &nbsp;
          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.bullet_list() }"
            @click="commands.bullet_list"
          >
            <v-icon color="black">format_list_bulleted</v-icon>
          </button>
          &nbsp;
          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.ordered_list() }"
            @click="commands.ordered_list"
          >
            <v-icon color="black">format_list_numbered</v-icon>
          </button>
          &nbsp;
          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.blockquote() }"
            @click="commands.blockquote"
          >
            <v-icon color="black">format_quote</v-icon>
          </button>
          &nbsp;
          <button class="menubar__button" @click="commands.horizontal_rule">
            <v-icon color="black">remove</v-icon>
          </button>
          &nbsp;
          <button class="menubar__button" @click="commands.undo">
            <v-icon color="green">undo</v-icon>
          </button>
          &nbsp;
          <button class="menubar__button" @click="commands.redo">
            <v-icon color="green">redo</v-icon>
          </button>          
        </div>
      </editor-menu-bar>
    </div>
    <div class="container" style="overflow:scroll;height:600px">
      <div class="content-body" style="height:600px;border:1px solid">
        <editor-content
          id="editorContent"
          style="height:500px"
          class="editor__content"
          :editor="editor"
          ref="editor_low"
        />
      </div>
    </div>
    <!-- Simple Editor -->
    <div class="footer" style="height:100px;padding-left:15px">
      <div>
        <h1>Please select thumbnail</h1>
      </div>
      <div>
        <img id="thumbnail" height="100px" width="100px" style="border:1px solid" />
      </div>
      <div style="padding-left:10px">
        <input id="sel" type="file" @change="selectImage" ref="file" />
      </div>
      <div class="save-article" style="float:right">
        <v-btn id="save-btn" color="cyan" @click="save">
          <v-icon dark>check</v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
//Basic Editor
import { Editor, EditorContent, EditorMenuBar } from "tiptap";

//Title & Contents
import { Placeholder } from "tiptap-extensions";
import Contents from "./Contents-edit";
import Title from "./Title-edit";
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
import Modal from "./ImageUploadModal-edit";
const BASE_FIREBASE_STORAGE_URL =
  "https://firebasestorage.googleapis.com/v0/b/hppk-robocup-2019.appspot.com/o/";
var thumbnailFilePath = "";
export default {
  components: {
    EditorContent,
    EditorMenuBar,
    Modal
  },
  data() {
    return {
      title: "Test Title", // todo: Temp value, should be removed
      contents: "Test Article", // todo: Temp value, should be removed
      newsID: this.$route.params.newsId.toString(), //this.$route.params.newsId.toString(),
      ref: firebase
        .firestore()
        .collection("articles")
        .doc(this.$route.params.newsId.toString()),
      thumbnailFile: null,
      isUploading: false,
      editor: new Editor({
        autoFocus: true,
        extensions: [
          //Editor Icon
          new Image(),
          new Bold(),
          new Italic(),
          new Strike(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new HorizontalRule(),
          new OrderedList(),
          new BulletList(),
          new ListItem(),
          new Code(),
          new Underline(),
          new History(),
          new Blockquote(),
          new Link(),

          //Title & Body
          new Contents(),
          new Title(),
          new Placeholder({
            showOnlyCurrent: false,
            emptyNodeText: node => {
              if (node.type.name === "title") {
                return "Title";
              }
              return "Contents";
            }
          })
        ]
      })
    };
  },
  beforeCreate() {},
  mounted() {
    var totalDoc;

    var newsID = this.newsID;
    var editor = this.editor;

    this.ref
      .get()
      .then(function(doc) {
        if (doc.exists) {
          const article = doc.data();
          totalDoc = "<h1>" + article.title + "</h1>";
          if(article.thumbnailUrl != null && article.thumbnailUrl != ""){
            var thumbnailView = document.getElementById("thumbnail");
            thumbnailView.src = BASE_FIREBASE_STORAGE_URL + article.thumbnailUrl.replace("/", "%2F") + "?alt=media";          
            thumbnailFilePath = article.thumbnailUrl;
          }
          firebase
            .firestore()
            .collection("articles-contents")
            .doc(newsID)
            .get()
            .then(function(doc) {
              if (doc.exists) {
                const articleContents = doc.data();
                totalDoc = totalDoc + articleContents.contents;
                totalDoc = `<div contenteditable="true" tabindex="0" class="ProseMirror">${totalDoc}</div>`;
                editor.setContent(totalDoc);
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
  },
  beforeDestroy() {
    this.editor.destroy();
  },
  methods: {    
    openModal(command) {
      //open image uploading pop-up
      this.$refs.ytmodal.showModal(command);
    },
    addCommand(data) {
      //add selected image
      if (data.command !== null) {
        data.command(data.data);
      }
    },
    async save() {
      if (this.isUploading) {
        return;
      }
      this.isUploading = true;
      const db = firebase.firestore();

      const userInfo = JSON.parse(
        localStorage.getItem("firebaseui::rememberedAccounts")
      )[0];

      const id = this.newsID;
      const router = this.$router;
      var articleHTML = this.editor.getHTML();

      //change base64 image data to Firebase Storage's URL
      var imgSrc = articleHTML.split('"');
      var imageIndex = 1;
      console.log("Start");
      articleHTML = "";
      for (var i = 0; i < imgSrc.length; i++) {
        if (
          imgSrc[i].endsWith("<img src=") &&
          imgSrc[i + 1].startsWith("data:image/")
        ) {
          var tmpImgFile = createImageFile(imgSrc[i + 1]);
          var tmpImageFilePath = "";
          while (true) {
            tmpImageFilePath =
              "images/" +
              id +
              "_" +
              imageIndex +
              "." +
              imgSrc[i + 1].split(";")[0].split("/")[1];
            const storageRef = firebase.storage().ref();
            const ref = storageRef.child(tmpImageFilePath);
            var isFileExist = await ref.getDownloadURL().then(
              function(url) {
                return true;
              },
              function(error) {
                return false;
              }
            );
            if (isFileExist == false) break;
            imageIndex++;
          }
          // Upload on the Firebase Storage using synchronous mode          
          const storageRef = firebase.storage().ref();
          const ref = storageRef.child(tmpImageFilePath);
          await ref.put(tmpImgFile); //'await' keyword change to synchronous mode
          var fullPath = await ref.getDownloadURL();
          imgSrc[i + 1] = '"' + fullPath + '"';
          imageIndex++;
        }
        articleHTML = articleHTML + imgSrc[i];
      }

      var title = getTitle(articleHTML);
      var contents = getCotents(articleHTML);

      //Upload thumbnail file
      var imageFilePath = thumbnailFilePath;
      if (this.thumbnailFile != null) {
        const fileName = id + "_thumb.jpg";
        imageFilePath = `images/${fileName}`;

        // Upload on the Firebase Storage
        const storageRef = firebase.storage().ref();
        const ref = storageRef.child(imageFilePath);
        ref.put(this.thumbnailFile).then(function(snapshot) {
          console.log("Uploaded a blob or file");
        });
      }

      // Save article information into the Fiebase Firestore
      db.collection("articles")
        .doc(id.toString())
        .set({
          id: parseInt(id),
          title: title,
          createdAt: parseInt(id),
          lastEditedAt: new Date().getTime(),
          writerId: userInfo.email,
          writerName: userInfo.displayName,
          thumbnailUrl: imageFilePath,
          writerPhotoUrl: userInfo.photoUrl
        })
        .then(function() {
          router.push("/news");
        })
        .catch(function(error) {
          console.error("Error writing information: ", error);
          // todo: Show error popup
        });

      // Save article contents

      db.collection("articles-contents")
        .doc(id.toString())
        .set({
          id: id,
          contents: contents
        })
        .then(function() {
          router.push("/news");
        })
        .catch(function(error) {
          console.error("Error writing contents: ", error);
          // todo: Show error popup
        });
    },
    selectImage(e) {
      const file = this.$refs.file.files[0];

      //Change image file size
      var _URL = window.URL || window.webkitURL;
      var img = document.createElement("img");
      img.onload = f => {
        const elem = document.createElement("canvas");
        elem.width = 920;
        elem.height = 518;
        const ctx = elem.getContext("2d");
        ctx.drawImage(img, 0, 0, elem.width, elem.height);

        //display thumbnail image
        document.querySelector("#thumbnail").src = elem.toDataURL("image/jpeg");

        ctx.canvas.toBlob(
          blob => {
            this.thumbnailFile = new File([blob], "tmpFileName", {
              type: "image/jpeg",
              lastModified: Date.now()
            });
          },
          "image/jpeg",
          1
        );
      };
      img.src = _URL.createObjectURL(file);
    }
  }
};
function createImageFile(imageSrc, id, index) {
  var _URL = window.URL || window.webkitURL;
  var img = document.createElement("img");

  var block = imageSrc.split(";");
  var contentType = block[0].split(":")[1];
  var realData = block[1].split(",")[1];
  var bstr = atob(realData);
  var n = bstr.length;
  var u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  var imageFile = new File([u8arr], "younFile", {
    type: contentType,
    lastModified: Date.now()
  });

  return imageFile;
}
function getTitle(articleHTML) {
  return articleHTML.split("</h1>")[0].slice(4);
}
function getCotents(articleHTML) {
  return articleHTML.slice(articleHTML.indexOf("</h1>") + 5);
}
function generateImageFileName(originName) {
  const temp = originName.split(".");
  return `${temp[0]}_${new Date().getTime()}.${temp[1]}`;
}

function generateAttachments(imageFilePath) {
  const attachments = [];
  const imgAttachment = {
    path: imageFilePath,
    type: "img"
  };
  const videoAttachment = {
    path: "",
    type: "video"
  };
  attachments.push(imgAttachment);
  attachments.push(videoAttachment);
  return attachments;
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
