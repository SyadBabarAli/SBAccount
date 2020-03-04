<template>
  <v-layout row wrap class="pa-2">
    <v-flex lg12 class="mt-12">
      <v-card class="black--text elevation-5">
        <v-layout>
          <v-flex lg12 class="pa-0">
            <v-card-title
              class="headline grey lighten-3 pa-1 ma-0"
              primary-title
            >Service Desk (3434) Statistics</v-card-title>
            <v-layout class="pa-1">
              <v-flex lg12>
                <service-desk-statistics-chart-line-statistics :data="filterdRecord" />
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
                    :items="filterdRecord"
                    :search="search"
                    :loading="isLoading"
                    :pagination.sync="pagination"
                  >
                    <template slot="items" slot-scope="props">
                      <td class="text-xs-left">{{ props.item.Date1 | momentDateOnly }}</td>
                      <td class="text-xs-left">{{ props.item.TotalAbandonedCalls }}</td>
                      <td class="text-xs-left">{{ props.item.ServiceLevel60s }}</td>

                      <td class="text-xs-left">{{ parseInt(props.item.CallsReceivedInOpenState) }}</td>
                      <td class="text-xs-left">{{ parseInt(props.item.CallsServedByAgent) }}</td>

                      <td class="text-xs-left">{{ (isNaN(props.item.CallDurationAvgMinute) ? 0 : props.item.CallDurationAvgMinute).toFixed(2) }}</td>

                      <!-- <td class="text-xs-left">{{ parseInt(props.item.SimultaneousHelpDesk) }}</td>
                      <td class="text-xs-left">{{ parseInt(props.item.SimultaneousExternal) }}</td> -->

                      <td class="text-xs-left">{{ parseInt(props.item.OverallNumberOfAbandons) }}</td>
                      <td class="text-xs-left">{{ parseInt(props.item.AbandonsBefore5Seconds) }}</td>
                      <td class="text-xs-left">{{ parseInt(props.item.AbandonsBefore15Seconds) }}</td>
                      <td class="text-xs-left">{{ parseInt(props.item.AbandonsBefore30Seconds) }}</td>
                      <td class="text-xs-left">{{ parseInt(props.item.AbandonsBefore60Seconds) }}</td>
                      <td class="text-xs-left">{{ parseInt(props.item.AbandonedAfter60Seconds) }}</td>

                      <!-- <td
                        class="text-xs-left"
                      >{{ parseInt(props.item.AvgWaitDurationOfAbandonedCallHelpDesk) }}</td>
                      <td
                        class="text-xs-left"
                      >{{ parseInt(props.item.AvgWaitDurationOfAbandonedSimultaneousExternal) }}</td> -->

                      <td>
                        <button-grid
                          :description="'View'"
                          @Click="btnView(props.item.HelpDeskCallID)"
                        />
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
      </v-card>
    </v-flex>
    <v-dialog v-model="viewDialog" scrollable>
      <app-data-details :id="id" @Click="closeViewDialog"></app-data-details>
    </v-dialog>
  </v-layout>
</template>
<script>
import ModalDetail from "../../../components/Main/ServiceDeskStatistic/ModalDetail";
import ServiceDeskStatisticsChartLineStatistics from "../../../components/Main/ServiceDeskStatistic/AbandonedCallChart";
import CallStatisticsService from "../../../services/callstatustics-service";
import { mixins } from "../../../mixins/CustomMixins";
import ButtonGrid from "../../../components/control/ButtonGrid";
export default {
  mixins: [mixins],
  components: {
    ServiceDeskStatisticsChartLineStatistics,
    "app-data-details": ModalDetail,
    ButtonGrid
  },
  data() {
    return {
      search: "",
      pagination: {
        descending: true,
        sortBy: "Date1"
      },
      headers: [
        {
          text: "Help Desk Call Id",
          value: "HelpDeskCallID",
          class: "csmHide"
        },
        { text: "Created Date", value: "Date1", width: "20%" },
        {
          text: "Abandoned Calls",
          value: "TotalAbandonedCalls",
          width: "10%"
        },
        { text: "Service Level 60s", value: "ServiceLevel60s", width: "20%" },
        {
          text: "Received",
          value: "CallsReceivedInOpenState"
        },
        { text: "Served", value: "CallsServedByAgent" },
        { text: "Call Duration Avg Minutes", value: "CallDurationAvgMinute" },
        // {
        //   text: "Simultaneous HelpDesk",
        //   value: "SimultaneousHelpDesk"
        // },
        // {
        //   text: "Simultaneous External",
        //   value: "SimultaneousExternal"
        // },
        {
          text: "Number Of Abandoned",
          value: "OverallNumberOfAbandons"
        },
        { text: "Abandoned 5 Sec", value: "AbandonsBefore5Seconds" },
        {
          text: "Abandoned 15 Sec",
          value: "AbandonsBefore15Seconds"
        },
        {
          text: "Abandoned 30 Sec",
          value: "AbandonsBefore30Seconds"
        },
        {
          text: "Abandoned 60 Sec",
          value: "AbandonsBefore60Seconds"
        },
        {
          text: "Abandoned After 60 Sec",
          value: "AbandonedAfter60Seconds"
        },
        // {
        //   text: "Avg Wait Duration Of Abandoned Call",
        //   value: "AvgWaitDurationOfAbandonedCallHelpDesk"
        // },
        // {
        //   text: "Avg Wait Duration Of Abandoned Call",
        //   value: "AvgWaitDurationOfAbandonedSimultaneousExternal"
        // },

        { text: "", value: "", width: "5%" }
      ],

      listOfRecord: [],
      isLoading: true,

      view: "",
      viewDialog: false,
      id: "0"
    };
  },
  created() {
    this.fetchCallAbandonStatisticsByDateRange();
  },
  computed: {
    filterdRecord() {
      var result = this.listOfRecord;
      return result;
    }
  },
  methods: {
    async fetchCallAbandonStatisticsByDateRange() {
      this.isLoading = false;
      const res = await CallStatisticsService.getCallAbandonStatisticsByDateRange(
        {
          //start_date: `2019-08-11T00:00:00`,
          //end_date: `2019-08-11T23:59:59`
           start_date: `2018-01-01T00:00:00`,
           end_date: `2020-12-31T23:59:59`
        }
      )
        .then(res => {
          this.listOfRecord = res.data;
          this.isLoading = false;
        })
        .catch(error => {
          this.isLoading = false;
          console.log(error);
        });
    },

    filterBy(list, val) {
      if (val) {
        val = val.toLowerCase();
        let searchData = list.filter(data => {
          var Date1 = data.Date1 == undefined ? "" : data.Date1;
          return Date1.toLowerCase().indexOf(val) > -1;
        });
      }
    },
    btnView(id) {
      this.id = id;
      this.viewDialog = true;
    },
    closeViewDialog() {
      this.viewDialog = false;
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