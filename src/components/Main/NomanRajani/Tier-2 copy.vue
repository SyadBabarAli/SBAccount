<template>
  <v-layout row wrap class="pa-2">
    <v-flex lg12 class="mt-12">
      <v-card class="black--text elevation-5">
        <v-layout>
          <v-flex lg12 class="pa-0">
            <v-card-title class="headline grey lighten-3 pa-1 ma-0" primary-title>
              Tier-2
              <button-small
                v-if="rights.DefineLocation"
                :link="'/DefineLocation'"
                :desciption="'Define Name'"
              />
              <button-small
                v-if="rights.DefineSupportGroup"
                :link="'/DefineSupportGroup'"
                :desciption="'Define Support Group'"
              />
              <button-small
                v-if="rights.DefineUser"
                :link="'/DefineUser'"
                :desciption="'Define User'"
              />
            </v-card-title>
            <v-tabs v-model="tabActive" color="colorDark" dark slider-color="yellow">
              <v-tab v-for="item in tabItems" :key="item.id" ripple>{{item.name}}</v-tab>
            </v-tabs>

            <v-tabs-items class="pt-0">
              <!-- -->
              <div v-if="tabActive == 0">
                <v-layout class="pa-1">
                  <v-flex lg12>
                    <date-picker @getResults="fetchDataAnalyst" />
                  </v-flex>
                </v-layout>
                <v-layout>
                  <v-flex lg12>
                    <v-card>
                      <v-card-title>
                        <download-excel
                          name="AnalystReport.xls"
                          :fields="json_fieldsAnalystReport"
                          type="xls"
                          :data="this.filteredAnalyst"
                        >
                          <v-btn
                            small
                            :loading="loading4"
                            :disabled="loading4"
                            color="colorLight"
                            class="colorDark white--text font-weight-light"
                            @click="loader = 'loading4'"
                          >
                            Export Excel
                            <v-icon right dark>cloud_download</v-icon>
                          </v-btn>
                        </download-excel>

                        <v-spacer></v-spacer>
                        <v-text-field
                          v-model="searchAnalyst"
                          append-icon="search"
                          label="Search"
                          single-line
                          hide-details
                          expand
                        ></v-text-field>
                      </v-card-title>
                      <v-data-table
                        must-sort
                        class="elevation-3"
                        :headers="headersAnalyst"
                        :items="this.filteredAnalyst"
                        :search="searchAnalyst"
                        :loading="isLoadingAnalyst"
                        :pagination.sync="paginationAnalyst"
                      >
                        <template slot="items" slot-scope="props">
                          <td class="text-xs-left">{{ props.item.ResolvedBy }}</td>
                          <td class="text-xs-left">{{ props.item.TicketsResolved }}</td>
                          <td
                            class="text-xs-left"
                          >{{ props.item.FollowupTicket == null ? 0 : props.item.FollowupTicket.toFixed(2) }} %</td>
                          <td class="text-xs-left">{{ props.item.FeedBackCnt }}</td>
                          <td
                            class="text-xs-left"
                          >{{ props.item.CustomerSatisfaction == null ? 0 : props.item.CustomerSatisfaction.toFixed(2) }}</td>
                          <td
                            class="text-xs-left"
                          >{{ props.item.Response_Rate == null ? 0 : props.item.Response_Rate.toFixed(2) }} %</td>
                          <td class="text-xs-left">{{ props.item.DissatisfiedCnt }}</td>
                        </template>
                        <v-alert
                          slot="no-results"
                          :value="true"
                          color="error"
                          icon="warning"
                        >Your search for "{{ searchAnalyst }}" found no results.</v-alert>
                      </v-data-table>
                    </v-card>
                  </v-flex>
                </v-layout>
              </div>

              <div v-else-if="tabActive == 1">
                <v-layout class="pa-1">
                  <v-flex lg12>
                    <date-picker @getResults="fetchReportZoneBySupportGroupNR" />
                  </v-flex>
                </v-layout>
                <v-layout>
                  <v-flex lg12>
                    <v-card>
                      <v-card-title>
                        <download-excel
                          name="SupportGroupWise.xls"
                          :fields="json_fieldsSG"
                          type="xls"
                          :data="this.filteredSG"
                        >
                          <v-btn
                            small
                            :loading="loading5"
                            :disabled="loading5"
                            color="colorLight"
                            class="colorDark white--text font-weight-light"
                            @click="loader = 'loading5'"
                          >
                            Export Excel
                            <v-icon right dark>cloud_download</v-icon>
                          </v-btn>
                        </download-excel>

                        <v-spacer></v-spacer>
                        <v-text-field
                          v-model="searchSG"
                          append-icon="search"
                          label="Search"
                          single-line
                          hide-details
                          expand
                        ></v-text-field>
                      </v-card-title>
                      <v-data-table
                        must-sort
                        class="elevation-3"
                        :headers="headersSG"
                        :items="this.filteredSG"
                        :search="searchSG"
                        :loading="isLoadingSG"
                        :pagination.sync="paginationSG"
                      >
                        <template slot="items" slot-scope="props">
                          <td class="text-xs-left">{{ props.item.SupportGroup }}</td>
                          <td class="text-xs-left">{{ props.item.Tickets_Created }}</td>
                          <td class="text-xs-left">{{ props.item.TicketResolved }}</td>
                          <td
                            class="text-xs-left"
                          >{{ props.item.FollowupTicket == null ? 0 : props.item.FollowupTicket.toFixed(2) }} %</td>
                          <td
                            class="text-xs-left"
                          >{{ props.item.CustomerSatisfaction == null ? 0 : props.item.CustomerSatisfaction.toFixed(2) }}</td>
                          <td
                            class="text-xs-left"
                          >{{ props.item.ResponseRate == null ? 0 : props.item.ResponseRate.toFixed(2) }} %</td>
                          <td class="text-xs-left">{{ props.item.DissatisfiedCnt }}</td>
                          <td class="text-xs-left">{{ props.item.ITPending }}</td>
                          <td class="text-xs-left">{{ props.item.ITPendingAvgDays }}</td>
                          <td class="text-xs-left">{{ props.item.UserPending }}</td>
                          <td class="text-xs-left">{{ props.item.UserPendingAvgDays }}</td>
                          <td class="text-xs-left">{{ props.item.VendorPending }}</td>
                          <td class="text-xs-left">{{ props.item.VendorPendingAvgDays }}</td>
                        </template>
                        <v-alert
                          slot="no-results"
                          :value="true"
                          color="error"
                          icon="warning"
                        >Your search for "{{ searchAnalyst }}" found no results.</v-alert>
                      </v-data-table>
                    </v-card>
                  </v-flex>
                </v-layout>
              </div>
              <div v-else-if="tabActive == 2">
                <v-layout class="pa-1">
                  <v-flex lg12>
                    <date-picker @getResults="fetchReportZoneNR2" />
                  </v-flex>
                </v-layout>
                <v-layout>
                  <v-flex lg12>
                    <v-card>
                      <v-card-title>
                        <download-excel
                          name="ZoneReport.xls"
                          :fields="json_fieldsZoneReport"
                          type="xls"
                          :data="this.filteredTickets"
                        >
                          <v-btn
                            small
                            :loading="loading3"
                            :disabled="loading3"
                            color="colorLight"
                            class="colorDark white--text font-weight-light"
                            @click="loader = 'loading3'"
                          >
                            Export Excel
                            <v-icon right dark>cloud_download</v-icon>
                          </v-btn>
                        </download-excel>
                        <v-spacer></v-spacer>
                        <v-text-field
                          v-model="search"
                          append-icon="search"
                          label="Search"
                          single-line
                          hide-details
                          expand
                        ></v-text-field>
                      </v-card-title>
                      <v-data-table
                        must-sort
                        class="elevation-3"
                        :headers="headers"
                        :items="this.filteredTickets"
                        :search="search"
                        :loading="isLoading"
                        :pagination.sync="pagination"
                      >
                        <template slot="items" slot-scope="props">
                          <td>
                            <button-grid :description="'View'" @Click="btnView(props.item)" />
                          </td>
                          <td class="text-xs-left">{{ props.item.Location }}</td>
                          <!-- <td class="text-xs-left">{{ props.item.Central }}</td>
                          <td class="text-xs-left">{{ props.item.OnsiteOffpeak }}</td>
                          <td class="text-xs-left">{{ props.item.Vendor }}</td>-->

                          <td class="text-xs-left">{{ props.item.TicketsCreated }}</td>
                          <td class="text-xs-left">{{ props.item.TicketResolved }}</td>
                          <td
                            class="text-xs-left"
                          >{{ props.item.FollowupTicket == null ? 0 : props.item.FollowupTicket.toFixed(2) }} %</td>
                          <td
                            class="text-xs-left"
                          >{{ props.item.CustomerSatisfaction == null ? 0 : props.item.CustomerSatisfaction.toFixed(2) }}</td>
                          <td
                            class="text-xs-left"
                          >{{ props.item.ResponseRate == null ? 0 : props.item.ResponseRate.toFixed(2) }} %</td>
                          <td class="text-xs-left">{{ props.item.DissatisfiedCnt }}</td>
                          <td class="text-xs-left">{{ props.item.ITPending }}</td>
                          <td class="text-xs-left">{{ props.item.ITPendingAvgDays }}</td>
                          <td class="text-xs-left">{{ props.item.UserPending }}</td>
                          <td class="text-xs-left">{{ props.item.UserPendingAvgDays }}</td>
                          <td class="text-xs-left">{{ props.item.VendorPending }}</td>
                          <td class="text-xs-left">{{ props.item.VendorPendingAvgDays }}</td>
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
              </div>
            </v-tabs-items>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>
    <v-dialog v-model="dialogSupportGroupByLocation" scrollable>
      <v-card>
        <v-card-title class="grey lighten-2">Details</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <div v-if="isLoadingZoneDetail">
            <v-progress-linear slot="progress" indeterminate></v-progress-linear>
          </div>
          <v-data-table
            v-else
            must-sort
            class="elevation-1"
            :headers="headersZoneDetail"
            :items="this.filteredZoneDetail"
            :search="searchZoneDetail"
            :loading="isLoadingZoneDetail"
            :pagination.sync="paginationZoneDetail"
          >
            <template slot="items" slot-scope="props">
              <td class="text-xs-left">{{ props.item.SupportGroup }}</td>
              <td class="text-xs-left">{{ props.item.TicketCreated }}</td>
              <td class="text-xs-left">{{ props.item.TicketResolved }}</td>
              <td
                class="text-xs-left"
              >{{ props.item.FollowupTicket == null ? 0 : props.item.FollowupTicket.toFixed(2) }} %</td>
              <td
                class="text-xs-left"
              >{{ props.item.CustomerSatisfaction == null ? 0 : props.item.CustomerSatisfaction.toFixed(2) }}</td>
              <td
                class="text-xs-left"
              >{{ props.item.ResponseRate == null ? 0 : props.item.ResponseRate.toFixed(2) }} %</td>
              <td class="text-xs-left">{{ props.item.DissatisfiedCnt }}</td>
              <td class="text-xs-left">{{ props.item.ITPending }}</td>
              <td class="text-xs-left">{{ props.item.ITPendingAvgDays }}</td>
              <td class="text-xs-left">{{ props.item.UserPending }}</td>
              <td class="text-xs-left">{{ props.item.UserPendingAvgDays }}</td>
              <td class="text-xs-left">{{ props.item.VendorPending }}</td>
              <td class="text-xs-left">{{ props.item.VendorPendingAvgDays }}</td>
            </template>
            <v-alert
              slot="no-results"
              :value="true"
              color="error"
              icon="warning"
            >Your search for "{{ search }}" found no results.</v-alert>
          </v-data-table>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click.stop="dialogSupportGroupByLocation=false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
