<template>
  <v-layout row wrap class="pa-2">
    <v-flex lg12 class="mt-12">
      <v-card class="black--text elevation-5">
        <v-card-title
          class="headline grey lighten-3 pa-1 ma-0"
          primary-title
        >Service Desk Statistics</v-card-title>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex lg12>
            <v-card>
              <date-picker @getResults="getResults"/>
            </v-card>
          </v-flex>
        </v-layout>
        <v-layout>
          <!-- <v-flex lg12 v-if="isLoading">
            <progress-linear/>
          </v-flex>-->
          <v-flex lg12>
            <v-card>
              <v-card-title>
                <v-toolbar-title>Details</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="search"
                  append-icon="search"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
              </v-card-title>
              <v-data-table
                :headers="headers"
                :items="filteredRecords"
                :search="search"
                :loading="isLoading"
                :pagination.sync="pagination"
              >
                <template slot="items" slot-scope="props">
                  <td class="text-xs-left">{{ props.item.Agent}}</td>
                  <td class="text-xs-left">{{ props.item.SupportGroup}}</td>
                  <td
                    class="text-xs-left"
                  >{{ props.item.AbandonedCall == 0 ? "" : props.item.AbandonedCall +' %' }}</td>
                  <td
                    class="text-xs-left"
                  >{{ getCustomerSatisfaction(props.item.CustomerSatisfaction) }}</td>
                  <td
                    class="text-xs-left"
                  >{{ props.item.ResponseRate > 0 ? props.item.ResponseRate +' %': '' }}</td>
                  <td
                    class="text-xs-left"
                  >{{ convertMinuteIntoTime2(props.item.AvrageConversationTime) }}</td>
                  <td
                    class="text-xs-left"
                  >{{ props.item.SLA == 0 ? "" : (props.item.SLA == undefined ? "" : props.item.SLA +' %') }}</td>
                  <td
                    class="text-xs-left"
                  >{{ convTwoDecimal(props.item.AttendancePercentage) +' %'}}</td>
                  <td class="text-xs-left">{{ convertMinuteIntoTime(props.item.Attendance) }}</td>
                </template>
                <v-alert
                  slot="no-results"
                  :value="true"
                  color="error"
                  icon="warning"
                >Your search for "{{ search }}" found no results.</v-alert>
              </v-data-table>
            </v-card>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import DatePicker from "../../components/control/DatePicker";
import ProgressLinear from "../../components/control/ProgressLinear";
import moment from "moment";
import _ from "lodash";
import CallStatustics from "../../services/callstatustics-service";

