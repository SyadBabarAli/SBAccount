
import { callstatustics } from "./";

export default {
  getCallHelpDeskStatusticsByDateRange(query) {
    return callstatustics().get("/getCallHelpDeskStatusticsByDateRange", {
      params: query
    });
  },
  getAgentActivityStatusticsByDateRange(query) {
    return callstatustics().get("/getAgentActivityStatusticsByDateRange", {
      params: query
    });
  },
  getCallAbandonStatisticsByDateRange(query) {
    return callstatustics().get("/getCallAbandonStatisticsByDateRange", {
      params: query
    });
  },
  getCallAbandonStatisticsDetail(id) {
    return callstatustics().get(`/getCallAbandonStatisticsDetail?id=${id}`);
  },
  getCallHelpDeskStatisticsMonthly(query) {
    return callstatustics().get("/getCallHelpDeskStatisticsMonthly", {
      params: query
    });
  },
  getCallStatisticsDetail(id) {
    return callstatustics().get(`/getCallStatisticsDetail?id=${id}`);
  },
};


// import { callstatustics } from './'

// export default {
//     getCallHelpDeskStatusticsByDateRange(query) {
//         return callstatustics().get('/getCallHelpDeskStatusticsByDateRange', {
//             params: query
//         })
//     },
//     getAgentActivityStatusticsByDateRange(query) {
//         return callstatustics().get('/getAgentActivityStatusticsByDateRange', {
//             params: query
//         })
//     }
// }