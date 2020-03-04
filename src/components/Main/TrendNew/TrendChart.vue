<template>
  <v-layout row wrap class="pa-2">
    <v-flex lg12 class="mt-12">
      <v-card class="black--text elevation-5">
        <v-card-title class="headline grey lighten-3 pa-1 ma-0" primary-title>Trend Chart</v-card-title>
        <v-layout row wrap>
          <v-flex desktop="100" tablet="100">
            <app-datepicker @getResults="getSummry"></app-datepicker>
          </v-flex>
        </v-layout>
        <v-card-text>
          <v-layout row wrap>
            <v-flex lg6 class="pa-1">
              <v-card class="elevation-10">
                <p class="text-md-center headline grey lighten-3 pa-1 ma-0">
                  ICT Service Desk
                  <br />Abandoned Call Rate (>15 secs)
                </p>
                <v-divider></v-divider>
                <v-layout row wrap align-center class="pa-2">
                  <v-flex class="text-md-center">
                    <progress-circular v-bind:class="{ 'csmHide': !isLoadingCallStatistics }"></progress-circular>
                    <abandoned-call-rate-chart-line-month-wise
                      :data="getCallStatisticsRecord"
                      v-bind:class="{ 'csmHide': isLoadingCallStatistics }"
                    />
                  </v-flex>
                </v-layout>
              </v-card>
            </v-flex>
            <v-flex lg6 class="pa-1">
              <v-card class="elevation-10">
                <p class="text-md-center headline grey lighten-3 pa-1 ma-0">
                  ICT Service Desk
                  <br />Service Level (served within 60 secs)
                </p>
                <v-divider></v-divider>
                <v-layout row wrap align-center class="pa-2">
                  <v-flex class="text-md-center">
                    <progress-circular v-show="isLoadingCallStatistics" />
                    <service-level-chart-line-month-wise
                      :data="getCallStatisticsRecord"
                      v-show="!isLoadingCallStatistics"
                    />
                  </v-flex>
                </v-layout>
              </v-card>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex class="pa-1">
              <v-card class="elevation-10">
                <p
                  class="text-md-center headline grey lighten-3 pa-1 ma-0"
                >Incident and Service Requests</p>
                <v-divider></v-divider>
                <v-layout row wrap align-center class="pa-2">
                  <v-flex class="text-md-center">
                    <progress-circular v-show="isLodingTrendChartCreatedDate" />
                    <incident-service-requests
                      :data="getDataTrendChartCreatedDate"
                      :dataUnRecordedIR="getUnRecordedIR"
                      v-show="!isLodingTrendChartCreatedDate"
                    />
                  </v-flex>
                </v-layout>
              </v-card>
            </v-flex>
            <v-flex class="pa-1">
              <v-card class="elevation-10">
                <p
                  class="text-md-center headline grey lighten-3 pa-1 ma-0"
                >Ageing (Resolved Tickets)</p>
                <v-divider></v-divider>
                <v-layout row wrap align-center class="pa-2">
                  <v-flex class="text-md-center">
                    <progress-circular v-show="isLodingTrendChartCreatedDate" />
                    <chart-stackbar-ageing
                      :objdata="getDataTrendChartCreatedDate"
                      v-show="!isLodingTrendChartCreatedDate"
                    />
                  </v-flex>
                </v-layout>
              </v-card>
            </v-flex>
            <!-- <v-flex class="pa-1">
              <v-card class="elevation-10">
                <p class="text-md-center headline grey lighten-3 pa-1 ma-0">Major Incidents</p>
                <v-divider></v-divider>
                <v-layout row wrap align-center class="pa-2">
                  <v-flex class="text-md-center">
                    <progress-circular v-show="isLodingTrendChartCreatedDate"/>
                    <chart-stackbar-ageing
                      :objdata="getDataTrendChartCreatedDate"
                      v-show="!isLodingTrendChartCreatedDate"
                    />
                  </v-flex>
                </v-layout>
              </v-card>
            </v-flex>-->
          </v-layout>
          <v-layout row wrap>
            <v-flex lg6 class="pa-1">
              <v-card class="elevation-10">
                <p
                  class="text-md-center headline grey lighten-3 pa-1 ma-0"
                >ICT User Satisfaction Level (5-scale)</p>
                <v-divider></v-divider>
                <v-layout row wrap align-center class="pa-2">
                  <v-flex class="text-md-center">
                    <progress-circular v-show="isLoading" />
                    <user-satisfaction-chart-line-month-wise
                      :data="filterdRecord"
                      v-show="!isLoading"
                    />
                  </v-flex>
                </v-layout>
              </v-card>
            </v-flex>
            <v-flex lg6 class="pa-1">
              <v-card class="elevation-10">
                <p
                  class="text-md-center headline grey lighten-3 pa-1 ma-0"
                >ICT Feedback Response Rate</p>
                <v-divider></v-divider>
                <v-layout row wrap align-center class="pa-2">
                  <v-flex class="text-md-center">
                    <progress-circular v-show="isLoading" />
                    <feedback-response-rate-chart-line-month-wise
                      :data="filterdRecord"
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
  </v-layout>
</template>
<script>
import moment from "moment";
import _ from "lodash";
import DatePicker from "../../../components/control/DatePicker";
import { mixins } from "../../../mixins/CustomMixins";

