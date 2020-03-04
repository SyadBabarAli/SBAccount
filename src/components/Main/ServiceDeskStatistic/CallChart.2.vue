<template>
  <v-layout>
    <v-flex lg12>
      <highcharts :options="options"></highcharts>
    </v-flex>
  </v-layout>
</template>

<script>
import { Chart } from "highcharts-vue";

export default {
  props: ["data"],
  data() {
    return {
      dateSelected: "",
      objSeries: [],
      isAbandonedCallRate: true,
      isAvgSpeedOfAnswer: true,
      arrayAbandonedCall: [],
      arrayServiceLevel: [],
      arrayAasim: [],
      arrayFaisal: [],
      arrayHamza: [],
      arrayHiba: [],
      arrayHina: [],
      arrayIrma: [],
      arrayJonathan: [],
      arrayHasnain: [],
      arrayAli: [],
      arrayCategories: [],
      options: {}
    };
  },
  created: function() {
    this.objSeries.push({
      name: "Aasim",
      type: "column",
      yAxis: 1,
      data: null
    });
  },
  watch: {
    data() {
      setTimeout(() => {
        this.setChart();
      }, 10);
    }
  },

  methods: {
    makeDataStructure() {

      var groups1 = _.groupBy(this.data, function(value) {
        return value.UserName;
      });

      var cntGroup = 0;
      for (var property in groups1) {
        cntGroup++;
      }

      debugger;

      // this.arrayAbandonedCall = [];
      // this.arrayServiceLevel = [];
      // this.arrayAasim = [];
      // this.arrayFaisal = [];
      // this.arrayHamza = [];
      // this.arrayHiba = [];
      // this.arrayHina = [];
      // this.arrayIrma = [];
      // this.arrayJonathan = [];
      // this.arrayHasnain = [];
      // this.arrayAli = [];
      // this.arrayCategories = [];
      // var objData = this.data;

      // // objData = _(objData)
      // //   .groupBy("UserName")
      // //   .map((objs, key) => ({
      // //     // A1 :objs.
      // //     // Month: key,
      // //     // TimeFrom :_.sumBy(TimeFrom),
      // //     // TimeTo:_.sumBy(TimeTo),
      // //     UserName: _.sumBy(objs, "UserName"),
      // //     //_(objs.UserName),
      // //     TimeFrom: objs["TimeFrom"],
      // //     TimeTo: (objs, "TimeTo"),
      // //     //UserName: _.sumBy(objs, "UserName"),
      // //     AgentStateLogged: _.sumBy(objs, "AgentStateLogged"),
      // //     TotalAbandonedCalls: _.sumBy(objs, "TotalAbandonedCalls"),
      // //     ServiceLevel60s: _.sumBy(objs, "ServiceLevel60s")

      // //     // CallsReceivedInOpenState: _.sumBy(objs, "CallsReceivedInOpenState"),
      // //     // CallsServedByAgent: _.sumBy(objs, "CallsServedByAgent"),
      // //     // MaximumNumberOfSimultaneousCalls: _.sumBy(
      // //     //   objs,
      // //     //   "MaximumNumberOfSimultaneousCalls"
      // //     // ),
      // //     // OverallNumberOfAbandons: _.sumBy(objs, "OverallNumberOfAbandons"),
      // //     // AbandonsBefore5Seconds: _.sumBy(objs, "AbandonsBefore5Seconds"),
      // //     // AbandonsBefore15Seconds: _.sumBy(objs, "AbandonsBefore15Seconds"),
      // //     // AbandonsBefore30Seconds: _.sumBy(objs, "AbandonsBefore30Seconds"),
      // //     // AbandonsBefore60Seconds: _.sumBy(objs, "AbandonsBefore60Seconds"),
      // //     // AbandonedAfter60Seconds: _.sumBy(objs, "AbandonedAfter60Seconds"),
      // //     // AverageWaitingDurationOfAbandonedCalls: _.sumBy(
      // //     //   objs,
      // //     //   "AverageWaitingDurationOfAbandonedCalls"
      // //     // ),
      // //     // AgentStateLoggedInAssignedInAGroupAndNotInWithdrawalState: _.sumBy(
      // //     //   objs,
      // //     //   "AgentStateLoggedInAssignedInAGroupAndNotInWithdrawalState"
      // //     // ),
      // //   }))
      // //   .value();

      // //       var ratingObject = {};

      // // groups1.forEach(function(valueObject) {

      // //   debugger
      // //    //ratingObject[valueObject.rating] = ratingObject[valueObject.rating] ? ratingObject[valueObject.rating] + 1 : 1;
      // // });

      // let groups3 = _.sumBy(groups1, function(objs) {
      //   debugger;
      //   return objs.AgentStateLogged;
      // });
      // debugger;

      // var groups2 = _.groupBy(this.data, function(value) {
      //   return value.TimeFrom;
      // });

      // debugger;

      // var data2 = _.map(groups, function(group) {
      //   var callsReceivedInOpenState =
      //     _.sumBy(group, "CallsReceivedInOpenState") == undefined
      //       ? 0
      //       : _.sumBy(group, "CallsReceivedInOpenState");

      //   return {
      //     CallsReceivedInOpenState: callsReceivedInOpenState,
      //     TimeFrom: group[0].TimeFrom,
      //     TimeTo: group[0].TimeTo
      //   };
      // });

      //debugger;
      //   let profit = _.sumBy(this.data, function(objs) {
      //     return objs.UserName;
      //   });

      //debugger;

      for (var i = 0; i < objData.length; i++) {
        debugger;
        var userName = objData[i].UserName;
        var agentStateLogged = objData[i].AgentStateLogged;
        //debugger
        this.objSeries.push({
          name: userName,
          type: "column",
          yAxis: 1,
          data: agentStateLogged
        });
      }

      // for (var i = 0; i < objData.length; i++) {

      //   var totalAbandonedCalls = objData[i].TotalAbandonedCalls;
      //   var serviceLevel60s = objData[i].ServiceLevel60s;

      //   var aasim = objData[i].Asim;
      //   var faisal = objData[i].Faisal;
      //   var hamza = objData[i].Hamza;
      //   var hiba = objData[i].Hiba;
      //   var hina = objData[i].Hina;
      //   var irma = objData[i].Irma;
      //   var jonathan = objData[i].Jonathan;
      //   var hasnain = objData[i].Hasnain;
      //   var ali = objData[i].Ali;

      //   var timeFrom = objData[i].TimeFrom.split("T")[1].substring(0, 5);
      //   var timeTo = objData[i].TimeTo.split("T")[1].substring(0, 5);

      //   this.dateSelected = objData[i].TimeTo.split("T")[0];

      //   this.arrayAasim.push(aasim);
      //   this.arrayFaisal.push(faisal);
      //   this.arrayHamza.push(hamza);
      //   this.arrayHiba.push(hiba);
      //   this.arrayHina.push(hina);
      //   this.arrayIrma.push(irma);
      //   this.arrayJonathan.push(jonathan);
      //   this.arrayHasnain.push(hasnain);
      //   this.arrayAli.push(ali);

      //   this.arrayCategories.push(timeFrom + "-" + timeTo);

      //   totalAbandonedCalls =
      //     totalAbandonedCalls == undefined ? null : totalAbandonedCalls;
      //   serviceLevel60s = serviceLevel60s == undefined ? null : serviceLevel60s;
      //   this.arrayAbandonedCall.push(totalAbandonedCalls);
      //   this.arrayServiceLevel.push(serviceLevel60s);
      // }

      // this.objSeries = [
      //   {
      //     name: "Aasim",
      //     type: "column",
      //     yAxis: 1,
      //     data: this.arrayAasim
      //   },
      //   {
      //     name: "Faisal",
      //     type: "column",
      //     yAxis: 1,
      //     data: this.arrayFaisal
      //   },
      //   {
      //     name: "Hamza",
      //     type: "column",
      //     yAxis: 1,
      //     data: this.arrayHamza
      //   },
      //   {
      //     name: "Hiba",
      //     type: "column",
      //     yAxis: 1,
      //     data: this.arrayHiba
      //   },
      //   {
      //     name: "Hina",
      //     type: "column",
      //     yAxis: 1,
      //     data: this.arrayHina
      //   },
      //   {
      //     name: "Jonathan",
      //     type: "column",
      //     yAxis: 1,
      //     data: this.arrayJonathan
      //   },
      //   {
      //     name: "Hasnain",
      //     type: "column",
      //     yAxis: 1,
      //     data: this.arrayHasnain
      //   },
      //   {
      //     name: "Ali",
      //     type: "column",
      //     yAxis: 1,
      //     data: this.arrayAli
      //   },
      //   {
      //     name: "Service Level",
      //     dashStyle: "shortdot",
      //     color: "#87e0ff",
      //     type: "spline",
      //     data: this.arrayServiceLevel
      //   },
      //   {
      //     name: "Abandoned Call",
      //     color: "#ff0000",
      //     type: "spline",
      //     data: this.arrayAbandonedCall
      //   }
      // ];
    },
    setChart() {
      this.makeDataStructure();
      this.options = {
        exporting: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        chart: {
          zoomType: "xy",
          type: "column"
        },
        title: {
          text: this.dateSelected
        },
        subtitle: {
          text: ""
        },
        plotOptions: {
          column: {
            stacking: "normal"
          }
        },
        xAxis: [
          {
            categories: this.arrayCategories,
            crosshair: true
          }
        ],

        yAxis: [
          {
            labels: {
              format: "{value}"
            },
            title: {
              text: "Service Level"
            },
            opposite: true
          },
          {
            gridLineWidth: 0,
            title: {
              text: "Agents"
            }
          },
          {
            gridLineWidth: 0,
            title: {
              text: "Abandoned Call"
            },
            labels: {
              format: "{value}"
            },
            opposite: true
          }
        ],

        tooltip: {
          shared: true,
          formatter: function() {
            return this.points.reduce(function(s, point) {
              var obj =
                s +
                (point.y > 0
                  ? "<br/>" + point.series.name + ": " + point.y + ""
                  : "");
              return obj;
            }, "<b>" + this.x + "</b>");
          }
        },

        series: this.objSeries
      };
    }
  }
};
</script>

