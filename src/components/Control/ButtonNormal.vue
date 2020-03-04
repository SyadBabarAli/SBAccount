<template>
  <div id="buttonNormal">
    <v-btn
      block
      class="colorDark white--text font-weight-light"
      @click="onClick"
    >{{this.description}}</v-btn>
  </div>
</template>
<script>
export default {
  name: "buttonNormal",
  props: ["description"],
  methods: {
    onClick() {
      this.$emit("Click");
    }
  }
};
</script>