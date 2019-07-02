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
  data() {
    return {
      title: "",
      contents: ""
    };
  },
  methods: {
    save() {
      console.log("Save!");
    }
  }
};
</script>

<style>
</style>
