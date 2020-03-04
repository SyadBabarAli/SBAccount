<template>
  <layout-one :title="'Analyst KPI'" :breadcrumbsItems="breadcrumbsItems">
    <v-layout class="pa-1">
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
        <date-picker @getResults="fetchAgentKPIAttendance" />
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex lg12>
        <v-card>
          <v-container fluid grid-list-md>
            <v-layout row wrap pb-3>
              <v-flex d-flex xs12 sm6 md4 text-xs-center>
                <v-card>
                  <h4 class="grey lighten-3 body-1">Punctuality</h4>
                  <v-divider></v-divider>
                  <v-layout row wrap style="height:145px" align-center>
                    <v-flex lg12 class="pt-1 ma-1">
                      <v-flex lg12>
                        <progress-circular v-if="isLoading" />
                        <div
                          class="csmheadline font-weight-light display-2"
                          v-else
                        >{{getAnaylstKPIPercentage}}%</div>
                      </v-flex>
                    </v-flex>
                  </v-layout>
                  <v-layout>
                    <v-flex lg12 class="pb-1 mb-1">
                      <button-small
                        :link="'/PunctualityKPI?id='+selectTicketResolver.value "
                        :desciption="'View Detail'"
                      />
                    </v-flex>
                  </v-layout>
                </v-card>
              </v-flex>

              <v-flex d-flex xs12 sm6 md4 text-xs-center>
                <v-card>
                  <h4 class="grey lighten-3 body-1">Call To Ticket</h4>
                  <v-divider></v-divider>
                  <v-layout row wrap style="height:145px" align-center>
                    <v-flex lg12 class="pt-1 ma-1">
                      <v-flex lg12>
                        <progress-circular v-if="isLoading" />
                        <div
                          class="csmheadline font-weight-light display-2"
                          v-else
                        >{{getCallToTicketPercentage}}%</div>
                      </v-flex>
                    </v-flex>
                  </v-layout>
                  <v-layout>
                    <v-flex lg12 class="pb-1 mb-1">
                      <button-small
                        :link="'/CallToTicketKPI?id='+selectTicketResolver.value "
                        :desciption="'View Detail'"
                      />
                    </v-flex>
                  </v-layout>
                </v-card>
              </v-flex>

              <v-flex d-flex xs12 sm6 md4 text-xs-center>
                <v-card>
                  <h4 class="grey lighten-3 body-1">Quality Indicator</h4>
                  <v-divider></v-divider>
                  <v-layout row wrap style="height:145px" align-center>
                    <v-flex lg12 class="pt-1 ma-1">
                      <v-flex lg12>
                        <progress-circular v-if="isLoading" />
                        <div
                          class="csmheadline font-weight-light display-2"
                          v-else
                        >{{getQualityIndicatorPercentage}}%</div>
                      </v-flex>
                    </v-flex>
                  </v-layout>
                  <v-layout>
                    <v-flex lg12 class="pb-1 mb-1">
                      <button-small
                        :link="'/QualityIndicatorKPI?id='+selectTicketResolver.value "
                        :desciption="'View Detail'"
                      />
                    </v-flex>
                  </v-layout>
                </v-card>
              </v-flex>

              <v-flex d-flex xs12 sm6 md4 text-xs-center>
                <v-card>
                  <h4 class="grey lighten-3 body-1">Customer Satisfaction</h4>
                  <v-divider></v-divider>
                  <v-layout row wrap style="height:145px" align-center>
                    <v-flex lg12 class="pt-1 ma-1">
                      <v-flex lg12>
                        <progress-circular v-if="isLoading" />
                        <div
                          class="csmheadline font-weight-light display-2"
                          v-else
                        >{{((getCustomerSatisfactionKPIPercentage/5)*100).toFixed(2)}}%</div>
                      </v-flex>
                    </v-flex>
                  </v-layout>
                  <v-layout>
                    <v-flex lg12 class="pb-1 mb-1"></v-flex>
                  </v-layout>
                </v-card>
              </v-flex>

              <v-flex d-flex xs12 sm6 md4 text-xs-center>
                <v-card>
                  <h4 class="grey lighten-3 body-1">Call Abandoned</h4>
                  <v-divider></v-divider>
                  <v-layout row wrap style="height:145px" align-center>
                    <v-flex lg12 class="pt-1 ma-1">
                      <v-flex lg12>
                        <progress-circular v-if="isLoading" />
                        <div
                          class="csmheadline font-weight-light display-2"
                          v-else
                        >{{getCallAbandonedKPIPercentage}}%</div>
                      </v-flex>
                    </v-flex>
                  </v-layout>
                  <v-layout>
                    <v-flex lg12 class="pb-1 mb-1"></v-flex>
                  </v-layout>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex lg12>
        <v-card>
          <v-card-title>
            <v-toolbar-title>Summary</v-toolbar-title>
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
            :items="filteredRecord"
            :search="search"
            :pagination.sync="pagination"
          >
            <template slot="no-data" v-if="isLoading">
              <v-progress-linear slot="progress" indeterminate></v-progress-linear>
            </template>
            <template slot="items" slot-scope="props">
              <td class="text-xs-left">{{ props.item.AgentName }}</td>
              <td
                class="text-xs-left"
              >{{ props.item.AttendancePercentage == undefined ? 0 : props.item.AttendancePercentage.toFixed(2) }}</td>
              <td
                class="text-xs-left"
              >{{ props.item.CallToTicketPercentage == undefined ? 0 : props.item.CallToTicketPercentage.toFixed(2) }}</td>
              <td class="text-xs-left">{{ props.item.QualityIndicatorPercentage }}</td>
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
import TicketService from "../../../services/ticket-service";
import DatePicker from "../../../components/control/DatePicker";
import ProgressLinear from "../../../components/control/ProgressLinear";
import store from "../../../store";
import ButtonGrid from "../../../components/control/ButtonGrid";
import ProgressCircular from "../../../components/control/ProgressCircular";
import ButtonSmall from "../../../components/control/ButtonSmall";
import axios from "axios";
import CallStatustics from "../../../services/callstatustics-service";
import LayoutOne from "../../../components/control/layout/LayoutOne";
import CardOne from "../../../components/control/card/CardOne";

