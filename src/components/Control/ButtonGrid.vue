<template>
  <div id="buttonGrid" >
    <v-btn
      style="height:20px;font-size:13px;background-color:white"
      @click="onClick"
    >{{this.description}}</v-btn>
  </div>
</template>
<script>
export default {
  name: "buttonGrid",
  props: ["description"],
  methods: {
    onClick() {
      this.$emit("Click");
    }
  }
};
</script>