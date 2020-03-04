<template>
  <v-layout row wrap class="pa-2">
    <v-flex lg12 class="mt-12">
      <v-card class="black--text elevation-5">
        <v-card-title class="headline grey lighten-3 pa-1 ma-0" primary-title>Trend Chart</v-card-title>
        <v-layout row wrap>
          <v-flex lg12>
            <date-picker @getResults="getSummry"></date-picker>
          </v-flex>
        </v-layout>
        <v-card-text>
          <v-layout row wrap>
            <v-flex class="pa-1">
              <v-card class="elevation-10">
                <p class="text-md-center headline grey lighten-3 pa-1 ma-0">
                  <v-btn
                    small
                    color="colorLight"
                    class="colorDark white--text font-weight-light"
                    @click="generateExcelICTDepartment"
                  >
                    Export Excel
                    <v-icon right dark>cloud_download</v-icon>
                  </v-btn>Ageing (Resolved Tickets)
                </p>
                <v-divider></v-divider>
                <v-layout row wrap align-center class="pa-2">
                  <v-flex class="text-md-center">
                    <progress-circular v-show="isLoading" />
                    <chart-stackbar-ageing
                      :objdata="getDataTrendChartCreatedDate"
                      v-show="!isLoading"
                    />
                  </v-flex>
                </v-layout>
              </v-card>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-text>
          <v-layout row wrap>
            <v-flex class="pa-1">
              <v-card class="elevation-10">
                <p class="text-md-center headline grey lighten-3 pa-1 ma-0">
                  <v-btn
                    small
                    color="colorLight"
                    class="colorDark white--text font-weight-light"
                    @click="generateExcelVendor"
                  >
                    Export Excel
                    <v-icon right dark>cloud_download</v-icon>
                  </v-btn>Ageing By Vendor(Resolved Tickets)
                </p>
                <v-divider></v-divider>
                <v-layout row wrap align-center class="pa-2">
                  <v-flex class="text-md-center">
                    <progress-circular v-show="isLoading" />
                    <chart-stackbar-ageing-vendor
                      :objdata="getDataTrendChartVendor"
                      v-show="!isLoading"
                    />
                  </v-flex>
                </v-layout>
              </v-card>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>
    <dialog-loader :isSnackbar="IsSnackBar" />
  </v-layout>
