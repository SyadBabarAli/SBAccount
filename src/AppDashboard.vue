<template>
  <v-app id="scroll-target">
    <v-navigation-drawer v-model="leftModelMenu" temporary fixed>
      <menu-subheaders />
    </v-navigation-drawer>

    <!-- Left Bar Support Group / Locations-->
    <v-navigation-drawer
      :touchless="touchless"
      v-model="primaryDrawer.model"
      permanent
      clipped
      :floating="primaryDrawer.floating"
      :mini-variant="mini"
      mini-variant-width="50"
      app
    >
      <!-- Left Bar Open-->
      <v-list>
        <v-list-tile avatar tag="div">
          <v-list-tile-content>
            <v-list-tile-title class="pa-0 ma-0" style="height:60px">
              <v-layout>
                <v-flex lg4>
                  <!-- <div class="pl-3"> -->
                  <v-avatar :tile="false" :size="'60px'" color="grey lighten-4">
                    <v-icon style="font-size:60px">mdi-account</v-icon>
                  </v-avatar>
                  <!-- </div> -->
                </v-flex>
                <v-flex lg8 class="pt-3">
                  <h1 class="font-weight-light">{{loginUserName}}</h1>
                </v-flex>
              </v-layout>
            </v-list-tile-title>
          </v-list-tile-content>
          <v-btn icon @click.stop="mini = !mini">
            <v-icon>{{ mini ? 'chevron_right':'chevron_left'}}</v-icon>
          </v-btn>
        </v-list-tile>
        <menu-subheaders />
        <!-- <v-list-group prepend-icon="group" no-action v-model="isSupportGroup" v-show="!mini">
          <v-list-tile slot="activator">
            <v-list-tile-content>
              <v-list-tile-title>Support Groups</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider></v-divider>
          <tree-view-support-group />
        </v-list-group>
        <v-list-group prepend-icon="my_location" v-model="isLocation" no-action v-show="!mini">
          <v-list-tile slot="activator">
            <v-list-tile-content>
              <v-list-tile-title>Location Groups</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider></v-divider>
          <tree-view-location />
        </v-list-group>-->
      </v-list>

      <!-- Left Bar Hide-->
      <!-- <div v-show="mini" class="table">
        <br />
        <br />
        <v-list class="pt-0" dense three-line id="listSupportGroup" v-bind:width="10">
          <v-list-tile @click.stop="mini = !mini">
            <v-list-tile-action>
              <h3 style="writing-mode: tb-rl;" class="text-no-wrap">Support Group</h3>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
        <br />
        <br />
        <v-list class="pt-0" dense three-line id="listLocation">
          <v-list-tile @click.stop="mini = !mini">
            <v-list-tile-action>
              <h3 style="writing-mode: tb-rl;" class="text-no-wrap">Location</h3>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </div>-->
    </v-navigation-drawer>

    <v-toolbar clipped-left app class="colorDark" dark dense>
      <!-- <v-toolbar-side-icon
        v-if="primaryDrawer.type !== 'permanent'"
        @click.stop="leftModelMenu = !leftModelMenu"
      ></v-toolbar-side-icon>-->
      <v-toolbar-title class="font-weight-light hidden-sm-and-down pl-0">SBAccount</v-toolbar-title>
      <!-- <ticket-search /> -->
      <v-spacer />

      <v-toolbar-items class="hidden-sm-and-down">
        <v-menu transition="slide-x-transition" bottom left>
          <template v-slot:activator="{ on }">
            <!-- <v-btn class="deep-orange" color="primary" dark v-on="on">Slide X Transition</v-btn> -->
            <v-icon :color="AutoSyncColor" v-on="on">settings</v-icon>
          </template>

          <v-card>
            <v-container>
              <v-layout align-center>
                <v-flex xs12 sm4 text-xs-left>
                  <div>
                    <v-btn depressed small to="/Customers">Customers</v-btn>
                  </div>
                  <div>
                    <v-btn depressed small to="/Vendors">Vendors</v-btn>
                  </div>
                  <div>
                    <v-btn depressed small to="/Products">Products</v-btn>
                  </div>
                  <div>
                    <v-btn depressed small to="/Employees">Employees</v-btn>
                  </div>
                  <div>
                    <v-btn depressed small to="/SalesPersons">Sales Persons</v-btn>
                  </div>
                </v-flex>

                <v-flex xs12 sm4 text-xs-left>
                  <div>
                    <v-btn depressed small to="/CategoryCustomer">Customer</v-btn>
                  </div>
                  <div>
                    <v-btn depressed small  to="/CategoryVendor" >Vendor</v-btn>
                  </div>
                  <div>
                    <v-btn depressed small  to="/CategoryProduct">Product</v-btn>
                  </div>
                  <div>
                    <v-btn depressed small  to="/CategoryBrand">Brands</v-btn>
                  </div>
                  <div>
                    <v-btn depressed small  to="/CategoryDepartment">Departments</v-btn>
                  </div>
                  <div>
                    <v-btn depressed small  to="/CategoryDesignation">Designations</v-btn>
                  </div>
                </v-flex>

                <v-flex xs12 sm4 text-xs-left>
                  <div>
                    <v-btn depressed small to="/GeneralTax">Taxes</v-btn>
                  </div>
                  <div>
                    <v-btn depressed small to="/GeneralWarehouse">Warehouse</v-btn>
                  </div>
                  <div>
                    <v-btn depressed small>Adjustment Types</v-btn>
                  </div>
                  <div>
                    <v-btn depressed small>Custom Fields</v-btn>
                  </div>
                </v-flex>

                <v-flex xs12 sm4 text-xs-left>
                  <div>
                    <v-btn depressed small>Regions</v-btn>
                  </div>
                  <div>
                    <v-btn depressed small>Zones</v-btn>
                  </div>
                  <div>
                    <v-btn depressed small>Territories</v-btn>
                  </div>
                  <div>
                    <v-btn depressed small>Areas</v-btn>
                  </div>
                  <div>
                    <v-btn depressed small>Sub Areas</v-btn>
                  </div>
                </v-flex>
                <v-flex xs12 sm4 text-xs-left>
                  <div>
                    <v-btn depressed small to="/Branch">Branches</v-btn>
                  </div>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
          <div></div>
        </v-menu>
        <!-- <v-btn flat to="/Feedback">
          <h4 class="font-weight-light">
            <v-icon :color="AutoSyncColor">settings</v-icon>
            </h4>&nbsp;
          <v-badge color="red" v-model="feedbackShow" class="badge1">
            <span slot="badge">{{2}}</span>
          </v-badge>
        </v-btn>-->
        <v-btn flat>
          <h4 class="font-weight-light">Priority</h4>&nbsp;
          <v-badge color="red" v-model="priorityShow" class="badge1">
            <span slot="badge">{{1}}</span>
          </v-badge>
        </v-btn>
        <v-btn flat>
          <h4 class="font-weight-light">Overdue</h4>&nbsp;
          <v-badge color="red" v-model="overdueShow" class="badge1">
            <span slot="badge">{{34}}</span>
          </v-badge>
        </v-btn>
        <v-btn flat @click.stop="sync = !sync">
          <v-badge color="red">
            <v-icon :color="AutoSyncColor">{{ sync ? 'sync':'sync_disabled'}}</v-icon>
          </v-badge>
        </v-btn>
      </v-toolbar-items>

      <!-- Mobile -->
      <v-toolbar-items class="hidden-md-and-up">
        <v-tooltip v-model="showDisatisfied" left>
          <v-btn slot="activator" icon to="/Feedback">
            <v-badge color="red" left v-model="feedbackShow">
              <span slot="badge">{{feedbackCount}}</span>
              <v-icon color="white lighten-4" style="font-size: 20px;">sentiment_very_dissatisfied</v-icon>
            </v-badge>
          </v-btn>
          <span>Disatisfied</span>
        </v-tooltip>
        <v-tooltip v-model="showPriority" left>
          <v-btn slot="activator" icon to="/Priority">
            <v-badge color="red" left v-model="priorityShow">
              <span slot="badge">{{priorityCount}}</span>
              <v-icon color="white lighten-4" style="font-size: 20px;">priority_high</v-icon>
            </v-badge>
          </v-btn>
          <span>Priority</span>
        </v-tooltip>
        <v-tooltip v-model="show" left>
          <v-btn slot="activator" icon to="/Pending">
            <v-badge color="red" left v-model="overdueShow">
              <span slot="badge">{{overdueCount}}</span>
              <v-icon color="white lighten-4" style="font-size: 20px;">restore</v-icon>
            </v-badge>
          </v-btn>
          <span>Overdue</span>
        </v-tooltip>
        <v-tooltip left>
          <v-btn slot="activator" icon @click.stop="sync = !sync">
            <v-badge color="red" left>
              <v-icon :color="AutoSyncColor">{{ sync ? 'sync':'sync_disabled'}}</v-icon>
            </v-badge>
          </v-btn>
          <span>Auto-Sync</span>
        </v-tooltip>
      </v-toolbar-items>
    </v-toolbar>

    <v-content v-scroll="onScroll">
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </v-content>

    <v-layout>
      <v-flex class="text-xs-right">
        <v-fab-transition>
          <v-btn
            fab
            dark
            class="v-btn--floating v-btn--fixed v-btn--right theme--dark red"
            color="colorLight"
            v-if="offsetTop>10"
            v-model="snackbar"
            :bottom="true"
            :right="true"
            :timeout="100000"
            @click="$vuetify.goTo('#scroll-target')"
          >
            <v-icon dark>keyboard_arrow_up</v-icon>
          </v-btn>
        </v-fab-transition>
      </v-flex>
    </v-layout>
    <v-footer :inset="footer.inset" app>
      <span class="px-3">AKU IT Service Desk © {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import WebFontLoader from "webfontloader";
import MenuSubheaders from "./components/control/MenuSubheaders";
import treeView from "./components/control/TreeView";
import TreeViewSupportGroup from "./components/control/layout/TreeViewSupportGroup";
import TreeViewLocation from "./components/control/layout/TreeViewLocation";
import moment from "moment";
import _ from "lodash";
import TicketService from "./services/ticket-service";
import FeedbackService from "./services/feedback-service";
import axios from "axios";

export default {
  name: "app",
  components: {
    MenuSubheaders,
    treeView,
    TreeViewSupportGroup,
    TreeViewLocation,
    
  },
  data: () => ({
    loginItems: [{ title: "Log Our" }],
    loginUserName: "",
    offsetTop: 0,
    snackbar: true,
    AutoSyncColor: "white",

    feedbackShow: false,
    priorityShow: false,
    overdueShow: false,
    IsSync: false,
    leftModelMenu: false,
    isSupportGroup: true,
    isLocation: false,
    // IsListExpanded: true,
    dark: true,
    drawers: ["Default (no property)", "Permanent", "Temporary"],
    primaryDrawer: {
      model: null,
      type: "default (no property)",
      clipped: false,
      floating: false,
      mini: false
    },
    footer: {
      inset: false
    },
    mini: false,
    right: null,
    touchless: true,
    //items: [{ title: "Logout" }],
    drawer: true,
    drawerRight: false,
    right: false,
    left: false,
    showDisatisfied: false,
    showPriority: false,
    showOverdue: false,
    show: false,
    menu: false,
    startDate: "",
    endDate: "",
    feedbacks: [],
    isLoadingFeedbacks: false,
    tickets: [],
    isLoadingTickets: false,
    timer: "",
    sync: false
  }),

  props: {
    source: String
  },
  created() {
    // axios.get(this.$urlApplication + "RoleUser/GetLoginUserName").then(response => {
    //   this.loginUserName = response.data[0].FirstName;
    //   this.$store.commit("setLoginEmployeeId", response.data[0].Email);
    //   this.$store.commit("setRoleUserId", response.data[0].RoleUserId);
    // });
  },
  mounted() {
    //For Side Bar Close On Mobile
    this.mini = this.$vuetify.breakpoint.xs;
    WebFontLoader.load({
      google: {
        families: ["Roboto:100,300,400,500,700,900"]
      },
      active: this.setFontLoaded
    });
    //this.runMethods();
  },
  watch: {
    sync(value) {
      this.AutoSyncColor = value ? "orange" : "white";
      this.$store.dispatch("onSync", value);
    },
    "$store.getters.sync": {
      immediate: true,
      handler() {
        if (this.$store.getters.sync) {
          this.timer = setInterval(
            this.callAutoSync,
            this.$store.getters.syncTime
          );
        } else {
          this.cancelAutoUpdate();
        }
      }
    }
  },
  computed: {
    ticketsSotre() {
      var obj = this.$store.getters.tickets;
      return obj;
    },

    activeTickets() {
      var result = this.$store.getters.activeTickets;
      return result;
    },
    feedbackCount() {
      var count = this.$store.getters.dissatisfactionCount.toString();
      this.feedbackShow = count > 0 ? true : false;
      return count;
    },
    priorityCount() {
      var count = 0;

      if (this.$store.getters.currentScreenName != "Home") {
        count = this.ticketsSotre.filter(ticket => ticket.Priority === 1)
          .length;
        this.$store.dispatch("storePriorityTicket", count);
      } else {
        count = this.$store.getters.priorityTicket.toString();
      }
      this.priorityShow = count > 0 ? true : false;
      return count;
    },
    overdueCount() {
      var count = this.$store.getters.overdueCount.toString();
      if (this.$store.getters.currentScreenName != "Home") {
        count = this.activeTickets
          .filter(ticket => ticket.Age >= 3)
          .length.toString();
      }
      this.overdueShow = count > 0 ? true : false;
      return count;
    }
  },
  methods: {
    callAutoSync() {
      //Get Current Date----------------------------------------------------Start
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = today.getFullYear();
      var todayPicker = yyyy + "-" + mm + "-" + dd;
      this.$store.dispatch("storeStartDate", todayPicker);
      this.$store.dispatch("storeEndDate", todayPicker);
      document.getElementById("dateFrom").value = todayPicker;
      document.getElementById("dateTo").value = todayPicker;
      //Get Current Date----------------------------------------------------End

      this.runMethods();
    },
    setFontLoaded() {
      this.$emit("font-loaded");
    },
    logout() {
      try {
        var cookies = document.cookie.split(";");

        for (var i = 0; i < cookies.length; i++) {
          var cookie = cookies[i];
          var eqPos = cookie.indexOf("=");
          var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
      } catch (e) {}
    },
    async fetchFeedbacks() {
      this.isLoadingFeedbacks = true;

      this.feedbacks = this.$store.getters.feedbacks;
      this.isLoadingFeedbacks = false;
      try {
        const res = await FeedbackService.get({
          start_date: `${this.$store.getters.startDate}T00:00:00`,
          end_date: `${this.$store.getters.endDate}T23:59:59`
        });
        if (res) {
          this.feedbacks = res.data;
          if (this.$store.getters.currentScreenName != "Feedback") {
            this.$store.dispatch("fetchFeedbacks2", res);
            this.isLoadingFeedbacks = false;
          }
        }
      } catch (err) {
        this.isLoadingFeedbacks = false;
        console.log(err.response.data.Message);
      }
    },
    //Top Bar Priority | Overdue
    async fetchTickets() {
      this.isLoadingTickets = true;
      try {
        const res = await TicketService.get({
          start_date: `${this.$store.getters.startDate}T00:00:00`,
          end_date: `${this.$store.getters.endDate}T23:59:59`
        });

        if (res) {
          this.tickets = res.data;
          if (this.$store.getters.currentScreenName != "Feedback") {
            //alert(123);
            this.$store.dispatch("fetchTickets2", res);
          }
          this.isLoadingTickets = false;
        }
      } catch (err) {
        this.isLoadingTickets = false;
        console.log(err.response.data.Message);
      }
    },
    fetchActiveTickets() {
      this.$store.dispatch("getPendingDate");
      this.$store.dispatch("fetchActiveTickets", {
        end_date: `${this.$store.getters.endDate}T23:59:59`
      });
    },
    runMethods() {
      var screenName = this.$store.getters.currentScreenName;
      if (screenName != "Home") {
        this.fetchFeedbacks();
        this.fetchTickets();
        this.fetchActiveTickets();
      }
    },
    cancelAutoUpdate() {
      clearInterval(this.timer);
    },
    onScroll(e) {
      this.offsetTop = window.pageYOffset || document.documentElement.scrollTop;
    }
  },
  beforeDestroy() {
    this.cancelAutoUpdate();
  }
};
</script>
<style >
.icon {
  font-size: 10px;
}
.csmHide {
  display: none;
}
.bgColorH4 {
  background-color: #eee;
}
.csmheadline {
  font-size: 44px !important;
  line-height: 41px !important;
}
.badge1 > .v-badge__badge {
  border-radius: 3px;
}
.v-list__tile {
  padding: 0 !important;
}
/* Feedback Page CSS */
.nobull {
  list-style-type: none;
}

.animate-danger {
  animation: blinkingText 1s infinite;
}
@keyframes blinkingText {
  0% {
    background-color: #f44336;
  }
  /* 49%{	 background-color: transparent;	} */
  50% {
    background-color: transparent;
  }
  /* 99%{	 background-color:transparent;	} */
  100% {
    background-color: #f44336;
  }
}
/* Transaction */
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>