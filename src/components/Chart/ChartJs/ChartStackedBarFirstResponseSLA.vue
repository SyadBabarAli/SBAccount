<template>
  <div class="stacked-bar mb-8">
    <chart :options="options" v-if="tickets.length"></chart>
  </div>
</template>

<script>
    import moment from 'moment'

    export default {
        props: ['tickets'],
        data() {
            return {
                options: {},
                teams: [],
                metCount: [],
                breachedCount: [],
                notrespondedCount: [],
            }
        },
        mounted() {
            
        },
        updated() {
            
        },
        watch: {
            tickets() {
                this.teams = []
                this.metCount = []
                this.breachedCount = []
                this.notrespondedCount = []

                _.forEach(_.groupBy(this.tickets, 'SupportGroup'), (val, key) => {
                    this.teams.push(val[0].SupportGroup)
                    this.teams.sort()
                    this.metCount.push(0)
                    this.breachedCount.push(0)
                    this.notrespondedCount.push(0)
                })

                _.forEach(_.groupBy(this.met, 'SupportGroup'), (val, key) => {
                    let i = this.teams.findIndex(t => t == key)

                    this.metCount.splice(i, 1, val.length)
                })

                _.forEach(_.groupBy(this.breached, 'SupportGroup'), (val, key) => {
                    let i = this.teams.findIndex(t => t == key)

                    this.breachedCount.splice(i, 1, val.length)
                })

                _.forEach(_.groupBy(this.notResponded, 'SupportGroup'), (val, key) => {
                    let i = this.teams.findIndex(t => t == key)

                    this.notrespondedCount.splice(i, 1, val.length)
                })

                this.setChart()
            },
            '$store.getters.sidebar': {
                handler() {
                    document.querySelector('.stacked-bar .echarts div').style.margin = 'auto'
                }
            }
        },
        computed: {
            met() {
                var obj = this.tickets.filter(data => data.SLA === "Met");
                return obj;
            },
            breached() {
               var obj = this.tickets.filter(data => data.SLA === "Breached");
                return obj;
            },
            notResponded() {
                var obj = this.tickets.filter(data => data.SLA === "Not Responded");
                return obj;
            },
        },
        methods: {
            setChart() {
                this.options = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        data: ['Met', 'Breached', 'Not Responded']
                    },
                    // grid: {
                    //     left: '3%',
                    //     right: '4%',
                    //     bottom: '3%',
                    //     top: '20%',
                    //     containLabel: true
                    // },

                   // scales: {
                        xAxis: [
                            {
                                stacked: true,
                                type: 'category',
                                data: this.teams,
                                axisLabel: {
                                    rotate: 40,
                                    fontSize: 10,                                
                                },
                                
                                
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                axisLabel: {
                                    fontSize: 10,                                
                                },
                            }
                        ],
                  //  },
                  type: "stackedBar100",
                    series: [
                        
                        {
                            name: 'Met',
                            type: 'bar',
                            stack: 'stack',
                            data: this.metCount
                        },
                        {
                            name: 'Breached',
                            type: 'bar',
                            stack: 'stack',
                            data: this.breachedCount
                        },
                        {
                            name: 'Not Responded',
                            type: 'bar',
                            stack: 'stack',
                            data: this.notrespondedCount
                        },
                    ].reverse(),
                    color: ['green', 'rgb(244,67,54)', 'rgb(255, 183, 77)'].reverse(),
                }
            }
        }
    }
</script>

<style scoped>
    .echarts {
        width: 100%;
        height: 210px!important;
        margin: auto;
    }
</style>
