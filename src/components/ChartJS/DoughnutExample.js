import { Doughnut } from 'vue-chartjs'

export default {
  extends: Doughnut,
  props: ["A", "B"],
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
        labels: ['A', 'B'],
        datasets: [
          {
            backgroundColor: [
              '#00D8FF',
              '#DD1B16'
            ],
            data: [this.A, this.B]
          }
        ],
      };
      this.renderChart(this.options,{responsive: true,maintainAspectRatio: false});
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
