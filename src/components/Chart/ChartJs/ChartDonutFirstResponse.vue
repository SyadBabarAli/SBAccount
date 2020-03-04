<template>
  <chart :options="options"></chart>
</template>

<script>
export default {
  props: ["met", "breached", "notresponded"],
  data() {
    return {
      options: {}
    };
  },
  mounted() {
    this.setChart();
  },
  watch: {
    met() {
      this.setChart();
    },
    breached() {
      this.setChart();
    },
    notresponded() {
      this.setChart();
    }
  },
  methods: {
    setChart() {
      this.options = {
        tooltip: {
          trigger: "item",
          //formatter: "{b}: {c} ({d}%)"
          formatter: function(param) {
            var result = "";
            var obj = param;
            var name = obj.name;
            var percent = obj.percent;
            var value = obj.data.value;

            if (name == "Met") {
              result = name + " (≤ 30mins ): " + value + " (" + percent + "%)";
            } else if (name == "Breached") {
              //result = name + " (≥ 30mins): " + value + " (" + percent + "%)";
              result = name + " (> 30mins): " + value + " (" + percent + "%)";
            } else {
              result = name + " " + value + " (" + percent + "%)";
            }

            return result;
          }
        },
        legend: {
          data: ["Met", "Breached", "Not Responded"],
          padding: [0, 5, 5, 5]
        },
        series: [
          {
            type: "pie",
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
              { value: this.met, name: "Met" },
              { value: this.breached, name: "Breached" },
              { value: this.notresponded, name: "Not Responded" }
            ]
          }
        ],
        color: ["green", "rgb(244,67,54)", "rgb(255, 183, 77)"]
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
