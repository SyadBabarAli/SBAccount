<template>
  <v-layout row wrap class="pt-2 pl-1" id="feedbackRating">
    <v-flex lg6 class="pt-4">
      <v-layout row wrap>
        <v-flex lg12 class="pa-0 ma-0">
          <div class="font-weight-light my-2 display-2" v-if="this.avgRating" >{{this.avgRating}}</div>
          <div class="font-weight-light my-2 display-2" v-else>N/A</div>

        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex lg12 class="pa-0 ma-0">
          <v-rating
            v-model="this.ratingStar"
            background-color="gray"
            color="gray"
            small
            class="pa-0 ma-0"
            :readonly="true"
            half-increments
          ></v-rating>
          <v-divider></v-divider>
          {{this.total}}
          <v-icon>person</v-icon>total
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex lg5>
      <v-layout row wrap>
        <v-flex xs2 class="pa-0">
          <v-icon style="font-size: 15px;">star_rate</v-icon>
        </v-flex>
        <v-flex xs2 class="pa-0">
          <div class="pl-0" style="padding-top:2px">5</div>
        </v-flex>
        <v-flex xs8 class="pa-1">
          <v-progress-linear
            class="ma-0"
            background-color="transparent"
            color="#88b131"
            height="20"
            :value="this.ratingFive"
          ></v-progress-linear>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs2 class="pa-0">
          <v-icon style="font-size: 15px;">star_rate</v-icon>
        </v-flex>
        <v-flex xs2 class="pa-0">
          <div class="pl-0" style="padding-top:2px">4</div>
        </v-flex>
        <v-flex xs8 class="pa-1">
          <v-progress-linear
            class="ma-0"
            background-color="transparent"
            color="#9c0"
            height="20"
            :value="this.ratingFour"
          ></v-progress-linear>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs2 class="pa-0">
          <v-icon style="font-size: 15px;">star_rate</v-icon>
        </v-flex>
        <v-flex xs2 class="pa-0">
          <div class="pl-0" style="padding-top:2px">3</div>
        </v-flex>
        <v-flex xs8 class="pa-1">
          <v-progress-linear
            class="ma-0"
            background-color="transparent"
            color="#ffcf02"
            height="20"
            :value="this.ratingThree"
          ></v-progress-linear>
        </v-flex>
      </v-layout>
      <v-layout row wrap class="pa-0">
        <v-flex xs2 class="pa-0">
          <v-icon style="font-size: 15px;">star_rate</v-icon>
        </v-flex>
        <v-flex xs2 class="pa-0">
          <div class="pl-0" style="padding-top:2px">2</div>
        </v-flex>
        <v-flex xs8 class="pa-1">
          <v-progress-linear
            class="ma-0"
            background-color="transparent"
            color="#ff9f02"
            height="20"
            :value="this.ratingTwo"
          ></v-progress-linear>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs2 class="pa-0">
          <v-icon class="pa-0" style="font-size: 15px;">star_rate</v-icon>
        </v-flex>
        <v-flex xs2 class="pa-0">
          <div class="pl-0" style="padding-top:2px">1</div>
        </v-flex>
        <v-flex xs8 class="pa-1">
          <v-progress-linear
            class="ma-0"
            background-color="transparent"
            color="#ff6f31"
            height="20"
            :value="this.ratingOne"
          ></v-progress-linear>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
  <!-- </div> -->
</template>
<script>
export default {
  data() {
    return {
      //rating: 3.8
    };
  },
  name: "feedbackRating",
  props: [
    "avgRating",
    "total",
    "ratingStar",
    "ratingFive",
    "ratingFour",
    "ratingThree",
    "ratingTwo",
    "ratingOne"
  ],
  methods: {}
};
</script>