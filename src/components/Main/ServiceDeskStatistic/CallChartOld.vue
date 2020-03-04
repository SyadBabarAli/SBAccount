<template>
  <v-layout>
    <v-flex lg12>
      <highcharts :options="options"></highcharts>
    </v-flex>
  </v-layout>
</template>

<script>
import { Chart } from "highcharts-vue";
 
export default {
  props: ["data"],
  data() {
    return {
      dateSelected: "",
      objSeries: [],
      isAbandonedCallRate: true,
      isAvgSpeedOfAnswer: true,
      arrayAbandonedCall: [],
      arrayServiceLevel: [],
      arrayAasim: [],
      arrayFaisal: [],
      arrayHamza: [],
      arrayHiba: [],
      arrayHina: [],
      arrayIrma: [],
      arrayJonathan: [],
      arrayHasnain: [],
      arrayAli: [],
      arrayCategories: [],
      options: {}
    };
  },
  watch: {
    data() {
      setTimeout(() => {
        this.setChart();
      }, 10);
    }
  },

  methods: {
    makeDataStructure() {
      this.arrayAbandonedCall = [];
      this.arrayServiceLevel = [];
      this.arrayAasim = [];
      this.arrayFaisal = [];
      this.arrayHamza = [];
      this.arrayHiba = [];
      this.arrayHina = [];
      this.arrayIrma = [];
      this.arrayJonathan = [];
      this.arrayHasnain = [];
      this.arrayAli = [];
      this.arrayCategories = [];
      var objData = this.data;

      for (var i = 0; i < objData.length; i++) {
        var totalAbandonedCalls = objData[i].TotalAbandonedCalls;
        var serviceLevel60s = objData[i].ServiceLevel60s;

        var aasim = objData[i].Asim;
        var faisal = objData[i].Faisal;
        var hamza = objData[i].Hamza;
        var hiba = objData[i].Hiba;
        var hina = objData[i].Hina;
        var irma = objData[i].Irma;
        var jonathan = objData[i].Jonathan;
        var hasnain = objData[i].Hasnain;
        var ali = objData[i].Ali;

        var timeFrom = objData[i].TimeFrom.split("T")[1].substring(0, 5);
        var timeTo = objData[i].TimeTo.split("T")[1].substring(0, 5);

        this.dateSelected = objData[i].TimeTo.split("T")[0];

        this.arrayAasim.push(aasim);
        this.arrayFaisal.push(faisal);
        this.arrayHamza.push(hamza);
        this.arrayHiba.push(hiba);
        this.arrayHina.push(hina);
        this.arrayIrma.push(irma);
        this.arrayJonathan.push(jonathan);
        this.arrayHasnain.push(hasnain);
        this.arrayAli.push(ali);

        this.arrayCategories.push(timeFrom + "-" + timeTo);

        totalAbandonedCalls =
          totalAbandonedCalls == undefined ? null : totalAbandonedCalls;
        serviceLevel60s = serviceLevel60s == undefined ? null : serviceLevel60s;
        this.arrayAbandonedCall.push(totalAbandonedCalls);
        this.arrayServiceLevel.push(serviceLevel60s);
      }

      this.objSeries = [
        {
          name: "Aasim",
          type: "column",
          yAxis: 1,
          data: this.arrayAasim
        },
        {
          name: "Faisal",
          type: "column",
          yAxis: 1,
          data: this.arrayFaisal
        },
        {
          name: "Hamza",
          type: "column",
          yAxis: 1,
          data: this.arrayHamza
        },
        {
          name: "Hiba",
          type: "column",
          yAxis: 1,
          data: this.arrayHiba
        },
        {
          name: "Hina",
          type: "column",
          yAxis: 1,
          data: this.arrayHina
        },
        // {
        //   name: "Irma",
        //   type: "column",
        //   yAxis: 1,
        //   data: this.arrayIrma
        // },
        {
          name: "Jonathan",
          type: "column",
          yAxis: 1,
          data: this.arrayJonathan
        },
        {
          name: "Hasnain",
          type: "column",
          yAxis: 1,
          data: this.arrayHasnain
        },
        {
          name: "Ali",
          type: "column",
          yAxis: 1,
          data: this.arrayAli
        },
        {
          name: "Service Level",
          dashStyle: "shortdot",
          color: "#87e0ff",
          type: "spline",
          data: this.arrayServiceLevel
        },
        {
          name: "Abandoned Call",
          color: "#ff0000",
          type: "spline",
          data: this.arrayAbandonedCall
        }
      ];
    },
    setChart() {
      this.makeDataStructure();
      this.options = {
        exporting: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        chart: {
          zoomType: "xy",
          type: "column"
        },
        title: {
          text: this.dateSelected
        },
        subtitle: {
          text: ""
        },
        plotOptions: {
          column: {
            stacking: "normal"
          }
        },
        xAxis: [
          {
            categories: this.arrayCategories,
            crosshair: true
          }
        ],

        yAxis: [
          {
            labels: {
              format: "{value}"
            },
            title: {
              text: "Service Level"
            },
            opposite: true
          },
          {
            gridLineWidth: 0,
            title: {
              text: "Agents"
            }
          },
          {
            gridLineWidth: 0,
            title: {
              text: "Abandoned Call"
            },
            labels: {
              format: "{value}"
            },
            opposite: true
          }
        ],

        tooltip: {
          shared: true,
          formatter: function() {
            return this.points.reduce(function(s, point) {
              var obj =
                s +
                (point.y > 0
                  ? "<br/>" + point.series.name + ": " + point.y + ""
                  : "");
              return obj;
            }, "<b>" + this.x + "</b>");
          }
        },

        series: this.objSeries
      };
    }
  }
};
</script>

