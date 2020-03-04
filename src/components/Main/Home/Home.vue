<template>
  <div id="home">
    <v-layout row wrap class="pa-2">
      <v-flex lg12 class="mt-12">
        <v-card class="black--text elevation-5">
          <v-layout>
            <v-flex lg12>
              <v-card-title class="headline grey lighten-3 pa-1 ma-0" primary-title>Home</v-card-title>
              <v-layout row wrap>
                <v-flex lg12 text-xs-center>
                  <date-picker @getResults="fetchSummary" />
                </v-flex>
              </v-layout>
              <v-container fluid grid-list-md>
                <v-layout row wrap pb-3>
                  <v-flex d-flex v-if="rights.barTicketsReported">
                    <box-four :descName="'Tickets Reported'" :icon="'report_problem'">
                      <div slot="content1">
                        <progress-circular-small v-if="$store.getters.isLoadingTickets" />
                        <div v-else>{{ tickets.length == 0 ? "N/A" : tickets.length }}</div>
                      </div>
                    </box-four>
                  </v-flex>

                  <v-flex d-flex v-if="rights.barticketsResolved">
                    <box-four :descName="'Tickets Resolved'" :icon="'thumb_up'">
                      <div slot="content1">
                        <progress-circular-small v-if="$store.getters.isLoadingTickets" />
                        <div v-else>{{ resolvedCount.length == 0 ? "N/A" : resolvedCount.length }}</div>
                      </div>
                    </box-four>
                  </v-flex>

                  <v-flex d-flex v-if="rights.baravgResponseTime">
                    <box-four :descName="'Avg. Response Time (M)'" :icon="'timelapse'">
                      <div slot="content1">
                        <progress-circular-small v-if="isLoadingFirstResponseSLA" />
                        <div v-else>{{responseTime == 0 ? "N/A" : responseTime }}</div>
                      </div>
                    </box-four>
                  </v-flex>

                  <v-flex d-flex v-if="rights.baravgResolutionTime">
                    <box-four :descName="'Avg. Resolution Time (M)'" :icon="'timer'">
                      <div slot="content1">
                        <progress-circular-small v-if="$store.getters.isLoadingTickets" />
                        <div v-else>{{resolutionTime}}</div>
                      </div>
                    </box-four>
                  </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex d-flex xs12 sm6 md4 text-xs-center v-if="rights.pendingTickets">
                    <v-card>
                      <h6 class="grey lighten-3 body-1">Pending Tickets</h6>
                      <v-divider></v-divider>
                      <v-layout row wrap style="height:145px" align-center>
                        <v-flex lg12 class="pt-1 ma-1">
                          <progress-circular v-if="$store.getters.isLoadingTickets" />
                          <div v-else>
                            <app-donut
                              :active="activeCount.length"
                              :overdue="pendingCount.length"
                              v-if="pendingCount.length || activeCount.length"
                            ></app-donut>
                            <div class="font-weight-light my-2 display-2" v-else>N/A</div>
                          </div>
                        </v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex lg12 class="pb-1 mb-1">
                          <button-small :link="'/pending?display=all'" :desciption="'View Detail'" />
                        </v-flex>
                      </v-layout>
                    </v-card>
                  </v-flex>

                  <v-flex d-flex xs12 sm6 md4 text-xs-center v-if="rights.firstResponseSLA">
                    <v-card>
                      <h4 class="grey lighten-3 body-1">First Resoponse SLA</h4>
                      <v-divider></v-divider>
                      <v-layout row wrap style="height:145px" align-center>
                        <v-flex lg12 class="pt-1 ma-1">
                          <progress-circular v-if="isLoadingFirstResponseSLA" />
                          <div v-else>
                            <app-chartTFR
                              id="chartFirstResponseSLA"
                              :met="cntMet.length"
                              :breached="cntBreached.length"
                              :notresponded="cntNotResponded.length"
                              v-if="cntMet.length || cntBreached.length || cntNotResponded.length"
                            ></app-chartTFR>
                            <div class="font-weight-light my-2 display-2" v-else>N/A</div>
                          </div>
                        </v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex lg12 class="pb-1 mb-1">
                          <button-small :link="'/FirstResponseSLA'" :desciption="'View Detail'" />
                        </v-flex>
                      </v-layout>
                    </v-card>
                  </v-flex>

                  <v-flex d-flex xs12 sm6 md4 text-xs-center v-if="rights.resolvedTicketsAge">
                    <v-card>
                      <h4 class="grey lighten-3 body-1">Resolved Tickets (Age)</h4>
                      <v-divider></v-divider>
                      <v-layout row wrap style="height:145px" align-center>
                        <v-flex lg12 class="pt-1 ma-1">
                          <progress-circular v-if="$store.getters.isLoadingTickets" />
                          <div v-else>
                            <chart-dougnut-ageing-ticket
                              :below3Hours="ageingTicket.time.below3Hours"
                              :hours3to24="ageingTicket.time.hours3to24"
                              :days2to15="ageingTicket.time.days2to15"
                              :days16to30="ageingTicket.time.days16to30"
                              :above30days="ageingTicket.time.above30days"
                              v-if="ageingTicket.time.below3Hours || ageingTicket.time.hours3to24 || ageingTicket.time.days2to15
                             || ageingTicket.time.days16to30 || ageingTicket.time.above30days"
                            />
                            <div class="font-weight-light my-2 display-2" v-else>N/A</div>
                          </div>
                        </v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex lg12 class="pb-1 mb-1">
                          <button-small :link="'/AgeingTicket'" :desciption="'View Detail'" />
                        </v-flex>
                      </v-layout>
                    </v-card>
                  </v-flex>

                  <v-flex d-flex xs12 sm6 md4 text-xs-center v-if="rights.userFeedbackStatistics">
                    <v-card>
                      <h4 class="grey lighten-3 body-1">User Feedback Statistics</h4>
                      <v-divider></v-divider>
                      <v-layout row wrap style="height:145px" align-center>
                        <v-flex lg12 class="pt-1 ma-1">
                          <v-flex lg12 v-if="$store.getters.isLoadingFeedbacks">
                            <progress-circular />
                          </v-flex>
                          <feedback-rating
                            :ratingStar="feedbackStats.ratingPercentage"
                            :avgRating="feedbackStats.avgRating"
                            :total="feedbacks.length"
                            :ratingFive="feedbackStats.rating.five"
                            :ratingFour="feedbackStats.rating.four"
                            :ratingThree="feedbackStats.rating.three"
                            :ratingTwo="feedbackStats.rating.two"
                            :ratingOne="feedbackStats.rating.one"
                            v-else
                          />
                        </v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex lg12 class="pb-1 mb-1">
                          <button-small :link="'/feedback'" :desciption="'View Detail'" />
                        </v-flex>
                      </v-layout>
                    </v-card>
                  </v-flex>

                  <v-flex d-flex xs12 sm6 md4 text-xs-center v-if="rights.ticketsResolvedOverallIT">
                    <v-card>
                      <h4 class="grey lighten-3 body-1">% of Tickets Resolved (Overall IT)</h4>
                      <v-divider></v-divider>
                      <v-layout row wrap style="height:145px" align-center>
                        <v-flex lg12 class="pt-1 ma-1">
                          <v-flex lg12>
                            <progress-circular v-if="$store.getters.isLoadingTickets" />
                            <div v-else>
                              <div class="font-weight-light display-2">{{ticketsResolvedPercentage}}</div>
                            </div>
                          </v-flex>
                        </v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex lg12 class="pb-1 mb-1">
                          <button-small :link="'/AllTickets'" :desciption="'View Detail'" />
                        </v-flex>
                      </v-layout>
                    </v-card>
                  </v-flex>

                  <v-flex d-flex xs12 sm6 md4 text-xs-center v-if="rights.priorityTickets">
                    <v-card>
                      <h4 class="grey lighten-3 body-1">Priority 1 Tickets</h4>
                      <v-divider></v-divider>
                      <v-layout row wrap style="height:145px" align-center>
                        <v-flex lg12 class="pt-1 ma-1">
                          <v-flex lg12>
                            <progress-circular v-if="$store.getters.isLoadingTickets" />
                            <div v-else>
                              <div class="csmheadline font-weight-light display-2">{{priorityCount}}</div>
                            </div>
                          </v-flex>
                        </v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex lg12 class="pb-1 mb-1">
                          <button-small :link="'/priority'" :desciption="'View Detail'" />
                        </v-flex>
                      </v-layout>
                    </v-card>
                  </v-flex>

                  <v-flex d-flex xs12 sm6 md4 text-xs-center v-if="rights.serviceDeskstatistics">
                    <v-card>
                      <h4 class="grey lighten-3 body-1">Service Desk (3434) Statistics</h4>
                      <v-divider></v-divider>
                      <v-layout row wrap style="height:145px" align-center>
                        <v-flex lg12 class="pt-1 ma-1">
                          <progress-circular v-if="$store.getters.isLoadingTickets" />
                          <div v-else>
                            <v-layout row wrap>
                              <v-flex lg>
                                <h5 class="font-weight-regular">Avg Speed Of Answer (Within 60s)</h5>
                                <div class="font-weight-light display-2 pt-3">{{ServiceLevel60s}}</div>
                              </v-flex>
                              <v-flex lg6>
                                <h5 class="font-weight-regular">Total Abandoned Calls %</h5>
                                <div
                                  class="font-weight-light display-2 pt-3"
                                >{{TotalAbandonedCalls}}</div>
                              </v-flex>
                            </v-layout>
                          </div>
                        </v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex lg12 class="pb-1 mb-1">
                          <button-small :desciption="'View Detail'" v-show="false" />
                        </v-flex>
                      </v-layout>
                    </v-card>
                  </v-flex>

                  <v-flex d-flex xs12 sm6 md4 text-xs-center v-if="rights.followUpTickets">
                    <v-card>
                      <h4 class="grey lighten-3 body-1">% Follow Up Tickets</h4>
                      <v-divider></v-divider>
                      <v-layout row wrap style="height:145px" align-center>
                        <v-flex lg12 class="pt-1 ma-1">
                          <progress-circular v-if="this.isLoadingFollowUpTicket" />
                          <div v-else>
                            <v-layout row wrap>
                              <v-flex lg12>
                                <div class="font-weight-light display-2 pt-3">{{followUpTicket}}</div>
                              </v-flex>
                            </v-layout>
                          </div>
                        </v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex lg12 class="pb-1 mb-1">
                          <button-small :desciption="'View Detail'" v-show="false" />
                        </v-flex>
                      </v-layout>
                    </v-card>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-flex>
          </v-layout>
          <v-divider light></v-divider>
        </v-card>
      </v-flex>
    </v-layout>
    <div class="csmHide">{{feedbackStats}}</div>
  </div>
