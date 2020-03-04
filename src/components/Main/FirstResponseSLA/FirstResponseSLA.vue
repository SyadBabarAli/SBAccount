


<template>
  <div id="firstResponseSLA">
    <v-layout row wrap class="pa-2">
      <v-flex lg12 class="mt-12">
        <v-card class="black--text elevation-5">
          <v-layout>
            <v-flex lg12>
              <v-card-title
                class="headline grey lighten-3 pa-1 ma-0"
                primary-title
              >First Response SLA</v-card-title>
              <v-layout row wrap>
                <v-flex lg2>
                  <v-combobox
                    class="pt-3 pl-1"
                    v-model="selectTicketResolver"
                    :items="itemsTicketResolver"
                    label="Select a user name"
                    item-text="text"
                    item-value="value"
                  ></v-combobox>
                </v-flex>
                <v-flex lg10>
                  <div class="justify-left">
                    <date-picker @getResults="fetchTFR"/>
                  </div>
                </v-flex>
              </v-layout>
              <v-container fluid grid-list-md>
                <v-layout row wrap>
                  <v-flex d-flex lg6 xs12 sm6 md4 text-xs-center>
                    <v-card height="190">
                      <h6 class="grey lighten-3 body-1">Average Response Time</h6>
                      <v-divider></v-divider>
                      <v-layout row wrap style="height:145px" align-center>
                        <v-flex lg12>
                          <progress-circular v-if="isLoading"/>
                          <div v-else>
                            <app-SpeedoMeter :data="[speedometer]" v-if="speedometer"></app-SpeedoMeter>
                            <div class="font-weight-light my-2 display-2" v-else>N/A</div>
                          </div>
                        </v-flex>
                      </v-layout>
                    </v-card>

                    <!-- <v-card class="elevation-5" height="190">
                      <v-layout row wrap style="height:190px" align-center>
                        <v-flex lg12>
                          <progress-circular v-if="isLoading"/>
                          <div v-else>
                            <app-SpeedoMeter :data="[speedometer]" v-if="speedometer"></app-SpeedoMeter>
                            <div class="font-weight-light my-2 display-2" v-else>N/A</div>
                          </div>
                        </v-flex>
                      </v-layout>
                    </v-card>-->
                  </v-flex>

                  <v-flex d-flex lg6 xs12 sm6 md4 text-xs-center>
                    <v-card height="190">
                      <h6 class="grey lighten-3 body-1">First Response SLA (Overall)</h6>
                      <v-divider></v-divider>
                      <v-layout row wrap style="height:145px" align-center>
                        <v-flex lg12>
                          <progress-circular v-if="isLoading"/>
                          <div v-else>
                            <app-chartTFR
                              id="chartFirstResponseSLA"
                              :met="cntMet.length"
                              :breached="cntBreached.length"
                              :notresponded="cntNotResponded.length"
                              v-if="cntMet.length || cntBreached.length || cntNotResponded.length"
                            />
                            <div class="font-weight-light my-2 display-2" v-else>N/A</div>
                          </div>
                        </v-flex>
                      </v-layout>
                    </v-card>

                    <!-- <v-card class="elevation-5" height="190">
                      <v-layout row wrap style="height:190px" align-center>
                        <v-flex lg12>
                          <progress-circular v-if="isLoading"/>
                          <div v-else>
                            <app-chartTFR
                              id="chartFirstResponseSLA"
                              :met="cntMet.length"
                              :breached="cntBreached.length"
                              :notresponded="cntNotResponded.length"
                              v-if="cntMet.length || cntBreached.length || cntNotResponded.length"
                            />
                            <div class="font-weight-light my-2 display-2" v-else>N/A</div>
                          </div>
                        </v-flex>
                      </v-layout>
                    </v-card>-->
                  </v-flex>

                  <v-flex d-flex lg12 xs12 sm12 md12 text-xs-center>
                    <v-card height="290">
                      <h6 class="grey lighten-3 body-1">First Response SLA (Support Group Wise)</h6>
                      <v-divider></v-divider>
                      <v-layout row wrap style="height:145px" align-center>
                        <v-flex lg12>
                          <progress-circular v-if="isLoading"/>
                          <div v-else>
                            <app-HighChartStackBar100 :data="stackBar100" v-if="stackBar100.length"></app-HighChartStackBar100>
                            <div class="font-weight-light my-2 display-2" v-else>N/A</div>
                          </div>
                        </v-flex>
                      </v-layout>
                    </v-card>
                    <!-- <v-card class="elevation-5" height="290">
                      <v-layout row wrap style="height:290px" align-center>
                        <v-flex lg12>
                          <progress-circular v-if="isLoading"/>
                          <div v-else>
                            <app-HighChartStackBar100 :data="stackBar100" v-if="stackBar100.length"></app-HighChartStackBar100>
                            <div class="font-weight-light my-2 display-2" v-else>N/A</div>
                          </div>
                        </v-flex>
                      </v-layout>
                    </v-card>-->
                  </v-flex>
                </v-layout>
              </v-container>
              <v-layout>
                <v-flex lg12>
                  <v-card>
                    <v-card-title>
                      <!-- <v-toolbar-title>Details</v-toolbar-title>
                      <v-divider class="mx-2" inset vertical></v-divider>-->
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
                      must-sort
                      :headers="headers"
                      :items="filteredRecords"
                      :search="search"
                      :pagination.sync="pagination"
                      :loading="isLoading"
                    >
                      <template slot="items" slot-scope="props">
                        <td class="text-xs-left">{{ props.item.SupportGroup }}</td>
                        <td class="text-xs-left">{{ props.item.IR }}</td>
                        <td class="text-xs-left">{{ props.item.AssignedTime | momentDate }}</td>
                        <td class="text-xs-left">{{ props.item.FirstResponseTime | momentDate }}</td>
                        <td
                          class="text-xs-left"
                        >{{ convertMinuteIntoTime(props.item.Duration,props.item.FirstResponseTime,props.item.AssignedTime,props.item.Duration) }}</td>
                        <td class="text-xs-left">{{ props.item.SLA }}</td>
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
            </v-flex>
          </v-layout>
          <v-divider light></v-divider>
          <v-card-actions class="pa-0 ma-0 ml-1"></v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>


