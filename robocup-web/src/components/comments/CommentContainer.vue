<template>
  <v-container>
    <v-form ref="form">
      <v-layout row wrap>
        <v-flex offset-md1 xs12 sm2>
          <v-text-field v-model="writerName" label="Writer Name" outline></v-text-field>
        </v-flex>
        <v-flex xs9 sm9 md7 lg7 pl-3>
          <v-textarea v-model="comment" name="input-7-1" label="Comment" rows="1"></v-textarea>
        </v-flex>
        <v-flex xs1 pl-3>
          <v-btn outline fab small @click="writeComment">
            <v-icon dark>send</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-form>

    <v-layout row v-if="comments.length > 0">
      <v-flex offset-md1 md10>
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
    comments: []
  }),
  created() {
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
            console.log("TEST: " + JSON.stringify(comment));
            this.comments.push(comment);
          }
        });
      });
  },
  methods: {
    writeComment() {
      const d = new Date();
      const dateTime = `${d.getFullYear()}-${d.getMonth() +
        1}-${d.getDate()} ${d.getHours()}:${("0" + d.getMinutes()).slice(-2)}:${("0" + d.getSeconds()).slice(-2)}`;

      const comment = {
        type: this.type,
        parentId: this.parentId,
        dateTime: dateTime,
        writerName: this.writerName,
        comment: this.comment
      };

      firebase
        .firestore()
        .collection("comments")
        .doc(d.getTime().toString())
        .set(comment)
        .then(() => {
          this.$refs.form.resetValidation();
          this.writerName = "";
          this.comment = "";
        })
        .catch(function(error) {
          console.error("Error writing document: ", error);
        });
    }
  }
};
</script>

<style>
</style>
