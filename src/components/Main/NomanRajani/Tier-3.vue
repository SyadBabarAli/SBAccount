<template>
  <v-layout row wrap class="pa-2">
    <v-flex lg12 class="mt-12">
      <v-card class="black--text elevation-5">
        <v-layout>
          <v-flex lg12 class="pa-0">
            <v-card-title class="headline grey lighten-3 pa-1 ma-0" primary-title>Tier-2</v-card-title>
            <date-picker @getResults="f1" />
            <iframe id="ifram1" style="width:100%;height:800px;" :src="iframe.src"></iframe>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import { mixins } from "../../../mixins/CustomMixins";
import TicketService from "../../../services/ticket-service";
import DatePicker from "../../../components/control/DatePicker";
import ProgressLinear from "../../../components/control/ProgressLinear";
import store from "../../../store";
import ButtonSmall from "../../../components/control/ButtonSmall";
export default {
  mixins: [mixins],
  components: {
    DatePicker,
    ProgressLinear,
    ButtonSmall
  },
  data() {
    return {
      iframe: {
        src:
          "http://localhost:60868/Webform/Report.aspx?dtFrom=" +
          this.$store.getters.startDate +
          "&dtTo=" +
          this.$store.getters.endDate
      }
    };
  },
  created: function() {
    //store.commit("setCurrentScreenName", "Tier3");
  },
  mounted() {
    //this.fetchData();
    //this.fetchDataAnalyst();
  },
  computed: {
    // filteredTickets() {
    //   return this.listOfRecords;
    // },
    // filteredAnalyst() {
    //   return this.listOfRecordsAnalyst;
    // }
  },
  methods: {
    f1() {
      //var strCurrentDate = new Date(`${this.$store.getters.startDate}`);
      //var strNewEndDate = new Date(`${this.$store.getters.endDate}`);

      var strCurrentDate = new Date(
        `${this.$store.getters.startDate}T00:00:00`
      );
      var strNewEndDate = new Date(`${this.$store.getters.endDate}T23:59:59`);

      var difference = strNewEndDate - strCurrentDate;

      this.iframe.src =
        "http://localhost:60868/Webform/Report.aspx?dtFrom=" +
        this.$store.getters.startDate +
        "&dtTo=" +
        this.$store.getters.endDate;

      debugger;

      // if (difference < 0) {
      //   alert("Please select date end should be greater than start date");
      // } else {
      //   this.isLoading = true;
      //   this.iframe.src =
      //     "http://localhost:60868/Webform/Report.aspx?dtFrom=" +
      //     strCurrentDate +
      //     ";&dtTo=" +
      //     strNewEndDate;
      // }

      //debugger
      // this.iframe.src = null;
      // this.iframe.src = "http://localhost:60868/Webform/Report.aspx";
    }
  }
};
</script>

<style scoped>
/* Table Self Style*/
table.v-table tbody td:first-child,
table.v-table tbody td:not(:first-child),
table.v-table tbody th:first-child,
table.v-table tbody th:not(:first-child),
table.v-table thead td:first-child,
table.v-table thead td:not(:first-child),
table.v-table thead th:first-child,
table.v-table thead th:not(:first-child) {
  padding: 10 10px;
  width: inherit;
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 32px;
}
table.v-table tbody td,
table.v-table tbody th {
  height: 30px;
}
</style>