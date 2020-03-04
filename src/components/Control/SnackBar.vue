<template>
  <v-snackbar
    v-model="isTrue"
    :timeout="1000"
    top="top"
    :vertical="'vertical'"
  >Record saved successfully
    <v-btn color="pink" flat @click="this.isTrue = true">Close</v-btn>
  </v-snackbar>
</template>
<script>
export default {
  props: ['isSnackbar'],
  data() {
    return {
      isTrue: false
    };
  },
//   created() {
//     this.load();
//   },
  watch: {
    isSnackbar() {
      this.load();
    }
  },
  computed: {
    getData() {
      return this.data;
    }
  },
  methods: {
    load() {
        //alert(this.isSnackbar);
        this.isTrue = true;
    }
  }

  //   props: {
  //     isSnackbar: Boolean
  //   },
  //   props: ['isSnackbar'],
  //   data: () => ({
  //     isTrueSnack: false
  //   })
  //   computed: {
  //     isTrue(obj) {

  // alert(obj);
  //     }
  //   }
  //   watch: {
  //     isSnackbar() {
  //       alert("test");
  //       //     this.isTrueSnack = this.isTrue;
  //     }
  //   }
};
</script>