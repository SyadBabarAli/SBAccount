<template>
    <div>
        <mu-appbar title="Dashboard" class="fixed-top mh-50">
            <mu-icon-button icon="menu" slot="left" @click="toggleMenu"></mu-icon-button>

            <mu-flat-button to="/feedback" slot="right" class="notification">
                <span class="d-lg">Dissatisfaction</span>
                <mu-circular-progress :size="20" color="white" class="notification-item" v-if="isLoadingFeedbacks"></mu-circular-progress>
                <mu-badge :content="feedbackCount" :color="feedbackColor" class="notification-item" v-else></mu-badge>
            </mu-flat-button>

            <mu-flat-button to="priority" slot="right" class="notification">
                <span class="d-lg">Priority</span>
                <mu-circular-progress :size="20" color="white" class="notification-item" v-if="isLoadingTickets"></mu-circular-progress>
                <mu-badge :content="priorityCount" :color="priorityColor" class="notification-item" v-else></mu-badge>
            </mu-flat-button>

            <mu-flat-button :to="{ path: '/pending', query: { display: 'overdue' } }" slot="right" class="notification">
                <span class="d-lg">Overdue</span>
                <mu-circular-progress :size="20" color="white" class="notification-item" v-if="isLoadingTickets"></mu-circular-progress>
                <mu-badge :content="pendingCount" :color="pendingColor" class="notification-item" v-else></mu-badge>
            </mu-flat-button>

            <mu-checkbox label="Auto-Sync" uncheckIcon="sync_disabled" checkedIcon="sync" labelLeft slot="right" v-model="sync" class="auto-sync"></mu-checkbox>
             
             <!-- <mu-flat-button slot="right" class="notification"  v-on:click="logout">
                <span class="d-lg">Logout</span>                
            </mu-flat-button> -->
        </mu-appbar>

        <mu-drawer :open="menu" :docked="false" @close="toggleMenu">
            <mu-list @itemClick="toggleMenu">
                <mu-list-item title="Home" to="/"></mu-list-item>
                <mu-list-item title="All Tickets" to="/AllTickets"></mu-list-item>
                <mu-list-item title="Priority" to="/priority"></mu-list-item>
                <mu-list-item title="Pending" to="/pending"></mu-list-item>
                <mu-list-item title="Feedback" to="/feedback"></mu-list-item>
                <mu-list-item title="First Response SLA" to="/FirstResponseSLA"></mu-list-item>
                <!-- <mu-list-item title="Service Desk Statistics" to="/servicedeskstatistics"></mu-list-item> -->
                <!-- <mu-list-item title="Ftag" to="/ftag"></mu-list-item> -->
                <!-- <mu-list-item title="Attendance Sheet" to="/sdkpi"></mu-list-item> -->
                <mu-list-item title="Met And Breached" to="/MetAndBreached"></mu-list-item>
                <mu-list-item title="Tickets" to="/Tickets"></mu-list-item>

                <!-- <mu-list-item title="User" to="/User"></mu-list-item>
                <mu-list-item title="UserGroup" to="/UserGroup"></mu-list-item>
                <mu-list-item title="UserRight" to="/UserRight"></mu-list-item> -->
            </mu-list>
        </mu-drawer>
    </div>
</template>

