<template>
  <!-- <div id="pending">
    <v-layout row wrap class="pa-2">
      <v-flex lg12 class="mt-12">
        <v-card class="black--text">
          <v-layout>
            <v-flex lg12 class="pt-0">
  <v-card-title class="headline grey lighten-3 pa-1 ma-0" primary-title>Status Summary</v-card-title>-->
  <layout-one :title="'Status Summary'">
    <v-layout row wrap text-xs-center>
      <v-flex xs12 class="py-2">
        <v-btn
          small
          round
          id="btn1"
          :depressed="btn1StatusDepressed"
          v-bind:class="[btn1StatusDepressed ? '':'colorLight white--text' ]"
          v-on:click="toggleButton"
          :to="{ path: '/pending', query: { display: 'all' } }"
        >All ({{ totalCount }})</v-btn>
        <v-btn
          small
          round
          id="btn2"
          :depressed="btn2StatusDepressed"
          v-bind:class="[btn2StatusDepressed ? '':'colorLight white--text' ]"
          v-on:click="toggleButton"
          :to="{ path: '/pending', query: { display: 'active' } }"
        >Active ({{ activeCount }})</v-btn>
        <v-btn
          small
          round
          id="btn3"
          :depressed="btn3StatusDepressed"
          v-bind:class="[btn3StatusDepressed ? '':'colorLight white--text' ]"
          v-on:click="toggleButton"
          :to="{ path: '/pending', query: { display: 'overdue' } }"
        >Overdue ({{ pendingCount }})</v-btn>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex lg12>
        <v-layout row wrap class="pt-3">
          <v-flex lg4>
            <app-donut
              :itPending="itPending.length"
              :vendorPending="vendorPending.length"
              :userPending="userPending.length"
            ></app-donut>
          </v-flex>
          <v-flex lg4 class="pr-3 pl-3">
            <v-layout row wrap>
              <v-flex lg12>
                <div class="pa-1" :style="{ cursor: 'pointer'}">
                  <v-card
                    v-bind:class="[this.view =='Active' ? 'white--text elevation-10' : 'white--text' ]"
                    color="#ffb74d"
                    @click="setView('Active')"
                  >
                    <h4 class="text-xs-right font-weight-light">Active Tickets (IT Pending)</h4>
                    <v-layout>
                      <v-flex lg5 class="pa-1" text-xs-left>
                        <v-icon dark style="font-size: 50px;">computer</v-icon>
                      </v-flex>
                      <v-flex lg7 class="pa-0 font-weight-light my-2 display-2" text-xs-right>
                        <div class="csmheadline">
                          <slot name="content1">{{itPending.length}}</slot>
                        </div>
                      </v-flex>
                    </v-layout>

                    <v-divider light></v-divider>
                    <v-layout class="black--text" style="background-color:#e0e0e0">
                      <v-flex lg6 class="text-xs-left">
                        <h4 class="font-weight-light pl-1">Average Days</h4>
                      </v-flex>

                      <v-flex lg6 class="text-xs-right pr-1">
                        <h4 class="font-weight-light">{{ itPending | avgDays }}</h4>
                      </v-flex>
                    </v-layout>
                  </v-card>
                </div>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex lg12>
                <div class="pa-1" :style="{ cursor: 'pointer'}">
                  <v-card
                    v-bind:class="[this.view =='User Pending' ? 'white--text elevation-10' : 'white--text' ]"
                    @click="setView('User Pending')"
                    color="#64b5f6"
                  >
                    <h4 class="text-xs-right font-weight-light">User Pending</h4>
                    <v-layout>
                      <v-flex lg5 class="pa-1" text-xs-left>
                        <v-icon dark style="font-size: 50px;">account_box</v-icon>
                      </v-flex>
                      <v-flex lg7 class="pa-0 font-weight-light my-2 display-2" text-xs-right>
                        <div class="csmheadline">
                          <slot name="content1">{{userPending.length}}</slot>
                        </div>
                      </v-flex>
                    </v-layout>
                    <v-divider light></v-divider>
                    <v-layout class="black--text" style="background-color:#e0e0e0">
                      <v-flex lg6 class="text-xs-left">
                        <h4 class="font-weight-light pl-1">Average Days</h4>
                      </v-flex>
                      <v-flex lg6 class="text-xs-right">
                        <h4 class="font-weight-light pr-1">{{ userPending | avgDays }}</h4>
                      </v-flex>
                    </v-layout>
                  </v-card>
                </div>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex lg4 class="pr-3 pl-3">
            <v-layout row wrap>
              <v-flex lg12>
                <div class="pa-1" :style="{ cursor: 'pointer'}">
                  <v-card
                    v-bind:class="[this.view =='Vendor Pending' ? 'white--text elevation-10' :  'white--text' ]"
                    @click="setView('Vendor Pending')"
                    color="#a1887f"
                  >
                    <h4 class="text-xs-right font-weight-light">Vendor Pending</h4>
                    <v-layout>
                      <v-flex lg5 class="pa-1" text-xs-left>
                        <v-icon dark style="font-size: 50px;">build</v-icon>
                      </v-flex>
                      <v-flex lg7 class="pa-0 font-weight-light my-2 display-2" text-xs-right>
                        <div class="csmheadline">
                          <slot name="content1">{{vendorPending.length}}</slot>
                        </div>
                      </v-flex>
                    </v-layout>
                    <v-divider light></v-divider>
                    <v-layout class="black--text" style="background-color:#e0e0e0">
                      <v-flex lg6 class="text-xs-left">
                        <h4 class="font-weight-light pl-1">Average Days</h4>
                      </v-flex>
                      <v-flex lg6 class="text-xs-right">
                        <h4 class="font-weight-light pr-1">{{ vendorPending | avgDays }}</h4>
                      </v-flex>
                    </v-layout>
                  </v-card>
                </div>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex lg12>
                <div class="pa-1" :style="{ cursor: 'pointer'}">
                  <v-card
                    v-bind:class="[this.view =='' ? 'white--text elevation-10' : 'white--text' ]"
                    @click="setView('')"
                    color="#9575cd"
                  >
                    <h4 class="text-xs-right font-weight-light">Total Pending</h4>
                    <v-layout>
                      <v-flex lg5 class="pa-1" text-xs-left>
                        <v-icon dark style="font-size: 50px;">hourglass_empty</v-icon>
                      </v-flex>
                      <v-flex lg7 class="pa-0 font-weight-light my-2 display-2" text-xs-right>
                        <div class="csmheadline">
                          <slot name="content1">{{filteredTickets.length}}</slot>
                        </div>
                      </v-flex>
                    </v-layout>
                    <v-divider light></v-divider>
                    <v-layout class="black--text" style="background-color:#e0e0e0">
                      <v-flex lg6 class="text-xs-left">
                        <h4 class="font-weight-light pl-1">Average Days</h4>
                      </v-flex>
                      <v-flex lg6 class="text-xs-right">
                        <h4 class="font-weight-light pr-1">{{ filteredTickets | avgDays }}</h4>
                      </v-flex>
                    </v-layout>
                  </v-card>
                </div>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex d-flex lg12 xs12 sm12 md12 text-xs-center class="pa-2">
            <v-card>
              <h6 class="grey lighten-3 body-1">&nbsp;</h6>
              <v-divider></v-divider>
              <v-layout row wrap align-center>
                <v-flex lg12 class="pt-1 ma-1">
                  <app-stacked-bar :tickets="stackedTickets"/>
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-divider class></v-divider>
    <v-layout>
      <v-flex lg12>
        <v-card>
          <v-card-title>
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
            :items="filterListOfRecord"
            :search="search"
            :pagination.sync="pagination"
          >
            <template slot="no-data" v-if="isLoading">
              <v-progress-linear slot="progress" indeterminate></v-progress-linear>
            </template>

            <template slot="items" slot-scope="props">
              <td class="text-xs-left">{{ props.item.CreatedDate | momentDate }}</td>
              <td class="text-xs-left">{{ props.item.Id }}</td>
              <td class="text-xs-left">{{ props.item.Age }}</td>
              <td class="text-xs-left">{{ props.item.AffectedUser }}</td>
              <td class="text-xs-left">{{ props.item.Title }}</td>
              <td class="text-xs-left">{{ props.item.SupportGroup }}</td>
              <td class="text-xs-left">{{ props.item.AssignedTo }}</td>
              <td class="text-xs-left">{{ props.item.Classification }}</td>
              <td class="text-xs-left">{{ props.item.Status }}</td>
              <td class="text-xs-left">{{ props.item.Followup }}</td>
              <td class="text-xs-left">
                <button-grid :description="'View'" @Click="btnView(props.item.Id)"/>
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
    <v-dialog v-model="viewDialog" width="500" scrollable>
      <app-ticket-details :getTicketId="ticketId" @Click="closeViewDialog"></app-ticket-details>
    </v-dialog>
  </layout-one>
  <!-- </v-flex>
          </v-layout>
          <v-divider light></v-divider>
          <v-card-actions class="pa-0 ma-0 ml-1"></v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </div>-->
