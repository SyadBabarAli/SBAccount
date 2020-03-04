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
                    <date-picker @getResults="fetchData" />
                  </v-flex>
                </v-layout>
                <v-layout>
                  <v-flex lg12>
                    <v-card>
                      <!-- <v-progress-linear indeterminate v-if="isLoading"></v-progress-linear>
                      <Grid
                        v-show="!isLoading"
                        ref="grid"
                        :cell-render="cellComponent"
                        :style="{height: '520px'}"
                        :data-items="gridData"
                        :resizable="true"
                        :reorderable="true"
                        :sortable="true"
                        :pageable="gridPageable"
                        :groupable="{footer: 'visible'}"
                        :group="group"
                        :take="take"
                        :skip="skip"
                        :expand-field="'expanded'"
                        :columns="columns"
                        @datastatechange="dataStateChange"
                        @expandchange="expandChange"
                      ></Grid> -->
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
                          <td class="text-xs-left">{{ props.item.Location }}</td>
                          <td class="text-xs-left">{{ props.item.Central }}</td>
                          <td class="text-xs-left">{{ props.item.OnsiteOffpeak }}</td>

                          <td class="text-xs-left">{{ props.item.Vendor }}</td>

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
  </v-layout>
</template>
<script>
import "@progress/kendo-theme-default/dist/all.css";
import Vue from "vue";
import { process } from "@progress/kendo-data-query";
import { Grid } from "@progress/kendo-vue-grid";

function getNestedValue(fieldName, dataItem) {
  const path = fieldName.split(".");
  let data = dataItem;

  path.forEach(p => {
    data = data ? data[p] : undefined;
  });

  return data;
}

const componentInstance = Vue.component("template-component", {
  props: {
    field: String,
    dataItem: Object,
    format: String,
    className: String,
    columnIndex: Number,
    columnsCount: Number,
    rowType: String,
    level: Number,
    expanded: Boolean,
    editor: String
  },
  template: `<td v-if="rowType==='groupFooter'">
  <div v-if="columnIndex == 0 ">
    Total
  </div>
  <div v-else>
      {{computedAggregates}}
  </div>
</td>
<td v-else-if="renderCell" :class="className">
  <b>{{ getNestedValue(field, dataItem)}}</b>
</td>
<td v-else-if="renderArrow" key="'g' + columnIndex" :class="'k-group-cell'" >
</td>
<td v-else-if="columnIndex <= level" key='g-colspan' :colSpan="columnsCount - columnIndex">
  <p class="k-reset">
		<a @click="onClick" tabIndex="-1" href="#" :class="expanded ? 'k-i-collapse k-icon' : 'k-i-expand k-icon'" />
      {{dataItem[field]}} {{computedAggregates}}
	</p>
</td>
`,
  computed: {
    computedAggregates: function() {
      let renderedString;

      // if (this.field === "Central") {
      //   renderedString = " " + this.dataItem.aggregates.Central.sum;
      // } else if (this.field === "OnsiteOffpeak") {
      //   renderedString = " " + this.dataItem.aggregates.OnsiteOffpeak.sum;
      // } else if (this.field === "Vendor") {
      //   renderedString = " " + this.dataItem.aggregates.Vendor.sum;
      // } else
      if (this.field === "Tickets_Created") {
        renderedString = " " + this.dataItem.aggregates.Tickets_Created.sum;
      } else if (this.field === "TicketResolved") {
        renderedString = " " + this.dataItem.aggregates.TicketResolved.sum;
      } else if (this.field === "value") {
        var obj = this.dataItem.aggregates;
        // renderedString =
        //   "   : " +
        //   (obj.Tickets_Created == undefined ? 0 : obj.Tickets_Created.sum) +
        //   "      : " +
        //   (obj.TicketResolved == undefined ? 0 : obj.TicketResolved.sum);
        renderedString =
          " Ticket Resolved : " +
          this.dataItem.aggregates.TicketResolved.sum +
          "  Ticket Created : " +
          this.dataItem.aggregates.Tickets_Created.sum;
      }

      //var v1 = this.dataItem;
      //debugger
      //this.expanded = false
      //alert(1);
      return renderedString;
    },
    renderArrow() {
      var returnValue =
        this.columnIndex === undefined ||
        this.level === undefined ||
        this.columnIndex < this.level ||
        this.columnsCount === undefined ||
        this.rowType !== "groupHeader" ||
        this.dataItem[this.field] === undefined;
      //alert(2);
      return returnValue && this.dataItem[this.field];
    },
    renderCell() {
      return this.field !== undefined && this.rowType !== "groupHeader";
      //alert(3);
    }
  },
  methods: {
    onClick(e) {
      this.$emit("change", e, this.dataItem, this.expanded);
    },
    onClick(e) {
      // @ts-ignore
      this.$emit("click", e, this.dataItem, this.expanded);
    },
    hidecolumn: function(e) {
      this.$emit("hidecolumn", e);
    },
    getNestedValue: getNestedValue
  }
});

