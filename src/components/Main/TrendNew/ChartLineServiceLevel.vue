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
      arrayServiceLevel60s: [],
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
      this.arrayServiceLevel60s = [];
      this.arrayMonth = [];

      for (var i = 0; i < this.data.length; i++) {
        this.arrayMonth.push(this.data[i].MonthYear);

        var totalServiceLevel60s = this.data[i].ServiceLevel60s;
        if (totalServiceLevel60s < 90) {
          var result = {
            y: totalServiceLevel60s,
            marker: {
              symbol: "circle",
              fillColor: "red"
            }
          };
          this.arrayServiceLevel60s.push(result);
        } else {
          this.arrayServiceLevel60s.push(totalServiceLevel60s);
        }
      }
      //this.arrayServiceLevel60s.push(50);

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
        legend: {
          enabled: false
        },
        subtitle: {
          text: ""
          //text: "Service Level (served within 60secs)"
        },
        xAxis: {
          categories: this.arrayMonth
        },
        yAxis: {
          //Rmove Fixed Values Of Charts
          // max: 100,
          // min: 80,
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
              value: 90,
              color: "#ff8b00",
              dashStyle: "shortdash",
              width: 4,
              label: {
                text: "Target>=90%",
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
            name: "Service Desk Service Level",
            data: this.arrayServiceLevel60s
          }
        ]
      };
    }
  }
};
</script>
