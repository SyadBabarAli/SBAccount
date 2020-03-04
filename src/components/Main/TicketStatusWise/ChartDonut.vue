<template>
  <chart :options="options"></chart>
</template>

<script>
    export default {
        props: ['Met', 'Breached'],
        data() {
            return {
                options: {}
            }
        },
        mounted() {
            this.setChart()
        },
        watch: {
            totalPending() {
                this.setChart()
            }
        },
        computed: {
            totalPending() {
                return this.Met + this.Breached
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
                        data: ['Met', 'Breached'],
                        textStyle: {
                            fontSize: 10
                        },
                        
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
                                {value: this.Met, name: 'Met'},
                                {value: this.Breached, name: 'Breached'}
                            ]
                        }
                    ],
                    color: ['green','rgb(244,67,54)']
                }
            }
        }
    }
</script>

<style scoped>
  .echarts {
        width: 320px!important;
        height: 190px!important;
         /* height: 182px!important; */
        /* height: 132px!important; */
        /* height: 160px!important; */
        margin: auto;
    }
</style>