<script>
import moment from "moment";
import _ from "lodash";
import TicketService from "../../../services/ticket-service";

import ChartDonutFirstResponse from "../../../components/Chart/ChartJs/ChartDonutFirstResponse";
import SpeedoMeter from "../../../components/Main/FirstResponseSLA/SpeedoMeter";
import HighChartStackBar100 from "../../../components/Main/FirstResponseSLA/HighChartStackBar100";
import TicketDetails from "../../../components/Other/TicketDetails";

import DatePicker from "../../../components/control/DatePicker";
import ProgressLinear from "../../../components/control/ProgressLinear";
import ProgressCircularSmall from "../../../components/control/ProgressCircularSmall";

import ProgressCircular from "../../../components/control/ProgressCircular";
import axios from "axios";
export default {
  components: {
    DatePicker,
    ProgressLinear,
    ProgressCircular,
    ProgressCircularSmall,
    "app-chartTFR": ChartDonutFirstResponse,
    "app-SpeedoMeter": SpeedoMeter,
    "app-HighChartStackBar100": HighChartStackBar100
  },
  data() {
    return {
      pagination: {
        descending: true,
        sortBy: "AssignedTime"
      },
      search: "",
      headers: [
        { text: "Support Group", value: "SupportGroup", width: "20%" },
        { text: "IR", value: "IR", width: "10%" },
        { text: "Assigned Time", value: "AssignedTime", width: "20%" },
        {
          text: "First Response Time",
          value: "FirstResponseTime",
          width: "10%"
        },
        { text: "Duration DD:HH:MM", value: "Duration", width: "20%" },
        { text: "SLA", value: "SLA", width: "20%" }
      ],

      startDate: "",
      endDate: "",
      listOfRecords: [],
      incidentId: "",
      isLoading: false,
      filterInput: "",
      viewDialog: false,
      individualTeam: "",
      individualName: "",
      moreDialog: false,
      IsExportFirstTime: false,
      selectTicketResolver: [],
      itemsTicketResolver: []
    };
  },
  watch: {
    "$store.getters.sync": {

      immediate: true,
      handler() {
        if (this.$store.getters.sync) {

            
          
          this.timer = setInterval(this.fetchTFR, this.$store.getters.syncTime);
        } else {
          this.cancelAutoUpdate();
        }
      }
    }
  },
  created() {
    this.getTicketResolver();
    this.fetchTFR();
  },
  computed: {
    filteredRecords() {
      var result;
      let query = this.$route.query.display;
      result = this.listOfRecords.filter(
        data =>
          _.includes(this.$store.getters.filterTree, data.SupportGroupLast) &&
          _.includes(this.$store.getters.filterLocation, data.Property_Location)
      );
      return result;
    },
    exportIntoExcel() {
      var objData = this.listOfRecords.filter(data =>
        _.includes(this.$store.getters.filterTree, data.SupportGroupLast)
      );

      for (var i = 0; i < objData.length; i++) {
        var resultDateTime = objData[i].AssignedTime;
        if (resultDateTime != undefined && resultDateTime.indexOf("T") != -1) {
          var resultDateTimeNew = resultDateTime.split("T");

          var vDate = resultDateTimeNew[0];
          var vTime = resultDateTimeNew[1];

          var vDateArray = vDate.split("-");

          var vYear = vDateArray[0];
          var vMonth = vDateArray[1];
          var vDay = vDateArray[2];
          var resultDate = vMonth + "/" + vDay + "/18";

          var vTimeArray = vTime.split(":");

          var vHour = vTimeArray[0];
          var vMinute = vTimeArray[1];
          var vSecond = parseInt(vTimeArray[2]);
          var vResultTime = vHour + ":" + vMinute + ":00";

          resultDateTime = resultDate + " " + vResultTime;
          objData[i].AssignedTime = resultDateTime;
        }
        //2
        var resultDateTime2 = objData[i].FirstResponseTime;
        if (
          resultDateTime2 != undefined &&
          resultDateTime2.indexOf("T") != -1
        ) {
          resultDateTime2 = resultDateTime2.split("T");

          var vDate2 = resultDateTime2[0];
          var vTime2 = resultDateTime2[1];

          var vDateArray2 = vDate2.split("-");

          var vYear2 = vDateArray2[0];
          var vMonth2 = vDateArray2[1];
          var vDay2 = vDateArray2[2];
          var resultDate2 = vMonth2 + "/" + vDay2 + "/" + vYear2;

          var vTimeArray2 = vTime2.split(":");

          var vHour2 = vTimeArray2[0];
          var vTime2 = vTimeArray2[1];
          var vSecond2 = parseInt(vTimeArray2[2]);
          var vResultTime2 = vHour2 + ":" + vTime2 + ":00";

          resultDateTime2 = resultDate2 + " " + vResultTime2;

          objData[i].FirstResponseTime = resultDateTime2;
        }
      }

      return objData;
    },
    cntBreached() {
      var obj = this.filteredRecords.filter(data => data.SLA === "Breached");
      return obj;
    },
    cntMet() {
      var obj = this.filteredRecords.filter(data => data.SLA === "Met");
      return obj;
    },
    cntNotResponded() {
      var obj = this.filteredRecords.filter(
        data => data.SLA === "Not Responded"
      );
      return obj;
    },
    speedometer() {
      var data = this.filteredRecords.filter(data => 1 === 1);
      var result = 0;
      if (data.length > 0) {
        var sumTimeMin = _.sumBy(data, "Duration");
        var cntRecord = 0;
        _.mapKeys(data, function(value, key) {
          if (
            value.FirstResponseTime != undefined &&
            value.AssignedTime != undefined &&
            value.Duration != 0
          ) {
            cntRecord++;
          }
        });

        result = sumTimeMin / cntRecord;
        result = parseInt(result);
      }

      return result;
    },
    stackBar100() {
      var obj = this.filteredRecords.filter(data => 1 === 1);
      return obj;
    }
  },
  methods: {
    getTicketResolver() {
      // axios({
      //   method: "get",
      //   url: this.$urlApplication + "general/GetAgentUserList"
      // })
      //   .then(res => {
      //     this.itemsTicketResolver = [];
      //     var IsSelect = true;
      //     for (let items of res.data) {
      //       var result = {
      //         value: items.Email,
      //         text: items.FirstName
      //       };
      //       if (IsSelect) {
      //         this.selectTicketResolver = {
      //           value: items.Email,
      //           text: items.FirstName
      //         };
      //         IsSelect = false;
      //       }

      //       this.itemsTicketResolver.push(result);
      //     }
      //   })
      //   .catch(error => {});
      axios({
        method: "get",
        url: this.$urlApplication + "general/GetTicketResolvers"
      })
        .then(res => {
          this.itemsTicketResolver = [];
          for (let items of res.data) {
            var result = {
              value: items.UserDimKey,
              text: items.UserName
            };

            this.itemsTicketResolver.push(result);
          }
        })
        .catch(error => {});
    },

    closeMoreDialog() {
      this.moreDialog = false;
    },
    fetchTFR() {
      //var obj = this.selectTicketResolver.value;
      //debugger
      this.startDate = this.$store.getters.startDate;
      this.endDate = this.$store.getters.endDate;
      //Validate Date From And To
      var strCurrentDate = new Date(
        `${this.$store.getters.startDate}T00:00:00`
      );
      var strNewEndDate = new Date(`${this.$store.getters.endDate}T23:59:59`);
      var difference = strNewEndDate - strCurrentDate;
      if (difference < 0) {
        alert("Please select date end should be greater than start date");
      } else {
        this.listOfRecords = [];
        //End Validate Date From And To
        this.isLoading = true;
        TicketService.getSPDBSLAFirstResponseByResolved({
          start_date: `${this.$store.getters.startDate}T00:00:00`,
          end_date: `${this.$store.getters.endDate}T23:59:59`,
          userDimKey:
            this.selectTicketResolver.value == undefined
              ? 0
              : this.selectTicketResolver.value
        })
          .then(res => {
            this.listOfRecords = res.data;
            this.isLoading = false;
            //this.hideLabel();
            //document.querySelector("#chartFirstResponseSLA > div > canvas").style.height ="190px";
          })
          .catch(error => {
            //document.getElementById("loading").style.display = "none";
            this.isLoading = false;
            //document.getElementById("noRecord").style.display = "block";
            console.log(error);
          });
      }
    },
    // setBars() {
    //   let bars = document.querySelectorAll(
    //       ".IndividualDetails .rating-box.individual .bar"
    //     ),
    //     max = 0;
    //   for (let i of bars) {
    //     max = Math.max(max, i.dataset.individual);
    //   }
    //   for (let i of bars) {
    //     i.style.width = (i.dataset.individual * 100) / max + "%";
    //   }
    // },
    convertMinuteIntoTime(minute, firstResponseTime, assignedTime, duration) {
      var pFirstResponseTime = firstResponseTime;
      var pAssignedTime = assignedTime;
      var pDuration = duration;

      var intMinute = minute;
      var strResult = "00:00:00";
      if (pFirstResponseTime == undefined) {
        strResult = "---------------------------------";
      } else if (
        pFirstResponseTime != undefined &&
        pAssignedTime != undefined &&
        pDuration == 0
      ) {
        strResult = "---------------------------------";
        //strResult ="xxxxxxxxxxxxxxxxxx";
      } else {
        var strHours = (minute / 60).toString().split(".");

        var intDay1 = intMinute / 1440;
        var intDay2 = intDay1 >= 1 ? intDay1.toString().split(".")[0] : 0;

        var strHour1 = (intMinute - intDay2 * 1440) / 60;
        var strHour2 = strHour1 >= 1 ? strHour1.toString().split(".")[0] : 0;

        var stMinute1 = intMinute - (intDay2 * 1440 + strHour2 * 60);
        var stMinute2 = stMinute1 >= 1 ? stMinute1.toString().split(".")[0] : 0;

        strResult = intDay2 + " : " + strHour2 + " : " + stMinute2; //+ " : " +strSecond2;
      }
      return strResult;
    },
    cancelAutoUpdate() {
      clearInterval(this.timer);
    }
    // hideLabel() {
    //   setTimeout(function() {
    //     if (
    //       document.getElementsByClassName("highcharts-credits")[0] != undefined
    //     ) {
    //       document.getElementsByClassName("highcharts-credits")[0].textContent =
    //         "";
    //     }

    //     if (
    //       document.getElementsByClassName("highcharts-credits")[1] != undefined
    //     ) {
    //       document.getElementsByClassName("highcharts-credits")[1].textContent =
    //         "";
    //     }
    //   }, 1000);
    // }
  },
  beforeDestroy() {
    this.cancelAutoUpdate();
  }
  // mounted() {
  //   this.fetchTFR();
  //   //this.hideLabel();
  // }
};
</script>

<style scoped>

.echarts {
  width: 320px !important;
  height: 190px !important;
  margin: auto;
}
/* Table Self Style*/
table.v-table tbody td:first-child,
table.v-table tbody td:not(:first-child),
table.v-table tbody th:first-child,
table.v-table tbody th:not(:first-child),
table.v-table thead td:first-child,
table.v-table thead td:not(:first-child),
table.v-table thead th:first-child,
table.v-table thead th:not(:first-child) {
  padding: 0 10px;
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