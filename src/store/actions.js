import moment from "moment";

import AuthorizationService from "../services/authorization-service";
import FeedbackService from "../services/feedback-service";
import TicketService from "../services/ticket-service";

export default {
  async fetchTree({ commit }) {
    const res = await AuthorizationService.getTree();
    commit("setTree", res.data);
  },
  storeFilterTree({ commit }, payload) {
    commit("setFilterTree", payload);
  },
  storeIncidentTierQueuesIds({ commit }, payload) {
    commit("setIncidentTierQueuesIds", payload);
  },
  //New 06-03-2019
  storeTree({ commit }, payload) {
    commit("setTree", payload);
  },


  async fetchTree({ commit }) {
    const res = await AuthorizationService.getTree();
    commit("setTree", res.data);
  },
  // storeFilterTree({ commit }, payload) {
  //   commit("setFilterTree", payload);
  // },
  storeStartDate({ commit }, payload) {
    commit("setStartDate", payload);
  },
  storeEndDate({ commit }, payload) {
    commit("setEndDate", payload);
  },
  storeTicketId({ commit }, payload) {
    commit("setTicketId", payload);
  },
  async fetchFeedbacks({ commit }, payload) {
    commit("setIsLoadingFeedbacks", true);
    try {
      commit("setFeedbacks", []);
      const res = await FeedbackService.get(payload);
      
      //debugger
      //2
      //console.log("fetchFeedbacks " +res.data.length);

      commit("setFeedbacks", res.data);
      commit("setIsLoadingFeedbacks", false);
    } catch (err) {
      commit("setFeedbacks", []);
      commit("setIsLoadingFeedbacks", false);
    }
  },
  //Feedback-Individual Ratings
  async fetchFeedbacks2({ commit }, payload) {
    commit("setIsLoadingFeedbacks", true);
    try {
      commit("setFeedbacks", []);
      const res = payload; //await FeedbackService.get(payload)
      //console.log("fetchFeedbacks2 " +res.data.length);
      commit("setFeedbacks", res.data);
      commit("setIsLoadingFeedbacks", false);
    } catch (err) {
      commit("setFeedbacks", []);
      commit("setIsLoadingFeedbacks", false);
    }
  },
  //Resolved Ticket No Divided By Feedback Count
  async fetchResponseTickets({ commit }, payload) {
    commit("setIsLoadingResponseTickets", true);
    try {
      const res = await TicketService.getResolved(payload);
//debugger
      commit("setResponseTickets", res.data);
      commit("setIsLoadingResponseTickets", false);
      commit("storeError", "");
    } catch (err) {
      commit("setIsLoadingResponseTickets", false);
      err.response.data.Message = "N/A";
      commit("storeError", err.response.data);
      commit("setResponseTickets", []);
    }
  },
  async fetchTickets({ commit }, payload) {
    commit("setIsLoadingTickets", true);
    try {
      const res = await TicketService.get(payload);
      commit("setTickets", res.data);
      commit("setIsLoadingTickets", false);
    } catch (err) {
      commit("setTickets", []);
      commit("setIsLoadingTickets", false);
    }
  },
  async fetchTickets2({ commit }, data) {
    commit("setIsLoadingTickets", true);
    try {
      const res = data; // await TicketService.get(payload)
      commit("setTickets", res.data);
      commit("setIsLoadingTickets", false);
    } catch (err) {
      commit("setTickets", []);
      commit("setIsLoadingTickets", false);
    }
  },
  async fetchActiveTickets({ commit }, payload) {
    try {
      const res = await TicketService.getOpenTicketByDateEnd(payload);
      //debugger
      commit("setActiveTickets", res.data);
    } catch (err) {
      console.log(err.response.data.Message);
    }
  },
  getPendingDate({ commit }) {
    commit(
      "setPendingDate",
      moment()
        .subtract(3, "days")
        .format("YYYY-MM-DD")
    );
  },
  setSidebar({ commit }, payload) {
    commit("setSidebar", payload);
  },
  onSync({ commit }, payload) {
    commit("onSync", payload);
  },
  storeArrayMenu({ commit }, payload) {
    commit("setArrayMenu", payload);
  },
  storeLocation({ commit }, payload) {
    commit("setLocation", payload);
  },
  storeFilterLocation({ commit }, payload) {
    commit("setFilterLocation", payload);
  },

  storePriorityTicket({ commit }, payload) {
    commit("setPriorityTicket", payload);
  },
  storeDissatisfactionCount({ commit }, payload) {
    commit("setDissatisfactionCount", payload);
  },
  overdueCount({ commit }, payload) {
    commit("setOverdueCount", payload);
  },

  storeSupportGroup({ commit }, payload) {
    commit("setSupportGroup", payload);
  },
  storeFilterSupportGroup({ commit }, payload) {
    commit("setFilterSupportGroup", payload);
  },

  storeSelectedAnalyst({ commit }, payload) {
    commit("setSelectedAnalyst", payload);
  },

  //Knowledge Base
  storeKBArticle({ commit }, payload) {
    commit("setKBArticle", payload);
  },

  storeDateFrom({ commit }, payload) {
    commit("setDateFrom", payload);
  },
  storeDateTo({ commit }, payload) {
    commit("setDateTo", payload);
  }
};