</template>

<script>
import ProgressCircular from "../../../components/control/ProgressCircular";
import ProgressCircularSmall from "../../../components/control/ProgressCircularSmall";
import ButtonSmallTwo from "../../../components/control/ButtonSmallTwo";
import DatePicker from "../../../components/control/DatePicker";
import Doughnut from "../../../components/ChartJS/Doughnut/Doughnut.js";
import BoxFour from "../../../components/control/BoxFour";
import StackedBar from "../../../components/Chart/ChartJs/PendingStackedBar";
import TicketService from "../../../services/ticket-service";
import FeedbackService from "../../../services/feedback-service";
import Donut from "../../../components/Chart/ChartJs/PendingDonut";
import TicketDetails from "../../../components/Other/TicketDetails";
import ProgressLinear from "../../../components/control/ProgressLinear";
import ButtonGrid from "../../../components/control/ButtonGrid";
import LayoutOne from "../../../components/control/layout/LayoutOne";
import _ from "lodash";

export default {
  name: "pending",
  components: {
    LayoutOne,
    ButtonGrid,
    ButtonSmallTwo,
    DatePicker,
    Doughnut,
    BoxFour,
    "app-stacked-bar": StackedBar,
    "app-donut": Donut,
    "app-ticket-details": TicketDetails,
    ProgressLinear,
    ProgressCircularSmall,
    ProgressCircular
  },
  data() {
    return {
      btn1StatusDepressed: false,
      btn2StatusDepressed: true,
      btn3StatusDepressed: true,
      listOfRecord: [],
      tickets: [],
      isLoading: true,
      total: 100,
      view: "",
      viewDialog: false,
      ticketId: "",
      search: "",
      pagination: {
        descending: true,
        sortBy: "Age"
      },
      headers: [
        { text: "Created Date", value: "CreatedDate" },
        { text: "ID", value: "Id" },
        { text: "Age", value: "Age" },
        { text: "Affected User", value: "AffectedUser" },
        { text: "Title", value: "Title" },
        { text: "Support Group", value: "SupportGroup" },
        { text: "Assigned To", value: "AssignedTo" },
        { text: "Classification", value: "Classification" },
        { text: "Status", value: "Status" },
        { text: "Followup", value: "Followup" },
        { text: "", value: "" }
      ]
    };
  },
  created() {
    //debugger
    //this.$router.go('pending?display=all')

    if (this.$router.currentRoute.query.display == undefined) {
      this.$router.currentRoute.query.display = "all";
      //this.$router.go('pending?display=all')
    }
    this.fetchTickets();
    this.$store.commit("setCurrentScreenName", "Pending");
  },
  watch: {
    // view(obj) {
    //   debugger;
    // },
    "$store.getters.sync": {
      immediate: true,
      handler() {
        if (this.$store.getters.sync) {
          this.timer = setInterval(
            this.fetchTickets,
            this.$store.getters.syncTime
          );
        } else {
          this.cancelAutoUpdate();
        }
      }
    }
  },

  computed: {
    //Method Use For
    filterListOfRecord() {
      let query = this.$route.query.display;
      var result = null;
      if (query) {
        //debugger;
        if (query === "active") {
          result = this.listOfRecord.filter(
            ticket =>
              _.includes(this.$store.getters.filterTree, ticket.SupportGroup) &&
              ticket.Age < 3 &&
              _.includes(
                this.$store.getters.filterLocation,
                ticket.Property_Location
              )
          );
        } else if (query === "overdue") {
          result = this.listOfRecord.filter(
            ticket =>
              _.includes(this.$store.getters.filterTree, ticket.SupportGroup) &&
              ticket.Age >= 3 &&
              _.includes(
                this.$store.getters.filterLocation,
                ticket.Property_Location
              )
          );
        } else if (query === "all") {
          result = this.listOfRecord.filter(
            ticket =>
              _.includes(this.$store.getters.filterTree, ticket.SupportGroup) &&
              _.includes(
                this.$store.getters.filterLocation,
                ticket.Property_Location
              )
          );
        }
      }
      //Filter By Bar Buttons
      if (this.view != "") {
        result = result.filter(w => w.Status == this.view);
      }

      return result;
    },
    filteredTickets() {
      let query = this.$route.query.display;
      var result = null;
      if (query) {
        if (query === "active") {
          return this.tickets.filter(
            ticket =>
              _.includes(this.$store.getters.filterTree, ticket.SupportGroup) &&
              ticket.Age < 3 &&
              _.includes(
                this.$store.getters.filterLocation,
                ticket.Property_Location
              )
          );
        } else if (query === "overdue") {
          return this.tickets.filter(
            ticket =>
              _.includes(this.$store.getters.filterTree, ticket.SupportGroup) &&
              ticket.Age >= 3 &&
              _.includes(
                this.$store.getters.filterLocation,
                ticket.Property_Location
              )
          );
        }
      }

      return this.tickets.filter(
        ticket =>
          _.includes(this.$store.getters.filterTree, ticket.SupportGroup) &&
          _.includes(
            this.$store.getters.filterLocation,
            ticket.Property_Location
          )
      );

      // //Filter By Bar Buttons
      // if (this.view != "") {
      //   return this.tickets.filter(w => w.Status == this.view);
      // }

      // return result;
    },
    itPending() {
      var result = this.filteredTickets.filter(
        ticket => ticket.Status === "Active"
      );
      return result;
    },
    vendorPending() {
      var result = this.filteredTickets.filter(
        ticket => ticket.Status === "Vendor Pending"
      );
      return result;
    },
    userPending() {
      return this.filteredTickets.filter(
        ticket => ticket.Status === "User Pending"
      );
    },
    activeCount() {
      return this.tickets.filter(
        ticket =>
          _.includes(this.$store.getters.filterTree, ticket.SupportGroup) &&
          ticket.Age < 3 &&
          _.includes(
            this.$store.getters.filterLocation,
            ticket.Property_Location
          )
      ).length;
    },
    pendingCount() {
      return this.tickets.filter(
        ticket =>
          _.includes(this.$store.getters.filterTree, ticket.SupportGroup) &&
          ticket.Age >= 3 &&
          _.includes(
            this.$store.getters.filterLocation,
            ticket.Property_Location
          )
      ).length;
    },
    totalCount() {
      return this.tickets.filter(
        ticket =>
          _.includes(this.$store.getters.filterTree, ticket.SupportGroup) &&
          _.includes(
            this.$store.getters.filterLocation,
            ticket.Property_Location
          )
      ).length;
    },
    stackedTickets() {
      if (this.view) {
        //debugger;
        return this.filteredTickets.filter(
          ticket => ticket.Status == this.view
        );
      }
      return this.filteredTickets;
    }
    // stackedTickets() {
    //   var result = null;
    //   if (this.view) {
    //     this.filteredTickets = this.filteredTickets.filter(
    //       ticket => ticket.Status == this.view
    //     );
    //   }
    //   this.filteredTickets = result;
    //   return result; //this.filteredTickets;
    // }
  },
  methods: {
    async fetchTickets() {
      try {
        this.isLoading = true;
        const res = await TicketService.getActive("detailed");
        this.tickets = res.data;
        this.listOfRecord = res.data;
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        console.log(err.response.data.Message);
      }
    },
    setView(val) {
      this.view = val;
    },
    isActive(val) {
      let query = this.$route.query.display;
      return query == val;
    },
    btnView(ticketId) {
      this.ticketId = ticketId;
      this.viewDialog = true;
    },
    closeViewDialog() {
      this.viewDialog = false;
    },
    cancelAutoUpdate() {
      clearInterval(this.timer);
    },
    toggleButton: function(event) {
      var id = event.currentTarget.id;
      if (id == "btn1") {
        this.btn1StatusDepressed = false;
        this.btn2StatusDepressed = true;
        this.btn3StatusDepressed = true;
      } else if (id == "btn2") {
        this.btn1StatusDepressed = true;
        this.btn2StatusDepressed = false;
        this.btn3StatusDepressed = true;
      } else if (id == "btn3") {
        this.btn1StatusDepressed = true;
        this.btn2StatusDepressed = true;
        this.btn3StatusDepressed = false;
      }
    }
  },
  filters: {
    avgDays(val) {
      if (val.length) {
        return _.round(_.meanBy(val, "Age"), 0);
      } else {
        return "N/A";
      }
    }
  },
  beforeDestroy() {
    this.cancelAutoUpdate();
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