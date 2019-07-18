<template>
  <v-container>
    <v-form ref="form">
      <v-layout row wrap>
        <v-flex offset-md1 offset-xl3 xs12 sm2 xl1>
          <v-text-field v-model="writerName" label="Writer Name" outline></v-text-field>
        </v-flex>
        <v-flex xs9 sm9 md7 lg7 xl5 pl-3>
          <v-textarea v-model="comment" name="input-7-1" auto-grow label="Comment" rows="1"></v-textarea>
        </v-flex>
        <v-flex xs1 pl-3>
          <v-btn outline fab small @click="writeComment">
            <v-icon dark>send</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-form>

    <v-layout row v-if="comments.length > 0">
      <v-flex offset-md1 offset-xl3 md10 xl6>
        <v-card>
          <v-list two-line>
            <template v-for="(comment, index) in comments">
              <v-divider v-if="index != 0" :key="index"></v-divider>
              <v-list-tile :key="comment.dateTime">
                <v-list-tile-content>
                  <v-list-tile-title v-html="comment.writerName">{{ comment.writerName }}</v-list-tile-title>
                  <v-list-tile-sub-title v-html="comment.comment">{{ comment.comment }}</v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-list-tile-action-text>{{ comment.dateTime }}</v-list-tile-action-text>
                  <v-btn v-show="isSignIn" fab outline small color="cyan" @click="removeComment(comment)">
                    <v-icon>remove</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </template>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  props: ["type", "parentId"],
  data: () => ({
    writerName: "",
    comment: "",
    comments: [],
    isSignIn: false,
  }),
  created() {
    this.isSignIn =
      localStorage.getItem("firebaseui::rememberedAccounts") != null;

    firebase
      .firestore()
      .collection("comments")
      .where("type", "==", this.type)
      .where("parentId", "==", this.parentId)
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === "removed") {
            const comment = change.doc.data();
            const idx = this.comments.findIndex(function(e) {
              return e.dateTime === comment.dateTime;
            });
            if (idx > -1) this.comments.splice(idx, 1);
          } else {
            const comment = change.doc.data();
            this.comments.push(comment);
          }
        });
      });
  },
  methods: {
    writeComment() {
      const d = new Date();
      const dateTime = `${d.getFullYear()}-${d.getMonth() +
        1}-${d.getDate()} ${d.getHours()}:${("0" + d.getMinutes()).slice(
        -2
      )}:${("0" + d.getSeconds()).slice(-2)}`;

      const comment = {
        id: d.getTime().toString(),
        type: this.type,
        parentId: this.parentId,
        dateTime: dateTime,
        writerName: this.writerName,
        comment: this.comment
      };

      firebase
        .firestore()
        .collection("comments")
        .doc(comment.id)
        .set(comment)
        .then(() => {
          this.$refs.form.resetValidation();
          this.writerName = "";
          this.comment = "";
        })
        .catch(function(error) {
          console.error("Error writing document: ", error);
        });
    },
    removeComment(comment) {
      firebase
        .firestore()
        .collection("comments")
        .doc(comment.id)
        .delete()
        .then(() => {})
        .catch(function(error) {
          console.error("Error delete document: ", error);
        });
    }
  }
};
</script>

<style>
</style>
