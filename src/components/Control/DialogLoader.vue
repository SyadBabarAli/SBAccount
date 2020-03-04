<template>
  <v-dialog v-model="isTrue" persistent width="300">
    <v-card color="primary" dark>
      <v-card-text>Please wait…
        <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: ["isSnackbar"],
  data() {
    return {
      isTrue: false
    };
  },
  watch: {
    isSnackbar(val) {
      this.load(val);
    }
  },
  computed: {
    getData() {
      return this.data;
    }
  },
  methods: {
    load(val) {
      this.isTrue = val;
    }
  }
};
</script>