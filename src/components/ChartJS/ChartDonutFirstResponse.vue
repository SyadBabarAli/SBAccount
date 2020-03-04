<template>
  <chart :options="options"></chart>
</template>

<script>
    export default {
        props: ['met', 'breached','notresponded'],
        data() {
            return {
                options: {}
            }
        },
        mounted() {
            this.setChart()
        },
        watch: {
            met() {
                this.setChart()
            },
            breached() {
                this.setChart()
            },
            notresponded() {
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
                        data: ['Met', 'Breached','Not Responded'],
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
                                    show: true
                                }
                            },
                            data: [
                                {value: this.met, name: 'Met'},
                                {value: this.breached, name: 'Breached'},
                                {value: this.notresponded, name: 'Not Responded'}
                            ]
                        }
                    ],
                    color: ['green', 'rgb(244,67,54)','rgb(255, 183, 77)']
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
