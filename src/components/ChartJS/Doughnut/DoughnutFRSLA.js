import { Doughnut } from "vue-chartjs";

export default {
  extends: Doughnut,
  props: ["met", "breached", "notresponded"],
  data() {
    return {
      options: {}
    };
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
  mounted() {
    this.setChart();
  },
  methods: {
    setChart() {
      this.options = {
        labels: ["Met", "Breached", "Not Responded"],
        datasets: [
          {
            backgroundColor: ["#00D8FF", "#DD1B16"],
            data: [this.met, this.breached,this.notresponded]
          }
        ]
      };
      this.renderChart(this.options, {
        responsive: true,
        maintainAspectRatio: false
      });
    }
  }
};
