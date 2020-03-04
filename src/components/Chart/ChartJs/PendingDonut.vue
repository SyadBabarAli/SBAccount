<template>
  <div>
    <chart :options="options"></chart>
  </div>
</template>

<script>
export default {
  props: ["itPending", "vendorPending", "userPending"],
  data() {
    return {
      options: {}
    };
  },
  mounted() {
    this.setChart();
  },
  watch: {
    totalPending() {
      this.setChart();
    }
  },
  computed: {
    totalPending() {
      return this.itPending + this.vendorPending + this.userPending;
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
          data: ["Active", "Vendor Pending", "User Pending"],
          textStyle: {
            fontSize: 10
          },
          top: "bottom"
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
                show: false
              }
            },
            data: [
              { value: this.itPending, name: "Active" },
              { value: this.vendorPending, name: "Vendor Pending" },
              { value: this.userPending, name: "User Pending" }
            ]
          }
        ],
        color: ["rgb(255, 183, 77)", "rgb(100, 181, 246)", "rgb(161, 136, 127)"]
      };
    }
  }
};
</script>

<style scoped>
.echarts {
  top:-20px;
  /* margin-top: 0px!important; */
  height: 264px !important;
  width: 300px !important;
  margin: auto;
}

/* .echarts {
  margin-top: -25px;
  width: 200px !important;
  height: 150px !important;
  margin: auto;
} */

/* .echarts {
        width: 264px!important;
        height: 264px!important;
        margin: auto;
    } */
</style>
