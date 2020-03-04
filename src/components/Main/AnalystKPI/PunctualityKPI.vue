<template>
  <layout-one :title="'Punctuality'" :breadcrumbsItems="breadcrumbsItems">
    <v-layout row wrap>
      <v-flex lg2>
        <v-combobox
          class="pt-3 pl-1"
          v-model="selectTicketResolver"
          :items="itemsTicketResolver"
          label="Select an analyst"
          item-text="text"
          item-value="value"
        ></v-combobox>
      </v-flex>
      <v-flex lg8>
        <v-card>
          <date-picker @getResults="fetchResolvedTicketWithFeedback"/>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex lg12>
        <v-card>
          <v-card-title>
            <v-toolbar-title>Details</v-toolbar-title>
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
            :headers="headers"
            :items="filteredListOfRecord"
            :search="search"
            :loading="isLoading"
            :pagination.sync="pagination"
          >
            <template slot="items" slot-scope="props">
              <tr :class="{ 'red lighten-3': isDanger(props.item) }">
                <td class="text-xs-left">{{ props.item.AgentName }}</td>
                <td class="text-xs-left">{{ props.item.RosterDateTime }}</td>
                <td class="text-xs-left">{{ props.item.TimeIn }}</td>
                <td class="text-xs-left">{{ props.item.LateOrNot }}</td>
              </tr>
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
  </layout-one>
</template>

<script>
import Application from "../../../services/application-service";
import DatePicker from "../../../components/control/DatePicker";
import ProgressLinear from "../../../components/control/ProgressLinear";
import LayoutOne from "../../../components/control/layout/LayoutOne";
import axios from "axios";
export default {
  data() {
    return {
      breadcrumbsItems: [
        {
          text: "Dashboard",
          disabled: false,
          href: "#/Home"
        },
        {
          text: "Analyst KPI",
          disabled: false,
          href: "#/AnalystKPI"
        },
        {
          text: "Punctuality",
          disabled: true
        }
      ],

      pagination: {
        // descending: true,
        // sortBy: "CreatedDate",
        rowsPerPage: 10
      },
      search: "",
      headers: [
        { text: "Analyst", value: "AgentName", width: "25%" },
        { text: "Roster Date Time", value: "RosterDateTime", width: "25%" },
        { text: "Login Time", value: "LoginTime", width: "25%" },
        { text: "Late Or Not", value: "LateOrNot", width: "25%" }
      ],

      selectTicketResolver: [],
      itemsTicketResolver: [],

      tickets: [],
      isAllow: true,
      filterInput: "",
      startDate: "",
      endDate: "",
      listOfRecords: [],
      isLoading: false
    };
  },
  created: function() {
    this.getTicketResolver();
    this.fetchResolvedTicketWithFeedback();
  },
  computed: {
    filteredListOfRecord() {
      var result = null;
      //if (this.selectTicketResolver.length != 0) {
      result = this.listOfRecords.filter(
        data =>
          data.AgentEmailName.toLowerCase() ==
          this.selectTicketResolver.value.toLowerCase()
      );
      //}
      return result;
    }
  },
  methods: {
    isDanger(obj) {
      var isTrue = false;
      var val = obj.LateOrNot;

      if (val == "Late") {
        isTrue = true;
      } else if (val == undefined) {
        isTrue = true;
      }
      return isTrue;
    },
    getTicketResolver: function() {
      axios({
        method: "get",
        url: this.$urlApplication + "general/GetAgentUserList"
      })
        .then(res => {
          this.itemsTicketResolver = [];
          var IsSelect = true;

          // this.itemsTicketResolver.push({
          //   value: 'A',
          //   text: 'All'
          // });

          for (let items of res.data) {
            var result = {
              value: items.Email,
              text: items.FirstName
            };

            // var v1 =items.FirstName;
            // var v2 = this.$route.query.id;

            // debugger

            if (items.Email == this.$route.query.id) {
              this.selectTicketResolver = {
                value: items.Email,
                text: items.FirstName
              };
              //IsSelect = false;
            }

            this.itemsTicketResolver.push(result);
          }
        })
        .catch(error => {});
    },
    changeRowBGColor(LateOrNot) {
      var result = "";
      if (LateOrNot == "Late") {
        result = "rgb(255,153,153)";
      }
      return result;
    },
    fetchResolvedTicketWithFeedback() {
      this.isLoading = true;
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
          this.isLoadingServiceDesk = false;
          const res = Application.getAttendanceSheetByDateRange({
            start_date: strCurrentDate,
            end_date: strNewEndDate
          })
            .then(res => {
              this.listOfRecords = res.data;
              this.isLoading = false;
            })
            .catch(error => {
              this.isLoading = false;
            });
        } catch (err) {}
      }
    },
    filterBy(list, val) {
      if (val) {
        val = val.trim().toLowerCase();
        let searchData = list.filter(feedback => {
          var AgentName =
            feedback.AgentName == undefined ? "" : feedback.AgentName;
          var RosterDateTime =
            feedback.RosterDateTime == undefined ? "" : feedback.RosterDateTime;
          var LateOrNot =
            feedback.LateOrNot == undefined ? "" : feedback.LateOrNot;
          var TimeIn = feedback.TimeIn == undefined ? "" : feedback.TimeIn;

          var searchField = this.filterInput; // document.querySelector('#slcSearchField >div >input').value;

          if (searchField == "AgentName") {
            return (
              AgentName.toString()
                .toLowerCase()
                .indexOf(val) > -1
            );
          } else if (searchField == "RosterDateTime") {
            return RosterDateTime.toLowerCase().indexOf(val) > -1;
          } else if (searchField == "LateOrNot") {
            return LateOrNot.toLowerCase().indexOf(val) > -1;
          } else if (searchField == "TimeIn") {
            return (
              TimeIn.toString()
                .toLowerCase()
                .indexOf(val) > -1
            );
          } else {
            return (
              AgentName.toString()
                .toLowerCase()
                .indexOf(val) > -1 ||
              RosterDateTime.toLowerCase().indexOf(val) > -1 ||
              LateOrNot.toLowerCase().indexOf(val) > -1 ||
              TimeIn.toLowerCase().indexOf(val) > -1
            );
          }
        });

        return searchData;
      }
      return list;
    }
  },
  // beforeMount() {
  //   this.fetchResolvedTicketWithFeedback();
  // },
  components: {
    DatePicker,
    ProgressLinear,
    LayoutOne
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