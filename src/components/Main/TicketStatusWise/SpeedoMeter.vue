<template>
  <highcharts :options="options"  style='height: 190px'></highcharts>
</template>

<script>
    import {Chart} from 'highcharts-vue'
    export default {
       props: ['data'],
        data() {
            return {
                options: {}
            }
        },
        mounted() {
            this.setChart()
        },
        watch: {
            data()
            {
                this.setChart()
            }
        },
        methods: {
            setChart() {
                  this.options = {
                     
                    chart: {
                        type: 'gauge',
                        plotBackgroundColor: null,
                        plotBackgroundImage: null,
                        plotBorderWidth: 0,
                        plotShadow: false,
                    },
                    plotOptions: {
                            gauge: {
                                wrap: false
                            }
                     },

                    title: {
                        text: ''
                    },
                    pane: {
                        startAngle: -150,
                        endAngle: 150,
                    },
                    yAxis: {
                        min: 0,
                        max: 2000,

                        minorTickInterval: 'auto',
                        minorTickWidth: 1,
                        minorTickLength: 10,
                        minorTickPosition: 'inside',
                        minorTickColor: '#666',

                        tickPixelInterval: 30,
                        tickWidth: 2,
                        tickPosition: 'inside',
                        tickLength: 10,
                        tickColor: '#666',
                        labels: {
                            step: 2,
                            rotation: 'auto'
                        },
                        title: {
                            text: 'min'
                        },
                        plotBands: [{
                            from: 0,
                            to: 180,
                            color: '#55BF3B' // green
                            
                        }, {
                            from: 180,
                            to: 1440,
                            color: 'rgb(255, 183, 77)' // yellow
                        }, {
                            from: 1440,
                            to: 2000,
                            color: 'rgb(244,67,54)' // red
                            
                        }]
                    },

                    series: [{
                        name: 'Avg',
                        data :this.data,
                        tooltip: {
                            valueSuffix: ' min'
                        }
                    }]
                  }
            }
        },
        components: {
            highcharts: Chart 
        }
    }
</script>
