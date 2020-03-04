<template>
  <layout-one :title="'Quality Indicator'">
    <v-card-title>
      <v-toolbar-title>Details</v-toolbar-title>
      <v-divider class="mx-2" inset vertical></v-divider>

      <download-excel
        name="QualityIndicator.xls"
        type="xls"
        :fields="json_fields"
        :data="excelExport(filtered, search)"
      >
        <v-btn
          small
          :loading="loading3"
          :disabled="loading3"
          color="colorLight"
          class="colorDark white--text font-weight-light"
          @click="loader = 'loading3'"
        >
          Export Excel
          <v-icon right dark>cloud_download</v-icon>
        </v-btn>
      </download-excel>
      <v-flex lg2 class="pl-1">
        <v-combobox
          class="pt-3 pl-1"
          v-model="selectRoleUserIdMain"
          :items="itemsRoleUserIdMain"
          label="Select an analyst"
          item-text="text"
          item-value="value"
        ></v-combobox>
      </v-flex>

      <v-flex lg2 class="pl-1">
        <v-combobox
          v-model="selectRequestTypeMain"
          :items="itemsRequestTypeMain"
          label="Request Type"
          item-text="Name"
          item-value="RequestTypeId"
        ></v-combobox>
      </v-flex>

      <v-spacer></v-spacer>
      <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
      <v-dialog v-model="dialog" max-width="500px" scrollable persistent>
        <v-btn v-show="rights.Modify" slot="activator" color="primary" dark class="mb-2">Add</v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <form>
                <v-layout wrap v-show="false">
                  <v-flex lg12>
                    <v-text-field
                      v-model="editedItem.QualityIndicatorId"
                      label="Quality Indicator Id"
                      disabled
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout wrap>
                  <v-flex lg6>
                    <v-dialog
                      ref="dialogstartDate"
                      v-model="modalstartDate"
                      :return-value.sync="editedItem.ReportedDate"
                      lazy
                      full-width
                      width="290px"
                    >
                      <v-text-field
                        slot="activator"
                        v-model="editedItem.ReportedDate"
                        label="Reported Date"
                        prepend-icon="event"
                        readonly
                      ></v-text-field>
                      <v-date-picker v-model="editedItem.ReportedDate" scrollable color="colorDark">
                        <v-spacer></v-spacer>
                        <v-btn flat color="colorDark" @click="modalstartDate = false">Cancel</v-btn>
                        <v-btn
                          flat
                          color="colorDark"
                          @click="$refs.dialogstartDate.save(editedItem.ReportedDate)"
                        >OK</v-btn>
                      </v-date-picker>
                    </v-dialog>
                  </v-flex>
                  <v-flex lg6>
                    <v-combobox
                      v-model="selectRequestType"
                      :items="itemsRequestType"
                      label="Request Type"
                      item-text="Name"
                      item-value="RequestTypeId"
                    ></v-combobox>
                  </v-flex>
                </v-layout>
                <v-layout wrap>
                  <v-flex lg12>
                    <v-combobox
                      v-model="selectRoleUserId"
                      :items="itemsRoleUserId"
                      label="Select an agent"
                      item-text="text"
                      item-value="value"
                    ></v-combobox>

                    <!-- <v-combobox
                      v-model="selectAgentActivityType"
                      :items="itemsAgentActivityType"
                      label="Select an agent"
                      item-text="text"
                      item-value="value"
                    ></v-combobox>-->
                  </v-flex>
                </v-layout>
                <v-layout wrap>
                  <v-flex lg12>
                    <v-combobox
                      v-model="selectQualityCategory"
                      :items="itemsQualityCategory"
                      label="Select a quality indicator category"
                      item-text="Description"
                      item-value="QualityCategoryId"
                    ></v-combobox>
                  </v-flex>
                </v-layout>
                <v-layout wrap>
                  <v-flex lg12>
                    <v-text-field v-model="editedItem.RefNo" label="Ref No"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout wrap>
                  <v-flex lg12>
                    <v-text-field v-model="editedItem.SupervisorRemarks" label="CSD Remarks"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout wrap v-show="false">
                  <v-flex lg12>
                    <v-text-field v-model="editedItem.CSDRemarks" label="CSD Remarks"></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout wrap>
                  <v-flex lg12>
                    <v-text-field v-model="editedItem.LeadRemarks" label="Lead Remarks"></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout wrap>
                  <v-flex>
                    <v-checkbox
                      color="colorDark"
                      v-model="editedItem.ReflectOnAppraisal"
                      label="Reflect On Appraisal"
                    ></v-checkbox>
                  </v-flex>
                </v-layout>

                <v-layout wrap>
                  <v-flex>
                    <v-combobox
                      v-if="editedItem.ReflectOnAppraisal"
                      v-model="selectQualityKPI"
                      :items="itemsQualityKPI"
                      label="Select a quality KPI"
                      item-text="Name"
                      item-value="QualityKPIId"
                    ></v-combobox>
                  </v-flex>
                </v-layout>

                <v-layout wrap>
                  <v-flex lg12>
                    <v-text-field
                      v-if="editedItem.ReflectOnAppraisal"
                      v-model="editedItem.AppraisalRemarks"
                      label="Appraisal Remarks"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click="postUser" v-show="this.editedIndex === -1 ? true : false">save</v-btn>
            <v-btn flat @click="putUser" v-show="this.editedIndex === -1 ? false : true">update</v-btn>
            <v-btn flat @click="clear">clear</v-btn>
            <v-btn flat @click="close">cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="filterd(filtered, search)"
      class="elevation-3 table1"
      :search="search"
      :pagination.sync="pagination"
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.QualityIndicatorId }}</td>
        <td class="text-xs-left">{{ props.item.ReportedDate.split('T')[0] }}</td>
        <td class="text-xs-left">{{ props.item.AgentName }}</td>
        <td class="text-xs-left">{{ props.item.NameQualityKPI }}</td>
        <td class="text-xs-left">{{ props.item.Description }}</td>
        <td class="text-xs-left">{{ props.item.Score }}</td>
        <td class="text-xs-left">{{ props.item.RefNo }}</td>
        <td class="text-xs-left">{{ props.item.SupervisorRemarks }}</td>
        <td class="text-xs-left">{{ props.item.FirstName }}</td>
        <td class="text-xs-left">{{ (props.item.ReflectOnAppraisal == 1 ? 'Yes' : 'No') }}</td>
        <td class="text-xs-left">{{ (props.item.Active == 1 ? 'Yes' : 'No') }}</td>
        <td class="text-xs-left">{{ props.item.RequestType }}</td>

        <td class="justify-center layout px-0">
          <v-btn
            color="primary"
            fab
            small
            dark
            style="height:22px;width:22px;font-size:13px;"
            v-if="rights.Modify"
          >
            <v-icon style="font-size:13px" @click="editItem(props.item)">edit</v-icon>
          </v-btn>
          <v-btn
            color="red"
            fab
            small
            dark
            style="height:22px;width:22px;font-size:13px;"
            v-if="rights.Delete"
          >
            <v-icon style="font-size:13px" @click="deleteItem(props.item)">delete</v-icon>
          </v-btn>
        </td>
      </template>
    </v-data-table>
    <snack-bar :isSnackbar="IsSnackBar" />
  </layout-one>
