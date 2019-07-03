<template>
  <div class="modal" v-if="show">
    <div class="modal-content">
      <h1>Add image</h1>
      <header class="tab-header">
        <button @click="tab = 1;" :class="{ active: tab == 1 }">Link</button>       
        <button @click="tab = 2;" :class="{ active: tab == 2 }">
          Upload (Simple)
        </button>
      </header>

      <div v-if="tab == 1">
        <p>Here is a test image URL</p>
        <pre>https://i.imgur.com/0ogkTp7.jpg</pre>
        <label for="url">Image URL:</label>
        <input v-model="imageSrc" id="url" style="width:100%;border:1px solid" autocomplete="off"/>
      </div>
      <div v-if="tab == 2">
        <label for="up">Really simple input upload:</label>
        <input type="file" @change="fileChange" id="up" ref="file" />
      </div>
      <div>          
        <label>Image Size</label> 
        width : <input v-model="imgWidth" type="text" maxlength="4" style="width:40px;text-align:right;border:1px solid;" autocomplete="off" pattern="[0-9]{4}"/> px <br>
        height : <input v-model="imgHeight" type="text" maxlength="4" style="width:40px;text-align:right;border:1px solid;" autocomplete="off" pattern="[0-9]{4}"/> px
      </div>
      <center>
        <footer class="modal-footer">
            <button
            @click="insertImage"
            class="success"
            style="width:30%"
            >
            Add Image
            </button>
            <button @click="show = false;" class="danger" style="width:30%">Cancel</button>
        </footer>
      </center>
    </div>
  </div>
</template>

<script>
export default {
  components: {    
  },
  data() {
    return {
      imageSrc: "",
      command: null,
      show: false,
      tab: 1,
      imgWidth: null,
      imgHeight: null,
      
    };
  },
  methods: {
    showModal(command) {
      // Add the insert image command
      this.command = command;
      this.show = true;
    },
    fileChange(e) {
      const file = this.$refs.file.files[0];  
      
      //Get Image's original width & height
      var _URL = window.URL || window.webkitURL;
      var img = new Image();
      img.onload = f => {            
            this.imgWidth = f.path[0].width;
            this.imgHeight = f.path[0].height;
      };
      img.src = _URL.createObjectURL(file);
      
      //Get base64 image data
      const reader = new FileReader();
      reader.onload = e => {
        console.log(e.target);
        //set image data to image source
        this.imageSrc = e.target.result;             
      };
      reader.readAsDataURL(file);
    },
    insertImage() {
      const data = {
        command: this.command,
        data: {
          src: this.imageSrc,
          width: this.imgWidth,
          height: this.imgHeight,
          // alt: "YOU CAN ADD ALT",
          // title: "YOU CAN ADD TITLE"
        }
      };

      this.$emit("onConfirm", data);
      this.closeModal();
    },
    closeModal() {
      this.show = false;
      this.imageSrc = "";
      this.tab = 1;
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
