import { application } from "./";
import { application2 } from "./";

export default {
  getAttendanceSheetByDateRange(query) {
    return application().get("/getAttendanceSheetByDateRange", {
      params: query
    });
  },
  getAllGhostIR() {
    return application().get("/getAllGhostIR");
  },

  postGhostIR(objData) {
    var obj = application();
    //debugger;
    return application().post(
      "/postGhostIR",
      { data: objData }
      // data : {
      //      objData
      // }
    );
  },

  getTickets() {
    return application2().get("/GetTickets");
  },

  getUser() {
    return application2().get("/GetRoleUsers");
  },
  getRoleUserGroup() {
    return application2().get("/GetRoleUserGroup");
  },
  getRoleUserRules() {
    return application2().get("/GetRoleUserRules");
  }
};

// axios({
//     method: "post",
//     url: "http://localhost:60868/api/application/postGhostIR",
//     data: {
//       IR: "'401'",
//       ContactNo: "Test"
//     }
//   });
