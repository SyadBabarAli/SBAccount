<template>
<div >
  <v-btn small  @click="onClick" >{{this.description}}</v-btn>
  </div>
</template>
<script>
export default {
  name: "buttonSmallTwo",
  props: ["description"],
  methods:{
     onClick() {
      this.$emit("Click");
    }
  }
};
</script>