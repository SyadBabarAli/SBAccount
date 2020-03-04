<template>
  <v-btn small :to=link>{{this.desciption}}</v-btn>
</template>
<script>
export default {
  name: "buttonSmall",
  props: ["desciption", "link"],
};
</script>