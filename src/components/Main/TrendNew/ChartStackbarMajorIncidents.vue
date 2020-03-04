<template>
  <div>
    <highcharts :options="options"></highcharts>
  </div>
</template>
<script>
import _ from "lodash";
export default {
  props: ["data"],
  data() {
    return {
      options: {
        arrayPriorityCount: [],
        arrayMonth: [],
        options: {}
      }
    };
  },
  created() {
    // setTimeout(function() {
    //   var objArray = document.getElementsByClassName("highcharts-credits");
    //   for (var i = 0; i < objArray.length; i++) {
    //     document.getElementsByClassName("highcharts-credits")[i].style.display =
    //       "none";
    //   }
    // }, 100);
    //this.hideLabel();
    this.setChart();
  },
  watch: {
    data() {
      this.arrayMonth = [];
      this.arrayPriorityCount = [];

      var objMonth = _.uniqBy(this.data, function(e) {
        return e.CreatedDateMonthYear;
      });

      var ticketCount = _(this.data)
        .groupBy("CreatedDateMonthYear")
        .map((objs, key) => ({
          Month: key,
          Total: _.sumBy(objs, "PriorityCount")
        }))
        .value();

      for (var i = 0; i < objMonth.length; i++) {
        this.arrayMonth.push(objMonth[i].CreatedDateMonthYear);
        this.arrayPriorityCount.push(ticketCount[i].Total);
      }

      //debugger
      this.setChart();
    }
  },
  computed: {},
  methods: {
    setChart: function() {
      this.options = {
        chart: {
          type: "column",
          options3d: {
            enabled: true,
            alpha: 10,
            beta: 25,
            depth: 70
          }
        },
        title: {
          //text: "Major Incidents"
          text: ""
        },
        credits: {
          enabled: false
        },
        subtitle: {
          text: ""
          //text: "Notice the difference between a 0 value and a null point"
        },
        tooltip: {
          enabled: false
        },
        plotOptions: {
          column: {
            depth: 25
          },
          series: {
            borderWidth: 0,
            dataLabels: {
              enabled: true,
              format: "{point.y}"
              //format: "{point.y:.1f}"
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
          allowDecimals: true
        },
        series: [
          {
            name: "Major Incidents",
            data: this.arrayPriorityCount,
            color: "rgb(244,67,54)"
          }
        ]
      };
    }
  }
};
</script>

<style scoped>
.echarts {
  width: 100%;
}
</style>
