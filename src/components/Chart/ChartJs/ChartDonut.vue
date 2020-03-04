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
                    // legend: {
                    //     //data: ['Active', 'Vendor Pending', 'User Pending'],
                    //     textStyle: {
                    //         fontSize: 8
                    //     },
                    //     top: 'bottom'
                    // },
                    series: [
                        {
                            type : 'pie',
                            data : this.data,
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
                    //color: ['rgb(255, 183, 77)','rgb(100, 181, 246)', 'rgb(161, 136, 127)']
                }
            }
        }
    }
</script>

<style scoped>
    .echarts {
        width: 264px!important;
        height: 264px!important;
        margin: auto;
    }
</style>