//import StackedBarPercentage from "../../Main/TrendNew/ChartStackedbar";
import ChartStackbarAgeing from "../../Main/TrendNew/ChartStackbarAgeing";
import AbandonedCallRateChartLineMonthWise from "../../Main/TrendNew/ChartLineAbandonedCallRate";
import ServiceLevelChartLineMonthWise from "../../Main/TrendNew/ChartLineServiceLevel";
import FeedbackResponseRateChartLineMonthWise from "../../Main/TrendNew/ChartLineFeedbackResponseRate";
import UserSatisfactionChartLineMonthWise from "../../Main/TrendNew/ChartLineUserSatisfaction";
import IncidentServiceRequests from "../../Main/TrendNew/ChartStackbarIncidentServiceRequest";
import ChartStackbarMajorIncidents from "../../Main/TrendNew/ChartStackbarMajorIncidents";

import TicketService from "../../../services/ticket-service";
import FeedbackService from "../../../services/feedback-service";
import CallStatisticsService from "../../../services/callstatustics-service";

import ProgressCircular from "../../../components/control/ProgressCircular";
import axios from 'axios'
export default {
  components: {
    //StackedBarPercentage,
    ChartStackbarAgeing,
    AbandonedCallRateChartLineMonthWise,
    ServiceLevelChartLineMonthWise,
    FeedbackResponseRateChartLineMonthWise,
    UserSatisfactionChartLineMonthWise,
    IncidentServiceRequests,
    ChartStackbarMajorIncidents,
    "app-datepicker": DatePicker,
    ProgressCircular
  },
  data() {
    return {
      listOfRecords: [],
      isLoading: true,
      listOfRecordsTrendChartCreatedDate: [],
      isLodingTrendChartCreatedDate: true,
      listOfRecordCallStatistics: [],
      isLoadingCallStatistics: true,
      arrayUnRecordedIRs: []
    };
  },
  created() {
    this.getSummry();
  },
  computed: {
    filterdRecord() {
      var result = this.listOfRecords.filter(
        data =>
          _.includes(this.$store.getters.filterTree, data.SupportGroup) &&
          _.includes(this.$store.getters.filterLocation, data.Property_Location)
      );
      return result;
    },

    filterdRecordTrendChartCreatedDate() {
      var result = this.listOfRecordsTrendChartCreatedDate.filter(
        data =>
          _.includes(this.$store.getters.filterTree, data.SupportGroup) &&
          _.includes(this.$store.getters.filterLocation, data.Property_Location)
      );
      return result;
    },
    getDataTrendChartCreatedDate() {
      var result = this.filterdRecordTrendChartCreatedDate;
      return result;
    },
    getUnRecordedIR() {
      var result = this.arrayUnRecordedIRs;
      return result;
    },

    getCallStatisticsRecord() {
      var result = this.listOfRecordCallStatistics;
      return result;
    },
    getData() {
      var result = this.filterdCallStatisticsRecord;
      return result;
    }
  },
  methods: {
    hideChartLabel() {
      setTimeout(function() {
        var objArray = document.getElementsByClassName("highcharts-credits");
        for (var i = 0; i < objArray.length; i++) {
          document.getElementsByClassName("highcharts-credits")[
            i
          ].style.display = "none";
        }
      }, 10);
    },
    getSummry() {
      this.fetchTrendChartCreatedDate();
      this.fetchUnRecordedIRCount();
      this.fetchCallHelpDeskStatisticsMonthly();
      this.fetchTrendChart();
    },
    async fetchTrendChartCreatedDate() {
      this.isLodingTrendChartCreatedDate = true;
      const res = await TicketService.getTrendChartCreatedDate({
        start_date: `${this.$store.getters.startDate}T00:00:00`,
        end_date: `${this.$store.getters.endDate}T23:59:59`
      })
        .then(res => {
          this.listOfRecordsTrendChartCreatedDate = res.data;
          this.isLodingTrendChartCreatedDate = false;
        })
        .catch(error => {
          this.isLodingTrendChartCreatedDate = false;
          console.log(error);
        });
    },

    async fetchTrendChart() {
      this.isLoading = true;
      const res = await TicketService.getTrendChart({
        start_date: `${this.$store.getters.startDate}T00:00:00`,
        end_date: `${this.$store.getters.endDate}T23:59:59`
      })
        .then(res => {
          this.listOfRecords = res.data;
          this.isLoading = false;
        })
        .catch(error => {
          this.isLoading = false;
          console.log(error);
        });
    },
    async fetchCallHelpDeskStatisticsMonthly() {
      this.isLoadingCallStatistics = true;
      const res = await CallStatisticsService.getCallHelpDeskStatisticsMonthly({
        start_date: `${this.$store.getters.startDate}T00:00:00`,
        end_date: `${this.$store.getters.endDate}T23:59:59`
      })
        .then(res => {
          this.listOfRecordCallStatistics = res.data;
          this.isLoadingCallStatistics = false;
        })
        .catch(error => {
          this.isLoadingCallStatistics = false;
          console.log(error);
        });
    },
    async fetchUnRecordedIRCount() {
      await axios({
        method: "get",
        url: this.$urlApplication + "GetUnRecordedIRCount"
      })
        .then(res => {
          this.arrayUnRecordedIRs = res.data;
        })
        .catch(error => {});
    }
  }
};
</script>

<style scoped>
.csmHide {
  display: none;
}
#container {
  width: 100% !important;
  height: 100% !important;
  min-width: 100% !important;
}
.highcharts-container {
  width: 100% !important;
  height: 100% !important;
  min-width: 100% !important;
}
</style>
