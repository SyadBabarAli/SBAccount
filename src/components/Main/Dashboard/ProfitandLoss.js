import { HorizontalBar } from 'vue-chartjs'

export default {
  extends: HorizontalBar,
  mounted() {
    this.renderChart({
      labels: ['Expenses', 'Revenue'],
      datasets: [
        {
          data: [100, 75],
          backgroundColor: ["#669911", "#119966"],
          hoverBackgroundColor: ["#66A2EB", "#FCCE56"],
          label: 'Profit & Loss',
        }
      ]
    }, {
      scales: {
        xAxes: [{
          ticks: {
            min: 60
          }
        }],
        yAxes: [{
          stacked: true
        }]
      },
      responsive: true, maintainAspectRatio: false, legend: {
        position: 'bottom',

      },
    })
  }
}
