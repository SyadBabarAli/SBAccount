<template>
  <div id="home">
    <v-layout row wrap class="pa-2">
      <v-flex lg12 class="mt-12">
        <v-card class="black--text elevation-5">
          <v-layout>
            <v-flex lg12>
              <v-card-title class="headline grey lighten-3 pa-1 ma-0" primary-title>Home</v-card-title>
              <v-container fluid grid-list-md>
                <v-layout row wrap>
                  <v-flex d-flex xs12 sm6 md12 text-xs-center v-if="rights.pendingTickets">
                    <v-card>
                      <h3 class="text-xs-left headline mb-0 pa-2">Sales</h3>
                      <v-divider></v-divider>
                      <v-layout row wrap class="pt-2">
                        <v-flex lg6 class="pa-3">
                          <v-card class="green white--text elevation-5">
                            <v-layout class="pl-2 pr-2 pt-2">
                              <v-flex lg2 class="pa-0 text-xs-left">
                                  <v-icon dark style="font-size: 80px;">calendar_today</v-icon>
                              </v-flex>
                              <v-flex lg10>
                                <v-layout>
                                  <v-flex lg8>
                                    <h4 class="font-weight-regular text-xs-left">This Week</h4>
                                  </v-flex>
                                  <v-flex lg4 class="text-xs-right">
                                    <v-icon
                                      dark
                                      style="font-size: 20px; "
                                      class="text-xs-left"
                                    >arrow_upward</v-icon>
                                  </v-flex>
                                </v-layout>
                                <v-layout>
                                  <v-flex lg12 class="pa-0 text-xs-right">
                                    <h4 class="caption">Last Week</h4>
                                  </v-flex>
                                </v-layout>
                                <v-layout>
                                  <v-flex lg12 class="pa-0 text-xs-right">
                                    <h4 class="caption">Rs 24,276</h4>
                                  </v-flex>
                                </v-layout>
                                <v-layout>
                                  <v-flex lg12 class="pa-0 text-xs-right">
                                    <h4 class="font-weight-regular text-xs-left">Rs 23217,137</h4>
                                  </v-flex>
                                </v-layout>
                              </v-flex>
                            </v-layout>
                          </v-card>
                        </v-flex>
                        <v-flex lg6 class="pa-3">
                         <v-card class="green white--text elevation-5">
                            <v-layout class="pl-2 pr-2 pt-2">
                              <v-flex lg2 class="pa-0 text-xs-left">
                                  <v-icon dark style="font-size: 80px;">calendar_today</v-icon>
                              </v-flex>
                              <v-flex lg10>
                                <v-layout>
                                  <v-flex lg8>
                                    <h4 class="font-weight-regular text-xs-left">This Week</h4>
                                  </v-flex>
                                  <v-flex lg4 class="text-xs-right">
                                    <v-icon
                                      dark
                                      style="font-size: 20px; "
                                      class="text-xs-left"
                                    >arrow_upward</v-icon>
                                  </v-flex>
                                </v-layout>
                                <v-layout>
                                  <v-flex lg12 class="pa-0 text-xs-right">
                                    <h4 class="caption">Last Week</h4>
                                  </v-flex>
                                </v-layout>
                                <v-layout>
                                  <v-flex lg12 class="pa-0 text-xs-right">
                                    <h4 class="caption">Rs 24,276</h4>
                                  </v-flex>
                                </v-layout>
                                <v-layout>
                                  <v-flex lg12 class="pa-0 text-xs-right">
                                    <h4 class="font-weight-regular text-xs-left">Rs 23217,137</h4>
                                  </v-flex>
                                </v-layout>
                              </v-flex>
                            </v-layout>
                          </v-card>
                        </v-flex>
                        <v-flex lg6 class="pa-3">
                          <v-card class="green white--text elevation-5">
                            <v-layout class="pl-2 pr-2 pt-2">
                              <v-flex lg2 class="pa-0 text-xs-left">
                                  <v-icon dark style="font-size: 80px;">calendar_today</v-icon>
                              </v-flex>
                              <v-flex lg10>
                                <v-layout>
                                  <v-flex lg8>
                                    <h4 class="font-weight-regular text-xs-left">This Week</h4>
                                  </v-flex>
                                  <v-flex lg4 class="text-xs-right">
                                    <v-icon
                                      dark
                                      style="font-size: 20px; "
                                      class="text-xs-left"
                                    >arrow_upward</v-icon>
                                  </v-flex>
                                </v-layout>
                                <v-layout>
                                  <v-flex lg12 class="pa-0 text-xs-right">
                                    <h4 class="caption">Last Week</h4>
                                  </v-flex>
                                </v-layout>
                                <v-layout>
                                  <v-flex lg12 class="pa-0 text-xs-right">
                                    <h4 class="caption">Rs 24,276</h4>
                                  </v-flex>
                                </v-layout>
                                <v-layout>
                                  <v-flex lg12 class="pa-0 text-xs-right">
                                    <h4 class="font-weight-regular text-xs-left">Rs 23217,137</h4>
                                  </v-flex>
                                </v-layout>
                              </v-flex>
                            </v-layout>
                          </v-card>
                        </v-flex>
                        <v-flex lg6 class="pa-3">
                          <v-card class="green white--text elevation-5">
                            <v-layout class="pl-2 pr-2 pt-2">
                              <v-flex lg2 class="pa-0 text-xs-left">
                                  <v-icon dark style="font-size: 80px;">calendar_today</v-icon>
                              </v-flex>
                              <v-flex lg10>
                                <v-layout>
                                  <v-flex lg8>
                                    <h4 class="font-weight-regular text-xs-left">This Week</h4>
                                  </v-flex>
                                  <v-flex lg4 class="text-xs-right">
                                    <v-icon
                                      dark
                                      style="font-size: 20px; "
                                      class="text-xs-left"
                                    >arrow_upward</v-icon>
                                  </v-flex>
                                </v-layout>
                                <v-layout>
                                  <v-flex lg12 class="pa-0 text-xs-right">
                                    <h4 class="caption">Last Week</h4>
                                  </v-flex>
                                </v-layout>
                                <v-layout>
                                  <v-flex lg12 class="pa-0 text-xs-right">
                                    <h4 class="caption">Rs 24,276</h4>
                                  </v-flex>
                                </v-layout>
                                <v-layout>
                                  <v-flex lg12 class="pa-0 text-xs-right">
                                    <h4 class="font-weight-regular text-xs-left">Rs 23217,137</h4>
                                  </v-flex>
                                </v-layout>
                              </v-flex>
                            </v-layout>
                          </v-card>
                        </v-flex>
                      </v-layout>
                    </v-card>
                  </v-flex>
                  <v-flex d-flex xs12 sm6 md6 text-xs-center>
                    <v-card>
                      <h3 class="text-xs-left headline mb-0 pa-2">Revenue vs Expense</h3>
                      <v-divider></v-divider>
                      <v-layout row wrap style="height:145px" align-center>
                        <v-flex lg12 class="pt-1 ma-1">
                          <line-example :styles="myStyles" />
                        </v-flex>
                      </v-layout>
                    </v-card>
                  </v-flex>

                  <v-flex d-flex xs12 sm6 md6 text-xs-center>
                    <v-card>
                      <h3 class="text-xs-left headline mb-0 pa-2">Invoices</h3>
                      <v-divider></v-divider>
                      <v-layout row wrap style="height:145px" align-center>
                        <v-flex lg12 class="pt-1 ma-1">
                          <pie-example :styles="myStyles" />
                        </v-flex>
                      </v-layout>
                    </v-card>
                  </v-flex>
                  <v-flex d-flex xs12 sm6 md6 text-xs-center v-if="rights.firstResponseSLA">
                    <v-card>
                      <h3 class="text-xs-left headline mb-0 pa-2">Top Products</h3>
                      <v-divider></v-divider>
                      <v-layout row wrap style="height:145px" align-center>
                        <v-flex lg12 class="pt-1 ma-1">
                          <top-products :styles="myStyles" :P1="10" :P2="30" :P3="40" :P4="60" />
                        </v-flex>
                      </v-layout>
                    </v-card>
                  </v-flex>
                  <v-flex d-flex xs12 sm6 md6 text-xs-center v-if="rights.firstResponseSLA">
                    <v-card>
                      <h3 class="text-xs-left headline mb-0 pa-2">Account Receivable Aging</h3>
                      <v-divider></v-divider>
                      <v-layout row wrap style="height:145px" align-center>
                        <v-flex lg12 class="pt-1 ma-1">
                          <bar-example :styles="myStyles" />
                        </v-flex>
                      </v-layout>
                    </v-card>
                  </v-flex>
                  <v-flex d-flex xs12 sm6 md6 text-xs-center v-if="rights.firstResponseSLA">
                    <v-card>
                      <h3 class="text-xs-left headline mb-0 pa-2">Top Customers</h3>
                      <v-divider></v-divider>
                      <v-layout row wrap style="height:145px" align-center>
                        <v-flex lg12 class="pt-1 ma-1">
                          <top-products :styles="myStyles" :P1="10" :P2="30" :P3="40" :P4="60" />
                        </v-flex>
                      </v-layout>
                    </v-card>
                  </v-flex>
                  <v-flex d-flex xs12 sm6 md6 text-xs-center v-if="rights.firstResponseSLA">
                    <v-card>
                      <h3 class="text-xs-left headline mb-0 pa-2">Cash and Banks</h3>
                      <v-divider></v-divider>
                      <v-layout row wrap style="height:145px" align-center>
                        <v-flex lg12 class="pt-1 ma-1">
                          <line-example :styles="myStyles" />
                        </v-flex>
                      </v-layout>
                    </v-card>
                  </v-flex>

                  <v-flex d-flex xs12 sm6 md6 text-xs-center>
                    <v-card>
                      <h3 class="text-xs-left headline mb-0 pa-2">Profit & Loss</h3>
                      <v-divider></v-divider>
                      <v-layout row wrap style="height:145px" align-center>
                        <v-flex lg12 class="pt-1 ma-1">
                          <profitand-loss :styles="myStyles" />
                        </v-flex>
                      </v-layout>
                    </v-card>
                  </v-flex>

                  <v-flex d-flex xs12 sm6 md6 text-xs-center>
                    <v-card>
                      <h3 class="text-xs-left headline mb-0 pa-2">Expenses</h3>
                      <v-divider></v-divider>
                      <v-layout row wrap style="height:145px" align-center>
                        <v-flex lg12 class="pt-1 ma-1">
                          <expenses :styles="myStyles" />
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
    <!-- <div class="csmHide">{{feedbackStats}}</div> -->
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
//import ChartDougnutAgeingTicket from "../../../components/Main/Home/ChartDougnutAgeingTicket";
import CallStatustics from "../../../services/callstatustics-service";

