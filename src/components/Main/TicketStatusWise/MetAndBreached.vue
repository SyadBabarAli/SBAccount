<template>
  <div>
    <v-container grid-list-lg text-xs-center class="pt-3">
      <v-card>
        <h4 class="bgColorH4">Met and Breached Status Summary</h4>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex lg12>
            <v-card>
              <date-picker @getResults="fetchTickets"/>
            </v-card>
          </v-flex>
        </v-layout>
        <v-flex lg12 v-if="isLoading">
          <progress-linear/>
        </v-flex>
        <div v-else>
          <v-layout>
            <v-flex lg6>
              <app-donut
                :Met="ticketMeet.length"
                :Breached="ticketBreached.length"
                v-if="ticketMeet.length+ticketBreached.length"
              ></app-donut>
            </v-flex>
            <v-flex lg6>
              <app-SpeedoMeter :data="[speedometer]" v-if="speedometer"></app-SpeedoMeter>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex lg12>
              {{stackedTicketsCount}}
              <app-stacked-bar :objdataCount="stackedTicketsCount" :objdata="stackedTickets"></app-stacked-bar>
            </v-flex>
          </v-layout>
        </div>
      </v-card>
      <v-layout>
        <v-flex lg12 v-if="isLoading">
          <progress-linear/>
        </v-flex>
        <v-flex lg12 v-else>
          <v-card>
            <v-card-title>Met and Breached Status Summary
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table :headers="headers" :items="filteredRecord" :search="search">
              <template slot="items" slot-scope="props">
                <td class="text-xs-left">{{ props.item.CreatedDate | momentDate }}</td>
                <td class="text-xs-left">{{ props.item.Id }}</td>
                <td class="text-xs-left">{{ timeConvertIntoDay(props.item.Age) }}</td>
                <td class="text-xs-left">{{ props.item.AffectedUser }}</td>
                <td class="text-xs-left">{{ props.item.Title }}</td>
                <td class="text-xs-left">{{ props.item.SupportGroup }}</td>
                <td class="text-xs-left">{{ props.item.AssignedTo }}</td>
                <td class="text-xs-left">{{ props.item.Classification }}</td>
                <td class="text-xs-left">{{ props.item.Status }}</td>
                <td>
                  <v-btn
                    slot="activator"
                    @click="btnView(props.item.Id)"
                    small
                    class="pa-0 ma-0"
                  >View</v-btn>
                </td>
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
    </v-container>

    <v-dialog v-model="viewDialog" width="500">
      <app-ticket-details :getTicketId="ticketId" @Click="closeViewDialog"></app-ticket-details>
    </v-dialog>
  </div>
</template>

<script>
import _ from "lodash";
import moment from "moment";

import ProgressLinear from "../../../components/control/ProgressLinear";
import ProgressCircular from "../../../components/control/ProgressCircular";
import DatePicker from "../../../components/control/DatePicker";

import Donut from "../../../components/Main/TicketStatusWise/ChartDonut";
import StackedBar from "../../../components/Main/TicketStatusWise/ChartStackedBar";
import TicketDetails from "../../../components/Other/TicketDetails";
import TicketService from "../../../services/ticket-service";
import SpeedoMeter from "../../../components/Main/TicketStatusWise/SpeedoMeter";

