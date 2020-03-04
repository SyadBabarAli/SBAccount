<template>
  <v-layout row wrap class="pa-2">
    <v-flex lg12 class="mt-12">
      <v-card class="black--text elevation-5">
        <v-layout>
          <v-flex lg12 class="pa-0">
            <v-card-title class="headline grey lighten-3 pa-1 ma-0" primary-title>Agent Statistics</v-card-title>
            <v-layout class="pa-1">
              <v-flex lg12>
                <app-datepicker @getResults="getResults"></app-datepicker>
              </v-flex>
            </v-layout>
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
                      expand
                    ></v-text-field>
                  </v-card-title>
                  <v-data-table
                    must-sort
                    :headers="headers"
                    :items="filteredRecords"
                    :search="search"
                    :loading="isLoadinglistOfRecords"
                    :pagination.sync="pagination"
                  >
                    <template slot="items" slot-scope="props">
                      <td class="text-xs-left">{{ props.item.Agent }}</td>
                      <td class="text-xs-left">{{ props.item.SupportGroup }}</td>
                      <td class="text-xs-left">{{ props.item.AbandonedCall }}</td>
                      <td class="text-xs-left">{{ props.item.CustomerSatisfaction }}</td>
                      <td class="text-xs-left">{{ props.item.ResponseRate }}</td>
                      <td class="text-xs-left">{{ props.item.AvrageConversationTime }}</td>
                      <td class="text-xs-left">{{ props.item.SLA }}</td>
                      <td class="text-xs-left">{{ props.item.AttendancePercentage }}</td>
                      <td class="text-xs-left">{{ props.item.Attendance }}</td>
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
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import DatePicker from "../../../components/control/DatePicker";
import moment from "moment";
import _ from "lodash";
import CallStatustics from "../../../services/callstatustics-service";

export default {
  name: "AgentStatistics",
  components: {
    "app-datepicker": DatePicker
  },
  data() {
    return {
      isAllow: false,

      search: "",
      pagination: {
        descending: true,
        sortBy: "CreatedDate"
      },
      headers: [
        { text: "Agent", value: "Agent", width: "20%" },
        { text: "Support Group", value: "SupportGroup", width: "10%" },
        { text: "Abandoned Call", value: "AbandonedCall", width: "20%" },
        {
          text: "Customer Satisfaction",
          value: "CustomerSatisfaction",
          width: "10%"
        },
        { text: "Response Rate", value: "ResponseRate", width: "20%" },
        {
          text: "Avg. Conv Time",
          value: "AvrageConversationTime",
          width: "20%"
        },
        { text: "SLA", value: "SLA", width: "20%" },
        {
          text: "Attendance Percentage",
          value: "AttendancePercentage",
          width: "20%"
        },
        { text: "Attendance", value: "Attendance", width: "20%" }
      ],

      isLoadinglistOfRecords: true,
      listOfRecords: []
    };
  },
  mounted() {
    this.getResults();
  },
  computed: {
    filteredRecords() {
      var filterTeams = this.$store.getters.filterTeams;
      var recordList = this.listOfRecords.filter(ticket =>
        _.includes("Service Desk", ticket.SupportGroup)
      );
      return recordList;
    }
  },
  methods: {
    getResults() {
      this.isLoadinglistOfRecords = true;

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
              this.isLoadinglistOfRecords = false;
            })
            .catch(error => {
              this.isLoadinglistOfRecords = false;
            });
        } catch (err) {}
      }
    },
    filterBy(list, val) {
      if (val) {
        val = val.trim().toLowerCase();
        let searchData = list.filter(feedback => {
          var v2 =
            feedback.AffectedUser.toLowerCase().indexOf(val) > -1 ||
            feedback.ResolvedBy.toLowerCase().indexOf(val) > -1 ||
            feedback.SupportGroup.toLowerCase().indexOf(val) > -1 ||
            feedback.Rating.toString().indexOf(val) > -1;
          return v2;
        });
        return this.getPaginatedData(searchData);
      }
      return this.getPaginatedData(list);
    }
  }
};
</script>
