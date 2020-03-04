
<template>
  <div>
    <chartjsDougnut :styles="myStyles"/>
  </div>
</template>
<script>
import Doughnut from "./Doughnut.js";
export default {
    components: {
    chartjsDougnut: Doughnut
  },
  computed: {
    myStyles() {
      return {
        height: `${this.height}px`,
        position: "relative"
      };
    }
  }
};
</script>
<style>
</style>

