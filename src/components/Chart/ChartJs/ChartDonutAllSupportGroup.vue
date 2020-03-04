<template>
  <chart :options="options"></chart>
</template>

<script>
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
            getData() {
                this.setChart()
            }
        },
        computed: {
            getData() {
                return this.data 
            }
        },
        methods: {
            setChart() {
                this.options = {
                       tooltip: {
                        trigger: 'item',
                        formatter: "{b} : {d}%",
                    },
                   legend: {
                            display: true, 
                            position: 'top',                           
                           },
                    series: [
                        {
                            type : 'pie',
                            data :this.data,
                            radius: ['20%', '30%'],
                            // label: {
                            //     normal: {
                            //         show: false,
                            //         position: 'center'
                            //     },
                            //     emphasis: {
                            //         show: false,
                            //         textStyle: {
                            //             fontSize: '30',
                            //             fontWeight: 'bold'
                            //         }
                            //     }
                            // },
                            // labelLine: {
                            //     normal: {
                            //         show: false
                            //     }
                            // },
                        }
                    ],
                    color: ['green', 'red','gray'] //rgb(244,67,54)
                }
            }
        }
    }
</script>

<style scoped>
    .echarts {
        width: 620px!important;
        height: 660px!important;
        margin: auto;
    }
</style>
