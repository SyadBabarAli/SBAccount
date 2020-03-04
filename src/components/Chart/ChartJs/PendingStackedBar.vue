<template>
  <!-- <div class="stacked-bar mb-8"> -->
  <chart :options="options"></chart>
  <!-- </div> -->
</template>

<script>
import moment from "moment";

export default {
  props: ["tickets"],
  data() {
    return {
      options: {},
      tree: [],
      above30Count: [],
      between16And30Count: [],
      between6And15Count: [],
      between3And5Count: [],
      below3Count: []
    };
  },
  mounted() {},
  updated() {},
  watch: {
    tickets() {
      //debugger
      this.tree = [];
      this.above30Count = [];
      this.between16And30Count = [];
      this.between6And15Count = [];
      this.between3And5Count = [];
      this.below3Count = [];

      _.forEach(_.groupBy(this.tickets, "SupportGroup"), (val, key) => {
        this.tree.push(val[0].SupportGroup);
        this.tree.sort();
        this.above30Count.push(0);
        this.between16And30Count.push(0);
        this.between6And15Count.push(0);
        this.between3And5Count.push(0);
        this.below3Count.push(0);
      });

      _.forEach(_.groupBy(this.above30, "SupportGroup"), (val, key) => {
        let i = this.tree.findIndex(t => t == key);

        this.above30Count.splice(i, 1, val.length);
      });

      _.forEach(_.groupBy(this.between16And30, "SupportGroup"), (val, key) => {
        let i = this.tree.findIndex(t => t == key);

        this.between16And30Count.splice(i, 1, val.length);
      });

      _.forEach(_.groupBy(this.between6And15, "SupportGroup"), (val, key) => {
        let i = this.tree.findIndex(t => t == key);

        this.between6And15Count.splice(i, 1, val.length);
      });

      _.forEach(_.groupBy(this.between3And5, "SupportGroup"), (val, key) => {
        let i = this.tree.findIndex(t => t == key);

        this.between3And5Count.splice(i, 1, val.length);
      });

      _.forEach(_.groupBy(this.below3, "SupportGroup"), (val, key) => {
        let i = this.tree.findIndex(t => t == key);

        this.below3Count.splice(i, 1, val.length);
      });

      this.setChart();
    }
    // '$store.getters.sidebar': {
    //     handler() {
    //         document.querySelector('.stacked-bar .echarts div').style.margin = 'auto'
    //     }
    // }
  },
  computed: {
    above30() {
      //debugger
      return this.tickets.filter(ticket => ticket.Age > 30);
    },
    between16And30() {
      return this.tickets.filter(
        ticket => ticket.Age >= 16 && ticket.Age <= 30
      );
    },
    between6And15() {
      return this.tickets.filter(ticket => ticket.Age >= 6 && ticket.Age <= 15);
    },
    between3And5() {
      return this.tickets.filter(ticket => ticket.Age >= 3 && ticket.Age <= 5);
    },
    below3() {
      return this.tickets.filter(ticket => ticket.Age < 3);
    }
  },
  methods: {
    setChart() {
      //debugger
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
            "6 to 15 days",
            "3 to 5 days",
            "Below 3 days"
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
            data: this.tree,
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
            name: "6 to 15 days",
            type: "bar",
            stack: "stack",
            data: this.between6And15Count
          },
          {
            name: "3 to 5 days",
            type: "bar",
            stack: "stack",
            data: this.between3And5Count
          },
          {
            name: "Below 3 days",
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
