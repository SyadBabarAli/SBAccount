<template>
  <!-- <div id="priority"> -->
  <v-layout row wrap class="pa-2">
    <v-flex lg12 class="mt-12">
      <v-card class="black--text elevation-5">
        <v-layout>
          <v-flex lg12 class="pa-0">
            <v-card-title class="headline grey lighten-3 pa-1 ma-0" primary-title>Priority 1 Tickets</v-card-title>
            <v-layout class="pa-1">
              <v-flex lg12>
                <date-picker @getResults="fetchPriorityTicketsByDateRange"/>
              </v-flex>
            </v-layout>
            <v-layout>
              <!-- <v-flex lg12 v-if="isLoading">
                  <progress-linear/>
              </v-flex>-->
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
                    class="elevation-3"
                    :headers="headers"
                    :items="this.filteredTickets"
                    :search="search"
                    :loading="isLoading"
                    :pagination.sync="pagination"
                  >
                    <template slot="items" slot-scope="props">
                      <td class="text-xs-left">{{ props.item.CreatedDate | momentDate }}</td>
                      <td class="text-xs-left">{{ props.item.Id }}</td>
                      <td>{{ props.item.Title }}</td>
                      <td class="text-xs-left">{{ props.item.SupportGroup }}</td>
                      <td class="text-xs-left">{{ props.item.ResolvedBy }}</td>
                      <td class="text-xs-left">{{ props.item.ResolutionDescription }}</td>
                      <td>
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
          </v-flex>
        </v-layout>
        <!-- <v-divider light></v-divider> -->
        <!-- <v-card-actions class="pa-0 ma-0 ml-1"></v-card-actions> -->
      </v-card>
    </v-flex>
    <v-dialog v-model="viewDialog" width="500" scrollable>
      <app-ticket-details :getTicketId="ticketId" @Click="closeViewDialog"></app-ticket-details>
    </v-dialog>
  </v-layout>
  <!-- </div> -->
</template>
<script>
import TicketDetails from "../../../components/Other/TicketDetails";
import TicketService from "../../../services/ticket-service";
import DatePicker from "../../../components/control/DatePicker";
import ProgressLinear from "../../../components/control/ProgressLinear";
import store from "../../../store";
import ButtonGrid from "../../../components/control/ButtonGrid";
export default {
  components: {
    "app-ticket-details": TicketDetails,
    DatePicker,
    ProgressLinear,
    ButtonGrid
  },
  data() {
    return {
      search: "",
      pagination: {
        descending: true,
        sortBy: "CreatedDate"
      },
      headers: [
        { text: "Created Date", value: "CreatedDate", width: "20%" },
        { text: "ID", value: "Id", width: "10%" },
        { text: "Title", value: "Title", width: "20%" },
        { text: "Support Group", value: "SupportGroup", width: "10%" },
        { text: "Resolved By", value: "ResolvedBy", width: "20%" },
        {
          text: "Resolution Description",
          value: "ResolutionDescription",
          width: "20%"
        },
        { text: "", value: "", width: "5%" }
      ],

      tickets: [],
      ticketDetail: [],
      isLoading: true,
      page: 1,
      perPage: 100,
      total: 100,
      entries: 100,
      showingOffset: 1,
      showingEntries: 100,
      filterInput: "",
      orderBy: "Date",
      order: "desc",
      view: "",
      viewDialog: false,
      ticketId: ""
    };
  },
  created: function() {
    store.commit("setCurrentScreenName", "Priority");
  },
  mounted() {
    this.fetchPriorityTicketsByDateRange();
  },
  watch: {
    "$store.getters.sync": {
      immediate: true,
      handler() {
        //alert("Priority");
        if (this.$store.getters.sync) {
          this.timer = setInterval(
            this.fetchPriorityTicketsByDateRange,
            this.$store.getters.syncTime
          );
        } else {
          this.cancelAutoUpdate();
        }
      }
    }
  },
  computed: {
    filteredTickets() {
      return this.tickets.filter(
        ticket =>
          _.includes(this.$store.getters.filterTree, ticket.SupportGroup) &&
          _.includes(
            this.$store.getters.filterLocation,
            ticket.Property_Location
          )
      );
    }
  },
  methods: {
    async fetchPriorityTicketsByDateRange() {
      //alert("here");
      //Validate Date From And To
      var strCurrentDate = new Date(
        `${this.$store.getters.startDate}T00:00:00`
      );
      var strNewEndDate = new Date(`${this.$store.getters.endDate}T23:59:59`);
      var difference = strNewEndDate - strCurrentDate;

      if (difference < 0) {
        alert("Please select date end should be greater than start date");
      } else {
        this.isLoading = true;
        this.tickets = [];
        const res = await TicketService.getPriorityTicketsByDateRange({
          start_date: `${this.$store.getters.startDate}T00:00:00`,
          end_date: `${this.$store.getters.endDate}T23:59:59`
        })
          .then(res => {
            this.tickets = res.data;
            this.isLoading = false;
          })
          .catch(error => {
            this.isLoading = false;
          });
      }
    },
    filterBy(list, val) {
      if (val) {
        val = val.toLowerCase();
        let searchData = list.filter(ticket => {
          var Id = ticket.Id == undefined ? "" : ticket.Id;
          var Title = ticket.Title == undefined ? "" : ticket.Title;
          var SupportGroup =
            ticket.SupportGroup == undefined ? "" : ticket.SupportGroup;
          var ResolvedBy =
            ticket.ResolvedBy == undefined ? "" : ticket.ResolvedBy;
          var ResolutionDescription =
            ticket.ResolutionDescription == undefined
              ? ""
              : ticket.ResolutionDescription;

          return (
            Id.toLowerCase().indexOf(val) > -1 ||
            Title.toLowerCase().indexOf(val) > -1 ||
            SupportGroup.toLowerCase().indexOf(val) > -1 ||
            ResolvedBy.toLowerCase().indexOf(val) > -1 ||
            ResolutionDescription.toLowerCase().indexOf(val) > -1
          );
        });

        return searchData;
      }
      return list;
    },
    btnView(id) {
      this.ticketId = id;
      this.viewDialog = true;
    },
    closeViewDialog() {
      this.viewDialog = false;
    },
    cancelAutoUpdate() {
      clearInterval(this.timer);
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