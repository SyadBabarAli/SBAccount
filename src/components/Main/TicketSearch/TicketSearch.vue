<template>
  <div>
    <!-- <div style="flex-basis: 20%"> -->
    <!-- <v-toolbar class="colorDark" dark dense> -->
    <div class="v-toolbar__content">
      <!-- <v-spacer></v-spacer> -->
      <!-- style="width:140px" -->
      <div class="pt-3">
        <v-select
          v-show="false"
          v-model="selectFilter"
          :items="itemsFilter"
          item-text="text"
          item-value="value"
          label="Filter By"
        ></v-select>
      </div>
      <!-- style="width:340px" -->
      <div class="pt-1">
        <v-text-field
          @keyup.enter="search"
          v-model="searchText"
          flat
          label="Search"
          prepend-inner-icon="search"
          solo-inverted
          v-bind:style="{ width: imageHeight}"
        ></v-text-field>
      </div>
      <!-- </v-toolbar> -->
    </div>
    <!-- <v-layout row wrap class="pa-2">
      <v-flex lg12 class="mt-12">
    <v-toolbar color="colorLight" dark dense>-->
    <!-- <v-btn color="colorLight"  @click="search"> Search</v-btn> -->
    <!-- </v-toolbar>
      </v-flex>
    </v-layout>-->
    <v-dialog v-model="vdailogTicketList" scrollable>
      <app-ticket-details
        :visible="vdailogTicketList"
        :pSearchText="this.searchText"
        :pId="this.selectFilter"
        @onClick="vdailogTicketList = false"
      ></app-ticket-details>
    </v-dialog>
  </div>
</template>
<script>
import TicketDetails from "../../../components/Main/TicketSearch/TicketSearchDetails";
import TicketService from "../../../services/ticket-service";
import DatePicker from "../../../components/control/DatePicker";
import ProgressLinear from "../../../components/control/ProgressLinear";
import store from "../../../store";
import ButtonGrid from "../../../components/control/ButtonGrid";
import { mixins } from "../../../mixins/CustomMixins";
export default {
  //mixins: [mixins],
  components: {
    "app-ticket-details": TicketDetails,
    DatePicker
  },
  // mounted () {
  //   console.log(this.$vuetify.breakpoint)
  // },
  computed: {
    imageHeight() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "100px";
        case "sm":
          return "440px";
        case "md":
          return "440px";
        case "lg":
          return "440px";
        case "xl":
          return "440px";
      }
    }
  },
  data() {
    return {
      itemsFilter: [
        {
          text: "Affected User",
          value: 1
        },
        {
          text: "Ftag",
          value: 2
        },
        {
          text: "IR",
          value: 3
        },
        {
          text: "Title",
          value: 4
        },
        {
          text: "All",
          value: 0
        }
      ],
      selectFilter: 0,
      vdailogTicketList: false,
      searchText: "",
      viewDialog: false
    };
  },
  methods: {
    search() {
      var search = this.searchText;
      this.vdailogTicketList = true;
    },
    btnView(id) {
      this.ticketId = id;
      this.vdailogTicketList = true;
    },
    cancelAutoUpdate() {
      clearInterval(this.timer);
    }
  },
  beforeDestroy() {
    this.cancelAutoUpdate();
  }
};
</script>
