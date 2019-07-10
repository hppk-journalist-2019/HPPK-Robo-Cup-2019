<template>
  <div class="modal" v-if="show">
    <div class="modal-content">
      <h1>Add Video</h1>
        
      <div>
        <label for="up">Please Input YouTube Link</label>
        <input type="text" placeholder="https://" v-model="url">
      </div>
      <div>          
        <label>Video Size</label> 
        width : <input v-model="width" type="text" maxlength="4" style="width:40px;text-align:right;border:1px solid;" autocomplete="off" pattern="[0-9]{4}"/> px <br>
        height : <input v-model="height" type="text" maxlength="4" style="width:40px;text-align:right;border:1px solid;" autocomplete="off" pattern="[0-9]{4}"/> px
      </div>
      <center>
        <footer class="modal-footer">
            <button
            @click="insertVideo"
            class="success"
            style="width:30%"
            >
            Add Video
            </button>
            <button @click="closeModal;" class="danger" style="width:30%">Cancel</button>
        </footer>
      </center>
    </div>    
  </div>
</template>
<script>
export default {
  data() {
    return {
      url: "",
      width: 400,
      height: 300,
      command: null,
      show: false
    };
  },
  computed: {
    youtubeID() {
      return this.youtubeParser(this.url);
    }
  },
  methods: {
    youtubeParser(url) {
      const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
      const match = url.match(regExp);
      return match && match[7].length == 11 ? match[7] : false;
    },
    showModal(command){
        this.command = command;
        this.show = true;
    },
    insertVideo(){
        const data = {
            command: this.command,
            data:{
                src: this.youtubeID,
                width: this.width,
                height: this.height
            }
        };
        this.$emit("onConfirm",data);        
        this.closeModal();
    },
    closeModal(){
        this.url = "";
        this.width = 400;
        this.height = 300;
        this.show = false;
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

</style>