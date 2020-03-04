import Vue from "vue";
import Vuex from "vuex";
import moment from "moment";

import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // teams: [],
    // filterTeams: [],

    tree: [],
    filterTree: [],
    selectedIncidentTierQueuesIds: [],
    startDate: moment()
      //.subtract(1, "days")
      .format("YYYY-MM-DD"),
    endDate: moment().format("YYYY-MM-DD"),
    feedbacks: [],
    isLoadingFeedbacks: false,
    responseTickets: [],
    isLoadingResponseTickets: false,
    tickets: [],
    isLoadingTickets: false,
    activeTickets: [],
    pendingDate: "",
    error: "",
    sidebar: true,
    sync: false,
    //syncTime: 1500000,
    syncTime: 60000,
    //syncTime: 10000,
    ticketId: "0",
    arrayMenu: [],
    location: [],
    filterLocation: [],

    supportGroup: [],
    filterSupportGroup: [],

    currentScreenName: "",
    priorityTicket: "0",
    dissatisfactionCount: "0",
    overdueCount: "0",

    loginEmployeeId: "",
    roleUserId: "",
    selectedAnalyst: '',

    //Knowledge Base-Start
    kbArticle: '0',
    //Knowledge Base-End

    dateFrom: moment().format("YYYY-MM-DD"),
    dateTo: moment().format("YYYY-MM-DD"),

  },
  mutations: mutations,
  actions: actions,
  getters: getters
});
