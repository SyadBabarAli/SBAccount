
<template>
  <v-card>
    <v-card-title class="grey lighten-2">Ticket</v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="listOfRecord"
        :search="search"
        :pagination.sync="pagination"
      >
        <template slot="no-data" v-if="isLoading">
          <v-progress-linear slot="progress" indeterminate></v-progress-linear>
        </template>
        <template slot="items" slot-scope="props">
          <tr :class="{ 'animate-danger': isDanger(props.item) }">
            <td class="text-xs-left">{{ props.item.CreatedDate | momentDate }}</td>
            <td class="text-xs-left">{{ props.item.Status }}</td>
            <td class="text-xs-left">{{ props.item.IR }}</td>
            <td class="text-xs-left">{{ props.item.SupportGroup }}</td>
            <td class="text-xs-left">{{ props.item.AffectedUser }}</td>
            <td class="text-xs-left">{{ props.item.Title }}</td>
            <td class="text-xs-left">{{ props.item.Ftag }}</td>
            <td>
              <button-grid :description="'View'" @Click="btnView(props.item.IncidentDimKey)"></button-grid>
            </td>
          </tr>
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
      <v-btn flat @click.stop="show=false">Close</v-btn>
    </v-card-actions>

     <v-dialog v-model="viewDialog" scrollable width="500">
        <app-feedback-details :IncidentDimKey="incidentId" @Click="closeViewDialog"></app-feedback-details>
      </v-dialog>
  </v-card>

  <!-- <div id="vdailogTicketList"> -->
  <!-- <v-card>
      <v-card-title class="grey lighten-2">Ticket</v-card-title>
      <v-card-text>
        <v-layout row wrap>
          <v-flex>
            <v-data-table
              :headers="headers"
              :items="listOfRecord"
              :search="search"
              :pagination.sync="pagination"
            >
              <template slot="no-data" v-if="isLoading">
                <v-progress-linear slot="progress" indeterminate></v-progress-linear>
              </template>
              <template slot="items" slot-scope="props">
                <tr :class="{ 'animate-danger': isDanger(props.item) }">
                  <td class="text-xs-left">{{ props.item.CreatedDate | momentDate }}</td>
                  <td class="text-xs-left">{{ props.item.Status }}</td>
                  <td class="text-xs-left">{{ props.item.IR }}</td>
                  <td class="text-xs-left">{{ props.item.SupportGroup }}</td>
                  <td class="text-xs-left">{{ props.item.AffectedUser }}</td>
                  <td class="text-xs-left">{{ props.item.Title }}</td>
                  <td class="text-xs-left">{{ props.item.Ftag }}</td>
                  <td>
                    <button-grid :description="'View'" @Click="btnView(props.item.IncidentDimKey)"></button-grid>
                  </td>
                </tr>
              </template>

              <v-alert
                slot="no-results"
                :value="true"
                color="error"
                icon="warning"
              >Your search for "{{ search }}" found no results.</v-alert>
            </v-data-table>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat @click.stop="show=false">Close</v-btn>
      </v-card-actions>
       <v-dialog v-model="viewDialog" scrollable width="500">
        <app-feedback-details :IncidentDimKey="incidentId" @Click="closeViewDialog"></app-feedback-details>
      </v-dialog>
  </v-card>-->
  <!-- <div id="modalFeedbackDetails"> -->
  <!-- </div> -->
  <!-- </div> -->
</template>

<script>
// import {bus} from '../main.js'
import ButtonNormal from "../../../components/Control/ButtonNormal";
import ProgressLinear from "../../../components/control/ProgressLinear";
//import ProgressCircle from "../../../components/control/ProgressCircle";
import FeedbackService from "../../../services/feedback-service";
import TicketService from "../../../services/ticket-service";
import FeedbackDetails from "../../../components/Main/TicketSearch/TicketSearchDetailView";
import DatePicker from "../../../components/control/DatePicker";
import IndividualResponseRate from "../../../components/Chart/ChartJs/IndividualResponseRate";
import FeedbackRating from "../../../components/control/FeedbackRating";
import ButtonGrid from "../../control/ButtonGrid";
import moment from "moment";
import _ from "lodash";

export default {
  props: ["visible", "pId", "pSearchText"],
  name: "vdailogTicketList",
  components: {
    "app-feedback-details": FeedbackDetails,
    "app-individual-response-rate": IndividualResponseRate,
    "app-datepicker": DatePicker,
    ButtonNormal,
    FeedbackRating,
    ButtonGrid
  },
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit("onClick");
          this.search = "";
        }
      }
    }
  },

  watch: {
    visible: function(obj) {
      if (obj) {
        this.filteredFeedbacks();
      } else {
      }
    }
  },

  data() {
    return {
      search: "",
      pagination: {
        descending: true,
        sortBy: "CreatedDate",
        rowsPerPage: 10
      },
      headers: [
        // { text: "IncidentDimKey", value: "IncidentDimKey" },
        { text: "Created Date", value: "CreatedDate" },
        { text: "Status", value: "Status" },
        { text: "IR", value: "IR" },
        {
          text: "Support Group",
          value: "SupportGroup",
          align: "left"
        },
        { text: "Affected User", value: "AffectedUser" },
        { text: "Title", value: "Title" },
        { text: "Ftag", value: "Ftag" },
        { text: "", value: "" }
      ],
      incidentId: "",
      viewDialog: false,
      isLoading: false,
      listOfRecord: []
    };
  },

  methods: {
    isDanger(feedback) {
      return feedback.Rating < 3;
    },
    filteredFeedbacks() {
      this.listOfRecord = [];
      this.isLoading = true;
      TicketService.getTicketSearch({
        id: this.pId,
        text: this.pSearchText
      })
        .then(res => {
          this.listOfRecord = res.data;
          this.isLoading = false;
        })
        .catch(error => {
          this.isLoading = false;
          console.log(error);
        });
    },
    btnView(incidentId) {
      this.incidentId = incidentId;
      this.viewDialog = true;
    },
    closeViewDialog() {
      this.viewDialog = false;
    }
  }
};
</script>