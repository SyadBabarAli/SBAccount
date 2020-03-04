<template>
  <highcharts :options="options"></highcharts>
</template>

<script>
import { Chart } from "highcharts-vue";

export default {
  props: ["data"],
  data() {
    return {
      options: {},
      supportGroupArray: [],
      metArray: [],
      breachedArray: [],
      notRespondedArray: []
    };
  },
  mounted() {
    //alert("mounted-Stackbar100");
    this.setChart();
  },
  watch: {
    data() {
      //alert("watch-Stackbar100");
      //                 this.supportGroupArray = [],
      //                 this.metArray = [],
      //                 this.breachedArray = [],
      //                 this.notRespondedArray = [],

      //                 _.forEach(_.groupBy(this.data, 'SupportGroup'), (val, key) => {
      //                     var objCountSupportGroup=  _.countBy(val,'SLA');
      // if(objCountSupportGroup["Met"]!=undefined){this.metArray.push(objCountSupportGroup["Met"])} else {this.metArray.push(0)}
      // if(objCountSupportGroup["Breached"]!=undefined){this.breachedArray.push(objCountSupportGroup["Breached"])} else{this.breachedArray.push(0)}
      // if(objCountSupportGroup["Not Responded"]!=undefined){this.notRespondedArray.push(objCountSupportGroup["Not Responded"])} else{this.notRespondedArray.push(0)}
      //                     this.supportGroupArray.push(key)
      //                 })

      this.setChart();
    }
  },
  methods: {
    setChart() {
      (this.supportGroupArray = []),
        (this.metArray = []),
        (this.breachedArray = []),
        (this.notRespondedArray = []),
        _.forEach(_.groupBy(this.data, "SupportGroup"), (val, key) => {
          var objCountSupportGroup = _.countBy(val, "SLA");
          if (objCountSupportGroup["Met"] != undefined) {
            this.metArray.push(objCountSupportGroup["Met"]);
          } else {
            this.metArray.push(0);
          }
          if (objCountSupportGroup["Breached"] != undefined) {
            this.breachedArray.push(objCountSupportGroup["Breached"]);
          } else {
            this.breachedArray.push(0);
          }
          if (objCountSupportGroup["Not Responded"] != undefined) {
            this.notRespondedArray.push(objCountSupportGroup["Not Responded"]);
          } else {
            this.notRespondedArray.push(0);
          }
          this.supportGroupArray.push(key);
        });

      this.options = {
        chart: {
          type: "column",
          height: 250
          //   width:1000
        },
        credits: {
          enabled: false
        },
        title: {
          text: " "
        },
        xAxis: {
          categories: this.supportGroupArray
        },
        yAxis: {
          min: 0,
          title: {
            text: " "
          }
        },
        tooltip: {
          pointFormat:
            '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
          shared: true
        },
        plotOptions: {
          column: {
            stacking: "percent"
          }
          //  series: {
          //     pointWidth: 25
          // }
        },
        series: [
          { name: "Met", data: this.metArray, color: "green" },
          {
            name: "Breached",
            data: this.breachedArray,
            color: "rgb(244,67,54)"
          },
          {
            name: "Not Responded",
            data: this.notRespondedArray,
            color: "rgb(255, 183, 77)"
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

<style scoped>
</style>