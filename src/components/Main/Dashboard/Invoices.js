import { Pie } from 'vue-chartjs'

export default {
  extends: Pie,
  cutoutPercentage: 50,
  data: {
    // labels: ["Green", "Blue", "Gray", "Purple", "Yellow", "Red", "Black"],
    // datasets: [{
    //   backgroundColor: [
    //     "#2ecc71",
    //     "#3498db",
    //     "#95a5a6",
    //     "#9b59b6",
    //     "#f1c40f",
    //     "#e74c3c",
    //     "#34495e"
    //   ],
    //   data: [12, 19, 3, 17, 28, 24, 7]
    // }]
  },
  mounted() {
    this.renderChart({
      labels: ["Invoiced", "Overdue", "Payment"],
      datasets: [
        {
          backgroundColor: [
            'rgba(255,99,132,0.2)',
            '#E46651',
            '#00D8FF',
          ],
          data: [40, 20, 80]
        }
      ]
    }, {

      tooltips: {
        enabled: false
      },
      pieceLabel: {
        mode: 'value',
        position: 'outside',
      },
      responsive: true,
      legend: {
        position: 'bottom',
      },
      // title: {
      //   display: true,
      //   text: 'Idades',
      //   fontSize: 20
      // },
      animation: {
        animateScale: true,
        animateRotate: true
      },
      // pieceLabel: {
      //   render: 'label',
      //   position: 'outside',
      //   segment: true
      // },
      responsive: true, maintainAspectRatio: false,
      // legend: {
      //   position: 'bottom',
      //   // labels: {
      //   //   fontColor: "white",
      //   //   boxWidth: 20,
      //   //   padding: 20
      //   // }
      // },
    })
  }
}
