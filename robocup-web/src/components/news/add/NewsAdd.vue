<template>
  <div>
    <v-text-field v-model="title" :counter="10" label="Title" required></v-text-field>

    <v-flex xs6>
      <v-textarea v-model="contents" solo name="input-7-4" label="Contents..."></v-textarea>
    </v-flex>

    <v-icon @click="uploadImage">image</v-icon>
    <input type="file" accept="image" @change="uploadImage" />

    <v-btn fab dark large color="cyan" @click="save">
      <v-icon dark>check</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  data: () => ({
    title: "Test Title", // todo: Temp value, should be removed
    contents: "Test Article", // todo: Temp value, should be removed
    imageFilePath: ""
  }),
  methods: {
    save() {
      const db = firebase.firestore();

      const id = new Date().getTime();
      const router = this.$router
      
      // Save into the Fiebase Firestore
      db.collection("articles")
        .doc(id.toString())
        .set({
          id: id,
          title: this.title,
          contents: this.contents,
          createdAt: id,
          lastEditedAt: id,
          writerId: "test", // todo: Temp value, should be changed to Login ccount id
          writerName: "Yoonho Aaron Kim", // todo: Temp value, should be changed to Login account name
          attachments: generateAttachments(this.imageFilePath)
        })
        .then(function() {
          router.push('/news')
        })
        .catch(function(error) {
          console.error("Error writing document: ", error);
          // todo: Show error popup
        });
    },
    uploadImage(e) {
      const image = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = e => {
        this.previewImage = e.target.result;
        console.log(this.previewImage);
      };

      const fileName = generateImageFileName(image.name);
      this.imageFilePath = `images/${fileName}`;

      // Upload on the Firebase Storage
      const storageRef = firebase.storage().ref();
      const ref = storageRef.child(this.imageFilePath);
      ref.put(image).then(function(snapshot) {
        console.log("Uploaded a blob or file");
      });
    }
  }
};

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
  return attachments
}
</script>

<style>
</style>
