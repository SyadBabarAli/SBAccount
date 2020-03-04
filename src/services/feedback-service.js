import { feedback } from "./";
import store from "@/store";

import moment from "moment";

export default {
  get(query) {
    // //Validate Date From And To
    // var strCurrentDate = new Date(query.start_date);
    // var strNewEndDate = new Date(query.end_date);

    // var difference = strNewEndDate - strCurrentDate;
    // if(difference<0)
    // {
    //     alert("Please select date end should be greater than start date");
    // }
    // else
    // {
    //     //End Validate Date From And To
    // const currentDate = moment().format('YYYY-MM-DD')
    // const currentTime = moment().format('HH:mm:ss')
    // const endDate = store.getters.endDate
    // const newEndDate = moment().add(1, 'days').format('YYYY-MM-DD')

    // if (currentDate === endDate && currentTime >= '23:45:00') {
    //     store.dispatch('storeStartDate', currentDate)
    //     store.dispatch('storeEndDate', newEndDate)
    // }

    return feedback().get("", {
      params: query
    });
    //}
  },
  // getResolvedTicketWithFeedback(query) {
  //     const currentDate = moment().format('YYYY-MM-DD')
  //     const currentTime = moment().format('HH:mm:ss')
  //     const endDate = store.getters.endDate
  //     const newEndDate = moment().add(1, 'days').format('YYYY-MM-DD')

  //     if (currentDate === endDate && currentTime >= '23:45:00') {
  //         store.dispatch('storeStartDate', currentDate)
  //         store.dispatch('storeEndDate', newEndDate)
  //     }

  //     return feedback().get('getResolvedTicketWithFeedback', {
  //         params: query
  //     })
  // },

  getResolvedTicketWithFeedback(query) {
    return feedback().get("/getResolvedTicketWithFeedback", {
      params: query
    });
  },
  updateCommentsAgainstUserFeedback(query) {
    return feedback().get("/getupdateCommentsAgainstUserFeedback", {
      params: query
    });
  },
  getIndividualRatingFeedback(query) {
    return feedback().get("/getIndividualRatingFeedback", {
      params: query
    });
  },
  getFinanceGetTicketByFtag(query) {
    return feedback().get("/getFinanceGetTicketByFtag", {
      params: query
    });
  }
  // ,updateCommentsAgainstUserFeedback(query) {
  //     return feedback().get('/updateCommentsAgainstUserFeedback', {
  //         params: query
  //     })
  // }
};
