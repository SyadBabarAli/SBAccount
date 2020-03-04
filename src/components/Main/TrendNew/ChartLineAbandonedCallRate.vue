<template>
  <highcharts :options="options" id="container" style="height: 400px; min-width: 1210px"></highcharts>
</template>

<script>
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
      arrayAbandonedCall: [],
      arrayAbandonedCallMonth: [],
      arrayServiceLevel: [],
      options: {}
    };
  },
  mounted() {
    this.setChart();
  },
  watch: {
    data() {
      this.arrayAbandonedCall = [];
      this.arrayAbandonedCallMonth = [];

      for (var i = 0; i < this.data.length; i++) {
        this.arrayAbandonedCallMonth.push(this.data[i].MonthYear);

        var totalAbandonedCalls = this.data[i].TotalAbandonedCalls;
        if (totalAbandonedCalls > 5) {
          var result = {
            y: totalAbandonedCalls,
            marker: {
              symbol: "circle",
              fillColor: "red"
            }
          };
          this.arrayAbandonedCall.push(result);
        } else {
          this.arrayAbandonedCall.push(totalAbandonedCalls);
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
          //text: "ICT Service Desk"
        },
        credits: {
          enabled: false
        },
        // exporting: {
        //   enabled: false
        // },
        legend: {
          enabled: false
        },
        subtitle: {
          text: ""
          //text: "Abandoned Call Rate (>15 secs)"
        },
        xAxis: {
          categories: this.arrayAbandonedCallMonth
        },
        yAxis: {
          //Rmove Fixed Values Of Charts
          //max: 10,
          min: 0,
          labels: {
            format: "{value} %"
          },
          // title: {
          //   text: "P e r c e n t a g e ( % )"
          // },

          title: {
            text: ""
          },
          plotLines: [
            {
              value: 5,
              color: "#ff8b00",
              dashStyle: "shortdash",
              width: 4,
              label: {
                text: "Target<=5",
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
            name: "Abandoned Call Rate",
            data: this.arrayAbandonedCall
          }
        ]
      };
    }
  }
};
</script>
