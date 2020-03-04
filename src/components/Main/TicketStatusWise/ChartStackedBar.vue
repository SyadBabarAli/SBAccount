<template>
  <div class="stacked-bar mb-8">
    <chart :options="options" v-if="objdata.length"></chart>
  </div>
</template>

<script>
import moment from "moment";
import _ from "lodash";
export default {
  props: ["objdataCount", "objdata"],
  data() {
    return {
      options: {},
      teams: [],
      above30Count: [],
      between16And30Count: [],
      between6And15Count: [],
      between3And5Count: [],
      below3Count: []
    };
  },
  created: function() {
    var obj = this.objdata;
    var obj2 = null;
  },
  watch: {
    objdataCount: {
      handler: function(val, oldVal) {
        alert("deep-objdataCount");

        this.teams = [];
        this.above30Count = [];
        this.between16And30Count = [];
        this.between6And15Count = [];
        this.between3And5Count = [];
        this.below3Count = [];

        _.forEach(_.groupBy(this.objdata, "SupportGroup"), (val, key) => {
          this.teams.push(val[0].SupportGroup);
          this.teams.sort();
          this.above30Count.push(0);
          this.between16And30Count.push(0);
          this.between6And15Count.push(0);
          this.between3And5Count.push(0);
          this.below3Count.push(0);
        });

        _.forEach(_.groupBy(this.above30, "SupportGroup"), (val, key) => {
          let i = this.teams.findIndex(t => t == key);

          this.above30Count.splice(i, 1, val.length);
        });

        _.forEach(
          _.groupBy(this.between16And30, "SupportGroup"),
          (val, key) => {
            let i = this.teams.findIndex(t => t == key);

            this.between16And30Count.splice(i, 1, val.length);
          }
        );

        _.forEach(_.groupBy(this.between6And15, "SupportGroup"), (val, key) => {
          let i = this.teams.findIndex(t => t == key);

          this.between6And15Count.splice(i, 1, val.length);
        });

        _.forEach(_.groupBy(this.between3And5, "SupportGroup"), (val, key) => {
          let i = this.teams.findIndex(t => t == key);

          this.between3And5Count.splice(i, 1, val.length);
        });

        _.forEach(_.groupBy(this.below3, "SupportGroup"), (val, key) => {
          let i = this.teams.findIndex(t => t == key);

          this.below3Count.splice(i, 1, val.length);
        });

        this.setChart();

      },
      deep: true
    },
    objdata: {
      handler: function(val, oldVal) {
        // this.teams = [];
        // this.above30Count = [];
        // this.between16And30Count = [];
        // this.between6And15Count = [];
        // this.between3And5Count = [];
        // this.below3Count = [];

        // _.forEach(_.groupBy(this.objdata, "SupportGroup"), (val, key) => {
        //   this.teams.push(val[0].SupportGroup);
        //   this.teams.sort();
        //   this.above30Count.push(0);
        //   this.between16And30Count.push(0);
        //   this.between6And15Count.push(0);
        //   this.between3And5Count.push(0);
        //   this.below3Count.push(0);
        // });

        // _.forEach(_.groupBy(this.above30, "SupportGroup"), (val, key) => {
        //   let i = this.teams.findIndex(t => t == key);

        //   this.above30Count.splice(i, 1, val.length);
        // });

        // _.forEach(
        //   _.groupBy(this.between16And30, "SupportGroup"),
        //   (val, key) => {
        //     let i = this.teams.findIndex(t => t == key);

        //     this.between16And30Count.splice(i, 1, val.length);
        //   }
        // );

        // _.forEach(_.groupBy(this.between6And15, "SupportGroup"), (val, key) => {
        //   let i = this.teams.findIndex(t => t == key);

        //   this.between6And15Count.splice(i, 1, val.length);
        // });

        // _.forEach(_.groupBy(this.between3And5, "SupportGroup"), (val, key) => {
        //   let i = this.teams.findIndex(t => t == key);

        //   this.between3And5Count.splice(i, 1, val.length);
        // });

        // _.forEach(_.groupBy(this.below3, "SupportGroup"), (val, key) => {
        //   let i = this.teams.findIndex(t => t == key);

        //   this.below3Count.splice(i, 1, val.length);
        // });

        // this.setChart();
      },
      deep: true
    },
    "$store.getters.sidebar": {
      handler() {
        document.querySelector(".stacked-bar .echarts div").style.margin =
          "auto";
      }
    }
  },
  computed: {
    above30() {
      return this.objdata.filter(data => data.Age > 43200);
    },
    between16And30() {
      return this.objdata.filter(
        data => data.Age >= 23040 && data.Age <= 43200
      );
    },
    between6And15() {
      return this.objdata.filter(data => data.Age >= 2880 && data.Age <= 21600);
    },
    between3And5() {
      return this.objdata.filter(data => data.Age >= 180 && data.Age <= 1440);
    },
    below3() {
      var result;
      result = this.objdata.filter(data => data.Age < 180);
      return result;
    }
  },
  methods: {
    setChart() {
      //alert(this.above30Count);

      // this.teams = [];
      // this.above30Count = [];
      // this.between16And30Count = [];
      // this.between6And15Count = [];
      // this.between3And5Count = [];
      // this.below3Count = [];

      // _.forEach(_.groupBy(this.objdata, "SupportGroup"), (val, key) => {
      //   this.teams.push(val[0].SupportGroup);
      //   this.teams.sort();
      //   this.above30Count.push(0);
      //   this.between16And30Count.push(0);
      //   this.between6And15Count.push(0);
      //   this.between3And5Count.push(0);
      //   this.below3Count.push(0);
      // });

      // _.forEach(_.groupBy(this.above30, "SupportGroup"), (val, key) => {
      //   let i = this.teams.findIndex(t => t == key);

      //   this.above30Count.splice(i, 1, val.length);
      // });

      // _.forEach(
      //   _.groupBy(this.between16And30, "SupportGroup"),
      //   (val, key) => {
      //     let i = this.teams.findIndex(t => t == key);

      //     this.between16And30Count.splice(i, 1, val.length);
      //   }
      // );

      // _.forEach(_.groupBy(this.between6And15, "SupportGroup"), (val, key) => {
      //   let i = this.teams.findIndex(t => t == key);

      //   this.between6And15Count.splice(i, 1, val.length);
      // });

      // _.forEach(_.groupBy(this.between3And5, "SupportGroup"), (val, key) => {
      //   let i = this.teams.findIndex(t => t == key);

      //   this.between3And5Count.splice(i, 1, val.length);
      // });

      // _.forEach(_.groupBy(this.below3, "SupportGroup"), (val, key) => {
      //   let i = this.teams.findIndex(t => t == key);

      //   this.below3Count.splice(i, 1, val.length);
      // });

      this.options = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        legend: {
          data: [
            "Above 30 days",
            "16 to 30 days",
            "2 to 15 days",
            "3 to 24 hours",
            "Below 3 hours"
          ]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          top: "20%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: this.teams,
            axisLabel: {
              rotate: 40
            }
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "Above 30 days",
            type: "bar",
            stack: "stack",
            data: this.above30Count
          },
          {
            name: "16 to 30 days",
            type: "bar",
            stack: "stack",
            data: this.between16And30Count
          },
          {
            name: "2 to 15 days",
            type: "bar",
            stack: "stack",
            data: this.between6And15Count
          },
          {
            name: "3 to 24 hours",
            type: "bar",
            stack: "stack",
            data: this.between3And5Count
          },
          {
            name: "Below 3 hours",
            type: "bar",
            stack: "stack",
            data: this.below3Count
          }
        ].reverse(),
        color: [
          "rgb(255, 183, 77)",
          "rgb(161, 136, 127)",
          "rgb(100, 181, 246)",
          "rgb(149, 117, 205)",
          "rgb(92, 107, 192)"
        ].reverse()
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
