<template>
  <chart :options="options"></chart>
</template>

<script>
    export default {
        props: ['active', 'overdue'],
        data() {
            return {
                options: {}
            }
        },
        mounted() {
            this.setChart()
        },
        watch: {
            active() {
                this.setChart()
            },
            overdue() {
                this.setChart()
            }
        },
        methods: {
            setChart() {
                this.options = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b}: {c} ({d}%)"
                    },
                    legend: {
                        data: ['Active', 'Overdue'],
                        padding: [0, 5, 5, 5]
                    },
                    series: [
                        {
                            type: 'pie',
                            radius: ['40%', '70%'],
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: false,
                                    textStyle: {
                                        fontSize: '30',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: [
                                {value: this.active, name: 'Active'},
                                {value: this.overdue, name: 'Overdue'}
                            ]
                        }
                    ],
                    color: ['rgb(92,107,192)', 'rgb(244,67,54)']
                }
            }
        }
    }
</script>

<style scoped>
    .echarts {
        width: 320px!important;
        height: 132px!important;
        margin: auto;
    }
</style>
