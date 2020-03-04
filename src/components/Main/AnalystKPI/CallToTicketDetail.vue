<template>
  <!-- <v-card>
    <v-card-title class="headline grey lighten-2" primary-title>Ticket Details</v-card-title>
    <v-divider></v-divider>
  <v-card-text>-->
  <v-tabs v-model="active" color="colorLight" dark slider-color="yellow">
    <v-tab>Ticket</v-tab>
    <v-tab-item>
      <v-card flat>
        <v-card-text>
          <h1>Test</h1>
          <v-data-table
            must-sort
            :headers="headers"
            :items="filteredRecord"
            :search="search"
            :loading="isLoadinglistOfRecord"
            :pagination.sync="pagination"
          >
            <template slot="items" slot-scope="props">
              <td class="text-xs-left">{{ props.item.UserName }}</td>
              <td class="text-xs-left">{{ props.item.Ticket }}</td>
              <td class="text-xs-left">{{ props.item.Unrecorded }}</td>
              <td class="text-xs-left">{{ props.item.CallServed }}</td>
              <td>
                <!-- <button-grid :description="'View'" @Click="btnView(props.item.UserName)"/> -->
              </td>
            </template>
            <v-alert
              slot="no-results"
              :value="true"
              color="error"
              icon="warning"
            >Your search for "{{ search }}" found no results.</v-alert>
          </v-data-table>

          <!-- Fame is the shadow of passion standing in the light before you judge some walk in a shoes atleast a mile. -->
        </v-card-text>
      </v-card>
    </v-tab-item>

    <v-tab>Unrecorded IR</v-tab>
    <v-tab-item>
      <v-card flat>
        <v-card-text>This is vuetify theme</v-card-text>
      </v-card>
    </v-tab-item>

    <v-tab>Call Served</v-tab>
    <v-tab-item>
      <v-card flat>
        <v-card-text>This is vuetify theme</v-card-text>
      </v-card>
    </v-tab-item>
  </v-tabs>

  <!-- </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn flat @click="onClick">Close</v-btn>
    </v-card-actions>
  </v-card>-->
</template>

<script>
import moment from "moment";
import TicketService from "../../../services/ticket-service";
import axios from "axios";

export default {
  props: ["id"],
  data() {
    return {
      isLoadinglistOfRecord: true,
      listOfRecord: [],

      search: "",
      pagination: {
        rowsPerPage: -1,
        descending: false,
        sortBy: "AgentName"
      },
      headers: [
        { text: "Analyst", value: "UserName", width: "20%" },
        { text: "Ticket", value: "Ticket", width: "20%" },
        {
          text: "Unrecorded IR",
          value: "Unrecorded",
          width: "20%"
        },
        {
          text: "Call Served",
          value: "CallServed",
          width: "20%"
        },
        {
          text: "Action",
          value: "",
          width: "20%"
        }
      ],

      active: null,
      text: "Lorem ips ex ea commodo consequat.",

      ticket: {},
      isLoadingTicket: false,
      loadingTicketText: ""
    };
  },
  watch: {
    id: function() {
      this.fetchCallToTicket();
    }
  },
  computed: {
    filteredRecord() {
      return this.listOfRecord;
    }
  },
  methods: {
    onClick() {
      this.$emit("Click");
    },
    fetchCallToTicket() {
      this.isLoadinglistOfRecord = true;
      //Validate Date From And To
      // var strCurrentDate = new Date(
      //   `${this.$store.getters.startDate}T00:00:00`
      // );
      // var strNewEndDate = new Date(`${this.$store.getters.endDate}T23:59:59`);
      // var difference = strNewEndDate - strCurrentDate;

      // if (difference < 0) {
      //   alert("Please select date end should be greater than start date");
      // } else {
        var strCurrentDate = `${this.$store.getters.startDate}T00:00:00`;
        var strNewEndDate = `${this.$store.getters.endDate} 23:59:59.999`;

// var v1 = this.$urlApplication;
// debugger
        axios({
          method: "get",
          url:
            this.$urlApplication +
            "AgentKPI/GetCallToTicket?dateFrom=" +
            strCurrentDate +
            "&dateTo=" +
            strNewEndDate +
            "&userName=" +
            this.id
        })
          .then(res => {
            this.listOfRecord = res.data;
            this.isLoadinglistOfRecord = false;
          })
          .catch(error => {
            this.isLoadinglistOfRecord = false;
          });
      //}
    }
    // async fetchTicket() {
    //   this.isLoadingTicket = true;
    //   //const res = await TicketService.getTicketDetails(this.getTicketId);
    //   this.ticket = res.data;
    //   this.isLoadingTicket = false;
    // }
  }
};
</script>