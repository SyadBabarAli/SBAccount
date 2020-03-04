<template>
  <v-card>
    <v-card-title class="headline grey lighten-2" primary-title>Details</v-card-title>
    <v-layout row wrap>
      <v-flex class="text-md-center" lg12>
        <service-desk-statistics-detail-chart-line-statistics-detail
          :data="filterdRecordCallStatisticsDetail"
        />
      </v-flex>
    </v-layout>
    <v-divider></v-divider>
    <v-card-text>
      <v-data-table
        must-sort
        :headers="headers"
        :items="filterdRecordCallStatisticsDetail"
        :search="search"
        :loading="isLoading2"
        :pagination.sync="pagination"
      >
        <template slot="items" slot-scope="props">
          <td
            class="text-xs-left"
          >{{ props.item.TimeFrom | momentTime }} - {{ props.item.TimeTo | momentTime}}</td>
          <td class="text-xs-left">{{ parseInt(props.item.CallsReceivedInOpenState) }}</td>
          <td class="text-xs-left">{{ parseInt(props.item.CallsServedByAgent) }}</td>
          <td class="text-xs-left">{{ parseInt(props.item.MaximumNumberOfSimultaneousCalls) }}</td>
          <td class="text-xs-left">{{ parseInt(props.item.OverallNumberOfAbandons) }}</td>
          <td class="text-xs-left">{{ parseInt(props.item.AbandonsBefore5Seconds) }}</td>
          <td class="text-xs-left">{{ parseInt(props.item.AbandonsBefore15Seconds) }}</td>
          <td class="text-xs-left">{{ parseInt(props.item.AbandonsBefore30Seconds) }}</td>
          <td class="text-xs-left">{{ parseInt(props.item.AbandonsBefore60Seconds) }}</td>
          <td class="text-xs-left">{{ parseInt(props.item.AbandonedAfter60Seconds) }}</td>
          <td
            class="text-xs-left"
          >{{ props.item.AverageWaitingDurationOfAbandonedCalls > 0 ? (props.item.AverageWaitingDurationOfAbandonedCalls/60).toFixed(2):'' }}</td>
          <td class="text-xs-left">{{ parseInt(props.item.Asim) }}</td>
          <td class="text-xs-left">{{ parseInt(props.item.Faisal) }}</td>
          <td class="text-xs-left">{{ parseInt(props.item.Hamza) }}</td>
          <td class="text-xs-left">{{ parseInt(props.item.Hiba) }}</td>
          <td class="text-xs-left">{{ parseInt(props.item.Hina) }}</td>
          <td class="text-xs-left">{{ parseInt(props.item.Irma) }}</td>
          <td class="text-xs-left">{{ parseInt(props.item.Jonathan) }}</td>
          <td class="text-xs-left">{{ parseInt(props.item.Hasnain) }}</td>
          <td class="text-xs-left">{{ parseInt(props.item.Ali) }}</td>
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
      <v-btn flat @click="onClick">Close</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import CallStatisticsService from "../../../services/callstatustics-service";
import ServiceDeskStatisticsDetailChartLineStatisticsDetail from "../../../components/Main/ServiceDeskStatistic/CallChart";