export default {
  components: {
    LayoutOne,
    DatePicker,
    ProgressLinear,
    ButtonGrid,
    ButtonSmall,
    ProgressCircular,
    CardOne
  },
  data() {
    return {
      labels: ["12am", "3am", "6am", "9am", "12pm", "3pm", "6pm", "9pm"],
      value: [200, 675, 410, 390, 310, 460, 250, 240],
      breadcrumbsItems: [
        {
          text: "Dashboard",
          disabled: false,
          href: "#/Home"
        },
        {
          text: "Analyst",
          disabled: true
        }
      ],
      selectTicketResolver: [],
      itemsTicketResolver: [],

      isAllow: false,

      search: "",
      pagination: {
        rowsPerPage: -1,
        descending: false,
        sortBy: "AgentName"
      },
      headers: [
        { text: "Analyst", value: "AgentName", width: "20%" },
        {
          text: "Attendance (%)",
          value: "AttendancePercentage",
          width: "20%"
        },
        {
          text: "Call To Ticket (%)",
          value: "CallToTicketPercentage",
          width: "20%"
        },
        {
          text: "Quality Indicator (%)",
          value: "QualityIndicatorPercentage",
          width: "20%"
        }
      ],
      listOfRecord: [],
      isLoading: true,
      AttendancePercentageAll: 0
    };
  },
  created: function() {
    this.getTicketResolver();
    this.fetchAgentKPIAttendance();
    store.commit("setCurrentScreenName", "AnalystKPI");
  },

  computed: {
    getCustomerSatisfactionKPIPercentage() {
      var result = 0;
      var objData = this.listOfRecord;
      var employeeIdSelected = this.selectTicketResolver.value;
      for (let items of objData) {
        var employeeId = items.AgentEmailName.toLowerCase();
        if (employeeIdSelected == employeeId) {
          result =
            items.CustomerSatisfactionPercentage == undefined
              ? 0
              : items.CustomerSatisfactionPercentage.toFixed(2);

          this.$store.commit(
            "setSelectedAnalyst",
            items.AgentEmailName.toLowerCase()
          );
          break;
        }
      }
      return result;
    },

    getCallAbandonedKPIPercentage() {
      var result = 0;
      var objData = this.listOfRecord;
      var employeeIdSelected = this.selectTicketResolver.value;
      for (let items of objData) {
        var employeeId = items.AgentEmailName.toLowerCase();
        if (employeeIdSelected == employeeId) {
          result =
            items.AbandonedCallPercentage == undefined
              ? 0
              : items.AbandonedCallPercentage.toFixed(2);
          break;
        }
      }
      return result;
    },

    getAnaylstKPIPercentage() {
      var result = 0;
      var objData = this.listOfRecord;
      var employeeIdSelected = this.selectTicketResolver.value;
      for (let items of objData) {
        var employeeId = items.AgentEmailName.toLowerCase();
        if (employeeIdSelected == employeeId) {
          result = items.AttendancePercentage.toFixed(2);
          break;
        }
      }
      return result;
    },

    getCallToTicketPercentage() {
      var result = 0;
      var objData = this.listOfRecord;
      var employeeIdSelected = this.selectTicketResolver.value;
      for (let items of objData) {
        var employeeId = items.AgentEmailName.toLowerCase();
        if (employeeIdSelected == employeeId) {
          result =
            items.CallToTicketPercentage == undefined
              ? 0
              : items.CallToTicketPercentage.toFixed(2);

          break;
        }
      }
      return result;
    },

    getQualityIndicatorPercentage() {
      var result = 0;
      var objData = this.listOfRecord;
      var employeeIdSelected = this.selectTicketResolver.value;
      for (let items of objData) {
        var employeeId = items.AgentEmailName.toLowerCase();
        if (employeeIdSelected == employeeId) {
          result =
            items.QualityIndicatorPercentage == undefined
              ? 0
              : items.QualityIndicatorPercentage.toFixed(2);
          break;
        }
      }
      return result;
    },

    filteredRecord() {
      return this.listOfRecord;
    }
  },
  methods: {
    getTicketResolver() {
      axios({
        method: "get",
        url: this.$urlApplication + "general/GetAgentUserList"
      })
        .then(res => {
          this.itemsTicketResolver = [];

          for (let items of res.data) {
            var result = {
              value: items.Email,
              text: items.FirstName
            };

            if (this.$store.getters.selectedAnalyst == "") {
              this.selectTicketResolver = {
                value: items.Email,
                text: items.FirstName
              };
              this.$store.commit(
                "setSelectedAnalyst",
                items.Email.toLowerCase()
              );
            } else {
              if (this.$store.getters.selectedAnalyst == items.Email) {
                this.selectTicketResolver = {
                  value: items.Email,
                  text: items.FirstName
                };
              }
            }

            this.itemsTicketResolver.push(result);
          }
        })
        .catch(error => {});
    },

    fetchAgentKPIAttendance() {
      //Validate Date From And To
      var strCurrentDate = new Date(
        `${this.$store.getters.startDate}T00:00:00`
      );
      var strNewEndDate = new Date(`${this.$store.getters.endDate}T23:59:59`);
      var difference = strNewEndDate - strCurrentDate;

      if (difference < 0) {
        alert("Please select date end should be greater than start date");
      } else {
        var strCurrentDate = `${this.$store.getters.startDate}T00:00:00`;
        var strNewEndDate = `${this.$store.getters.endDate} 23:59:59`;

        this.isLoading = true;
        this.listOfRecord = [];

        var employeeId =
          this.selectTicketResolver.value == undefined
            ? this.$route.query.id
            : this.selectTicketResolver.value;

        axios({
          method: "get",
          url:
            this.$urlApplication +
            "AgentKPI/GetAgentKPIAttendance?dateFrom=" +
            strCurrentDate +
            "&dateTo=" +
            strNewEndDate +
            "&userName=" +
            employeeId
        })
          .then(res => {
            this.listOfRecord = res.data;
            this.isLoading = false;
          })
          .catch(error => {
            this.isLoading = false;
            this.AttendancePercentageAll = 0;
          });
      }
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
.v-sheet--offset {
  top: -24px;
  position: relative;
}
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