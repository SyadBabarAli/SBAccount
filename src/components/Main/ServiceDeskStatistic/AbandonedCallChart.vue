<template>
  <!-- style="height: 400px; min-width: 1210px" -->
  <highstock :options="options"></highstock>
</template>

<script>
import { Chart } from "highcharts-vue";
export default {
  components: {
    highcharts: Chart
  },
  // created: function() {
  //   setTimeout(function() {
  //     //document.getElementsByClassName("highcharts-series highcharts-series-2 highcharts-areaspline-series highcharts-navigator-series")[0].remove();
  //     // document.getElementsByClassName(
  //     //   "highcharts-series highcharts-series-2 highcharts-areaspline-series highcharts-navigator-series"
  //     // )[0].style.display = "none";
  //   }, 2000);
  // },
  props: ["data"],
  data() {
    return {
      arrayAbandonedCall: [],
      arrayServiceLevel: [],
      options: {}
    };
  },
  // mounted() {
  //   this.setChart();
  // },
  watch: {
    data() {
      this.arrayAbandonedCall = [];
      this.arrayServiceLevel = [];

      for (var i = 0; i < this.data.length; i++) {
        this.arrayAbandonedCall.push([
          this.data[i].Milliseconds,
          this.data[i].TotalAbandonedCalls
        ]);
      }
      for (var i = 0; i < this.data.length; i++) {
        this.arrayServiceLevel.push([
          this.data[i].Milliseconds,
          this.data[i].ServiceLevel60s
        ]);
      }
      var obj = this.data;
      this.setChart();
    }
  },
  methods: {
    setChart() {
      this.options = {
        exporting: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        legend: {
          enabled: true
        },
        navigator: {
          enabled: true
        },
        scrollbar: {
          enabled: true
        },
        rangeSelector: {
          selected: 1
        },
        yAxis: {
          lineWidth: 1,
          title: {
            text: ""
          },
          plotLines: [
            {
              value: 5,
              color: "red",
              dashStyle: "shortdash",
              width: 2,
              label: {
                text: "Target<=5"
              }
            },
            {
              value: 90,
              color: "red",
              dashStyle: "shortdash",
              width: 2,
              label: {
                text: "Target>=90"
              }
            }
          ]
        },
        series: [
          {
            name: "Abandoned Call Rate",
            data: this.arrayAbandonedCall,
            marker: {
              enabled: true,
              radius: 3
            },
            shadow: true,
            tooltip: {
              valueDecimals: 2
            }
          },
          {
            color: "rgb(124, 181, 236)",
            name: "Avg Speed Of Answer",
            data: this.arrayServiceLevel,
            marker: {
              enabled: true,
              radius: 3
            },
            shadow: true,
            tooltip: {
              valueDecimals: 2
            }
          }
        ]
      };
      this.removetScrollChart();
    },
    removetScrollChart() {
      setTimeout(function() {
        (document.getElementsByClassName(
          "highcharts-series highcharts-series-2 highcharts-areaspline-series highcharts-navigator-series"
        )[0].style.display = "none"),
          500;
      });
    }
  }
};
</script>
