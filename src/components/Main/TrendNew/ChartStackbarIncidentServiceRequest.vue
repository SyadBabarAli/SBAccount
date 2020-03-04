<template>
  <div>
    <highcharts :options="options" id="container"></highcharts>
  </div>
</template>
<script>
import _ from "lodash";
export default {
  props: ["data", "dataUnRecordedIR"],
  data() {
    return {
      options: {
        arrayTicketCount: [],
        arrayTicketWithoutGeneralINQ: [],
        arrayUnRecordedIRs: [],
        arrayMonth: [],

        options: {}
      }
    };
  },
  created() {
    this.setChart();
  },
  watch: {
    data() {
      this.arrayMonth = [];
      this.arrayTicketCount = [];
      this.arrayTicketWithoutGeneralINQ = [];
      this.arrayUnRecordedIRs = [];

      var objMonth = _.uniqBy(this.data, function(e) {
        return e.CreatedDateMonthYear;
      });

      var ticketCount = _(this.data)
        .groupBy("CreatedDateMonthYear")
        .map((objs, key) => ({
          Month: key,
          Total: _.sumBy(objs, "TicketWithoutGeneralINQCount")
        }))
        .value();

      var ticketWithGeneralINQCount = _(this.data)
        .groupBy("CreatedDateMonthYear")
        .map((objs, key) => ({
          Month: key,
          Total: _.sumBy(objs, "TicketWithGeneralINQCount")
        }))
        .value();

      for (var i = 0; i < objMonth.length; i++) {
        this.arrayMonth.push(objMonth[i].CreatedDateMonthYear);
        this.arrayTicketCount.push(ticketCount[i].Total);
        this.arrayTicketWithoutGeneralINQ.push(
          ticketWithGeneralINQCount[i].Total
        );
        var year = objMonth[i].Year;
        var month = objMonth[i].Month;
        for (var j = 0; j < this.dataUnRecordedIR.length; j++) {
          if (
            year == this.dataUnRecordedIR[j].Year &&
            month == this.dataUnRecordedIR[j].Month
          ) {
            this.arrayUnRecordedIRs.push(this.dataUnRecordedIR[j].Cnt);
            break;
          }
        }
      }
      this.setChart();
    }
  },
  methods: {
    setChart: function() {
      this.options = {
        chart: {
          type: "column"
        },
        title: {
          text: ""
        },
        credits: {
          enabled: false
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
              format: "{point.y}"
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
          }
        },
        series: [
          {
            name: "Incident and Service Requests",
            data: this.arrayTicketCount, //[2, 3, null, 4, 0, 5, 1, 4, 6, 3]
            dataLabels: {
              enabled: true,
              color: "black"
            }
          },
          {
            name: "Non ICT Requests",
            data: this.arrayTicketWithoutGeneralINQ, //[2, 3, null, 4, 0, 5, 1, 4, 6, 3]
            dataLabels: {
              enabled: true,
              color: "black"
            }
          },
          {
            name: "Un Recorded IRs",
            data: this.arrayUnRecordedIRs,
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