<script>
    import moment from 'moment'
    import _ from 'lodash'

    import FeedbackService from '../../services/feedback-service'
    import TicketService from '../../services/ticket-service'

    export default {
        data() {
            return {
                menu: false,
                startDate: '',
                endDate: '',
                feedbacks: [],
                isLoadingFeedbacks: false,
                tickets: [],
                isLoadingTickets: false,
                timer: '',
                sync: false
            }
        },
        mounted() {
            this.runMethods()
        },
        watch: {
            sync(value) {
                this.$store.dispatch('onSync', value)
            },
            '$store.getters.sync': {
                immediate: true,
                handler() {
                    if (this.$store.getters.sync) {
                        this.timer = setInterval(this.runMethods, this.$store.getters.syncTime)
                    } else {
                        this.cancelAutoUpdate()
                    }
                }
            }
        },
        computed: {
            activeTickets() {
                return this.$store.getters.activeTickets
            },
            feedbackCount() {
                let filterFeedbacks = this.feedbacks.filter(feedback => _.includes(this.$store.getters.filterTeams, feedback.SupportGroup) && feedback.Rating <= 2)
                let count
                if (filterFeedbacks) {
                    count = filterFeedbacks.length.toString()
                } else {
                    count = '0'
                }
                return count
            },
            priorityCount() {
                let filterTickets = this.tickets.filter(ticket => _.includes(this.$store.getters.filterTeams, ticket.SupportGroup) && ticket.Priority === 1)
                let count
                if (filterTickets) {
                    count = filterTickets.length.toString()
                } else {
                    count = '0'
                }
                return count
            },
            pendingCount() {
                let filterTickets = this.activeTickets.filter(ticket => _.includes(this.$store.getters.filterTeams, ticket.SupportGroup) && ticket.Age >= 3)
                let count
                if (filterTickets) {
                    count = filterTickets.length.toString()
                } else {
                    count = '0'
                }
                return count
            },
            feedbackColor() {
                if (this.feedbackCount !== '0') {
                    return 'red'
                }
            },
            priorityColor() {
                if (this.priorityCount !== '0') {
                    return 'red'
                }
            },
            pendingColor() {
                if (this.pendingCount !== '0') {
                    return 'red'
                }
            }
        },
        methods: {
            logout()
            {
                try 
                {
                    //document.execCommand("ClearAuthenticationCache");

                    var cookies = document.cookie.split(";");

                    for (var i = 0; i < cookies.length; i++) {
                        var cookie = cookies[i];
                        var eqPos = cookie.indexOf("=");
                        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                    }
                } 
                catch (e) 
                {
                    alert('exception');
                }
            },
            toggleMenu() {
                this.menu = !this.menu
            },
            setDate() {
                this.startDate = moment().subtract(1, 'days').format('YYYY-MM-DD'),
                this.endDate = moment().format('YYYY-MM-DD')
            },
            async fetchFeedbacks() {
                this.isLoadingFeedbacks = true
                 try {
                     
                    const res = await FeedbackService.get({
                        start_date: `${this.startDate}T00:00:00`,
                        end_date: `${this.endDate}T23:59:59`
                    })
                    if (res) {
                    //debugger
                        //-1
                        this.feedbacks = res.data
                        this.$store.dispatch('fetchFeedbacks2',res);
                        this.isLoadingFeedbacks = false
                    }
                  } catch (err) {
                     this.isLoadingFeedbacks = false
                    console.log(err.response.data.Message)
                }
            },
            //Top Bar Priority | Overdue
            async fetchTickets() {
                this.isLoadingTickets = true
                try {
                    const res = await TicketService.get({
                        start_date: `${this.startDate}T00:00:00`,
                        end_date: `${this.endDate}T23:59:59`
                    })

                    if (res) {
                        this.tickets = res.data
                        if (this.$store.getters.currentScreenName != "Feedback") {
                        this.$store.dispatch('fetchTickets2',res);
                        }
                        this.isLoadingTickets = false
                    }
                } catch (err) {
                     this.isLoadingTickets = false
                    console.log(err.response.data.Message)
                }
            },
            fetchActiveTickets() {
                this.$store.dispatch('getPendingDate')
                this.$store.dispatch('fetchActiveTickets',{ end_date: `${this.$store.getters.endDate}T23:59:59`})
            },
            runMethods() {
                this.setDate()
                this.fetchFeedbacks()
                this.fetchTickets()
                this.fetchActiveTickets()
            },
            cancelAutoUpdate() {
                clearInterval(this.timer)
            },
            beforeDestroy() {
                this.cancelAutoUpdate()
            }
        }
    }
</script>

<style>
    .notification {
        padding: 12px
    }
    .notification-item {
        margin-left: 8px;
    }
    .auto-sync .mu-checkbox-icon-uncheck {
        color: rgba(255, 255, 255, 0.87);
    }
    .auto-sync .mu-checkbox-icon-checked {
        color: #FFCF02;
    }
    .auto-sync .mu-checkbox-label {
        color: rgba(255, 255, 255, 0.87);
    }
</style>