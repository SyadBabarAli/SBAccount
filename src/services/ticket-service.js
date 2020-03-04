import { ticket } from "./";

export default {
  getResolved(query) {
    return ticket().get("/resolved", {
      params: query
    });
  },
  get(query) {
    return ticket().get("", {
      params: query
    });
  },
  getActive(detailType) {
    return ticket().get(`/active/${detailType}`);
  },
  getPriority() {
    return ticket().get("/priority");
  },
  getTicketDetails(ticketId) {
    return ticket().get(`/details?id=${ticketId}`);
  },
  getPriorityTicketsByDateRange(query) {
    return ticket().get("/getPriorityTicketsByDateRange", {
      params: query
    });
  },
  getOpenTicketByDateEnd(query) {
    return ticket().get("/getOpenTicketByDateEnd", {
      params: query
    });
  },
  getALLTicketWithSLA1(query) {
    return ticket().get("/getALLTicketWithSLA1", {
      params: query
    });
  },
  getActionLogById(query) {
    return ticket().get("/getActionLogById", {
      params: query
    });
  },
  getSupportGroupReponseById(query) {
    return ticket().get("/getSupportGroupReponseById", {
      params: query
    });
  },
  getSLAFirstResponseByDateRange(query) {
    return ticket().get("/getSLAFirstResponseByDateRange", {
      params: query
    });
  },
  getSPDBSLAFirstResponseByResolved(query) {
    return ticket().get("/getSPDBSLAFirstResponseByResolved", {
      params: query
    });
  },
  getTicketResolvedAndClosedByDate(query) {
    return ticket().get("/getTicketResolvedAndClosedByDate", {
      params: query
    });
  },
  getTicketAgeingByDateRange(query) {
    return ticket().get("/getTicketAgeingByDateRange", {
      params: query
    });
  },
  getTicketSearch(query) {
    return ticket().get("/getTicketSearch", {
      params: query
    });
  },
  getTicketSerachDetail(query) {
    return ticket().get("/getTicketSerachDetail", {
      params: query
    });
  },
  getTrendChart(query) {
    return ticket().get("/getTrendChart", {
      params: query
    });
  },
  getTrendChartCreatedDate(query) {
    return ticket().get("/getTrendChartCreatedDate", {
      params: query
    });
  },


  getFollowUpTicket(query) {
    return ticket().get("/GetFollowUpTicket", {
      params: query
    });
  },

  getReportZoneNR(query) {
    return ticket().get("/GetReportZoneNR", {
      params: query
    });
  },

  getReportAnalystNR(query) {
    return ticket().get("/GetReportAnalystNR", {
      params: query
    });
  },
  getReportZoneBySupportGroupNR(query) {
    return ticket().get("/GetReportZoneBySupportGroupNR", {
      params: query
    });
  },

  getReportZoneWiseNR(query) {
    return ticket().get("/GetReportZoneWiseNR", {
      params: query
    });
  },


  getReportZoneNR2(query) {
    return ticket().get("/GetReportZoneNR2", {
      params: query
    });
  },

  getReportZoneNR2Detail(query) {
    return ticket().get("/GetReportZoneNR2Detail", {
      params: query
    });
  },


};