import LineExample from "../../../components/Main/Dashboard/RevenuevsExpense";
import TopProducts from "../../../components/Main/Dashboard/TopProducts";
import PieExample from "../../../components/Main/Dashboard/Invoices";
import BarExample from "../../../components/Main/Dashboard/BarExample";

import Expenses from "../../../components/Main/Dashboard/Expenses";
import ProfitandLoss from "../../../components/Main/Dashboard/ProfitandLoss";

import moment from "moment";
import _ from "lodash";
//import color from '../theme.js'
import { mixins } from "../../../mixins/CustomMixins";

export default {
  name: "home",
  mixins: [mixins],
  components: {
    BoxFour,
    DatePicker,
    FeedbackRating,
    doughnut: Doughnut,
    Donut,
    LineExample,
    TopProducts,
    PieExample,
    BarExample,
    ProfitandLoss,
    Expenses
  },
  data() {
    return {
      height: 300,
      rights: {
        pendingTickets: true,
        firstResponseSLA: true,
        resolvedTicketsAge: true,
        userFeedbackStatistics: true,
        ticketsResolvedOverallIT: true,
        ticketsResolved: true,
        priorityTickets: true,
        serviceDeskStatistics: true,
        followUpTickets: true,
        //Top 4 Boxes
        barTicketsReported: true,
        barticketsResolved: true,
        baravgResponseTime: true,
        baravgResolutionTime: true
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
        height: `100px`,
        width: `400px`,
        position: "relative"
      };
    }

    // myStyles() {
    //   return {
    //     height: `${this.height}px`,
    //     position: "relative"
    //   };
    //}
  },
  methods: {
    increase() {
      this.height += 10;
    },
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
