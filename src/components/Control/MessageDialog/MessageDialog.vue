<template>
  <v-dialog v-model="isTrue" width="500">
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>{{this.heading}}</v-card-title>
      <v-card-text>{{this.message}}</v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <!-- <v-btn color="pink" flat @click="this.isTrue = true">Close</v-btn> -->
        <v-btn color="pink" flat @click="msg">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: ["isDialog", "heading", "message"],
  data() {
    return {
      isTrue: false
    };
  },

  watch: {
    isDialog() {
      this.load();
    }
  },
  // computed: {
  //   getData() {
  //     return this.data;
  //   }
  // },
  methods: {
    load() {
      this.isTrue = false;
    },
    msg()
    {
        this.isTrue = false;
    }
  }
};
</script>