import _ from "lodash";

export default {
  teams(state) {
    return _.sortBy(state.teams, "TeamAssigned");
  },
  filterTree(state) {
    return state.filterTree;
  },
  selectedIncidentTierQueuesIds(state) {
    return state.selectedIncidentTierQueuesIds;
  },
  tree(state) {
    return state.tree;
  },
  // filterTree(state) {
  //   return state.filterTree;
  // },
  startDate(state) {
    return state.startDate;
  },
  ticketId(state) {
    return state.ticketId;
  },
  endDate(state) {
    return state.endDate;
  },
  feedbacks(state) {
    //debugger
    var result = _.orderBy(
      state.feedbacks.filter(
        feedback =>
          _.includes(state.filterTree, feedback.SupportGroup) &&
          _.includes(state.filterLocation, feedback.Property_Location)
      ),
      "Date",
      "desc"
    );

    return result;
  },
  isLoadingFeedbacks(state) {
    return state.isLoadingFeedbacks;
  },
  responseTickets(state) {
    return state.responseTickets.filter(
      ticket =>
        _.includes(state.filterTree, ticket.SupportGroup) &&
        _.includes(state.filterLocation, ticket.Property_Location)
    ); 
  },
  isLoadingResponseTickets(state) {
    return state.isLoadingResponseTickets;
  },
  //Home Impact (% of Tickets Resolved (Overall IT))
  tickets(state) {
    var result = state.tickets.filter(
      ticket =>
        _.includes(state.filterTree, ticket.SupportGroup) &&
        _.includes(state.filterLocation, ticket.Property_Location)
    );

    // var a = state.tickets.filter(
    //   ticket => _.includes(state.filterTree, ticket.SupportGroup)
    //   // &&
    //   //  _.includes(state.filterLocation, ticket.Property_Location)
    // );

    // var b = state.tickets.filter(
    //   ticket =>
    //     _.includes(state.filterTree, ticket.SupportGroup) &&
    //     _.includes(state.filterLocation, ticket.Property_Location)
    // );

    // //var resultFinal = _.intersectionBy(result, result2, "SupportGroup");

    // var arrayAll = [],
    //   arrayFilter = [],
    //   arrayFinal = [];
    // a.forEach(function(obj) {
    //   arrayAll.push(obj.Property_Location);
    // });

    // b.forEach(function(obj) {
    //   arrayFilter.push(obj.Property_Location);
    // });

    // for (var i = 0; i < arrayAll.length; i++) {
    //   var isMatch = false;
    //   var keyAll = arrayAll[i];
    //   for (var j = 0; j < arrayFilter.length; j++) {
    //     var keyFilter = arrayFilter[j];
    //     if (keyAll == keyFilter) {
    //       isMatch = true;
    //       break;
    //     }
    //   }
    //   if (isMatch == false) {
    //     arrayFinal.push(keyAll);
    //   }
    // }

    //debugger;
    // Array.prototype.contains = function(v) {
    //   for (var i = 0; i < arrayAll.length; i++) {
    //     if (arrayAll[i] === v) return true;
    //   }
    //   return false;
    // };

    // Array.prototype.unique = function() {
    //   var arr = [];
    //   for (var i = 0; i < arrayAll.length; i++) {
    //     if (!arr.includes(arrayAll[i])) {
    //       arr.push(arrayAll[i]);
    //     }
    //   }
    //   return arr;
    // };

    //   var duplicates = [1,3,4,2,1,2,3,8];
    // var uniques = duplicates.unique(); // result = [1,3,4,2,8]

    //debugger
    // arrayAll.forEach(function(obj1) {
    //   arrayAll.forEach(function(obj2) {
    //     if(obj1==obj2)
    //     {

    //     }
    //   arrayFinal.push(obj.SupportGroup);
    //   })
    // });

    // // Make hashtable of ids in B
    // var bIds = {};
    // b.forEach(function(obj) {
    //   bIds[obj.id] = obj.SupportGroup;
    // });

    // // Return all elements in A, unless in B
    // result = a.filter(function(obj) {
    //   return !(obj.id in bIds);
    // });

    return result;
  },

  // onlyUnique(value, index, self) {
  //   return self.indexOf(value) === index;
  // },
  // getObjectDiff(obj1, obj2) {
  //   const diff = Object.keys(obj1).reduce((result, key) => {
  //     if (!obj2.hasOwnProperty(key)) {
  //       result.push(key);
  //     } else if (_.isEqual(obj1[key], obj2[key])) {
  //       const resultKeyIndex = result.indexOf(key);
  //       result.splice(resultKeyIndex, 1);
  //     }
  //     return result;
  //   }, Object.keys(obj2));

  //   return diff;
  // },

  isLoadingTickets(state) {
    return state.isLoadingTickets;
  },
  activeTickets(state) {
    var result = state.activeTickets.filter(
      ticket =>
        _.includes(state.filterTree, ticket.SupportGroup) &&
        _.includes(state.filterLocation, ticket.Property_Location)
    );
    return result;
  },
  pendingDate(state) {
    return state.pendingDate;
  },
  sidebar(state) {
    return state.sidebar;
  },
  totalResolvedTickets(state) {
    return state.tickets.filter(
      ticket => ticket.Status === "Resolved" || ticket.Status === "Closed"
    );
  },
  sync(state) {
    return state.sync;
  },
  syncTime(state) {
    return state.syncTime;
  },
  arrayMenu(state) {
    return state.arrayMenu;
  },
  location(state) {
    return state.location;
  },
  filterLocation(state) {
    return state.filterLocation;
  },
  currentScreenName(state) {
    return state.currentScreenName;
  },
  priorityTicket(state) {
    return state.priorityTicket;
  },
  dissatisfactionCount(state) {
    return state.dissatisfactionCount;
  },
  overdueCount(state) {
    return state.overdueCount;
  },
  filterSupportGroup(state) {
    return state.filterSupportGroup;
  },
  supportGroup(state) {
    return state.supportGroup;
  },
  loginEmployeeId(state) {
    return state.loginEmployeeId;
  },
  roleUserId(state) {
    return state.roleUserId;
  },
  selectedAnalyst(state) {
    return state.selectedAnalyst;
  },

  //Knowledge Base
  kbArticle(state) {
    return state.kbArticle;
  },
  dateFrom(state) {
    return state.dateFrom;
  },
  dateTo(state) {
    return state.dateTo;
  },
};
