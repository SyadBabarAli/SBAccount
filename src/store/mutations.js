export default {
  setTeams(state, payload) {
    state.teams = payload;
  },
  setFilterTeams(state, payload) {
    state.filterTeams = payload;
  },

  setTree(state, payload) {
    state.tree = payload;
  },
  setFilterTree(state, payload) {
    state.filterTree = payload;
  },
  setIncidentTierQueuesIds(state, payload) {
    state.selectedIncidentTierQueuesIds = payload;
  },
  setStartDate(state, payload) {
    state.startDate = payload;
  },
  setEndDate(state, payload) {
    state.endDate = payload;
  },
  setTicketId(state, payload) {
    state.ticketId = payload;
  },
  setFeedbacks(state, payload) {
    state.feedbacks = payload;
  },
  setIsLoadingFeedbacks(state, payload) {
    state.isLoadingFeedbacks = payload;
  },
  setResponseTickets(state, payload) {
    state.responseTickets = payload;
  },
  setIsLoadingResponseTickets(state, payload) {
    state.isLoadingResponseTickets = payload;
  },
  setTickets(state, payload) {
    state.tickets = payload;
  },
  setIsLoadingTickets(state, payload) {
    state.isLoadingTickets = payload;
  },
  setActiveTickets(state, payload) {
    state.activeTickets = payload;
  },
  setPendingDate(state, payload) {
    state.pendingDate = payload;
  },
  storeError(state, payload) {
    state.error = payload;
  },
  setSidebar(state, payload) {
    state.sidebar = payload;
  },
  onSync(state, payload) {
    state.sync = payload;
  },
  setArrayMenu(state, payload) {
    state.arrayMenu = payload;
  },
  setLocation(state, payload) {
    state.location = payload;
  },
  setFilterLocation(state, payload) {
    state.filterLocation = payload;
  },
  setCurrentScreenName(state, payload) {
    state.currentScreenName = payload;
  },
  setPriorityTicket(state, payload) {
    state.priorityTicket = payload;
  },
  setDissatisfactionCount(state, payload) {
    state.dissatisfactionCount = payload;
  },
  setOverdueCount(state, payload) {
    state.overdueCount = payload;
  },

  setSupportGroup(state, payload) {
    state.supportGroup = payload;
  },
  setFilterSupportGroup(state, payload) {
    state.filterSupportGroup = payload;
  },
  setLoginEmployeeId(state, payload) {
    state.loginEmployeeId = payload;
  },

  setRoleUserId(state, payload) {
    state.roleUserId = payload;
  },
  setSelectedAnalyst(state, payload) {
    state.selectedAnalyst = payload;
  },

  //KB Tree
  setKBArticle(state, payload) {
    state.kbArticle = payload;
  },

  setDateFrom(state, payload) {
    state.dateFrom = payload;
  },
  setDateTo(state, payload) {
    state.dateTo = payload;
  },
};
