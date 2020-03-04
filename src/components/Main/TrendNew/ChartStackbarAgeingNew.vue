<template>
  <div>
    <highcharts :options="options" id="container"></highcharts>
  </div>
</template>
<script>
import _ from "lodash";
export default {
  props: ["objdata"],
  data() {
    return {
      options: {
        arrayMonth: [],
        arrayHoursGreter0to3: [],
        arrayHoursGreter3to24: [],
        arrayHoursGreater24to48: [],
        arrayHoursGreater48: [],
        arrayActive: []
      }
    };
  },
  created() {
    this.setChart();
  },
  watch: {
    objdata() {
      this.arrayMonth = [];
      this.arrayHoursGreter0to3 = [];
      this.arrayHoursGreter3to24 = [];
      this.arrayHoursGreater24to48 = [];
      this.arrayHoursGreater48 = [];
      this.arrayActive = [];

      var totalResolved = _(this.objdata)
        .groupBy("CreatedDateMonthYear")
        .map((objs, key) => ({
          Month: key,
          Ticket: _.sumBy(objs, "resolved")
        }))
        .value();

      var TotalActive = _(this.objdata)
        .groupBy("CreatedDateMonthYear")
        .map((objs, key) => ({
          Month: key,
          Ticket: _.sumBy(objs, "active")
        }))
        .value();

      var HoursGreter0to3 = _(this.objdata)
        .groupBy("CreatedDateMonthYear")
        .map((objs, key) => ({
          Month: key,
          Ticket: _.sumBy(objs, "hoursGreter0to3")
        }))
        .value();

      var HoursGreter3to24 = _(this.objdata)
        .groupBy("CreatedDateMonthYear")
        .map((objs, key) => ({
          Month: key,
          Ticket: _.sumBy(objs, "hoursGreter3to24")
        }))
        .value();

      var HoursGreater24to48 = _(this.objdata)
        .groupBy("CreatedDateMonthYear")
        .map((objs, key) => ({
          Month: key,
          Ticket: _.sumBy(objs, "hoursGreater24to48")
        }))
        .value();

      var HoursGreater48 = _(this.objdata)
        .groupBy("CreatedDateMonthYear")
        .map((objs, key) => ({
          Month: key,
          Ticket: _.sumBy(objs, "hoursGreater48")
        }))
        .value();

      for (var i = 0; i < HoursGreter0to3.length; i++) {
        var totalCnt = TotalActive[i].Ticket + totalResolved[i].Ticket;
        var month = HoursGreter0to3[i].Month;
        var ticket = HoursGreter0to3[i].Ticket;
        var resultPercentage = ticket / (totalCnt / 100);
        this.arrayMonth.push(month);
        resultPercentage = parseFloat(resultPercentage.toFixed(1));
        this.arrayHoursGreter0to3.push(resultPercentage);
      }
      for (var i = 0; i < HoursGreter3to24.length; i++) {
        var totalCnt = TotalActive[i].Ticket + totalResolved[i].Ticket;
        var ticket = HoursGreter3to24[i].Ticket;
        var resultPercentage = ticket / (totalCnt / 100);
        resultPercentage = parseFloat(resultPercentage.toFixed(1));
        this.arrayHoursGreter3to24.push(resultPercentage);
      }
      for (var i = 0; i < HoursGreater24to48.length; i++) {
        var totalCnt = TotalActive[i].Ticket + totalResolved[i].Ticket;
        var ticket = HoursGreater24to48[i].Ticket;
        var resultPercentage = ticket / (totalCnt / 100);
        resultPercentage = parseFloat(resultPercentage.toFixed(1));
        this.arrayHoursGreater24to48.push(resultPercentage);
      }

      for (var i = 0; i < HoursGreater48.length; i++) {
        var totalCnt = TotalActive[i].Ticket + totalResolved[i].Ticket;
        var ticket = HoursGreater48[i].Ticket;
        var resultPercentage = ticket / (totalCnt / 100);
        resultPercentage = parseFloat(resultPercentage.toFixed(1));
        this.arrayHoursGreater48.push(resultPercentage);
      }

      for (var i = 0; i < TotalActive.length; i++) {
        var totalCnt = TotalActive[i].Ticket + totalResolved[i].Ticket;
        var ticket = TotalActive[i].Ticket;
        var resultPercentage = parseFloat(ticket) / (parseFloat(totalCnt) / 100);
        resultPercentage = parseFloat(resultPercentage.toFixed(1));
        this.arrayActive.push(resultPercentage);
      }
      this.setChart();
    }
  },
  computed: {},
  methods: {
    setChart: function() {
      this.options = {
        chart: {
          type: "column"
        },
        title: {
          text: "_",
          style: {
            color: "#FFFFFF"
          }
        },
        credits: {
          enabled: false
        },
        exporting: {
          enabled: true
        },
        subtitle: {
          text: ""
        },
        tooltip: {
          enabled: false
        },
        plotOptions: {
          column: {
            stacking: "normal",
            dataLabels: {
              enabled: true,
              format: "{point.y}%"
            }
          }
        },
        xAxis: {
          categories: this.arrayMonth,
          labels: {
            skew3d: true,
            style: {
              fontSize: "11px"
            }
          }
        },
        yAxis: {
          title: {
            text: null
          },
          max: 100,
          min: 0,
          labels: {
            format: "{value} %"
          }
        },

        legend: {
          itemMarginBottom: 10,
          reversed: true
        },
        series: [
          {
            name: "Active",
            data: this.arrayActive,
            color: "gray",
            dataLabels: {
              enabled: true,
              color: "black"
            }
          },
          {
            name: "Age > 48 (Hours)",
            data: this.arrayHoursGreater48,
            color: "brown",
            dataLabels: {
              enabled: true,
              color: "black"
            }
          },
          {
            name: "24 > Age ≤ 48 (Hours)",
            data: this.arrayHoursGreater24to48,
            color: "rgb(244,67,54)",
            dataLabels: {
              enabled: true,
              color: "black"
            }
          },
          {
            name: "3 > Age ≤ 24 (Hours)",
            data: this.arrayHoursGreter3to24,
            color: "rgb(255, 183, 77)",
            dataLabels: {
              enabled: true,
              color: "black"
            }
          },
          {
            name: "Age ≤ 03 (Hours)",
            data: this.arrayHoursGreter0to3,
            color: "green",
            dataLabels: {
              enabled: true,
              color: "black"
            }
          }
        ]
      };
    }
  }
};
</script>

