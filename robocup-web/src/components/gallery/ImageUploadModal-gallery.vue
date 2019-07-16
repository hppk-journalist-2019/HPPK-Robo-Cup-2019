<template>
  <div class="modal" v-if="show">
    <div class="modal-content">
      <h1>Add image</h1>
      <header class="tab-header">
        <button @click="tab = 1;" :class="{ active: tab == 1 }">Upload (Simple)</button>
      </header>
      <div v-if="tab == 1">
        <label for="up">Really simple input upload:</label>
        <input
          multiple="multiple"
          accept="image/jpeg, image/gif, image/png"
          type="file"
          @change="fileChange"
          id="up"
          ref="file"
        />
      </div>
      <center>
        <font size="5">
          <div id="status" style></div>
        </font>
      </center>
      <center>
        <footer class="modal-footer">
          <button @click="uploadImage" class="success" style="width:30%">Add Image</button>
          <button @click="show = false;" class="danger" style="width:30%">Cancel</button>
        </footer>
      </center>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      imageSrc: "",      
      show: false,
      tab: 1,
      isUploading: false
    };
  },
  methods: {
    showModal() {
      // Add the insert image command
      this.show = true;
    },
    fileChange(e) {
            
    },
    async uploadImage() {
      if (this.isUploading) return;
      this.isUploading = true;
      
      var status = document.getElementById("status");
      status.innerHTML = "Now uploading. Please Wait";

      const storageRef = firebase.storage().ref();
      for (let i = 0; i < this.$refs.file.files.length; i++) {
        const file = this.$refs.file.files[i];
        const serverFilePath = "images/" + file.name;
        var ref = storageRef.child(serverFilePath);
        await ref.put(file);
      }
      
      this.closeModal();
    },
    closeModal() {
      this.show = false;
      this.imageSrc = "";
      this.tab = 1;
      this.isUploading = false;
    }
  }
};
</script>

<style scoped>
.modal {
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  width: 400px;
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
}

.modal-footer {
  margin-top: 10px;
}

label {
  display: block;
  margin: 0.25em 0;
}

button {
  font-family: inherit;
  font-size: 100%;
  padding: 0.5em 1em;
  color: white;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  border: 1px solid #999;
  border: transparent;
  background-color: #e6e6e6;
  text-decoration: none;
  border-radius: 2px;
  cursor: pointer;
}

button.danger {
  background: rgb(202, 60, 60);
}

button.success {
  background: rgb(28, 184, 65);
}

button:disabled {
  opacity: 0.3;
}

button + button {
  margin-left: 10px;
}

.tab-header {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #222;
}

.tab-header button {
  color: #222;
  background: none;
  border: 0;
  flex: 1;
  padding: 5px 10px;
  cursor: pointer;
}

.tab-header button.active {
  background-color: #222;
  color: #fff;
}
</style>
