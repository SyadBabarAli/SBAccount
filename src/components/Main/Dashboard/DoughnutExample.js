import { Doughnut } from 'vue-chartjs'

export default {
  extends: Doughnut,
  props: ["I", "O", "P"],
  data() {
    return {
      options: {}
    }
  },
  watch: {
    A() {
      this.setChart();
    },
    B() {
      this.setChart();
    }
  },
  mounted() {
    this.setChart();
  },
  methods: {
    setChart() {
      this.options = {
        labels: ['Invoice', 'Overdue','Payment'],
        cutoutPercentage :50,
        datasets: [
          {
            backgroundColor: [
              '#00D8FF',
              '#DD1B16'
            ],
            data: [this.I, this.O, this.P]
          }
        ],
      };
      this.renderChart(this.options, { responsive: true, maintainAspectRatio: false });
    }
  },
}

// import { Doughnut } from "vue-chartjs";

// export default {

//   extends: Doughnut,
//   mounted() {
//     this.renderChart(
//       {
//         labels: ["Active", "Overdue"],
//         datasets: [
//           {
//             backgroundColor: ["rgb(92,107,192)", "rgb(244,67,54)"],
//             data: [40, 10]
//           }
//         ]
//       },
//       { responsive: true, maintainAspectRatio: false }
//     );
//   }
// };
