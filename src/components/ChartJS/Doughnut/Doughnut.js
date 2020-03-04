import { Doughnut } from "vue-chartjs";

export default {
  extends: Doughnut,
  props: ["active", "overdue"],
  data() {
    return {
      options: {}
    };
  },
  watch: {
    active() {
      this.setChart();
    },
    overdue() {
      this.setChart();
    }
  },
  mounted() {
    this.setChart();
  },
  methods: {
    setChart() {
      this.options = {
        labels: ["Active", "Overdue"],
        datasets: [
          {
            backgroundColor: ["#00D8FF", "#DD1B16"],
            data: [this.active, this.overdue]
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
