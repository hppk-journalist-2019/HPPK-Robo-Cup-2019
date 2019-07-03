<template>
  <div>
    <v-text-field v-model="title" :counter="10" label="Title" required></v-text-field>

    <v-flex xs6>
      <v-textarea v-model="contents" solo name="input-7-4" label="Contents..."></v-textarea>
    </v-flex>

    <v-btn fab dark large color="cyan" @click="save">
      <v-icon dark>check</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  data: () => ({
    title: "Test Title", // Temp value, should be removed 
    contents: "Test Article" // Temp value, should be removed 
  }),
  methods: {
    save() {
      const db = firebase.firestore();

      console.log("Save!: " + this.title + ", " + this.contents);
      const id = new Date().getTime();
      db.collection("articles")
        .doc(id.toString())
        .set({
          id: id,
          title: this.title,
          contents: this.contents,
          createdAt: id,
          lastEditedAt: id,
          writerId: "test", // Temp value, should be changed to Login ccount id
          writerName: "Yoonho Aaron Kim", // Temp value, should be changed to Login account name
          // attachment: List<Attachment>
        })
        .then(function() {
          console.log("Document successfully written!");
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
