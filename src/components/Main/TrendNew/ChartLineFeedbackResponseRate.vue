<template>
  <highcharts :options="options" id="container" style="height: 400px; min-width: 1210px"></highcharts>
</template>

<script>
import _ from "lodash";
import { Chart } from "highcharts-vue";
export default {
  components: {
    highcharts: Chart
  },
  // created: function() {
  //   setTimeout(function() {
  //     document.getElementsByClassName("highcharts-credits")[0].style.display =
  //       "none";
  //   }, 100);
  // },
  props: ["data"],
  data() {
    return {
      arrayResponseRate: [],
      arrayFeedback: [],
      arrayMonth: [],

      arrayServiceLevel: [],
      options: {}
    };
  },
  mounted() {
    this.setChart();
  },
  watch: {
    data() {
      this.arrayResponseRate = [];
      this.arrayMonth = [];

      var ticketCount = _(this.data)
        .groupBy("ResolvedDateMonthYear")
        .map((objs, key) => ({
          Month: key,
          Total: _.sumBy(objs, "TicketWithoutGeneralAndWithFeedbackINQCount")
        }))
        .value();

      var feedbackCount = _(this.data)
        .groupBy("ResolvedDateMonthYear")
        .map((objs, key) => ({
          Month: key,
          Total: _.sumBy(objs, "FeedbackCount")
        }))
        .value();

      // var ratingTotal = _(this.data)
      //   .groupBy("ResolvedDateMonthYear")
      //   .map((objs, key) => ({
      //     Month: key,
      //     Total: _.sumBy(objs, "RatingTotal")
      //   }))
      //   .value();

      var objMonth = _.uniqBy(this.data, function(e) {
        return e.ResolvedDateMonthYear;
      });

      for (var i = 0; i < objMonth.length; i++) {
        this.arrayMonth.push(objMonth[i].ResolvedDateMonthYear);

        var feedback = feedbackCount[i].Total;
        var ticket = ticketCount[i].Total;

        var responseRate = (feedback / ticket) * 100;
        //debugger
        responseRate = parseFloat(responseRate.toFixed(2));

        if (responseRate < 25) {
          var result = {
            y: responseRate,
            marker: {
              symbol: "circle",
              fillColor: "red"
            }
          };
          this.arrayResponseRate.push(result);
        } else {
          this.arrayResponseRate.push(responseRate);
        }
      }

      this.setChart();
    }
  },
  methods: {
    setChart() {
      this.options = {
        chart: {
          type: "line"
        },
        title: {
          text: ""
          //text: "ICT Feedback Response Rate"
        },
        credits: {
          enabled: false
        },
        legend: {
          enabled: false
        },
        subtitle: {
          text: ""
          //text: "Average Response Rate"
        },
        xAxis: {
          categories: this.arrayMonth
        },
        yAxis: {
          // max: 50,
          // min: 0,
          labels: {
            format: "{value}%"
          },
          title: {
            text: "."
          },
          plotLines: [
            {
              value: 25,
              color: "#ff8b00",
              dashStyle: "shortdash",
              width: 4,
              label: {
                text: "Target>=25%",
                style: { color: "#ff8b00" }
              }
            }
          ]
        },
        plotOptions: {
          line: {
            dataLabels: {
              enabled: false,
              style: {
                color: "black"
              }
            },
            enableMouseTracking: false
          },
          series: {
            label: {
              connectorAllowed: true
            },
            dataLabels: {
              enabled: true,
              format: "{y} %"
            }
          }
        },
        series: [
          {
            marker: {
              symbol: "circle",
              fillColor: "#7cbd1e",
              lineWidth: 0
            },
            lineColor: "#17b978",
            lineWidth: 4,
            name: "Average Response Rate",
            data: this.arrayResponseRate
          }
        ]
      };
    }
  }
};
</script>