export default {
  data() {
    return {
      pagination: {
        rowsPerPage: 10
      },
      search: "",
      headers: [
        { text: "Agent Name", value: "Agent", width: "10%" },
        { text: "Support Group", value: "SupportGroup", width: "10%" },
        { text: "Abandoned Rate", value: "AbandonedCall", width: "10%" },
        {
          text: "Customer Satisfaction",
          value: "CustomerSatisfaction",
          width: "10%"
        },
        {
          text: "Response Rate",
          value: "AvrageConversationTime",
          width: "10%"
        },
        {
          text: "Avg.Conv Time (MM:SS)",
          value: "AvrageConversationTime",
          width: "10%"
        },
        { text: "Resolution Level", value: "SLA", width: "10%" },
        {
          text: "Attendance KPI",
          value: "AttendancePercentage",
          width: "10%"
        },
        { text: "Tel.Login Time (DD:HH:MM)", value: "Attendance", width: "10%" }
      ],

      isAllow: true,
      filterInput: "",
      startDate: "",
      endDate: "", 
      listOfRecords: [],
      isLoading: true,

      moreDialog: false,
      viewDialog: false,
      incidentId: "",
      individualName: ""
    };
  },
  mounted() {
    this.getResults();
    this.setBars();
  },
  updated() {
    this.setBars();
  },
  watch: {
    perPage() {
      this.page = 1;
    },
    filterInput() {
      this.page = 1;
    },
    "$store.getters.sync": {
      immediate: true,
      handler() {
        if (this.$store.getters.sync) {
          this.timer = setInterval(
            this.getResults,
            this.$store.getters.syncTime
          );
        } else {
          this.cancelAutoUpdate();
        }
      }
    }
  },
  computed: {
    filteredRecords() {
      var filterTeams = this.$store.getters.filterTeams;
      var recordList = this.listOfRecords.filter(ticket =>
        _.includes("Service Desk", ticket.SupportGroup)
      );
      return recordList;
    },
    isLoadingFeedbacks() {
      return this.$store.getters.isLoadingFeedbacks;
    },
    responseTickets() {
      return this.$store.getters.responseTickets;
    },
    isLoadingResponseTickets() {
      return this.$store.getters.isLoadingResponseTickets;
    },
    error() {
      return this.$store.getters.error;
    }
  },
  methods: {
    getCustomerSatisfaction(val) {
      var strVal = val;
      var strResult = strVal == undefined ? "" : strVal.toFixed(2);
      return strResult;
    },
    convertMinuteIntoTime(minute) {
      var intMinute = minute;
      var strResult = "00:00:00";
      var strHours = (minute / 60).toString().split(".");

      var intDay1 = intMinute / 1440;
      var intDay2 = intDay1 >= 1 ? intDay1.toString().split(".")[0] : 0;

      var strHour1 = (intMinute - intDay2 * 1440) / 60;
      var strHour2 = strHour1 >= 1 ? strHour1.toString().split(".")[0] : 0;

      var stMinute1 = intMinute - (intDay2 * 1440 + strHour2 * 60);
      var stMinute2 = stMinute1 >= 1 ? stMinute1.toString().split(".")[0] : 0;

      strResult = intDay2 + " : " + strHour2 + " : " + stMinute2; //+ " : " +strSecond2;
      return strResult;
    },
    convertMinuteIntoTime2(minute) {
      var intMinute = minute;
      var strResult = "00:00";
      var strTime = intMinute.toString().split(".");
      var strMinute = 0;
      var strSecond = 0;

      if (strTime.length > 1) {
        strMinute = intMinute.toString().split(".")[0];
        strSecond = intMinute.toString().split(".")[1];
        strSecond = parseInt((strSecond * 60) / 100);
      } else {
        strMinute = intMinute.toString().split(".")[0];
      }
      strResult = strMinute + " : " + strSecond;
      return strResult;
    },
    getResults() {
      this.isLoading = true;
      //Validate Date From And To
      var strCurrentDate = new Date(
        `${this.$store.getters.startDate}T00:00:00`
      );
      var strNewEndDate = new Date(`${this.$store.getters.endDate}T23:59:59`);
      var difference = strNewEndDate - strCurrentDate;
      if (difference < 0) {
        alert("Please select date end should be greater than start date");
      } else {
        try {
          var strCurrentDate = new Date(
            `${this.$store.getters.startDate} 00:00:00.000`
          );
          var strNewEndDate = new Date(
            `${this.$store.getters.endDate} 23:59:59.999`
          );

          this.isLoadingServiceDesk = false;
          const res = CallStatustics.getAgentActivityStatusticsByDateRange({
            start_date: strCurrentDate,
            end_date: strNewEndDate
          })
            .then(res => {
              this.listOfRecords = res.data;
              this.isLoading = false;
            })
            .catch(error => {
              this.isLoading = false;
            });
        } catch (err) {}
      }
    },
    setBars() {
      let bars = document.querySelectorAll(".feedback .rating-box .bar"),
        max = 0;
      for (let i of bars) {
        max = Math.max(max, i.dataset.value);
      }
      for (let i of bars) {
        i.style.width = (i.dataset.value * 100) / max + "%";
      }
    },
    cancelAutoUpdate() {
      clearInterval(this.timer);
    },
    fetchResponseTickets() {
      this.$store.dispatch("fetchResponseTickets", {
        start_date: `${this.$store.getters.startDate}T00:00:00`,
        end_date: `${this.$store.getters.endDate}T23:59:59`
      });
    },
    convTwoDecimal(input) {
      var val = input;
      var result = 0.0;
      if (val > 0) {
        result = parseFloat(Math.round(val * 100) / 100).toFixed(2);
      } else {
        result = 0.0;
      }
      return result;
    }
  },
  components: {
    DatePicker,
    ProgressLinear
  }
};
</script>