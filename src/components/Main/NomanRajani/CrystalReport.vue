<template>
  <v-layout row wrap class="pa-2">
    <v-flex lg12 class="mt-12">
      <v-card class="black--text elevation-5">
        <v-layout>
          <v-flex lg12 class="pa-0">
            <v-card-title class="headline grey lighten-3 pa-1 ma-0" primary-title>Reports</v-card-title>
            <date-picker @getResults="executeReport" />
            <iframe style="width:100%;height:800px;" :src="iframe.src"></iframe>
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
        src: null
      }
    };
  },
  created: function() {
    store.commit("setCurrentScreenName", "CrystalReport");
  },
  methods: {
    executeReportAnalyst() {
      this.iframe.src =
        //"http://localhost:60868/Webform/Report.aspx?reportName=AnalystNR.rpt";
        this.$urlApplication + "/Webform/Report.aspx?reportName=AnalystNR.rpt";
    },
    executeReport() {
      var strCurrentDate = new Date(
        `${this.$store.getters.startDate}T00:00:00`
      );
      var strNewEndDate = new Date(`${this.$store.getters.endDate}T23:59:59`);
      var difference = strNewEndDate - strCurrentDate;

      this.iframe.src =
        //"http://localhost:60868/Webform/Report.aspx?dtFrom=" +
        this.$urlApplication + "/Webform/Report.aspx?dtFrom=";
        this.$store.getters.startDate +
        "&dtTo=" +
        this.$store.getters.endDate +
        "&reportName=MonthlyReport.rpt";
    }
  }
};
</script>

<style scoped>
</style>