export default {
  components: {
    ServiceDeskStatisticsDetailChartLineStatisticsDetail
  },
  props: ["id"],
  data() {
    return {
      search: "",
      pagination: {
        descending: true,
        sortBy: "DateTimeTo"
      },
      headers: [
        { text: "Time Duration", value: "TimeFrom" },
        {
          text: "Received",
          value: "CallsReceivedInOpenState"
        },
        { text: "Served", value: "CallsServedByAgent" },
        {
          text: "Simultaneous",
          value: "MaximumNumberOfSimultaneousCalls"
        },
        {
          text: "Abandons",
          value: "OverallNumberOfAbandons"
        },
        { text: "Abandons 5 Sec", value: "AbandonsBefore5Seconds" },
        {
          text: "Abandons 15 Sec",
          value: "AbandonsBefore15Seconds"
        },
        {
          text: "Abandons 30 Sec",
          value: "AbandonsBefore30Seconds"
        },
        {
          text: "Abandons 60 Sec",
          value: "AbandonsBefore60Seconds"
        },
        {
          text: "Abandoned After 60 Sec",
          value: "AbandonedAfter60Seconds"
        },
        {
          text: "Avg Wait Duration Of Abandoned Call",
          value: "AverageWaitingDurationOfAbandonedCalls"
        },
        { text: "Asim", value: "Asim" },
        { text: "Faisal", value: "Faisal" },
        { text: "Hamza", value: "Hamza" },
        { text: "Hiba", value: "Hiba" },
        { text: "Hina", value: "Hina" },
        { text: "Irma", value: "Irma" },
        { text: "Jonathan", value: "Jonathan" },
        { text: "Hasnain", value: "Hasnain" },
        { text: "Ali", value: "Ali" },
        //{text:"Babar",value:"Syed Babar Ali"}
      ],

      listOfRecord: {},
      isLoadingGraph: false,

      listOfRecord2: [],
      isLoading2: true
    };
  },
  created : function ()
  {
    //  var v1 = this.headers;
    //  this.headers.push({text:"Babar",value:"Syed Babar Ali"});

    //  debugger
     //alert('123');
  },
  watch: {
    id: function() {
      this.getCallAbandonStatisticsDetail();
      this.getCallStatisticsDetail();
    }
  },
  computed: {
    filterdRecordCallStatisticsDetail() {
      var result = this.listOfRecord2;
      return result;
    },

    filterdRecord() {
      var result = this.listOfRecord;
      return result;
    }
  },
  methods: {
    onClick() {
      this.$emit("Click");
    },
    async getCallAbandonStatisticsDetail() {
      this.isLoadingGraph = true;
      const res = await CallStatisticsService.getCallAbandonStatisticsDetail(
        this.id
      );
      this.listOfRecord = res.data;
      this.isLoadingGraph = false;
    },
    async getCallStatisticsDetail() {
      this.isLoading2 = true;
      const res = await CallStatisticsService.getCallStatisticsDetail(this.id);
      this.listOfRecord2 = res.data;
      this.isLoading2 = false;
    },
    filtered(list, val) {
      if (val) {
        val = val.toLowerCase();
        let searchData = list.filter(data => {
          var DateTimeTo = data.DateTimeTo == undefined ? "" : data.DateTimeTo;
          var Pilot = data.Pilot == undefined ? "" : data.Pilot;
          var AgentName = data.AgentName == undefined ? "" : data.AgentName;
          var CallsReceivedInOpenState =
            data.CallsReceivedInOpenState == undefined
              ? ""
              : data.CallsReceivedInOpenState;
          var CallsServedByAgent =
            data.CallsServedByAgent == undefined ? "" : data.CallsServedByAgent;
          var MaximumNumberOfSimultaneousCalls =
            data.MaximumNumberOfSimultaneousCalls == undefined
              ? ""
              : data.MaximumNumberOfSimultaneousCalls;
          var OverallNumberOfAbandons =
            data.OverallNumberOfAbandons == undefined
              ? ""
              : data.OverallNumberOfAbandons;
          var AbandonsBefore5Seconds =
            data.AbandonsBefore5Seconds == undefined
              ? ""
              : data.AbandonsBefore5Seconds;
          var AbandonsBefore15Seconds =
            data.AbandonsBefore15Seconds == undefined
              ? ""
              : data.AbandonsBefore15Seconds;
          var AbandonsBefore30Seconds =
            data.AbandonsBefore30Seconds == undefined
              ? ""
              : data.AbandonsBefore30Seconds;
          var AbandonsBefore60Seconds =
            data.AbandonsBefore60Seconds == undefined
              ? ""
              : data.AbandonsBefore60Seconds;

          return (
            DateTimeTo.toString()
              .toLowerCase()
              .indexOf(val) > -1 ||
            Pilot.toString()
              .toLowerCase()
              .indexOf(val) > -1 ||
            AgentName.toString()
              .toLowerCase()
              .indexOf(val) > -1 ||
            CallsReceivedInOpenState.toString()
              .toLowerCase()
              .indexOf(val) > -1 ||
            CallsServedByAgent.toString()
              .toLowerCase()
              .indexOf(val) > -1 ||
            MaximumNumberOfSimultaneousCalls.toString()
              .toLowerCase()
              .indexOf(val) > -1 ||
            OverallNumberOfAbandons.toString()
              .toLowerCase()
              .indexOf(val) > -1 ||
            AbandonsBefore5Seconds.toString()
              .toLowerCase()
              .indexOf(val) > -1 ||
            AbandonsBefore15Seconds.toString()
              .toLowerCase()
              .indexOf(val) > -1 ||
            AbandonsBefore30Seconds.toString()
              .toLowerCase()
              .indexOf(val) > -1 ||
            AbandonsBefore60Seconds.toString()
              .toLowerCase()
              .indexOf(val) > -1
          );
        });
      }
    }
  }
};
</script>
