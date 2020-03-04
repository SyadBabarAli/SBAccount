<template>
  <v-card class="mt-4 mx-auto">
    <v-card
      class="v-sheet--offset mx-auto"
      color="cyan"
      elevation="12"
      max-width="calc(100% - 32px)"
    >
      <v-card-title>
        <v-progress-circular :size="50" color="white" indeterminate v-if="this.isLoading"></v-progress-circular>
        <div class="font-weight-light display-2 white--text" v-else>
          {{this.val}}%
          <v-icon dark style="font-size: 45px;">trending_up</v-icon>
        </div>
      </v-card-title>
    </v-card>
    <v-card-text>
      <div class="title font-weight-light">{{this.heading}}</div>
      <v-divider class="my-2"></v-divider>
      <v-btn flat :to="link">View Detail</v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "cardOne",
  props: ["val", "heading", "link", "isLoading"]
};
</script>