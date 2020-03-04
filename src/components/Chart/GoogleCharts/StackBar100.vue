<template>
 <GChart type="ColumnChart"  :data="chartData" :options="options" />
</template>
<script>

import { GChart } from 'vue-google-charts'

    export default {
        props: ['data'],
        data() {
            return {
                    chartData:{},
                    options: {},
                    resultArray: [],
            }
        },
        mounted() {
           this.setChart()
        }, 
       watch: {
            data() { 
                this.resultArray = []
                this.resultArray.push(['Empty','Met', 'Breached','NotResponded'] );
                _.forEach(_.groupBy(this.data, 'SupportGroup'), (val, key) => {

                    var objCountSupportGroup=  _.countBy(val,'SLA');
                    var array = [key,objCountSupportGroup.Breached,objCountSupportGroup.Met,objCountSupportGroup["Not Responded"]];
                    this.resultArray.push(array)
                })
              
                if( this.resultArray != undefined)
                {
                 this.chartData =  this.resultArray;
                }
            },
        },
        methods: {
            setChart() {
                        this.options = {
                                isStacked: 'percent',
                                height: 250,
                                legend: {position: 'top', maxLines: 3},
                                vAxis: {
                                    minValue: 0,
                                    ticks: [0, .5, 1]
                                }
                        }
            }
        },
        components: {
            GChart: GChart 
        }
    }
</script>

<style scoped>
</style>
