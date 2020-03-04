<template>
    <div class="IndividualDetails">
        <div class="text-center" v-if="isLoading">
            <mu-linear-progress :size="8"></mu-linear-progress>
        </div> 

        <div v-else>
        <div class="panel-header grey text-center" style="font-size: 20px;">
         Analyst Comment
        </div>
            <!-- <mu-row gutter>
                <mu-col desktop="40" tablet="40" width="40">
                    <mu-flexbox>
                        <mu-flexbox-item>
                            <mu-select-field fullWidth v-model="perPage">
                                <mu-menu-item title="100" :value="100"></mu-menu-item>
                                <mu-menu-item title="250" :value="250"></mu-menu-item>
                                <mu-menu-item title="500" :value="500"></mu-menu-item>
                            </mu-select-field>
                        </mu-flexbox-item>

                        <mu-flexbox-item class="d-lg">
                           Record Per Page
                        </mu-flexbox-item>
                    </mu-flexbox>
                </mu-col>
                <mu-col desktop="60" tablet="60" width="60"></mu-col>
            </mu-row> -->

            <div class="table-responsive-md">
                <table class="table">
                    <thead>
                        <tr>
                            <th @click="sortBy('EnteredBy')">Entered By</th>
                            <th @click="sortBy('EnteredDate')">Entered Date</th>
                            <th @click="sortBy('Title')">Title</th>
                            <th @click="sortBy('Description')">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="feedback in paginatedFeedbacks" :key="feedback.Title">
                            <td>{{ feedback.EnteredBy }}</td>
                            <td>{{ feedback.EnteredDate }}</td>
                            <td>{{ feedback.Title }}</td>
                            <td>{{ feedback.Description }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
           
            <mu-flexbox class="pt-8">
                <mu-flexbox-item class="d-lg">
                    <span class="pl-8" v-if="filteredFeedbacks.length">Showing {{ showingOffset | toLocaleString }} to {{ showingEntries | toLocaleString }} of {{ filteredFeedbacks.length | toLocaleString }} entries</span>
                </mu-flexbox-item>

                <mu-flexbox-item>
                    <mu-pagination :current="page" :pageSize="perPage" :total="total" @pageChange="pageChange" class="flex-end"></mu-pagination>
                </mu-flexbox-item>
            </mu-flexbox>
            <div class="panel-header grey text-center" style="font-size: 20px;">Support Group</div>
            <div class="table-responsive-md">
                <table class="table">
                    <thead>
                        <tr>
                            <th @click="sortBy('SupportGroup')">Support Group</th>
                            <th @click="sortBy('StartDateTime')">Start DateTime</th>
                            <th @click="sortBy('FinishDateTime')">Finish DateTime</th>
                            <th @click="sortBy('SupportGroupResponseTime')">Support Group Response Time (DD:HH:MM)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="feedback in paginatedListOfRecord2" :key="feedback.SupportGroup">
                            <td>{{ feedback.SupportGroup }}</td>
                            <td>{{ feedback.StartDateTime  | momentDate  }}</td>
                            <td>{{ feedback.FinishDateTime  | momentDate }}</td>
                            <td>{{ convertMinuteIntoTime(feedback.SupportGroupResponseTime) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="panel-header grey text-center" style="font-size: 20px;">
            Support Group Response Time
            </div>
             <mu-row gutter>
                <mu-col desktop="100" tablet="100" width="100">
                    <app-donut :data="this.chartDonutSupportGroup"></app-donut>
                </mu-col>
                <!-- <mu-col desktop="60" tablet="60" width="60">
                    <h1>Two</h1>
                </mu-col> -->
            </mu-row>

             <!-- <mu-row gutter>
                <mu-col desktop="40" tablet="40" width="40">
                    <h1>One</h1>
                </mu-col>
                <mu-col desktop="60" tablet="60" width="60">
                    <h1>Two 4</h1>
                </mu-col>
            </mu-row> -->
            <mu-dialog :open="viewDialog" @close="closeViewDialog" scrollable>
                <app-feedback-details :incidentId="incidentId"></app-feedback-details>

                <mu-flat-button label="Close" slot="actions" primary @click="closeViewDialog"></mu-flat-button>
            </mu-dialog>
        </div>
    </div>
</template>
<script>

    import moment from 'moment'
    import _ from 'lodash'
    import TicketService from '../services/ticket-service'
    import ChartDonut from '../Chart/ChartJs/ChartDonut'

    export default {
        props: ['ID'],
        name: 'IndividualDetails',
        data() {
            return {
                listOfRecord: [],
                listOfRecord2: [],
                page: 1,
                perPage: 100,
                total: 100,
                showingOffset: 1,
                showingEntries: 100,
                orderBy: 'EnteredDate',
                order: 'asc',
                incidentId: '',
                viewDialog: false,
                isLoading: false,
                tickets: []
            }
        },
        computed: {
            filteredFeedbacks() {
                return _.orderBy(this.listOfRecord.filter(feedback => feedback.ResolvedBy == this.individualName), 'EnteredBy', 'desc')
            },
            filteredListOfRecord2() {
                return this.listOfRecord2
            },
            paginatedFeedbacks() {
                let offset = (this.page - 1) * this.perPage, paginatedData = _.take(_.drop(this.filteredFeedbacks, offset), this.perPage)
                this.total = Math.ceil(this.filteredFeedbacks.length / this.perPage * 100)
                this.showingOffset = offset + 1
                this.showingEntries = offset + paginatedData.length
                return _.orderBy(paginatedData, this.orderBy, this.order)
            },
             paginatedListOfRecord2() {
                return this.filteredListOfRecord2
            },
            filteredTickets() {
                return this.tickets.filter(ticket => ticket.ResolvedBy == this.individualName)
            }, 
            chartDonutSupportGroup() {
                var listdata =[];
                var totalTime =0;
                for (var i=0; i < this.listOfRecord2.length; i++)
                {
                    var supportGroupResponseTime = this.listOfRecord2[i].SupportGroupResponseTime;
                    totalTime +=supportGroupResponseTime;
                }
                for (var i=0; i < this.listOfRecord2.length; i++)
                {
                    var supportGroupResponseTime = this.listOfRecord2[i].SupportGroupResponseTime;
                    var supportGroup = this.listOfRecord2[i].SupportGroup;
                    var supportGroupPercentage = (supportGroupResponseTime/totalTime)*100;
                    supportGroupPercentage = supportGroupPercentage.toFixed(2);
                    listdata.push({ value: supportGroupPercentage, name: supportGroup});
                }
                
                //var data = [{ value: 10, name: 'Active'},{value: 20, name: 'Pending'}]
                return listdata
            },
        },
        methods: {
           
            fetchIncidentSLADetails(){
                /////////////Ticket-Analyst Comments/////////////////////////////  
                var ticketId = this.$store.getters.ticketId;
                TicketService.getActionLogById({
                    id: ticketId
                })
                .then(res => {
                    this.listOfRecord = res.data
                }).catch(error => {                  
                    console.log(error)
                })
                /////////////Ticket-Support Group Response/////////////////////////////  
                TicketService.getSupportGroupReponseById({
                    id: ticketId
                })
                .then(res => {
                    this.listOfRecord2 = res.data;
                }).catch(error => {                  
                    console.log(error)
                })
            },
            pageChange(i) {
                this.page = i
            },
            sortBy(val) {
                this.orderBy = val

                if (this.order == 'desc') {
                    this.order = 'asc'
                }
                else {
                    this.order = 'desc'
                }
            },
            btnView(incidentId) {
                this.incidentId = incidentId
                this.viewDialog = true
            },
            closeViewDialog() {
                this.viewDialog = false
            },
            convertMinuteIntoTime(minute)
            {
                var intMinute = minute;
                var strResult = "00:00:00";
                var strHours = (minute / 60).toString().split('.');

                var intDay1 = (intMinute/ 1440);
                var intDay2 = intDay1>= 1 ? intDay1.toString().split('.')[0] : 0;

                var strHour1 = (intMinute - (intDay2 * 1440 )) /60;
                var strHour2 = strHour1>= 1 ? strHour1.toString().split('.')[0] : 0;

                var stMinute1 = intMinute - ((intDay2 * 1440) + ( strHour2 * 60));
                var stMinute2 = stMinute1>= 1 ? stMinute1.toString().split('.')[0] : 0;
    
                strResult = intDay2 + " : " + strHour2 + " : " + stMinute2 ; //+ " : " +strSecond2;
                return strResult;
            }
        },
         beforeMount(){
            this.fetchIncidentSLADetails();
        },
        components: {
            'app-donut': ChartDonut
        }
    }
</script>

<style scoped>
    .IndividualDetails {
        font-size: 12px;
    }
    
    .rating-box {
        white-space: nowrap;
        margin-bottom: 8px;
    }

    .rating-box .analyst-container {
        text-align: center;
        margin: 4px 0;
        padding: 0 20px;
    }

    .analyst-container .analyst-team {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 4px;
    }

    .analyst-container .analyst-name {
        font-size: 13px;
    }
    
    .rating-box .score-container, .rating-box .rating-histogram {
        vertical-align: top;
        display: inline-block;
    }

    .rating-box .score-container {
        text-align: center;
        width: 160px;
        padding: 0 20px;
    }

    .score-container .score {
        font-size: 64px;
        font-weight: 100;
        line-height: 64px;
    }

    .score-container-star-rating {
        height: 24px;
        margin: 0 0 8px 2px;
    }

    .small-star.star-rating-non-editable-container {
        background-image: url(../assets/images/star-empty.png);
        height: 24px;
        width: 120px;
    }

    .small-star {
        position: relative;
    }

    .star-rating-non-editable-container {
        top: 1px;
        left: -1px;
    }

    .small-star .current-rating {
        background: url(../assets/images/star-fillable.png) left bottom;
        height: 24px;
    }

    .current-rating {
        
    }

    .score-container .reviews-stats {
        color: #8D8D8D;
    }

    .rating-box .reviewers-small {
        top: 3px;
    }

    .reviewers-small {
        background-image: url(../assets/images/reviewers.png);
        background-position: center;
        background-repeat: no-repeat;
        height: 16px;
        width: 16px;
        display: inline-block;
        position: relative;
    }

    .rating-box .rating-histogram {
        /* width: 425px;
        width: 170px; */
        width: 100%;
        padding: 0 20px 0 30px;
    }

    .rating-box .rating-bar-container {
        height: 23px;
        position: relative;
        margin-bottom: 2px;
    }

    .rating-box .bar-label {
        font-size: 11px;
        letter-spacing: 1px;
        position: absolute;
        top: 4px;
        left: -28px;
    }

    .rating-box .bar-label .star-tiny {
        position: relative;
        top: -2px;
        left: -2px;
    }

    .star-tiny.star-full {
        background-image: url(../assets/images/star-full.png);
    }

    .star-tiny {
        height: 14px;
        width: 14px;
        vertical-align: middle;
        display: inline-block;
    }

    .rating-bar-container.five .bar {
        background: #88B131;
    }

    .rating-bar-container.four .bar {
        background: #99CC00;
    }

    .rating-bar-container.three .bar {
        background: #FFCF02;
    }

    .rating-bar-container.two .bar {
        background: #FF9F02;
    }

    .rating-bar-container.one .bar {
        background: #FF6F31;
    }

    .rating-bar-container .bar {
        height: 100%;
        display: inline-block;
        opacity: .8;
        transition: width .25s ease;
    }

    .rating-box .bar-number {
        font-size: 11px;
        position: absolute;
        top: 4px;
        left: 5px;
    }

    .response-rate-box {
        margin-bottom: 8px;
    }

    .response-rate-box .circle-container {
        text-align: center;
    }
    
    @media (max-width: 768px) {
        .rating-box .score-container {
            width: 100%;
        }

        .small-star.star-rating-non-editable-container {
            margin: 0 auto;
        }
    }
</style>