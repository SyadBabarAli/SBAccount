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
      arrayAvgRating: [],
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
      this.arrayAvgRating = [];
      this.arrayMonth = [];

      var feedbackCount = _(this.data)
        .groupBy("ResolvedDateMonthYear")
        .map((objs, key) => ({
          Month: key,
          Total: _.sumBy(objs, "FeedbackCount")
        }))
        .value();

      var ratingTotal = _(this.data)
        .groupBy("ResolvedDateMonthYear")
        .map((objs, key) => ({
          Month: key,
          Total: _.sumBy(objs, "RatingCount")
        }))
        .value();

      var objMonth = _.uniqBy(this.data, function(e) {
        return e.ResolvedDateMonthYear;
      });

      for (var i = 0; i < objMonth.length; i++) {
        this.arrayMonth.push(objMonth[i].ResolvedDateMonthYear);

        var feedback = feedbackCount[i].Total;
        var rating = ratingTotal[i].Total;

        var avgRating = rating / feedback;
        avgRating = (avgRating * 100) / 5;
        avgRating = parseFloat(avgRating.toFixed(2));
        //avgRating = avgRating.toFixed(2);

        if (avgRating < 80) {
          var result = {
            y: avgRating,
            marker: {
              symbol: "circle",
              fillColor: "red"
            }
          };
          this.arrayAvgRating.push(result);
        } else {
          this.arrayAvgRating.push(avgRating);
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
          //text: "ICT User Satisfaction Level (5-scale)"
        },
        credits: {
          enabled: false
        },
        legend: {
          enabled: false
        },
        subtitle: {
          text: ""
          //text: "Average User Satisfaction Level"
        },
        xAxis: {
          categories: this.arrayMonth
        },
        yAxis: {
          // max: 100,
          // min: 70,
          labels: {
            format: "{value} %"
          },
          title: {
            //text: "Satisfaction Level (5-scale)"
            text: ""
          },
          plotLines: [
            {
              value: 80,
              color: "#ff8b00",
              dashStyle: "shortdash",
              width: 4,
              label: {
                text: "Target>=80",
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
              format: "{y}%"
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
            name: "Average User Satisfaction Level",
            data: this.arrayAvgRating
          }
        ]
      };
    }
  }
};
</script>
