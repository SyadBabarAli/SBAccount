<template>
  <highcharts :options="options" style="height: 190px"></highcharts>
</template>

<script>
import { Chart } from "highcharts-vue";
export default {
  props: ["data"],
  data() {
    return {
      options: {}
    };
  },
  mounted() {
    //alert("mounted-Speedometer");
    this.setChart();
  },
  watch: {
    data() {
      this.setChart();
    }
  },
  // beforeMount() {
  //     alert(12);
  // },
  methods: {
    setChart() {
      this.options = {
        chart: {
          type: "gauge",
          plotBackgroundColor: null,
          plotBackgroundImage: null,
          plotBorderWidth: 0,
          plotShadow: false
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          gauge: {
            wrap: false
          }
        },

        title: {
          text: ""
        },
        pane: {
          startAngle: -150,
          endAngle: 150,
          background: [
            {
              backgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [[0, "#FFF"], [1, "#333"]]
              },
              borderWidth: 0,
              outerRadius: "109%"
            },
            {
              backgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [[0, "#333"], [1, "#FFF"]]
              },
              borderWidth: 1,
              outerRadius: "107%"
            },
            {
              // default background
            },
            {
              backgroundColor: "#DDD",
              borderWidth: 0,
              outerRadius: "105%",
              innerRadius: "103%"
            }
          ]
        },

        // the value axis
        yAxis: {
          min: 0,
          max: 100,

          minorTickInterval: "auto",
          minorTickWidth: 1,
          minorTickLength: 10,
          minorTickPosition: "inside",
          minorTickColor: "#666",

          tickPixelInterval: 30,
          tickWidth: 2,
          tickPosition: "inside",
          tickLength: 10,
          tickColor: "#666",
          labels: {
            step: 2,
            rotation: "auto"
          },
          title: {
            text: "min"
          },
          plotBands: [
            {
              from: 0,
              to: 15,
              color: "#55BF3B" // green
            },
            {
              from: 15,
              to: 30,
              color: "rgb(255, 183, 77)" // yellow
            },
            {
              from: 30,
              to: 100,
              color: "rgb(244,67,54)" // red
            }
          ]
        },

        series: [
          {
            name: "Avg",
            data: this.data,
            tooltip: {
              valueSuffix: " min"
            }
          }
        ]
      };
    }
  },
  components: {
    highcharts: Chart
  }
};
</script>
