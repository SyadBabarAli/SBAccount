import { Doughnut } from 'vue-chartjs'

export default {
  extends: Doughnut,
  props: ["P1", "P2", "P3", "P4"],
  data() {
    return {
      options: {}
    }
  },
  watch: {
    P1() {
      this.setChart();
    },
    P2() {
      this.setChart();
    },
    P3() {
      this.setChart();
    },
    P4() {
      this.setChart();
    }
  },
  mounted() {
    this.setChart();
  },
  methods: {
    setChart() {
      this.options = {
        // legend: {
        //   display: false
        // },

        labels: ['P1', 'P2', 'P3', 'P4'],
        cutoutPercentage: 50,
        datasets: [
          {
            backgroundColor: [
              '#00D8FF',
              '#DD1B16'
            ],
            data: [this.P1, this.P2, this.P3, this.P4]
          }
        ],
      };
      this.renderChart(this.options, {
        responsive: true, maintainAspectRatio: false, legend: {
          display: false
        },
      });
    }
  },
}