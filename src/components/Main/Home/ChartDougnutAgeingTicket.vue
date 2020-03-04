<template>
  <chart :options="options"></chart>
</template>

<script>
export default {
  props: [
    "below3Hours",
    "hours3to24",
    "days2to15",
    "days16to30",
    "above30days"
  ],
  data() {
    return {
      options: {}
    };
  },
  mounted() {
    this.setChart();
  },
  watch: {
    below3Hours() {
      this.setChart();
    },
    hours3to24() {
      this.setChart();
    },
    days2to15() {
      this.setChart();
    },

    days16to30() {
      this.setChart();
    },
    above30days() {
      this.setChart();
    }
  },
  methods: {
    setChart() {
      this.options = {
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          x: "right",
          data: [
            "Below 3 Hours",
            "3 to 24 Hours",
            "2 to 15 Days",
            "16 to 30 Days",
            "30 Days Above"
          ],
          padding: [0, 5, 5, 5]
        },
        series: [
          {
            type: "pie",
            //avoidLabelOverlap: false,
            radius: ["40%", "70%"],
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: false,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: true
              }
            },
            data: [
              { value: this.below3Hours, name: "Below 3 Hours" },
              { value: this.hours3to24, name: "3 to 24 Hours" },
              { value: this.days2to15, name: "2 to 15 Days" },
              { value: this.days16to30, name: "16 to 30 Days" },
              { value: this.above30days, name: "30 Days Above" }
            ]
          }
        ],
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

<style scoped >
.echarts {
  width: 320px;
  height: 132px;
  margin: auto;
}
</style>
