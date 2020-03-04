<template>
  <!-- <div id="app"> -->
  <router-view/>
  <!-- </div> -->
</template>
<script>
export default {
  data: () => ({
    image: "https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
  })
};
</script>
<style>
#inspire img {
  height: 100%;
}
</style>