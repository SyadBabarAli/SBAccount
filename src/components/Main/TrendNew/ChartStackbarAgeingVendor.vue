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
        arrayDay0to1: [],
        arrayDay2to3: [],
        arrayDay4to7: [],
        arrayDay7toAbove: [],
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
      this.arrayDay0to1 = [];
      this.arrayDay2to3 = [];
      this.arrayDay4to7 = [];
      this.arrayDay7toAbove = [];
      this.arrayActive = [];

      var totalResolved = _(this.objdata)
        .groupBy("SupportGroup")
        .map((objs, key) => ({
          Vendor: key,
          Ticket: _.sumBy(objs, "resolved")
        }))
        .value();

      var TotalActive = _(this.objdata)
        .groupBy("SupportGroup")
        .map((objs, key) => ({
          Vendor: key,
          Ticket: _.sumBy(objs, "active")
        }))
        .value();

      var Day0to1 = _(this.objdata)
        .groupBy("SupportGroup")
        .map((objs, key) => ({
          Vendor: key,
          Ticket: _.sumBy(objs, "day0to1")
        }))
        .value();

      var Day2to3 = _(this.objdata)
        .groupBy("SupportGroup")
        .map((objs, key) => ({
          Vendor: key,
          Ticket: _.sumBy(objs, "day2to3")
        }))
        .value();

      var Day4to7 = _(this.objdata)
        .groupBy("SupportGroup")
        .map((objs, key) => ({
          Vendor: key,
          Ticket: _.sumBy(objs, "day4to7")
        }))
        .value();

      var Day7toAbove = _(this.objdata)
        .groupBy("SupportGroup")
        .map((objs, key) => ({
          Vendor: key,
          Ticket: _.sumBy(objs, "day7toAbove")
        }))
        .value();

      for (var i = 0; i < Day0to1.length; i++) {
        var totalCnt = TotalActive[i].Ticket + totalResolved[i].Ticket;
        var vendor = Day0to1[i].Vendor;
        var ticket = Day0to1[i].Ticket;
        var resultPercentage = ticket / (totalCnt / 100);
        this.arrayMonth.push(vendor);
        resultPercentage = parseFloat(resultPercentage.toFixed(1));
        this.arrayDay0to1.push(resultPercentage);
      }
      for (var i = 0; i < Day2to3.length; i++) {
        var totalCnt = TotalActive[i].Ticket + totalResolved[i].Ticket;
        var ticket = Day2to3[i].Ticket;
        var resultPercentage = ticket / (totalCnt / 100);
        resultPercentage = parseFloat(resultPercentage.toFixed(1));
        this.arrayDay2to3.push(resultPercentage);
      }
      for (var i = 0; i < Day4to7.length; i++) {
        var totalCnt = TotalActive[i].Ticket + totalResolved[i].Ticket;
        var ticket = Day4to7[i].Ticket;
        var resultPercentage = ticket / (totalCnt / 100);
        resultPercentage = parseFloat(resultPercentage.toFixed(1));
        this.arrayDay4to7.push(resultPercentage);
      }

      for (var i = 0; i < Day7toAbove.length; i++) {
        var totalCnt = TotalActive[i].Ticket + totalResolved[i].Ticket;
        var ticket = Day7toAbove[i].Ticket;
        var resultPercentage = ticket / (totalCnt / 100);
        resultPercentage = parseFloat(resultPercentage.toFixed(1));
        this.arrayDay7toAbove.push(resultPercentage);
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
            name: "7 - Above (Days)",
            data: this.arrayDay7toAbove,
            color: "rgb(244,67,54)",
            dataLabels: {
              enabled: true,
              color: "black"
            }
          },
          {
            name: "4 - 7 (Days)",
            data: this.arrayDay4to7,
            color: "brown",
            dataLabels: {
              enabled: true,
              color: "black"
            }
          },
          {
            name: "2 - 3 (Days)",
            data: this.arrayDay2to3,
            color: "rgb(255, 183, 77)",
            dataLabels: {
              enabled: true,
              color: "black"
            }
          },
          {
            name: "0 - 01 (Day)",
            data: this.arrayDay0to1,
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