</template>
<script>
import moment from "moment";
import _ from "lodash";
import DatePicker from "../../../components/control/DatePicker";
import { mixins } from "../../../mixins/CustomMixins";
import ChartStackbarAgeing from "../../Main/TrendNew/ChartStackbarAgeingNew";
import ChartStackbarAgeingVendor from "../../Main/TrendNew/ChartStackbarAgeingVendor";
import TicketService from "../../../services/ticket-service";
import ProgressCircular from "../../../components/control/ProgressCircular";
import axios from "axios";
import DialogLoader from "../../../components/control/DialogLoader";
export default {
  components: {
    ChartStackbarAgeing,
    ChartStackbarAgeingVendor,
    DatePicker,
    ProgressCircular,
    DialogLoader
  },
  data() {
    return {
      listOfRecords: [],
      selectedSupportGroup: [],
      selectedSupportGroupWithVendor: [],
      selectedLocation: [],
      isLoading: true,

      isLoadingExportICTDepartment: true,
      isLoadingExportVendor: true,
      snackbar: {
        isTrue: false
      },
      listVendor: [
        1, // Cisco
        59, // Compsi
        126, // CubeXS Weatherly
        121, // Cybernet
        97, // Gemco
        101, // Itech
        51, // Mobilink
        91, // Nedo
        124, // Netsat
        43, // PERN
        104, // PPM
        60, // Premier
        46, // PTCL
        138, // Storm Fiber
        45, // Synergy Computers
        110, // Texitech
        41, // Transworld
        4, // Vendor
        96, // Viper
        48, // Wateen
        138, // GCS
        144, // MB Communication
        154, // Enzee network
        153 // SATCOMM
      ]
    };
  },
  created() {
    this.getSummry();
  },
  computed: {
    IsSnackBar() {
      return this.snackbar.isTrue;
    },
    filterdRecordTrendChartCreatedDate() {
      //Location
      var cntLoc = 0;
      this.selectedLocation = [];
      for (let item of this.$store.getters.filterLocation) {
        if (cntLoc == 0) {
          this.selectedLocation.push("'" + item + "'");
        } else {
          this.selectedLocation.push(",'" + item + "'");
        }
        cntLoc++;
      }

      //SupportGroup
      var cntSup = 0;
      this.selectedSupportGroup = [];
      for (let item of this.$store.getters.selectedIncidentTierQueuesIds) {
        if (cntSup == 0) {
          this.selectedSupportGroup.push("" + item);
        } else {
          this.selectedSupportGroup.push("," + item);
        }
        cntSup++;
      }

      //SupportGroupWithVendor
      var cntSupVend = 0;
      this.selectedSupportGroupWithVendor = [];
      for (let item of this.$store.getters.selectedIncidentTierQueuesIds) {
        for (let item2 of this.listVendor) {
          if (item == item2) {
            if (cntSupVend == 0) {
              this.selectedSupportGroupWithVendor.push("" + item);
            } else {
              this.selectedSupportGroupWithVendor.push("," + item);
            }
            cntSupVend++;
          }
        }
      }
      var result = this.listOfRecords.filter(
        data =>
          _.includes(
            this.$store.getters.selectedIncidentTierQueuesIds,
            data.TierQueue_IncidentTierQueuesId
          ) &&
          _.includes(this.$store.getters.filterLocation, data.Property_Location)
      );
      return result;
    },
    getDataTrendChartCreatedDate() {
      var result = this.filterdRecordTrendChartCreatedDate;
      return result;
    },
    filtredVendor() {
      var result = this.listOfRecords.filter(data =>
        _.includes(this.listVendor, data.TierQueue_IncidentTierQueuesId)
      );
      var resultFinal = result.filter(
        data =>
          _.includes(
            this.$store.getters.selectedIncidentTierQueuesIds,
            data.TierQueue_IncidentTierQueuesId
          ) &&
          _.includes(this.$store.getters.filterLocation, data.Property_Location)
      );
      return resultFinal;
    },
    getDataTrendChartVendor() {
      var result = this.filtredVendor;
      return result;
    }
  },

  methods: {
    getSummry() {
      this.getTrendChartCreated();
    },
    async getTrendChartCreated() {
      this.isLoading = true;

      var objData = {
        DateFrom: `${this.$store.getters.startDate}T00:00:00`,
        DateTo: `${this.$store.getters.endDate}T23:59:59`,
        property_Location: this.selectedLocation,
        supportGroup: this.selectedSupportGroup
      };

      const res = axios({
        method: "post",
        url: this.$urlApplication + "TrendChart/GetTrendChartCreated",
        data: objData
      })
        .then(res => {
          this.listOfRecords = res.data;
          this.isLoading = false;
        })
        .catch(error => {
          this.isLoading = false;
        });
    },

    // generateExcelVendor() {
    //   var dateFrom = new Date(`${this.$store.getters.startDate}T00:00:00`);
    //   var dateTo = new Date(`${this.$store.getters.endDate}T23:59:59`);
    //   var difference = dateTo - dateFrom;
    //   if (difference < 0) {
    //     alert("Please select date end should be greater than start date");
    //   } else {
    //     this.snackbar.isTrue = true;
    //     var objData = {
    //       DateFrom: `${this.$store.getters.startDate}T00:00:00`,
    //       DateTo: `${this.$store.getters.endDate}T23:59:59`,
    //       property_Location: this.selectedLocation,
    //       supportGroup: this.selectedSupportGroupWithVendor
    //     };
    //     axios({
    //       method: "post",
    //       url: this.$urlApplication + "/TrendChart/GenerateExcelVendor",
    //       data: objData,
    //       responseType: "blob" // important
    //     }).then(response => {
    //       const url = window.URL.createObjectURL(new Blob([response.data]));
    //       const link = document.createElement("a");
    //       link.href = url;
    //       link.setAttribute("download", "AgeingVendor.xlsx");
    //       document.body.appendChild(link);
    //       link.click();
    //       this.snackbar.isTrue = false;
    //     });
    //   }
    // },
    // generateExcelICTDepartment() {
    //   var dateFrom = new Date(`${this.$store.getters.startDate}T00:00:00`);
    //   var dateTo = new Date(`${this.$store.getters.endDate}T23:59:59`);
    //   var difference = dateTo - dateFrom;


    //   if (difference < 0) {
    //     alert("Please select date end should be greater than start date");
    //   } else {
    //     this.snackbar.isTrue = true;
    //     var objData = {
    //       DateFrom: `${this.$store.getters.startDate}T00:00:00`,
    //       DateTo: `${this.$store.getters.endDate}T23:59:59`,
    //       property_Location: this.selectedLocation,
    //       supportGroup: this.selectedSupportGroup
    //     };

    //     axios({
    //       method: "post",
    //       url: this.$urlApplication + "/TrendChart/GenerateExcelICTDepartment",
    //       data: objData,
    //       responseType: "blob" // important
    //     }).then(response => {
    //       const url = window.URL.createObjectURL(new Blob([response.data]));
    //       const link = document.createElement("a");
    //       link.href = url;
    //       link.setAttribute("download", "AgeingReportForICTDepartment.xlsx");
    //       document.body.appendChild(link);
    //       link.click();
    //       this.snackbar.isTrue = false;
    //     });
    //   }
    // },
    generateExcelICTDepartment() {
      var objData = this.getDataTrendChartCreatedDate;
      axios({
        method: "post",
        url: this.$urlApplication + "/TrendChart/GenerateExcelICTDepartment",
        data: objData,
        responseType: "blob" // important
      }).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "AgeingReportForICTDepartment.xlsx");
        document.body.appendChild(link);
        link.click();
        this.snackbar.isTrue = false;
      });
    },
    generateExcelVendor() {
      var objData = this.getDataTrendChartCreatedDate;
      axios({
        method: "post",
        url: this.$urlApplication + "/TrendChart/GenerateExcelVendor",
        data: objData,
        responseType: "blob" // important
      }).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "AgeingReportForVendor.xlsx");
        document.body.appendChild(link);
        link.click();
        this.snackbar.isTrue = false;
      });
    }
  }
};
</script>

<style scoped>
</style>