export default {
  components: {
    DatePicker,
    ProgressLinear,
    ProgressCircular,
    "app-donut": Donut,
    "app-stacked-bar": StackedBar,
    "app-ticket-details": TicketDetails,
    "app-SpeedoMeter": SpeedoMeter
  },
  data() {
    return {
      search: "",
      headers: [
        { text: "Date", value: "CreatedDate", width: "20%" },
        { text: "ID", value: "Id", width: "10%" },
        { text: "Age", value: "Age", width: "10%" },
        { text: "AffectedUser", value: "AffectedUser", width: "10%" },
        { text: "Title", value: "Title", width: "20%" },
        { text: "Support Group", value: "SupportGroup", width: "10%" },
        { text: "AssignedTo", value: "AssignedTo", width: "20%" },
        {
          text: "Classification",
          value: "Classification",
          width: "20%"
        },
        {
          text: "Status",
          value: "Status",
          width: "20%"
        },
        { text: "Action", value: "", width: "5%" }
      ],

      tickets: [],
      ticketDetail: [],
      isLoading: true,
      view: "",
      viewDialog: false,
      ticketId: ""
    };
  },
  mounted() {
    this.fetchTickets();
  },
  updated() {
    this.setChart();
  },
  computed: {
    allRecord() {
      var result = this.listOfRecords.filter(data =>
        _.includes(this.$store.getters.filterTree, data.SupportGroup)
      );
      return result;
    },
    filteredRecord() {
      var result;
      result = this.allRecord;
      return result;
    },
    ticketTotal() {
      var result;
      result = this.allRecord;
      return result;
    },
    ticketMeet() {
      //alert("ticketMeet");
      var result;
      result = this.allRecord.filter(data => data.Age < 180);
      return result;
    },
    ticketBreached() {
      var result;
      result = this.allRecord.filter(data => data.Age >= 180);
      return result;
    },
    stackedTickets() {
      var result;
      if (this.allRecord != undefined) {
        result = this.allRecord;
      }

      return result;
    },
    stackedTicketsCount() {
      var result = 0;
      result = this.allRecord.length;
      //debugger;
      return result;
    },
    resolutionTime() {
      let data = [];

      _.forEach(this.allRecord, (val, key) => {
        if (val.ResolvedDate || val.ClosedDate) {
          var minute = moment(val.ResolvedDate).diff(
            moment(val.CreatedDate),
            "minutes"
          );
          data.push(minute);
        }
      });

      if (data.length) {
        var result = 0;
        result = _.round(_.meanBy(data));
        return result;
      } else {
        return "N/A";
      }
    },

    speedometer() {
      return this.resolutionTime;
    }
  },
  methods: {
    async fetchTickets() {
      //Validate Date From And To
      var strCurrentDate = new Date(
        `${this.$store.getters.startDate}T00:00:00`
      );
      var strNewEndDate = new Date(`${this.$store.getters.endDate}T23:59:59`);
      var difference = strNewEndDate - strCurrentDate;
      if (difference < 0) {
        alert("Please select date end should be greater than start date");
      } else {
        //End Validate Date From And To
        this.isLoading = true;
        //
        const res = await TicketService.getTicketResolvedAndClosedByDate({
          start_date: `${this.$store.getters.startDate}T00:00:00`,
          end_date: `${this.$store.getters.endDate}T23:59:59`
        })
          .then(res => {
            this.listOfRecords = res.data;
            this.isLoading = false;
          })
          .catch(error => {
            this.isLoading = false;
          });
      }
    },
    setChart() {
      const el = document.getElementById("myChart");

      if (el !== null) {
        const ctx = el.getContext("2d");

        const chart = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: ["Met", "Breached"],
            datasets: [
              {
                backgroundColor: ["rgb(255, 183, 77)", "rgb(100, 181, 246)"],
                data: [this.ticketMeet.length, this.ticketBreached.length]
              }
            ]
          },
          options: {
            cutoutPercentage: 60,
            responsive: true,
            maintainAspectRatio: true,
            animation: {
              animateRotate: false
            },
            legend: {
              position: "bottom"
            },
            tooltips: {
              callbacks: {
                label: function(tooltipItem, data) {
                  const dataset = data.datasets[tooltipItem.datasetIndex];
                  const total = dataset.data.reduce(
                    (previousValue, currentValue, currentIndex, array) => {
                      return previousValue + currentValue;
                    }
                  );
                  const currentValue = dataset.data[tooltipItem.index];
                  const precentage = Math.floor(
                    (currentValue / total) * 100 + 0.5
                  );

                  return precentage + "%";
                }
              }
            }
          }
        });
      }
    },
    btnView(ticketId) {
      this.ticketId = ticketId;
      this.viewDialog = true;
    },
    closeViewDialog() {
      this.viewDialog = false;
    },
    timeConvertIntoDay(input) {
      var val = input;
      var result = 0;

      if (val > 0) {
        result = parseInt(val / 1440);
      }

      return result;
    },
    hideLabel() {
      setTimeout(function() {
        if (
          document.getElementsByClassName("highcharts-credits")[0] != undefined
        ) {
          document.getElementsByClassName("highcharts-credits")[0].textContent =
            "";
        }
      }, 1000);
    }
  },
  filters: {
    avgDays(val) {
      var result;
      if (val.length) {
        result = _.round(_.meanBy(val, "Age"), 0);
      } else {
        result = "N/A";
      }
      //debugger
      return result;
    }
  }
};
</script>
