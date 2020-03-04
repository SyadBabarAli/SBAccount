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
        arrayLessThenDay: [],
        arrayBetween2_14: [],
        arrayBetween14Plus: [],
        arrayMonth: [],
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
      this.arrayLessThenDay = [];
      this.arrayBetween2_14 = [];
      this.arrayBetween14Plus = [];
      this.arrayActive = [];

      var totalCount = _(this.objdata)
        .groupBy("CreatedDateMonthYear")
        .map((objs, key) => ({
          Month: key,
          Total: _.sumBy(objs, "TicketWithoutGeneralINQCount")
        }))
        .value();

      var lessThenDay = _(this.objdata)
        .groupBy("CreatedDateMonthYear")
        .map((objs, key) => ({
          Month: key,
          Total: _.sumBy(objs, "LessThenDayCount")
        }))
        .value();

      var between2_14 = _(this.objdata)
        .groupBy("CreatedDateMonthYear")
        .map((objs, key) => ({
          Month: key,
          Total: _.sumBy(objs, "Between2To14Count")
        }))
        .value();

      var greater_14 = _(this.objdata)
        .groupBy("CreatedDateMonthYear")
        .map((objs, key) => ({
          Month: key,
          Total: _.sumBy(objs, "GreaterThen14Count")
        }))
        .value();

      var active_ = _(this.objdata)
        .groupBy("CreatedDateMonthYear")
        .map((objs, key) => ({
          Month: key,
          Total: _.sumBy(objs, "ActiveCount")
        }))
        .value();

      for (var i = 0; i < lessThenDay.length; i++) {
        var totalCnt = totalCount[i].Total;
        var month = lessThenDay[i].Month;
        var total = lessThenDay[i].Total;
        var resultPercentage = total / (totalCnt / 100);
        this.arrayMonth.push(month);
        resultPercentage = parseFloat(resultPercentage.toFixed(1));
        this.arrayLessThenDay.push(resultPercentage);
      }
      for (var i = 0; i < between2_14.length; i++) {
        var totalCnt = totalCount[i].Total;
        var total = between2_14[i].Total;
        var resultPercentage = total / (totalCnt / 100);
        resultPercentage = parseFloat(resultPercentage.toFixed(1));
        this.arrayBetween2_14.push(resultPercentage);
      }
      for (var i = 0; i < greater_14.length; i++) {
        var totalCnt = totalCount[i].Total;
        var total = greater_14[i].Total;
        var resultPercentage = total / (totalCnt / 100);
        resultPercentage = parseFloat(resultPercentage.toFixed(1));
        this.arrayBetween14Plus.push(resultPercentage);
      }

      for (var i = 0; i < active_.length; i++) {
        var totalCnt = totalCount[i].Total;
        var total = active_[i].Total;
        var resultPercentage = total / (totalCnt / 100);
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
          //margin: 5
          //marginTop:10
          style: {
            color: "#FFFFFF",
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
              //color:"white"
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
          //layout: "horizantal",
          // align: "right",
          // verticalAlign: "middle",
          // itemMarginTop: 10,
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
            name: "14 days+",
            data: this.arrayBetween2_14,
            color: "rgb(244,67,54)",
            dataLabels: {
              enabled: true,
              color: "black"
            }
          },
          {
            name: "2-14 days",
            data: this.arrayBetween14Plus,
            color: "rgb(255, 183, 77)",
            dataLabels: {
              enabled: true,
              color: "black"
            }
          },
          {
            name: "< 1 day",
            data: this.arrayLessThenDay,
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

