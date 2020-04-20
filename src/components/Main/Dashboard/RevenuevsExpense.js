import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  data: () => ({
    chartdata: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Revenue',
          backgroundColor: "rgba(255,99,132,0.2)",
          borderColor: "rgba(255,99,132,1)",
          pointBorderColor: "#fff",
          pointBackgroundColor: "rgba(255,99,132,1)",
          pointBorderColor: "#fff",


          data: [5, 10, 30, 0, 0, 0, 0, 0],
          fill: true

        },
        {
          label: 'Expense',
          backgroundColor: "rgba(255,99,132,0.2)",
          borderColor: "rgba(255,99,132,1)",
          pointBorderColor: "#fff",
          pointBackgroundColor: "rgba(255,99,132,1)",
          pointBorderColor: "#fff",
          data: [15, 25, 40, 0, 0, 0, 0, 0],
          fill: true
        }
      ]
    },
    options: {
      legend: {
        position: 'bottom',
        // labels: {
        //   fontColor: "white",
        //   boxWidth: 20,
        //   padding: 20
        // }
      },
      // scales: {
      //   yAxes: [{
      //     stacked: true
      //   }]
      // },
      responsive: true,
      maintainAspectRatio: false
    }
  }),

  mounted() {
    this.renderChart(this.chartdata, this.options)
  }
}