</template>

<script>
import LayoutOne from "../../../components/control/layout/LayoutOne";
import { validationMixin } from "vuelidate";
import { required, maxLength, email } from "vuelidate/lib/validators";
import { mixins } from "../../../mixins/CustomMixins";
import Application from "../../../services/application-service";
import MonthPicker from "../../../components/control/MonthPicker";
import SnackBar from "../../../components/control/SnackBar";
import axios from "axios";
export default {
  mixins: [mixins, validationMixin],
  validations: {
    editedItem: {
      AgentUserID: { required, maxLength: maxLength(100) },
      ReportedDate: { required },
      selectQualityCategory: { required }
    }
  },

  components: {
    MonthPicker,
    SnackBar,
    LayoutOne
  },
  data: () => ({
    rights: {
      View: false,
      Modify: false,
      Delete: false,
      Class: "csmHide"
    },
    pagination: {
      descending: true,
      sortBy: "ReportedDate",
      rowsPerPage: 10
    },
    valid: true,

    selectRoleUserId: null,
    itemsRoleUserId: [],

    selectRoleUserIdMain: [],
    itemsRoleUserIdMain: [],

    selectRequestTypeMain: {},
    itemsRequestTypeMain: [],

    Active: false,
    ReflectOnAppraisal: false,
    modalstartDate: false,
    startDate: "",
    snackbar: {
      isTrue: true
    },
    selectQualityCategory: [],
    itemsQualityCategory: [],

    selectQualityKPI: [],
    itemsQualityKPI: [],

    // selectAgentActivityType: [],
    // itemsAgentActivityType: [],

    selectRequestType: [],
    itemsRequestType: [],

    dialog: false,
    loading3: false,
    search: "",
    headers: [
      {
        text: "ID",
        value: "QualityIndicatorId",
        width: "1%",
        align: "left"
        //class: "csmHide"
      },
      { text: "Reported", value: "ReportedDate", width: "1%" }, //Reported Date
      { text: "Agent", value: "AgentName", width: "1%" },
      { text: "KPI", value: "NameQualityKPI", width: "1%" }, //Quality KPI
      { text: "Category", value: "Description", width: "20%" },
      { text: "Score", value: "Score", width: "1%" },
      { text: "Ref No", value: "RefNo", width: "20%" },
      { text: "CSD Remarks", value: "SupervisorRemarks", width: "50%" },
      { text: "Created", value: "FirstName", width: "1%" }, //Created By
      {
        text: "Reflect",
        value: "ReflectOnAppraisal",
        width: "1%"
      }, //Reflect On Appraisal
      { text: "Approved", value: "Active", width: "1%" },
      { text: "Request Type", value: "RequestType", width: "1%" }, //Request Type
      // {
      //   text: "Quality Category Id",
      //   value: "QualityCategoryId",
      //   class: "csmHide"
      // },
      // {
      //   text: "Quality KPI Id",
      //   value: "QualityKPIId",
      //   class: "csmHide"
      // },
      { text: "Actions", value: "", sortable: false, align: "Center" }
    ],

    json_fields: {
      ID: "QualityIndicatorId",
      "Reported Date": {
        field: "ReportedDate",
        callback: value => {
          var result =
            value != null && value != undefined
              ? value.replace("T", " ")
              : value;
          return result;
        }
      },
      //"Reported Date": "ReportedDate",
      Agent: "AgentName",
      "Quality KPI": "NameQualityKPI",
      Category: "Description",
      Score: "Score",
      "Ref No": "RefNo",
      "CSD Remarks": "SupervisorRemarks",
      "Created By": "FirstName",
      //"Reflect On Appraisal": "ReflectOnAppraisal",

      "Reflect On Appraisal": {
        field: "ReflectOnAppraisal",
        callback: value => {
          var result = value == true ? "Yes" : "No";
          return result;
        }
      },

      Approved: {
        field: "Active",
        callback: value => {
          var result = value == true ? "Yes" : "No";
          return result;
        }
      }

      //Approved: "Active"
      // "Quality Category Id": "QualityCategoryId",
      // "Quality KPI Id": "QualityKPIId"
    },

    listOfRecord: [],
    editedIndex: -1,

    editedItem: {
      QualityIndicatorId: "",
      AgentUserID: "",
      SupervisorRemarks: "",

      CSDRemarks: "",
      LeadRemarks: "",
      AppraisalRemarks: "",

      RefNo: "",
      ReportedDate: "",
      QualityCategoryId: 0,
      QualityKPIId: 0,
      QualityCategoryIds: [],
      QualityKPIIds: [],
      AgentActivityTypeIds: []
    },
    defaultItem: {
      QualityIndicatorId: "0",
      AgentUserID: "",
      SupervisorRemarks: "",

      CSDRemarks: "",
      LeadRemarks: "",
      AppraisalRemarks: "",

      ReportedDate: "",
      RefNo: "",
      QualityCategoryId: 0,
      QualityKPIId: 0,
      QualityCategoryIds: [],
      QualityKPIIds: [],
      AgentActivityTypeIds: []
    }
  }),
  computed: {
    filtered() {
      var result = null;
      result = this.listOfRecord.filter(
        data =>
          data.RequestTypeId ==
            (this.selectRequestTypeMain.RequestTypeId == 100
              ? data.RequestTypeId
              : this.selectRequestTypeMain.RequestTypeId) &&
          data.RoleUserIdFK ==
            (this.selectRoleUserIdMain.value == 100
              ? data.RoleUserIdFK
              : this.selectRoleUserIdMain.value)
      );

      return result;
    },
    AgentUserIDErrors() {
      const errors = [];
      if (!this.$v.editedItem.AgentUserID.$dirty) return errors;
      !this.$v.editedItem.AgentUserID.maxLength &&
        errors.push("AgentUserID must be at most 10 characters long");
      !this.$v.editedItem.AgentUserID.required &&
        errors.push("AgentUserID is required.");
      return errors;
    },

    IsSnackBar() {
      return this.snackbar.isTrue;
    },
    formTitle() {
      return this.editedIndex === -1
        ? "New Quality Indicator"
        : "Edit Quality Indicator";
    }
  },
  watch: {
    dialog(val) {
      var isTrue = val;
      isTrue || this.close();
    }
  },
  created() {
    this.initialize();
  },
  methods: {
    getRoleUsersAgents() {
      axios({
        method: "get",
        url: this.$urlApplication + "general/GetRoleUserBySupportGroup"
      })
        .then(res => {
          this.itemsRoleUserId = [];
          for (let value of res.data) {
            var result = {
              value: value.value,
              text: value.text
            };
            this.itemsRoleUserId.push(result);
          }
        })
        .catch(error => {});
    },

    getRoleUserBySupportGroup() {
      axios({
        method: "get",
        //url: this.$urlApplication + "general/GetAgentActivityType"
        url: this.$urlApplication + "general/GetRoleUserBySupportGroup"
      })
        .then(res => {
          this.itemsRoleUserIdMain = [];
          //this.itemsAgentActivityType = [];

          var IsSelect = true;

          var result = {
            value: 100,
            text: "All"
          };

          this.itemsRoleUserIdMain.push(result);
          for (let items of res.data) {
            var result = {
              value: items.value,
              text: items.text
            };

            if (IsSelect) {
              this.selectRoleUserIdMain = {
                value: items.value,
                text: items.text
              };
              IsSelect = false;
            }
            this.itemsRoleUserIdMain.push(result);
            //this.itemsAgentActivityType.push(result);
          }
        })
        .catch(error => {});
    },
    async getRequestTypes() {
      await axios({
        method: "get",
        url: this.$urlApplication + "/General/GetRequestTypes"
      })
        .then(res => {
          this.itemsRequestType = [];
          res.data = res.data.filter(w =>
            _.includes([1, 2, 3, 4, 100], w.RequestTypeId)
          );

          for (let items of res.data) {
            var result = {
              RequestTypeId: items.RequestTypeId,
              Name: items.Name
            };

            if (items.RequestTypeId != 100) {
              this.itemsRequestType.push({
                RequestTypeId: items.RequestTypeId,
                Name: items.Name
              });
            }

            //Default Selection Approved Main
            if (items.RequestTypeId == 1) {
              var approved = this.listOfRecord.filter(
                data => data.RequestTypeId == 1
              );
              var disapproved = this.listOfRecord.filter(
                data => data.RequestTypeId == 2
              );
              var forReview = this.listOfRecord.filter(
                data => data.RequestTypeId == 3
              );
              var pushback = this.listOfRecord.filter(
                data => data.RequestTypeId == 4
              );
              this.selectRequestTypeMain = {
                RequestTypeId: items.RequestTypeId,
                Name: items.Name
                // + " - " + approved.length + ""
              };
            }

            if (items.RequestTypeId == 1) {
              this.itemsRequestTypeMain.push({
                RequestTypeId: items.RequestTypeId,
                Name: items.Name
                //+ " - " + approved.length + ""
              });
            } else if (items.RequestTypeId == 2) {
              this.itemsRequestTypeMain.push({
                RequestTypeId: items.RequestTypeId,
                Name: items.Name
                // + " - " + disapproved.length + ""
              });
            } else if (items.RequestTypeId == 3) {
              this.itemsRequestTypeMain.push({
                RequestTypeId: items.RequestTypeId,
                Name: items.Name
                //+ " - " + forReview.length + ""
              });
            } else if (items.RequestTypeId == 4) {
              this.itemsRequestTypeMain.push({
                RequestTypeId: items.RequestTypeId,
                Name: items.Name
                //+ " - " + pushback.length + ""
              });
            }
          }
        })
        .catch(error => {});
    },

    filterd(list, val) {
      if (val) {
        val = val.trim().toLowerCase();
        let searchData = list.filter(feedback => {
          var QualityIndicatorId =
            feedback.QualityIndicatorId == undefined
              ? ""
              : feedback.QualityIndicatorId;
          var ReportedDate =
            feedback.ReportedDate == undefined ? "" : feedback.ReportedDate;
          var AgentName =
            feedback.AgentName == undefined ? "" : feedback.AgentName;
          var NameQualityKPI =
            feedback.NameQualityKPI == undefined ? "" : feedback.NameQualityKPI;
          var Description =
            feedback.Description == undefined ? "" : feedback.Description;
          var Score = feedback.Score == undefined ? "" : feedback.Score;
          var RefNo = feedback.RefNo == undefined ? "" : feedback.RefNo;
          var SupervisorRemarks =
            feedback.SupervisorRemarks == undefined
              ? ""
              : feedback.SupervisorRemarks;
          var FirstName =
            feedback.FirstName == undefined ? "" : feedback.FirstName;

          var RequestType =
            feedback.RequestType == undefined ? "" : feedback.RequestType;

          var searchField = this.search;

          return (
            QualityIndicatorId.toString()
              .toLowerCase()
              .indexOf(val) > -1 ||
            ReportedDate.toLowerCase().indexOf(val) > -1 ||
            AgentName.toLowerCase().indexOf(val) > -1 ||
            NameQualityKPI.toLowerCase().indexOf(val) > -1 ||
            Description.toLowerCase().indexOf(val) > -1 ||
            Score.toString()
              .toLowerCase()
              .indexOf(val) > -1 ||
            RefNo.toString()
              .toLowerCase()
              .indexOf(val) > -1 ||
            RequestType.toLowerCase().indexOf(val) > -1
          );
        });

        return searchData;
      }
      return list;
    },

    excelExport(data, input) {
      var result = [];
      result = this.filterd(data, input);
      return result;
    },
    validate() {
      if (this.$refs.form.validate()) {
        alert("Test");
      }
    },
    initialize() {
      this.tableLoad();
      this.getQualityIndicatorGroup();
      this.getQualityKPI();
      //this.getAgentActivityTypes();
      this.getRoleUserBySupportGroup();
      this.getRequestTypes();

      this.getRoleUsersAgents();

      this.getUserRights([602, 603, 604]).then(result => {
        result.forEach(element => {
          if (element.name == "View") {
            this.rights.View = true;
          }
          if (element.name == "Modify") {
            this.rights.Modify = true;
          }
          if (element.name == "Delete") {
            this.rights.Delete = true;
          }
        });
      });
    },

    // getAgentActivityTypes() {
    //   axios({
    //     method: "get",
    //     url: this.$urlApplication + "QualityIndicator/GetAgentActivityTypes"
    //   })
    //     .then(res => {
    //       this.itemsAgentActivityType = [];
    //       for (let items of res.data) {
    //         var result = {
    //           AgentActivityTypeId: items.AgentActivityTypeId,
    //           Agent: items.Agent
    //         };
    //         this.itemsAgentActivityType.push(result);
    //       }
    //     })
    //     .catch(error => {});
    // },

    getQualityKPI() {
      axios({
        method: "get",
        url: this.$urlApplication + "QualityIndicator/GetQualityKPIs"
      })
        .then(res => {
          this.itemsQualityKPI = [];
          for (let items of res.data) {
            var result = {
              QualityKPIId: items.QualityKPIId,
              Name: items.Name + "-" + items.Description
            };

            this.itemsQualityKPI.push(result);
          }
        })
        .catch(error => {});
    },

    getQualityIndicatorGroup() {
      axios({
        method: "get",
        url: this.$urlApplication + "QualityIndicator/GetQualityCategories"
      })
        .then(res => {
          this.itemsQualityCategory = [];
          for (let items of res.data) {
            var result = {
              QualityCategoryId: items.QualityCategoryId,
              Description: items.Description
            };

            this.itemsQualityCategory.push(result);
          }
        })
        .catch(error => {});
    },

    // getQualityIndicator(id) {
    //   axios({
    //     method: "get",
    //     url:
    //       this.$urlApplication + "QualityIndicator/GetQualityIndicator?id=" + id
    //   })
    //     .then(res => {
    //       this.selectQualityCategory = [];
    //       this.selectQualityKPI = [];
    //       this.selectAgentActivityType = [];

    //       var itemsQualityCategory = this.itemsQualityCategory;
    //       var itemsQualityKPI = this.itemsQualityKPI;
    //       var itemsAgentActivityType = this.itemsAgentActivityType;

    //       ///////
    //       for (let v1 of res.data) {
    //         for (let v2 of itemsQualityCategory) {
    //           if (v1.QualityCategoryId == v2.QualityCategoryId) {
    //             var id = v2.QualityCategoryId;
    //             var desc = v2.Description;
    //             var result = {
    //               QualityCategoryId: id,
    //               Description: desc
    //             };
    //             this.selectQualityCategory.push(result);
    //             break;
    //           }
    //         }
    //       }

    //       ///////
    //       for (let v1 of res.data) {
    //         for (let v2 of itemsQualityKPI) {
    //           if (v1.QualityKPIId == v2.QualityKPIId) {
    //             var id = v2.QualityKPIId;
    //             var desc = v2.Name;
    //             var result = {
    //               QualityKPIId: id,
    //               Name: desc
    //             };
    //             this.selectQualityKPI.push(result);
    //             break;
    //           }
    //         }
    //       }
    //       ///////
    //       for (let v1 of res.data) {
    //         for (let v2 of itemsAgentActivityType) {
    //           if (v1.AgentActivityTypeId == v2.AgentActivityTypeId) {
    //             var id = v2.AgentActivityTypeId;
    //             var desc = v2.Agent;
    //             var result = {
    //               AgentActivityTypeId: id,
    //               Agent: desc
    //             };
    //             this.selectAgentActivityType.push(result);
    //             break;
    //           }
    //         }
    //       }
    //       ///////
    //     })
    //     .catch(error => {});
    // },

    async tableLoad() {
      await axios({
        method: "get",
        url: this.$urlApplication + "QualityIndicator/GetQualityIndicators"
      })
        .then(res => {
          this.listOfRecord = res.data;
          //this.getRequestTypes();
        })
        .catch(error => {});
    },
    postUser() {
      var obj = this.editedItem;

      obj.QualityCategoryId = this.selectQualityCategory.QualityCategoryId;
      obj.QualityKPIId = obj.ReflectOnAppraisal
        ? this.selectQualityKPI.QualityKPIId
        : null;
      //obj.AgentActivityTypeId = this.selectAgentActivityType.AgentActivityTypeId;

      obj.AppraisalRemarks = obj.ReflectOnAppraisal
        ? obj.AppraisalRemarks
        : null;

      //obj.AgentActivityTypeId = this.selectAgentActivityType.value;
      obj.RoleUserIdFK = this.selectRoleUserId.value;

      obj.RequestTypeId = this.selectRequestType.RequestTypeId;

      if (this.editedItem.ReportedDate.length == 0) {
        alert("Please enter reported date");
      } else if (this.editedItem.QualityCategoryId == undefined) {
        alert("Please select a quality indicator category");
      } else {
        //Save
        axios({
          method: "post",
          url: this.$urlApplication + "QualityIndicator/PostQualityIndicator",
          data: obj
        })
          .then(res => {
            this.tableLoad();
            this.close();
            this.snackbar.isTrue = !this.snackbar.isTrue;
          })
          .catch(error => {});
      }
    },
    putUser() {
      var obj = this.editedItem;

      obj.QualityCategoryId = this.selectQualityCategory.QualityCategoryId;
      obj.QualityKPIId = obj.ReflectOnAppraisal
        ? this.selectQualityKPI.QualityKPIId
        : null;

      obj.AppraisalRemarks = obj.ReflectOnAppraisal
        ? obj.AppraisalRemarks
        : null;

      //obj.AgentActivityTypeId = this.selectAgentActivityType.value;
      obj.RoleUserIdFK = this.selectRoleUserId.value;
      obj.RequestTypeId = this.selectRequestType.RequestTypeId;

      if (this.editedItem.ReportedDate.length == 0) {
        alert("Please enter reported date");
      } else if (this.editedItem.QualityCategoryId == undefined) {
        alert("Please select a quality indicator category");
      } else {
        //Update
        axios({
          method: "put",
          url:
            this.$urlApplication +
            "QualityIndicator/PutQualityIndicator?id=" +
            obj.QualityIndicatorId,
          data: obj
        })
          .then(res => {
            this.tableLoad();
            this.close();
            this.snackbar.isTrue = !this.snackbar.isTrue;
          })
          .catch(error => {});
      }
    },

    deleteUser(id) {
      var pId = id;
      axios({
        method: "delete",
        url:
          this.$urlApplication +
          "QualityIndicator/DeleteQualityIndicator?id=" +
          pId
      })
        .then(res => {
          this.tableLoad();
        })
        .catch(error => {});
    },
    clear() {
      this.editedItem.QualityIndicatorId = "";
      this.editedItem.ReportedDate = "";
      this.editedItem.AgentUserID = "";
      this.editedItem.SupervisorRemarks = "";

      this.editedItem.CSDRemarks = "";
      this.editedItem.LeadRemarks = "";
      this.editedItem.AppraisalRemarks = "";
      this.editedItem.RefNo = "";
      this.editedItem.Active = false;
      this.editedItem.ReflectOnAppraisal = false;
      this.selectQualityCategory = [];
      this.selectQualityKPI = [];
      this.selectRoleUserId = [];
      //this.selectAgentActivityType = [];
    },
    editItem(item) {
      var obj = item;

      //QualityIndicator Group Combobox--Start
      for (var items of this.itemsQualityCategory) {
        if (obj.QualityCategoryId == items.QualityCategoryId) {
          this.selectQualityCategory = {
            QualityCategoryId: obj.QualityCategoryId,
            Description: items.Description
          };
          break;
        }
      }

      // //AgentActivityType Group Combobox--Start
      // for (var items of this.itemsAgentActivityType) {
      //   if (obj.AgentActivityTypeId == items.value) {
      //     this.selectAgentActivityType = {
      //       value: obj.AgentActivityTypeId,
      //       text: items.text
      //     };
      //     break;
      //   }
      // }

      //QualityKPIId Group Combobox--Start
      for (var items of this.itemsQualityKPI) {
        if (obj.QualityKPIId == items.QualityKPIId) {
          this.selectQualityKPI = {
            QualityKPIId: obj.QualityKPIId,
            Name: items.Name
          };
          break;
        }
      }

      //RequestTypeId Combobox--Start
      for (var items of this.itemsRequestType) {
        if (obj.RequestTypeId == items.RequestTypeId) {
          this.selectRequestType = {
            RequestTypeId: obj.RequestTypeId,
            Name: items.Name
          };
          break;
        }
      }
      //RequestTypeId Combobox--End

      //RoleUserIdFK User Assign Combobox--Start
      for (var items of this.itemsRoleUserId) {
        if (obj.RoleUserIdFK == items.value) {
          this.selectRoleUserId = {
            value: items.value,
            text: items.text
          };
          break;
        }
      }
      //

      obj.ReportedDate = obj.ReportedDate.split("T")[0];
      this.editedIndex = this.listOfRecord.indexOf(obj);
      this.editedItem = Object.assign({}, obj);
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.listOfRecord.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.deleteUser(item.QualityIndicatorId);
    },
    close() {
      if (!this.dialog) {
        this.clear();
      }
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    }
  }
};
</script>

<style scoped>
/* Table Self Style*/
table.v-table tbody td:first-child,
table.v-table tbody td:not(:first-child),
table.v-table tbody th:first-child,
table.v-table tbody th:not(:first-child),
table.v-table thead td:first-child,
table.v-table thead td:not(:first-child),
table.v-table thead th:first-child,
table.v-table thead th:not(:first-child) {
  width: inherit;
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre-wrap;
  height: 32px;
}
</style>
