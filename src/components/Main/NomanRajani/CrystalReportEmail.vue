<template>
  <v-layout row wrap class="pa-2">
    <v-flex lg12 class="mt-12">
      <v-card class="black--text elevation-5">
        <v-layout>
          <v-flex lg12 class="pa-0">
            <v-card-title
              class="headline grey lighten-3 pa-1 ma-0"
              primary-title
            >Reports send as a PDF format in email</v-card-title>
            <v-layout>
              <v-flex lg2>
                <date-picker-from />
              </v-flex>
              <v-flex lg2>
                <date-picker-to />
              </v-flex>
              <v-flex lg1 class="pa-0">
                <v-combobox
                  v-model="selectReport"
                  :items="reportItems"
                  label="Select report name"
                  item-text="text"
                  item-value="value"
                ></v-combobox>
              </v-flex>

              <v-flex lg3 class="pa-0">
                <v-textarea name="input-7-1" solo label="Enter email" v-model="emailAddress"></v-textarea>
              </v-flex>
              <v-flex lg1 class="pa-2">
                <v-btn
                  block
                  class="colorDark white--text font-weight-light"
                  @click="executeReport"
                >Get</v-btn>
              </v-flex>
            </v-layout>
            <!-- <iframe style="width:100%;height:800px;" :src="iframe.src"></iframe> -->
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>
    <dialog-loader :isSnackbar="IsSnackBar" />
  </v-layout>
</template>
<script>
import { mixins } from "../../../mixins/CustomMixins";

import DatePickerFrom from "../../../components/control/DatePickerFrom";
import DatePickerTo from "../../../components/control/DatePickerTo";
import DialogLoader from "../../../components/control/DialogLoader";

import store from "../../../store";
import axios from "axios";

export default {
  mixins: [mixins],
  components: {
    DialogLoader,
    DatePickerFrom,
    DatePickerTo
  },
  data() {
    return {
      emailAddress: "syedbabar.ali@aku.edu",
      snackbar: {
        isTrue: false
      },
      selectReport: { value: "AnalystNR.rpt", text: "Analyst" },
      reportItems: [{ value: "ZoneNR.rpt", text: "Zone" },{ value: "AnalystNR.rpt", text: "Analyst" }],
      iframe: {
        src: null
      }
    };
  },
  created: function() {
    store.commit("setCurrentScreenName", "CrystalReportEmail");
  },
  computed: {
    IsSnackBar() {
      return this.snackbar.isTrue;
    }
  },
  methods: {
    executeReport() {
      this.snackbar.isTrue = true;
      axios({
        method: "get",
        url:
          this.$urlApplication +
          "Report/GetGeneratePDFZoneNR?reportName=" +
          this.selectReport.value +
          //"&email=syedbabar.ali@aku.edu;mali.khan@aku.edu" +
          //"&email=mali.khan@aku.edu" +
          "&email=" +
          this.emailAddress +
          "&dtFrom=" +
          this.$store.getters.dateFrom +
          "&dtTo=" +
          this.$store.getters.dateTo
      })
        .then(res => {
          this.snackbar.isTrue = false;
        })
        .catch(error => {
          this.snackbar.isTrue = false;
        });
    }
  }
};
</script>

<style scoped>
</style>