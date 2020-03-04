<template>
  <layout-one :title="'Quality Indicator'" :breadcrumbsItems="breadcrumbsItems">
    <v-layout class="pa-1">
      <!-- <v-breadcrumbs :items="items" divider=">"></v-breadcrumbs> -->
      <v-flex lg2>
        <v-combobox
          class="pt-3 pl-1"
          v-model="selectTicketResolver"
          :items="itemsTicketResolver"
          label="Select an analyst"
          item-text="text"
          item-value="value"
          v-on:change="fetchQualityIndicator"
        ></v-combobox>
      </v-flex>
      <v-flex lg8>
        <date-picker @getResults="fetchQualityIndicator"/>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex lg12>
        <v-card>
          <v-layout>
            <v-flex lg12>
              <v-card>
                <v-card-title>
                  <v-toolbar-title>Summary</v-toolbar-title>
                  <download-excel
                    name="QualityIndicatorKPI.xls"
                    type="xls"
                    :fields="json_fields"
                    :data="excelExport(listOfRecord, search)"
                  >
                    <v-btn
                      small
                      :loading="exportLoading"
                      :disabled="exportLoading"
                      color="colorLight"
                      class="colorDark white--text font-weight-light"
                      @click="loader = 'exportLoading'"
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
                  :headers="headers"
                  :items="listOfRecord"
                  class="elevation-3"
                  :search="search"
                  :pagination.sync="pagination"
                >
                  <template slot="no-data">
                    <v-progress-linear slot="progress" indeterminate v-if="isLoading"></v-progress-linear>
                  </template>

                  <template slot="items" slot-scope="props">
                    <td>{{ props.item.QualityIndicatorId }}</td>
                    <td class="text-xs-left">{{ props.item.ReportedDate | momentConvertDate }}</td>
                    <!-- <td class="text-xs-left">{{ props.item.AgentName }}</td> -->
                    <td class="text-xs-left">{{ props.item.Description }}</td>
                    <td class="text-xs-left">{{ props.item.Score }}</td>
                    <td class="text-xs-left">{{ props.item.RefNo }}</td>
                    <td class="text-xs-left">{{ props.item.SupervisorRemarks }}</td>
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
        </v-card>
      </v-flex>
    </v-layout>
  </layout-one>
</template>
<script>
import LayoutOne from "../../../components/control/layout/LayoutOne";
import DatePicker from "../../../components/control/DatePicker";
import ProgressLinear from "../../../components/control/ProgressLinear";
import ProgressCircular from "../../../components/control/ProgressCircular";
import store from "../../../store";
import ButtonSmall from "../../../components/control/ButtonSmall";
import axios from "axios";

export default {
  components: {
    LayoutOne,
    DatePicker,
    ProgressLinear,
    ButtonSmall,
    ProgressCircular
  },
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
          text: "Quality Indicator",
          disabled: true
        }
      ],

      isLoading: true,
      exportLoading: false,
      listOfRecord: [],
      selectTicketResolver: [],
      itemsTicketResolver: [],

      pagination: {
        rowsPerPage: -1,
        descending: false,
        sortBy: "TicketCreatedDate"
      },

      search: "",
      headers: [
        {
          text: "ID",
          value: "QualityIndicatorId"
        },
        { text: "Reported Date", value: "ReportedDate" },
        //{ text: "Agent", value: "AgentName" },
        { text: "Category", value: "Description" },
        { text: "Score", value: "Score" },
        { text: "Ref No", value: "RefNo" },
        { text: "CSD Remarks", value: "SupervisorRemarks" }
      ],

      json_fields: {
        ID: "QualityIndicatorId",
        "Reported Date": {
          field: "ReportedDate",
          callback: value => {
            var result =
              value != null && value != undefined
                ? value.replace("T", " ")
                : value;
            return result;
          }
        },
        Agent: "AgentName",
        Category: "Description",
        Score: "Score",
        "Ref No": "RefNo",
        "CSD Remarks": "SupervisorRemarks"
      }
    };
  },
  created: function() {
    store.commit("setCurrentScreenName", "QualityIndicatorKPI");
    this.getTicketResolver();
    this.fetchQualityIndicator();
  },

  computed: {
    filteredRecord() {
      var result = null;
      result = this.listOfRecord.filter(
        data =>
          data.AgentEmailName.toLowerCase() ==
          this.selectTicketResolver.value.toLowerCase()
      );
      return result;
    }
  },
  methods: {
    filterBy(list, val) {
      if (val) {
        //debugger
        val = val.trim().toLowerCase();
        let searchData = list.filter(feedback => {
          var QualityIndicatorId =
            feedback.QualityIndicatorId == undefined
              ? ""
              : feedback.QualityIndicatorId;
          var ReportedDate =
            feedback.ReportedDate == undefined ? "" : feedback.ReportedDate;
          var AgentName =
            feedback.AgentName == undefined ? "" : feedback.AgentName;
          // var NameQualityKPI =
          //   feedback.NameQualityKPI == undefined ? "" : feedback.NameQualityKPI;
          var Description =
            feedback.Description == undefined ? "" : feedback.Description;
          var Score = feedback.Score == undefined ? "" : feedback.Score;
          var RefNo = feedback.RefNo == undefined ? "" : feedback.RefNo;
          var SupervisorRemarks =
            feedback.SupervisorRemarks == undefined
              ? ""
              : feedback.SupervisorRemarks;
          var FirstName =
            feedback.FirstName == undefined ? "" : feedback.FirstName;

          var RequestType =
            feedback.RequestType == undefined ? "" : feedback.RequestType;

          var searchField = this.search;

          return (
            QualityIndicatorId.toString()
              .toLowerCase()
              .indexOf(val) > -1 ||
            ReportedDate.toLowerCase().indexOf(val) > -1 ||
            AgentName.toLowerCase().indexOf(val) > -1 ||
            //  NameQualityKPI.toLowerCase().indexOf(val) > -1 ||
            Description.toLowerCase().indexOf(val) > -1 ||
            Score.toString()
              .toLowerCase()
              .indexOf(val) > -1 ||
            RefNo.toString()
              .toLowerCase()
              .indexOf(val) > -1
            //|| RequestType.toLowerCase().indexOf(val) > -1
          );
        });

        return searchData;
      }
      return list;
    },

    excelExport(data, input) {
      var result = [];
      result = this.filterBy(data, input);
      return result;
    },
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

            if (items.Email == this.$route.query.id) {
              this.selectTicketResolver = {
                value: items.Email,
                text: items.FirstName
              };
            }

            this.itemsTicketResolver.push(result);
          }
        })
        .catch(error => {});
    },

    fetchQualityIndicator() {
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
        var strNewEndDate = `${this.$store.getters.endDate} 23:59:59.999`;

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
            "AgentKPI/GetQualityIndicatorsKPI?dateFrom=" +
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