/////////////////////////////////////////////////////////////////////////////////////////
import axios from "axios";
import { mixins } from "../../../mixins/CustomMixins";
import TicketService from "../../../services/ticket-service";
import DatePicker from "../../../components/control/DatePicker";
import ProgressLinear from "../../../components/control/ProgressLinear";
import store from "../../../store";
import ButtonSmall from "../../../components/control/ButtonSmall";
import ProgressCircular from "../../../components/control/ProgressCircular";
import ButtonGrid from "../../control/ButtonGrid";

// const CancelToken = axios.CancelToken;
// let cancel;


var cancel;
var CancelToken = axios.CancelToken;

export default {
  mixins: [mixins],
  components: {
    DatePicker,
    ProgressLinear,
    ProgressCircular,
    ButtonSmall,
    ButtonGrid
  },
  data() {
    return {
      dialogSupportGroupByLocation: false,
      isLoadingZoneDetail: false,
      loading3: false,
      loading4: false,
      loading5: false,
      tabActive: null,
      tabItems: [
        {
          id: 0,
          name: "Analyst"
        },
        {
          id: 1,
          name: "Support Group"
        },
        {
          id: 2,
          name: "Zone"
        }
      ],

      json_fieldsZoneReport: {
        Name: "Location",
        "Tickets Created": "TicketsCreated",
        "Tickets Resolved": "TicketResolved",
        "Followup Tickets": "FollowupTicket",
        "Customer Satisfaction": "CustomerSatisfaction",
        "Feedback Response Rate": "ResponseRate",
        "Dissatisfied Rating": "DissatisfiedCnt",
        "IT Pending": "ITPending",
        "IT Pending Avg Days": "ITPendingAvgDays",
        "User Pending": "UserPending",
        "User Pending Avg Days": "UserPendingAvgDays",
        "Vendor Pending": "VendorPending",
        "Vendor Pending Avg Days": "VendorPendingAvgDays"
      },

      json_fieldsAnalystReport: {
        "Resolved By": "ResolvedBy",
        "Tickets Resolved": "TicketsResolved",
        "Followup Tickets": "FollowupTicket",
        "Feedback Counts": "FeedBackCnt",
        "Customer Satisfaction": "CustomerSatisfaction",
        "Dissatisfied Rating": "DissatisfiedCnt",
        "Feedback Response Rate": "Response_Rate"
      },

      json_fieldsSG: {
        "Support Group": "SupportGroup",
        "Tickets Created": "Tickets_Created",
        "Tickets Resolved": "TicketResolved",
        "Followup Tickets": "FollowupTicket",
        "Customer Satisfaction": "CustomerSatisfaction",
        "Feedback Response Rate": "ResponseRate",
        "Dissatisfied Rating": "DissatisfiedCnt",
        "IT Pending": "ITPending",
        "IT Pending Avg Days": "ITPendingAvgDays",
        "User Pending": "UserPending",
        "User Pending Avg Days": "UserPendingAvgDays",
        "Vendor Pending": "VendorPending",
        "Vendor Pending Avg Days": "VendorPendingAvgDays"
      },

      rights: {
        DefineLocation: false,
        DefineSupportGroup: false,
        DefineUser: false
      },
      search: "",
      pagination: {
        descending: false,
        sortBy: "Name",
        rowsPerPage: -1
      },
      headers: [
        { text: "Actions", value: "", sortable: false, align: "center" },
        // { text: "", value: "", width: "20%" },
        { text: "Location", value: "Location", width: "20%" },
        // { text: "Central", value: "Central", width: "10%" },
        // { text: "Onsite & Offpeak", value: "OnsiteOffpeak", width: "20%" },
        // { text: "Vendor", value: "Vendor", width: "10%" },
        { text: "Created", value: "Tickets_Created", width: "10%" },
        { text: "Resolved", value: "TicketResolved", width: "20%" },
        {
          text: "Followup",
          value: "FollowupTicket",
          width: "20%"
        },
        {
          text: "Customer Satisfaction",
          value: "CustomerSatisfaction",
          width: "20%"
        },
        {
          text: "Feedback Response Rate",
          value: "ResponseRate",
          width: "20%"
        },
        { text: "Dissatisfied Rating", value: "DissatisfiedCnt", width: "20%" },
        { text: "Active", value: "ITPending", width: "20%" },
        {
          text: "Active Avg Days",
          value: "ITPendingAvgDays",
          width: "20%"
        },
        { text: "User Pending", value: "UserPending", width: "20%" },
        {
          text: "User Pending Avg Days",
          value: "UserPendingAvgDays",
          width: "20%"
        },
        { text: "Vendor Pending", value: "VendorPending", width: "20%" },
        {
          text: "Vendor Pending Avg Days",
          value: "VendorPendingAvgDays",
          width: "20%"
        }
      ],

      searchZoneDetail: "",
      paginationZoneDetail: {
        descending: false,
        sortBy: "SupportGroup",
        rowsPerPage: -1
      },
      headersZoneDetail: [
        { text: "Support Group", value: "SupportGroup", width: "10%" },
        { text: "Created", value: "TicketCreated", width: "10%" },
        { text: "Resolved", value: "TicketResolved", width: "10%" },
        {
          text: "Followup",
          value: "FollowupTicket",
          width: "10%"
        },
        {
          text: "Customer Satisfaction",
          value: "CustomerSatisfaction",
          width: "10%"
        },
        {
          text: "Feedback Response Rate",
          value: "ResponseRate",
          width: "10%"
        },
        { text: "Dissatisfied Rating", value: "DissatisfiedCnt", width: "5%" },
        { text: "Active", value: "ITPending", width: "5%" },
        {
          text: "Active Avg Days",
          value: "ITPendingAvgDays",
          width: "10%"
        },
        { text: "User Pending", value: "UserPending", width: "5%" },
        {
          text: "User Pending Avg Days",
          value: "UserPendingAvgDays",
          width: "5%"
        },
        { text: "Vendor Pending", value: "VendorPending", width: "5%" },
        {
          text: "Vendor Pending Avg Days",
          value: "VendorPendingAvgDays",
          width: "5%"
        }
      ],

      searchAnalyst: "",
      paginationAnalyst: {
        descending: false,
        sortBy: "ResolvedBy",
        rowsPerPage: -1
      },
      headersAnalyst: [
        { text: "Resolved", value: "ResolvedBy", width: "20%" },
        { text: "Tickets Resolved", value: "TicketsResolved", width: "20%" },
        { text: "Followup Tickets", value: "FollowupTicket", width: "10%" },
        { text: "Feedback Counts", value: "FeedBackCnt", width: "20%" },
        {
          text: "Customer Satisfacation",
          value: "CustomerSatisfacation",
          width: "20%"
        },

        {
          text: "Feedback Response Rate",
          value: "ResponseRate",
          width: "20%"
        },
        {
          text: "Dissatisfied Rating",
          value: "DissatisfiedCnt",
          width: "20%"
        }
      ],

      listOfRecordsZone: [],
      listOfRecordsZoneDetail: [],
      listOfRecordsAnalyst: [],
      listOfRecordsSG: [],
      isLoading: true,
      isLoadingAnalyst: true,
      isLoadingSG: true,

      searchSG: "",
      paginationSG: {
        descending: false,
        sortBy: "SupportGroup",
        rowsPerPage: -1
      },
      headersSG: [
        { text: "Support Group", value: "SupportGroup", width: "20%" },
        { text: "Tickets Created", value: "Tickets_Created", width: "10%" },
        { text: "Tickets Resolved", value: "TicketResolved", width: "20%" },
        {
          text: "Followup Tickets",
          value: "FollowupTicket",
          width: "20%"
        },
        {
          text: "Customer Satisfaction",
          value: "CustomerSatisfaction",
          width: "20%"
        },
        {
          text: "Feedback Response Rate",
          value: "ResponseRate",
          width: "20%"
        },
        { text: "Dissatisfied Rating", value: "DissatisfiedCnt", width: "20%" },
        { text: "IT Pending", value: "ITPending", width: "20%" },
        {
          text: "IT Pending Avg Days",
          value: "ITPendingAvgDays",
          width: "20%"
        },
        { text: "User Pending", value: "UserPending", width: "20%" },
        {
          text: "User Pending Avg Days",
          value: "UserPendingAvgDays",
          width: "20%"
        },
        { text: "Vendor Pending", value: "VendorPending", width: "20%" },
        {
          text: "Vendor Pending Avg Days",
          value: "VendorPendingAvgDays",
          width: "20%"
        }
      ]
    };
  },
  created: function() {
    store.commit("setCurrentScreenName", "Tier-2");

    this.getUserRights([2046, 2047, 2048, 2049]).then(result => {
      result.forEach(element => {
        if (element.name == "DefineLocation") {
          this.rights.DefineLocation = true;
        }
        if (element.name == "DefineSupportGroup") {
          this.rights.DefineSupportGroup = true;
        }
        if (element.name == "DefineUser") {
          this.rights.DefineUser = true;
        }
      });
    });
  },
  mounted() {
    this.fetchDataAnalyst();
  },

  //   created()
  //   {
  //  this.fetchDataAnalyst();
  //   },
  computed: {
    filteredTickets() {
      return this.listOfRecordsZone;
    },
    filteredZoneDetail() {
      return this.listOfRecordsZoneDetail;
    },
    filteredAnalyst() {
      return this.listOfRecordsAnalyst;
    },
    filteredSG() {
      return this.listOfRecordsSG;
    },
    toFixed(val) {
      var strVal = val;
      var strResult = strVal == undefined ? 0 : strVal.toFixed(2);
      return strResult;
    }
  },
  watch: {
    tabActive: function() {
      var objTabs = this.tabItems;
      objTabs.forEach(item => {
        if (this.tabActive == item.id && item.name == "Analyst") {
          this.fetchDataAnalyst();
        } else if (this.tabActive == item.id && item.name == "Support Group") {
          this.fetchReportZoneBySupportGroupNR();
        } else if (this.tabActive == item.id && item.name == "Zone") {
          this.fetchReportZoneNR2();
        }
      });
    }
  },
  methods: {
    hidecolumn: function(field) {
      this.columns.map(function(column) {
        if (column.field === field) {
          Vue.set(column, "hidden", true);
        }
      });
    },

    async fetchReportZoneNR2() {
      var strCurrentDate = new Date(
        `${this.$store.getters.startDate}T00:00:00`
      );
      var strNewEndDate = new Date(`${this.$store.getters.endDate}T23:59:59`);
      var difference = strNewEndDate - strCurrentDate;

      if (difference < 0) {
        alert("Please select date end should be greater than start date");
      } else {
        this.isLoading = true;
        this.listOfRecordsZone = [];
        const res = await TicketService.getReportZoneNR2({
          start_date: `${this.$store.getters.startDate}T00:00:00`,
          end_date: `${this.$store.getters.endDate}T23:59:59`
        })
          .then(res => {
            this.listOfRecordsZone = res.data;
            this.isLoading = false;
          })
          .catch(error => {
            this.isLoading = false;
          });
      }
    },

    async fetchReportZoneNR2Detail(pZone) {
      var strCurrentDate = new Date(
        `${this.$store.getters.startDate}T00:00:00`
      );
      var strNewEndDate = new Date(`${this.$store.getters.endDate}T23:59:59`);
      var difference = strNewEndDate - strCurrentDate;

      if (difference < 0) {
        alert("Please select date end should be greater than start date");
      } else {
        this.isLoadingZoneDetail = true;
        this.listOfRecordsZoneDetail = [];
        const res = await TicketService.getReportZoneNR2Detail({
          start_date: `${this.$store.getters.startDate}T00:00:00`,
          end_date: `${this.$store.getters.endDate}T23:59:59`,
          zone: pZone
        })
          .then(res => {
            this.listOfRecordsZoneDetail = res.data;
            this.isLoadingZoneDetail = false;
          })
          .catch(error => {
            this.isLoadingZoneDetail = false;
          });
      }
    },

    fetchDataAnalyst() {
      if (cancel != undefined) {
        cancel();
       // console.log("cancelled");
      }
      this.fetchDataAnalyst();
    },


    fetchDataAnalyst2() {
      this.isLoadingAnalyst = true;
      this.listOfRecordsAnalyst = [];

      var strCurrentDate = `${this.$store.getters.startDate}T00:00:00`;
      var strNewEndDate = `${this.$store.getters.endDate} 23:59:59.999`;

      axios
        .get(
          this.$urlApplication +
            "tickets/GetReportAnalystNR?start_date=" +
            strCurrentDate +
            "&end_date=" +
            strNewEndDate,
          {
            cancelToken: new CancelToken(function executor(c) {
              // An executor function receives a cancel function as a parameter
              cancel = c;
              debugger
            })
          }
        )
        .then(res => {
          this.listOfRecordsAnalyst = res.data;
          this.isLoadingAnalyst = false;
        });
    },
    cancel() {
      //cancel();
      this.isLoadingAnalyst = false;
      //this.message = "The request cancelled";
    },

    //async fetchDataAnalyst() {
    fetchDataAnalystOld() {
      var strCurrentDate = new Date(
        `${this.$store.getters.startDate}T00:00:00`
      );
      var strNewEndDate = new Date(`${this.$store.getters.endDate}T23:59:59`);
      var difference = strNewEndDate - strCurrentDate;

      if (difference < 0) {
        alert("Please select date end should be greater than start date");
      } else {
        this.isLoadingAnalyst = true;
        this.listOfRecordsAnalyst = [];

        var strCurrentDate = `${this.$store.getters.startDate}T00:00:00`;
        var strNewEndDate = `${this.$store.getters.endDate} 23:59:59.999`;

        // const CancelToken = axios.CancelToken;
        // let cancel;

        // axios.get(
        //   this.$urlApplication +
        //     "tickets/GetReportAnalystNR?start_date=" +
        //     strCurrentDate +
        //     "&end_date=" +
        //     strNewEndDate,

        //   {
        //     cancelToken: new CancelToken(function executor(c) {
        //       // An executor function receives a cancel function as a parameter
        //       cancel = c;
        //     })
        //   }
        // );

        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        axios
          .get(
            this.$urlApplication +
              "tickets/GetReportAnalystNR?start_date=" +
              strCurrentDate +
              "&end_date=" +
              strNewEndDate,
            {
              cancelToken: source.token
            }
          )
          .then(res => {
            this.listOfRecordsAnalyst = res.data;
            this.isLoadingAnalyst = false;
          })
          .catch(function(thrown) {
            if (axios.isCancel(thrown)) {
              console.log("Request canceled", thrown.message);
            } else {
              // handle error
            }
          });

        //////////////////////////////////////
        // axios({
        //   method: "get",
        //   cancelToken: source.token,
        //   url:
        //     this.$urlApplication +
        //     "tickets/GetReportAnalystNR?start_date=" +
        //     strCurrentDate +
        //     "&end_date=" +
        //     strNewEndDate
        // })
        //   .then(res => {
        //     this.listOfRecordsAnalyst = res.data;
        //     this.isLoadingAnalyst = false;
        //   })
        //   .catch(function(thrown) {
        //     if (axios.isCancel(thrown)) {
        //       console.log("Request canceled", thrown.message);
        //     } else {
        //       // handle error
        //     }
        //     // error => {
        //     this.isLoadingAnalyst = false;
        //   });

        //const res = await TicketService.getReportAnalystNR({
        // const res = TicketService.getReportAnalystNR({
        //   start_date: `${this.$store.getters.startDate}T00:00:00`,
        //   end_date: `${this.$store.getters.endDate}T23:59:59`
        // })
        //   .then(res => {

        //     this.listOfRecordsAnalyst = res.data;
        //     this.isLoadingAnalyst = false;
        //   })
        //   .catch(error => {
        //     this.isLoadingAnalyst = false;
        //   });
      }
    },

    async fetchReportZoneBySupportGroupNR() {
      var strCurrentDate = new Date(
        `${this.$store.getters.startDate}T00:00:00`
      );
      var strNewEndDate = new Date(`${this.$store.getters.endDate}T23:59:59`);
      var difference = strNewEndDate - strCurrentDate;

      if (difference < 0) {
        alert("Please select date end should be greater than start date");
      } else {
        this.isLoadingSG = true;
        this.listOfRecordsSG = [];
        const res = await TicketService.getReportZoneBySupportGroupNR({
          start_date: `${this.$store.getters.startDate}T00:00:00`,
          end_date: `${this.$store.getters.endDate}T23:59:59`
        })
          .then(res => {
            this.listOfRecordsSG = res.data;
            this.isLoadingSG = false;
          })
          .catch(error => {
            this.isLoadingSG = false;
          });
      }
    },

    btnView(obj) {
      this.dialogSupportGroupByLocation = true;
      var location = obj.Property_Location;
      this.fetchReportZoneNR2Detail(location);
    }
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
  /* padding: 0 0px; */
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