</template>

<script>
import DatePicker from "../../../components/control/DatePicker";
import ProgressCircularSmall from "../../../components/control/ProgressCircularSmall";
import ProgressCircular from "../../../components/control/ProgressCircular";
import BoxFour from "../../../components/control/BoxFour";
import ButtonSmall from "../../../components/control/ButtonSmall";
import FeedbackRating from "../../../components/control/FeedbackRating";
import Donut from "../../../components/Chart/ChartJs/ActiveDonut";
import Doughnut from "../../../components/ChartJS/Doughnut/Doughnut.js";
import TicketService from "../../../services/ticket-service";
import ChartDonutFirstResponse from "../../../components/Chart/ChartJs/ChartDonutFirstResponse";
import ChartDougnutAgeingTicket from "../../../components/Main/Home/ChartDougnutAgeingTicket";
import CallStatustics from "../../../services/callstatustics-service";

import moment from "moment";
import _ from "lodash";
//import color from '../theme.js'
import { mixins } from "../../../mixins/CustomMixins";

export default {
  name: "home",
  mixins: [mixins],
  data() {
    return {
      rights: {
        pendingTickets: false,
        firstResponseSLA: false,
        resolvedTicketsAge: false,
        userFeedbackStatistics: false,
        ticketsResolvedOverallIT: false,
        ticketsResolved: false,
        priorityTickets: false,
        serviceDeskStatistics: false,
        followUpTickets: false,
        //Top 4 Boxes
        barTicketsReported: false,
        barticketsResolved: false,
        baravgResponseTime: false,
        baravgResolutionTime: false
      },
      isLoadingFirstResponseSLA: true,
      isLoadingFollowUpTicket: true,
      rating: 5,
      dateFrom: "01-01-2018",
      dateTo: "01-01-2018",
      height: 150,
      datacollection: null,
      timer: "",
      isLoadingServiceDesk: true,
      TotalAbandonedCalls: 0,
      FollowUpTicket: [],
      ServiceLevel60s: 0,
      listOfRecords: [],
      isLoadingTicketAgeing: true,
      listOfRecordAgeingTicket: [],
      items: [
        "Red",
        "Pink",
        "Purpel",
        "Deep Purpel",
        "Indigo",
        "Blue",
        "Light Blue",
        "Cyan",
        "Teal",
        "Green",
        "Light Green",
        "Lime",
        "Yellow",
        "Amber",
        "Orange",
        "Deep Orange",
        "Brown",
        "Blue Gray",
        "Dashboard-Old"
      ]
    };
  },
  created: function() {
    this.$store.commit("setCurrentScreenName", "Home");

    var obj = fetch(this.$urlApplication + "RoleUserRules/GetRoleUserRuleMenu")
      .then(res => res.json())
      .then(data => {
        var objData = data;
        var arrayResult = [];
        for (var i = 0; i < objData.length; i++) {
          var obj = objData[i];
          var optionName = obj.name;

          if (obj.Nature == "Box" || obj.Nature == "Bar") {
            if (optionName == "PendingTickets") {
              this.rights.pendingTickets = true;
            } else if (optionName == "FirstResponseSLA") {
              this.rights.firstResponseSLA = true;
            } else if (optionName == "TicketsResolvedOverallIT") {
              this.rights.ticketsResolvedOverallIT = true;
            } else if (optionName == "UserFeedbackStatistics") {
              this.rights.userFeedbackStatistics = true;
            } else if (optionName == "ServiceDeskStatistics") {
              this.rights.serviceDeskstatistics = true;
            } else if (optionName == "PriorityTickets") {
              this.rights.priorityTickets = true;
            } else if (optionName == "ResolvedTicketsAge") {
              this.rights.resolvedTicketsAge = true;
            } else if (optionName == "FollowUpTickets") {
              this.rights.followUpTickets = true;
            }

            //Topbar  4
            else if (optionName == "TicketsReportedBar") {
              this.rights.barTicketsReported = true;
            } else if (optionName == "TicketsResolvedBar") {
              this.rights.barticketsResolved = true;
            } else if (optionName == "AvgResponseTimeBar") {
              this.rights.baravgResponseTime = true;
            } else if (optionName == "AvgResolutionTimeBar") {
              this.rights.baravgResolutionTime = true;
            }
          }
        }
      })
      .catch(err => console.log(err));
  },
  components: {
    ProgressCircular,
    ProgressCircularSmall,
    ButtonSmall,
    BoxFour,
    DatePicker,
    FeedbackRating,
    doughnut: Doughnut,
    "app-donut": Donut,
    "app-chartTFR": ChartDonutFirstResponse,
    ChartDougnutAgeingTicket
  },
  mounted() {
    //this.fetchSummary();
  },
  watch: {
    "$store.getters.sync": {
      immediate: true,
      handler() {
        if (this.$store.getters.sync) {
          this.timer = setInterval(
            this.fetchSummary,
            this.$store.getters.syncTime
          );
        } else {
          this.cancelAutoUpdate();
        }
      }
    }
  },
  computed: {
    myStyles() {
      return {
        height: `150px`,
        position: "relative"
      };
    },

    feedbacks() {
      return this.$store.getters.feedbacks;
    },
    // followUpTicket()
    // {
    //   var
    // },
    feedbackStats() {
      var ratingFive = this.feedbacks.filter(feedback => feedback.Rating == 5)
        .length;
      var ratingFour = this.feedbacks.filter(feedback => feedback.Rating == 4)
        .length;
      var ratingThree = this.feedbacks.filter(feedback => feedback.Rating == 3)
        .length;
      var ratingTwo = this.feedbacks.filter(feedback => feedback.Rating == 2)
        .length;
      var ratingOne = this.feedbacks.filter(feedback => feedback.Rating == 1)
        .length;

      var ratingMax = Math.max(
        ratingFive,
        ratingFour,
        ratingThree,
        ratingTwo,
        ratingOne
      );

      var ratingMaxIndivisor = ratingMax / 100 / 2;
      var ratingFivePercentage = ratingFive / ratingMaxIndivisor;
      ratingFivePercentage = isNaN(ratingFivePercentage)
        ? 0
        : ratingFivePercentage;

      var ratingFourPercentage = ratingFour / ratingMaxIndivisor;
      ratingFourPercentage = isNaN(ratingFourPercentage)
        ? 0
        : ratingFourPercentage;

      var ratingThreePercentage = ratingThree / ratingMaxIndivisor;
      ratingThreePercentage = isNaN(ratingThreePercentage)
        ? 0
        : ratingThreePercentage;

      var ratingTwoPercentage = ratingTwo / ratingMaxIndivisor;
      ratingTwoPercentage = isNaN(ratingTwoPercentage)
        ? 0
        : ratingTwoPercentage;

      var ratingOnePercentage = ratingOne / ratingMaxIndivisor;
      ratingOnePercentage = isNaN(ratingOnePercentage)
        ? 0
        : ratingOnePercentage;

      let statsData = {
        avgRating: isNaN(_.round(_.meanBy(this.feedbacks, "Rating"), 2))
          ? 0
          : _.round(_.meanBy(this.feedbacks, "Rating"), 2),
        ratingPercentage: isNaN(
          0.05 * ((_.round(_.meanBy(this.feedbacks, "Rating"), 2) * 100) / 5)
        )
          ? 0
          : 0.05 * ((_.round(_.meanBy(this.feedbacks, "Rating"), 2) * 100) / 5),
        rating: {
          five: ratingFivePercentage,
          four: ratingFourPercentage,
          three: ratingThreePercentage,
          two: ratingTwoPercentage,
          one: ratingOnePercentage
        }
      };
      this.$store.dispatch("storeDissatisfactionCount", ratingOne + ratingTwo);
      setTimeout(function() {
        var obj = document.querySelectorAll(
          ".v-progress-linear__bar__determinate"
        );

        if (obj[0] != undefined) {
          if (document.querySelector("#divRating1") != null) {
            ratingFive =
              ratingFive > 0
                ? ratingFive.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : ratingFive;

            ratingFour =
              ratingFour > 0
                ? ratingFour.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : ratingFour;

            ratingThree =
              ratingThree > 0
                ? ratingThree.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : ratingThree;

            ratingTwo =
              ratingTwo > 0
                ? ratingTwo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : ratingTwo;

            ratingOne =
              ratingOne > 0
                ? ratingOne.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : ratingOne;

            document.querySelector("#divRating1").textContent = ratingFive;
            document.querySelector("#divRating2").textContent = ratingFour;
            document.querySelector("#divRating3").textContent = ratingThree;
            document.querySelector("#divRating4").textContent = ratingTwo;
            document.querySelector("#divRating5").textContent = ratingOne;
          } else {
            var objDiv1 = obj[0].appendChild(document.createElement("div"));
            objDiv1.textContent =
              ratingFive > 0
                ? ratingFive.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : ratingFive;
            objDiv1.style.textAlign = "left";
            objDiv1.id = "divRating1";

            var objDiv2 = obj[1].appendChild(document.createElement("div"));
            objDiv2.textContent =
              ratingFour > 0
                ? ratingFour.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : ratingFour;
            objDiv2.style.textAlign = "left";
            objDiv2.id = "divRating2";

            var objDiv3 = obj[2].appendChild(document.createElement("div"));
            objDiv3.textContent =
              ratingThree > 0
                ? ratingThree.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : ratingThree;
            objDiv3.style.textAlign = "left";
            objDiv3.id = "divRating3";

            var objDiv4 = obj[3].appendChild(document.createElement("div"));
            objDiv4.textContent =
              ratingTwo > 0
                ? ratingTwo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : ratingTwo;
            objDiv4.style.textAlign = "left";
            objDiv4.id = "divRating4";

            var objDiv5 = obj[4].appendChild(document.createElement("div"));
            objDiv5.textContent =
              ratingOne > 0
                ? ratingOne.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : ratingOne;
            objDiv5.style.textAlign = "left";
            objDiv5.id = "divRating5";
          }
        }
      }, 300);

      return statsData;
    },
    tickets() {
      var obj = this.$store.getters.tickets;
      return this.$store.getters.tickets;
    },
    resolvedCount() {
      return this.tickets.filter(
        ticket => ticket.Status === "Resolved" || ticket.Status === "Closed"
      );
    },
    priorityCount() {
      var obj = this.tickets.filter(ticket => ticket.Priority === 1).length;
      this.$store.dispatch("storePriorityTicket", obj);
      return obj;
    },

    responseTime() {
      var data = this.filteredRecords.filter(data => 1 === 1);
      var result = "N/A";
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

        if (result > 0) {
        } else {
          result = "N/A";
        }
      }

      return result;
    },
    resolutionTime() {
      let data = [];

      _.forEach(this.tickets, (val, key) => {
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
    activeTickets() {
      return this.$store.getters.activeTickets;
    },
    activeCount() {
      return this.activeTickets.filter(ticket => ticket.Age < 3);
    },
    pendingCount() {
      var obj = this.activeTickets.filter(ticket => ticket.Age >= 3);
      this.$store.dispatch("overdueCount", obj.length.toString());
      return obj;
    },
    responseTickets() {
      return this.$store.getters.responseTickets;
    },
    isLoadingResponseTickets() {
      return this.$store.getters.isLoadingResponseTickets;
    },
    error() {
      return this.$store.getters.error;
    },
    ticketsResolvedPercentage() {
      var result = null;

      // var resolvedCount  = this.resolvedCount.length;
      // var totalResolvedTickets  = this.$store.getters.totalResolvedTickets.length;
      // var result1 = (resolvedCount*100) / totalResolvedTickets;
      // alert( "resolvedCount = "+ resolvedCount + "totalResolvedTickets = "+ totalResolvedTickets + "    result = "+result1);

      if (this.resolvedCount.length) {
        result = `${_.round(
          (this.resolvedCount.length * 100) /
            this.$store.getters.totalResolvedTickets.length,
          1
        )}%`;
      } else {
        result = "N/A";
      }

      //debugger
      return result;
    },

    //FRT
    filteredRecords() {
      let query = this.$route.query.display;

      var result = this.listOfRecords.filter(
        data =>
          _.includes(this.$store.getters.filterTree, data.SupportGroupLast) &&
          _.includes(this.$store.getters.filterLocation, data.Property_Location)
      );
      return result;
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

    //Ageing Ticket
    filteredAgeingRecord() {
      let query = this.$route.query.display;
      return this.listOfRecordAgeingTicket.filter(
        data =>
          _.includes(this.$store.getters.filterTree, data.SupportGroup) &&
          _.includes(this.$store.getters.filterLocation, data.Property_Location)
      );
    },

    followUpTicket() {
      var result = this.FollowUpTicket.filter(
        data =>
          _.includes(this.$store.getters.filterTree, data.SupportGroup) &&
          _.includes(this.$store.getters.filterLocation, data.Property_Location)
      );

      var followupTicketCount = _.sumBy(result, "FollowupTicketCount");
      var totalTicketCount = _.sumBy(result, "TotalTicketCount");

      var resultNew = (followupTicketCount / totalTicketCount) * 100;
      resultNew = resultNew.toFixed(2);
      resultNew = isNaN(resultNew) ? "N/A" : resultNew;

      resultNew = resultNew > 0 ? resultNew + "%" : resultNew;

      // var countHours3to24 = _.sumBy(obj, "hours3to24");
      // var countDays2to15 = _.sumBy(obj, "days2to15");

      //debugger;
      return resultNew;
    },

    ageingTicket() {
      var obj = this.filteredAgeingRecord;

      var countBelow3Hours = _.sumBy(obj, "below3Hours");
      var countHours3to24 = _.sumBy(obj, "hours3to24");
      var countDays2to15 = _.sumBy(obj, "days2to15");
      var countDays16to30 = _.sumBy(obj, "days16to30");
      var countAbove30days = _.sumBy(obj, "above30days");

      var percBelow3Hours = countBelow3Hours;
      var percHours3to24 = countHours3to24;
      var percDays2to15 = countDays2to15;
      var perDays16to30 = countDays16to30;
      var perAbove30days = countAbove30days;

      let result = {
        time: {
          below3Hours: percBelow3Hours,
          hours3to24: percHours3to24,
          days2to15: percDays2to15,
          days16to30: perDays16to30,
          above30days: perAbove30days
        }
      };
      return result;
    }
  },
  methods: {
    getResult: function() {
      this.fetchSummary();
    },
    getRandomInt() {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
    },

    fetchFRT() {
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
        this.isLoadingFirstResponseSLA = true;
        TicketService.getSLAFirstResponseByDateRange({
          start_date: `${this.$store.getters.startDate}T00:00:00`,
          end_date: `${this.$store.getters.endDate}T23:59:59`
        })
          .then(res => {
            this.listOfRecords = res.data;
            this.isLoadingFirstResponseSLA = false;
          })
          .catch(error => {
            console.log(error);
            this.isLoadingFirstResponseSLA = false;
          });
      }
    },

    fetchAgeingTicket() {
      this.isLoadingTicketAgeing = true;
      TicketService.getTicketAgeingByDateRange({
        start_date: `${this.$store.getters.startDate}T00:00:00`,
        end_date: `${this.$store.getters.endDate}T23:59:59`
      })
        .then(res => {
          this.listOfRecordAgeingTicket = res.data;
          this.isLoadingTicketAgeing = false;
        })
        .catch(error => {
          console.log(error);
          this.isLoadingTicketAgeing = false;
        });
    },

    fetchResponseTickets() {
      this.$store.dispatch("fetchResponseTickets", {
        start_date: `${this.$store.getters.startDate}T00:00:00`,
        end_date: `${this.$store.getters.endDate}T23:59:59`
      });
    },
    fetchSummary() {
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
        this.$store.dispatch("fetchFeedbacks", {
          start_date: `${this.$store.getters.startDate}T00:00:00`,
          end_date: `${this.$store.getters.endDate}T23:59:59`
        });

        //HomePage All Method Call Here
        //Tickets Reported | Tickets Resolved | % of Tickets Resolved
        this.$store.dispatch("fetchTickets", {
          start_date: `${this.$store.getters.startDate}T00:00:00`,
          end_date: `${this.$store.getters.endDate}T23:59:59`
        });

        //Get Pending Tickets
        this.$store.dispatch("fetchActiveTickets", {
          end_date: `${this.$store.getters.endDate}T23:59:59`
        });
        // this.fetchResponseTickets()

        //Call Service Desk Statustics
        this.fetchCallHelpDeskStatusticsByDateRange();
        this.fetchFRT();
        this.fetchAgeingTicket();
        this.getFollowUpTicket();
      }
    },
    cancelAutoUpdate() {
      clearInterval(this.timer);
    },

    async fetchCallHelpDeskStatusticsByDateRange() {
      try {
        var strCurrentDate = new Date(
          `${this.$store.getters.startDate} 00:00:00.000`
        );
        var strNewEndDate = new Date(
          `${this.$store.getters.endDate} 23:59:59.999`
        );

        this.isLoadingServiceDesk = false;
        const res = await CallStatustics.getCallHelpDeskStatusticsByDateRange({
          start_date: strCurrentDate,
          end_date: strNewEndDate
        })
          .then(res => {
            var totalAbandonedCalls =
              res.data[0].TotalAbandonedCalls == undefined
                ? "0%"
                : res.data[0].TotalAbandonedCalls + "%";
            var serviceLevel60s =
              res.data[0].ServiceLevel60s == undefined
                ? "0%"
                : res.data[0].ServiceLevel60s + "%";

            this.TotalAbandonedCalls = totalAbandonedCalls;
            this.ServiceLevel60s = serviceLevel60s;
          })
          .catch(error => {});
      } catch (err) {}
    },
    async getFollowUpTicket() {
      this.isLoadingFollowUpTicket = true;
      TicketService.getFollowUpTicket({
        start_date: `${this.$store.getters.startDate}T00:00:00`,
        end_date: `${this.$store.getters.endDate}T23:59:59`
      })
        .then(res => {
          this.FollowUpTicket = res.data;
          this.isLoadingFollowUpTicket = false;
        })
        .catch(error => {
          this.isLoadingFollowUpTicket = false;
          console.log(error);
        });
    }
  },
  beforeDestroy() {
    this.cancelAutoUpdate();
  }
};
</script>