Vue.component("Grid", Grid);

/////////////////////////////////////////////////////////////////////////////////////////

import { mixins } from "../../../mixins/CustomMixins";
import TicketService from "../../../services/ticket-service";
import DatePicker from "../../../components/control/DatePicker";
import ProgressLinear from "../../../components/control/ProgressLinear";
import store from "../../../store";
import ButtonSmall from "../../../components/control/ButtonSmall";
import ProgressCircular from "../../../components/control/ProgressCircular";

export default {
  mixins: [mixins],
  components: {
    DatePicker,
    ProgressLinear,
    ProgressCircular,
    ButtonSmall
  },
  data() {
    return {
      isLoading: true,
      aggregates: [
        // { field: "Central", aggregate: "sum" },
        // { field: "OnsiteOffpeak", aggregate: "sum" },
        // { field: "Vendor", aggregate: "sum" },
        { field: "Tickets_Created", aggregate: "sum" },
        { field: "TicketResolved", aggregate: "sum" }
      ],
      cellComponent: componentInstance,
      gridPageable: { pageSizes: true },
      products: [],
      gridData: [],
      skip: 0,
      take: 100,
      group: [{ field: "Name" }],
      // group: [{ field: "ParentName" },{ field: "SupportGroup" }],
      expandedItems: [],

      columns: [
        { field: "Name", title: "Name", width: "150px", hidden: true },
        {
          field: "ParentName",
          title: "Parent Name",
          width: "100px",
          groupable: true,
          hidden: true
        },
        {
          field: "SupportGroup",
          title: "Support Group",
          width: "150px"
          //,expand: false
          // groupable: true,
          // hidden: false
        },
        // { field: "Central", title: "Central", width: "100px" },
        // { field: "OnsiteOffpeak", title: "Onsite Offpeak", width: "120px" },
        // { field: "Vendor", title: "Vendor", width: "100px" },
        { field: "Tickets_Created", title: "Created", width: "100px" },
        { field: "TicketResolved", title: "Resolved", width: "100px" },
        { field: "FollowupTicket", title: "Followup Ticket", width: "120px" },
        {
          field: "CustomerSatisfaction",
          title: "Customer Satisfaction"
        },
        {
          field: "ResponseRate",
          title: "Feedback Response Rate",
          width: "100px"
        },
        {
          field: "DissatisfiedCnt",
          title: "Dissatisfied Rating",
          width: "120px"
        },
        { field: "ITPending", title: "Active Tickets", width: "120px" },
        {
          field: "ITPendingAvgDays",
          title: "Active Tickets Avg Days",
          width: "120px"
        },
        { field: "UserPending", title: "User Pending", width: "120px" },
        {
          field: "UserPendingAvgDays",
          title: "User Pending Avg Days",
          width: "120px"
        },
        { field: "VendorPending", title: "Vendor Pending", width: "120px" },
        {
          field: "VendorPendingAvgDays",
          title: "Vendor Pending Avg Days",
          width: "120px"
        },
        { field: "FollowupTicket", title: "Followup Ticket", width: "120px" }
      ],

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
        Name: "Name",
        Central: "Central",
        "Onsite & Offpeak ": "OnsiteOffpeak",
        "Vendor ": "Vendor",
        "Tickets Created": "Tickets_Created",
        "Tickets Resolved": "TicketResolved",
        "Followup Tickets": "FollowupTicket",
        "Customer Satisfaction": "CustomerSatisfaction",
        "Feedback Response Rate": "ResponseRate",
        "Dissatisfied Rating": "DissatisfiedCnt",
        "Active Tickets": "ITPending",
        "Active Tickets Avg Days": "ITPendingAvgDays",
        "User Pending": "UserPending",
        "User Pending Avg Days": "UserPendingAvgDays",
        "Vendor Pending": "VendorPending",
        "Vendor Pending Avg Days": "VendorPendingAvgDays"
      },

      json_fieldsAnalystReport: {
        "Resolved By": "ResolvedBy",
        "Tickets Resolved": "TicketResolved",
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
        "Active Tickets": "ITPending",
        "Active Tickets Avg Days": "ITPendingAvgDays",
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
        { text: "Location", value: "Location", width: "20%" },
        { text: "Central", value: "Central", width: "10%" },
        { text: "Onsite & Offpeak", value: "OnsiteOffpeak", width: "20%" },
        { text: "Vendor", value: "Vendor", width: "10%" },
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
        { text: "Active Tickets", value: "ITPending", width: "20%" },
        {
          text: "Active Tickets Avg Days",
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
          value: "Response_Rate",
          width: "20%"
        },
        {
          text: "Dissatisfied Rating",
          value: "DissatisfiedCnt",
          width: "20%"
        }
      ],

      listOfRecords: [],
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
        { text: "Active Tickets", value: "ITPending", width: "20%" },
        {
          text: "Active Tickets Avg Days",
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
    // //var v1 = this.$store.getters.sidebar;
    // //debugger
    // this.$store.dispatch("setSidebar", false);
    // //this.$store.getters.sidebar = false;
  },
  computed: {
    filteredTickets() {
      return this.listOfRecords;
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
          //this.fetchData();
          this.fetchDataOnlyZoneWise();
        }
      });
    }
  },
  methods: {
    getData: function() {
      this.gridData = process(this.products, {
        take: this.take,
        skip: this.skip,
        group: this.group
      });
    },
    createAppState: function(dataState) {
      this.take = dataState.take;
      this.skip = dataState.skip;
      if (dataState.group) {
        dataState.group.map(group => (group.aggregates = this.aggregates));
      }
      this.group = dataState.group;
      this.getData();
    },
    dataStateChange: function(event) {
      this.createAppState(event.data);
    },
    expandChange: function(event) {
      Vue.set(event.dataItem, event.target.$props.expandField, event.value);
    },
    detailCollapse: function(event) {},
    async fetchData() {
      if (this.group) {
        this.group.map(group => (group.aggregates = this.aggregates));
      }
      this.group = this.group;
      this.getData();

      var result = null;
      var strCurrentDate = new Date(
        `${this.$store.getters.startDate}T00:00:00`
      );
      var strNewEndDate = new Date(`${this.$store.getters.endDate}T23:59:59`);
      var difference = strNewEndDate - strCurrentDate;

      if (difference < 0) {
        alert("Please select date end should be greater than start date");
      } else {
        this.isLoading = true;
        const res = await TicketService.getReportZoneWiseNR({
          start_date: `${this.$store.getters.startDate}T00:00:00`,
          end_date: `${this.$store.getters.endDate}T23:59:59`
        })
          .then(res => {
            result = res.data;
            this.products = result;
            this.getData();

            setTimeout(function() {
              var objTable = document.querySelector(
                ".k-grid-header-wrap > table"
              );
              //objTable.width = "3000px";

              var objTablecolgroupcol = document.querySelector(
                ".k-grid-table > colgroup > col"
              );

              if (objTablecolgroupcol != null) {
                objTablecolgroupcol.width = "50px";
              }
            }, 100);
            this.isLoading = false;
          })
          .catch(error => {
            this.isLoading = false;
          });
      }
      return result;
    },

    hidecolumn: function(field) {
      this.columns.map(function(column) {
        if (column.field === field) {
          Vue.set(column, "hidden", true);
        }
      });
    },
    //  toFixed(val) {
    //   var strVal = val;
    //   var strResult = strVal == undefined ? 0 : strVal.toFixed(2);
    //   return strResult;
    // },

    async fetchDataOnlyZoneWise() {
      var strCurrentDate = new Date(
        `${this.$store.getters.startDate}T00:00:00`
      );
      var strNewEndDate = new Date(`${this.$store.getters.endDate}T23:59:59`);
      var difference = strNewEndDate - strCurrentDate;

      if (difference < 0) {
        alert("Please select date end should be greater than start date");
      } else {
        this.isLoading = true;
        this.listOfRecords = [];
        const res = await TicketService.getReportZoneNR({
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

    async fetchDataAnalyst() {
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
        const res = await TicketService.getReportAnalystNR({
          start_date: `${this.$store.getters.startDate}T00:00:00`,
          end_date: `${this.$store.getters.endDate}T23:59:59`
        })
          .then(res => {
            this.listOfRecordsAnalyst = res.data;
            this.isLoadingAnalyst = false;
          })
          .catch(error => {
            this.isLoadingAnalyst = false;
          });
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
    }
  }
};
</script>

<style >
.k-grouping-header {
  display: none;
}
/* .k-grid-header-wrap > table {
  width: 3032px;
}
.k-grid-header-wrap > table > colgroup {
  width: 180px;
} */
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