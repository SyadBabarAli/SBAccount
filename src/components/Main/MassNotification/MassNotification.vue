<template>
  <layout-one :title="'Mass Notification'">
    <v-card-title>
      <v-toolbar-title>Details</v-toolbar-title>

      <v-dialog v-model="dialogError" width="500">
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>Warning</v-card-title>
          <v-card-text>Must select email address</v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click="dialogError = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-divider class="mx-2" inset vertical></v-divider>
      <v-flex lg1>
        <v-combobox
          v-model="selectActive"
          :items="itemsActive"
          label="Active"
          item-text="text"
          item-value="value"
        ></v-combobox>
      </v-flex>

      <v-flex lg2 class="pl-1">
        <v-combobox
          v-model="selectMassNotificationCategoryMain"
          :items="itemsMassNotificationCategoryMain"
          label="Category"
          item-text="CategoryName"
          item-value="MassNotificationCategoryId"
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

      <v-dialog v-model="dialog" max-width="500px" scrollable persistent fullscreen hide-overlay>
        <v-btn v-show="rights.Modify" slot="activator" color="primary" dark class="mb-2">Add</v-btn>
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="close">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn flat @click="sendEmailConfirmation">Send Email</v-btn>

              <v-btn
                v-if="rights.Modify"
                flat
                @click="postMassNotification"
                v-show="this.editedIndex === -1 ? true : false"
              >save</v-btn>

              <v-btn
                v-if="rights.Modify"
                flat
                @click="putMassNotification"
                v-show="this.editedIndex === -1 ? false : true"
              >update</v-btn>

              <v-btn flat @click="clear" v-if="rights.Modify">clear</v-btn>

              <v-btn dark flat @click="close">cancel</v-btn>
            </v-toolbar-items>
          </v-toolbar>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap v-show="false">
                <v-flex lg12>
                  <v-text-field
                    v-model="editedItem.MassNotificationId"
                    label="Mass Notification Id"
                    disabled
                  ></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout wrap class="pb-2">
                <v-flex lg3>
                  <v-textarea
                    v-model="editedItem.MassNotificationName"
                    solo
                    rows="3"
                    label="AKU IP Monitor"
                    hint="AKU IP Monitor"
                  ></v-textarea>
                </v-flex>

                <v-flex lg3>
                  <v-text-field v-model="editedItem.KeyWord" label="Keyword"></v-text-field>
                </v-flex>

                <v-flex lg2>
                  <v-combobox
                    v-model="selectMassNotificationCategory"
                    :items="itemsMassNotificationCategory"
                    label="Category"
                    item-text="CategoryName"
                    item-value="MassNotificationCategoryId"
                  ></v-combobox>
                </v-flex>
                <v-flex lg2>
                  <v-textarea
                    v-model="editedItem.Impact"
                    solo
                    rows="3"
                    label="Impact"
                    hint="Impact"
                  ></v-textarea>
                </v-flex>
                <v-flex lg2>
                  <v-btn @click="viewEmailBody">View Email</v-btn>
                </v-flex>
                <v-flex lg12>
                  <v-card class="elevation-10">
                    <v-card-title class="headline grey lighten-3 pa-1 ma-0" primary-title>Email Send</v-card-title>
                    <v-divider></v-divider>
                    <v-layout row wrap align-center class="pa-2">
                      <v-flex lg4>
                        <v-combobox
                          v-model="selectToEmailSend"
                          :items="itemsToEmailSend"
                          label="To Email"
                          item-text="text"
                          item-value="value"
                          multiple
                        ></v-combobox>
                      </v-flex>
                      <v-flex lg4>
                        <v-combobox
                          v-model="selectCcEmailSend"
                          :items="itemsCcEmailSend"
                          label="CC Email"
                          item-text="text"
                          item-value="value"
                          multiple
                        ></v-combobox>
                      </v-flex>
                      <v-flex lg4>
                        <v-text-field v-model="bccEmailSend" label="Bcc" box disabled></v-text-field>
                      </v-flex>
                      <v-flex lg12>
                        <v-textarea
                          v-model="editedItem.SenderComments"
                          solo
                          rows="3"
                          label="Sender Comments"
                          hint="Sender Comments"
                        ></v-textarea>
                      </v-flex>
                    </v-layout>
                  </v-card>
                </v-flex>
              </v-layout>

              <v-layout wrap>
                <v-flex lg12>
                  <v-card class="elevation-10">
                    <v-card-title class="headline grey lighten-3 pa-1 ma-0" primary-title>Email Body</v-card-title>
                    <v-divider></v-divider>
                    <v-layout row wrap align-center class="pa-2">
                      <v-flex lg4>
                        <v-text-field v-model="editedItem.toEmail" label="To" disabled></v-text-field>
                      </v-flex>
                      <v-flex lg4>
                        <v-text-field v-model="editedItem.ccEmail" label="Cc" box disabled></v-text-field>
                      </v-flex>
                      <v-flex lg4>
                        <v-card>
                          <h4 class="grey lighten-3 body-3">Bcc</h4>
                          <v-treeview
                            v-model="filterTree"
                            :load-children="fetchTree"
                            :items="itemsTree"
                            selected-color="colorLight"
                            selectable
                            activatable
                            open-all
                          ></v-treeview>
                        </v-card>
                      </v-flex>

                      <v-flex lg12>
                        <v-text-field v-model="editedItem.Subject" label="Email Subject"></v-text-field>
                      </v-flex>
                      <v-flex lg12>
                        <h3 class="font-weight-light">Email Body</h3>
                        <vue-editor v-model="editedItem.Body" :editor-toolbar="customToolbar"></vue-editor>
                      </v-flex>
                      <v-flex>
                        <v-alert
                          :value="true"
                          color="colorDark"
                          icon="info"
                          outline
                        >Email send in calibri font with 11 font size.</v-alert>
                      </v-flex>
                      <v-flex>
                        <v-checkbox color="colorDark" v-model="editedItem.Active" label="Active"></v-checkbox>
                      </v-flex>

                      <v-flex>
                        <v-combobox
                          v-model="selectRequestType"
                          :items="itemsRequestType"
                          label="Request Type"
                          item-text="Name"
                          item-value="RequestTypeId"
                        ></v-combobox>
                      </v-flex>
                    </v-layout>
                  </v-card>
                </v-flex>
              </v-layout>
              <v-layout wrap>
                <v-flex lg12>
                  <v-card class="elevation-10">
                    <v-card-title class="headline grey lighten-3 pa-1 ma-0" primary-title>&nbsp;</v-card-title>
                    <v-divider></v-divider>
                    <v-layout row wrap align-center class="pa-2">
                      <v-flex lg3>
                        <v-text-field
                          v-model="editedItem.CreatedBy"
                          label="Created By"
                          box
                          disabled
                        ></v-text-field>
                      </v-flex>
                      <v-flex lg3>
                        <v-text-field v-model="getCreatedDate" label="Created Date" box disabled></v-text-field>
                      </v-flex>
                      <v-flex lg3>
                        <v-text-field
                          v-model="editedItem.ModifiedBy"
                          label="Modified By"
                          box
                          disabled
                        ></v-text-field>
                      </v-flex>
                      <v-flex lg3>
                        <v-text-field v-model="getModifiedDate" label="Modified Date" box disabled></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-card-title>
    <v-data-table
      id="tableMassNotification"
      :headers="headers"
      :items="filtered"
      class="elevation-3"
      :search="search"
      :pagination.sync="pagination"
    >
      <template slot="items" slot-scope="props">
        <td class="justify-center layout px-0">
          <v-btn
            color="primary"
            fab
            small
            dark
            style="height:22px;width:22px;font-size:13px;"
            v-if="rights.View"
          >
            <v-icon style="font-size:13px" @click="editItem(props.item)">pageview</v-icon>
          </v-btn>

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
            v-if="rights.Delete"
            color="red"
            fab
            small
            dark
            style="height:22px;width:22px;font-size:13px;"
          >
            <v-icon style="font-size:13px" @click="deleteItem(props.item)">delete</v-icon>
          </v-btn>
        </td>
        <td>{{ props.item.MassNotificationId }}</td>
        <td class="text-xs-left">{{ props.item.MassNotificationName }}</td>
        <td class="text-xs-left">{{ props.item.KeyWord }}</td>
        <td class="text-xs-left">{{ props.item.Impact }}</td>
        <td class="text-xs-left">{{ props.item.Name }}</td>
        <td class="text-xs-left">{{ props.item.ModifiedBy }}</td>
      </template>
    </v-data-table>

    <snack-bar :isSnackbar="IsSnackBar" />
    <v-dialog v-model="dialogConfirmation" persistent max-width="290">
      <v-card color="primary" dark v-if="isLoading">
        <v-card-text>
          Please wait..
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
      <v-card v-else>
        <v-card-title class="headline">Alert</v-card-title>
        <v-card-text>Do you want to send this email.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="dialogConfirmation = false">Disagree</v-btn>
          <v-btn flat @click="sendEmail()">Agree</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogEmailBody" max-width="1000">
      <v-card class="pa-2">
        <div v-html="dialogEmailBodyContent"></div>
      </v-card>
    </v-dialog>
  </layout-one>
</template>

<script>
import Application from "../../../services/application-service";
import SnackBar from "../../../components/control/SnackBar";
import axios from "axios";
import { VueEditor, Quill } from "vue2-editor";
import { defaultFormat } from "moment";
import { mixins } from "../../../mixins/CustomMixins";
import LayoutOne from "../../../components/control/layout/LayoutOne";
import MessageDialog from "../../../components/control/MessageDialog/MessageDialog";

export default {
  mixins: [mixins],
  components: {
    LayoutOne,
    SnackBar,
    VueEditor,
    MessageDialog
  },

  data: () => ({
    dialogError: false,

    customToolbar: [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      //["blockquote", "code-block", "link"],
      //[{ header: 1 }, { header: 2 }], // custom button values
      [{ list: "ordered" }, { list: "bullet" }],
      //[{ script: "sub" }, { script: "super" }], // superscript/subscript
      //[{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      //[{ direction: "rtl" }], // text direction
      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      //[{ font: [] }],
      //[{ align: [] }],
      ["clean"]
    ],

    search: "",
    headers: [
      {
        text: "Actions",
        value: "",
        sortable: false,
        align: "Center"
        // width: "5%"
      },
      { text: "ID", value: "MassNotificationId" },
      { text: "AKU IP Monitor", value: "MassNotificationName" },
      { text: "Keyword", value: "KeyWord" },
      { text: "Impact", value: "Impact" },
      { text: "Request Type", value: "Name" },
      { text: "Modified By", value: "ModifiedBy" },
      { text: "Sender Comments", value: "SenderComments", class: "csmHide" },
      { text: "Impact", value: "Impact", class: "csmHide" }
    ],

    selectActive: { text: "Yes", value: true },
    itemsActive: [{ text: "Yes", value: true }, { text: "No", value: false }],

    selectRequestType: [],
    itemsRequestType: [],

    selectRequestTypeMain: {},
    itemsRequestTypeMain: [],

    arrayTree: [],
    filterTree: [],
    treeOptionAll: [],

    //isAllowEdit: false,

    rights: {
      View: false,
      Modify: false,
      Delete: false,
      Class: "csmHide"
    },

    selectToEmailSend: [],
    itemsToEmailSend: [],

    selectCcEmailSend: [],
    itemsCcEmailSend: [],

    selectMassNotificationCategory: [],
    itemsMassNotificationCategory: [],

    selectMassNotificationCategoryMain: {
      CategoryName: "Outage",
      MassNotificationCategoryId: "1"
    },
    itemsMassNotificationCategoryMain: [],

    pagination: {
      descending: true,
      sortBy: "ID",
      rowsPerPage: 10
    },
    isLoading: false,
    dialogEmailBody: false,
    dialogEmailBodyContent: "",

    emailFontSize: "14.5px",
    emailFontFamily: "Calibri",

    Active: false,
    snackbar: {
      isTrue: true
    },
    dialogConfirmation: false,
    dialog: false,
    loading3: false,

    listOfRecord: [],
    editedIndex: -1,
    toEmailSend: "",
    ccEmailSend: "-",
    bccEmailSend: "",

    editedItem: {
      Impact: "",
      toEmail: "it.servicedesk@aku.edu",
      ccEmail: "-",
      bccEmail: "",
      MassNotificationId: "",
      MassNotificationName: "",
      SenderComments: "",
      Body: "",
      Subject: "",
      KeyWord: "",
      Active: true,
      massNotificationBcc: [],
      massNotificationToEmail: [],
      massNotificationCcEmail: []
    },
    defaultItem: {
      Impact: "",
      MassNotificationId: "0",
      toEmail: "it.servicedesk@aku.edu",
      MassNotificationName: "",
      SenderComments: "",
      ccEmail: "-",
      bccEmail: "",
      Body: "",
      Subject: "",
      KeyWord: "",
      Active: true,
      massNotificationBcc: [],
      massNotificationToEmail: [],
      massNotificationCcEmail: []
    }
  }),
  computed: {
    getCreatedDate() {
      var result =
        this.editedItem.CreatedDate == undefined
          ? ""
          : this.editedItem.CreatedDate.replace("T", " ");
      return result;
    },
    getModifiedDate() {
      return this.editedItem.ModifiedDate == undefined
        ? ""
        : this.editedItem.ModifiedDate.replace("T", " ");
    },
    itemsTree() {
      const children = this.arrayTree;
      return [
        {
          id: 1,
          name: "All",
          children
        }
      ];
    },
    IsSnackBar() {
      return this.snackbar.isTrue;
    },
    formTitle() {
      return this.editedIndex === -1
        ? "New Mass Notification"
        : "Edit Mass Notification";
    },

    filtered() {
      var result = null;
      result = this.listOfRecord.filter(
        data =>
          data.Active === this.selectActive.value &&
          data.MassNotificationCategoryId ==
            (this.selectMassNotificationCategoryMain
              .MassNotificationCategoryId == 100
              ? data.MassNotificationCategoryId
              : this.selectMassNotificationCategoryMain
                  .MassNotificationCategoryId) &&
          data.RequestTypeId ==
            (this.selectRequestTypeMain.RequestTypeId == 100
              ? data.RequestTypeId
              : this.selectRequestTypeMain.RequestTypeId)
      );

      return result;
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
    // errorMsg() {
    //   if (this.dialogError) {
    //     this.dialogError = false;
    //   } else {
    //     this.dialogError = true;
    //   }
    // },
    initialize() {
      this.tableLoad();
      //this.getUserRightOnPage();
      this.getMassNotificationCategories();
      //this.getRequestTypes();

      this.getToEmails();
      this.getCcEmails();

      this.getUserRights([906, 907, 908]).then(result => {
        result.forEach(element => {
          //debugger
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

    getToEmails() {
      axios({
        method: "get",
        url: this.$urlApplication + "/GetToEmails"
      })
        .then(res => {
          this.itemsToEmailSend = [];
          for (let items of res.data) {
            var result = {
              text: items.EmailTitle,
              value: items.Email1,
              EmailId: items.EmailId
            };
            this.itemsToEmailSend.push(result);
            // //Default Selection
            // if (items.EmailId == 1) {
            //   this.selectToEmailSend = result;
            // }
          }
        })
        .catch(error => {});
    },

    getCcEmails() {
      axios({
        method: "get",
        url: this.$urlApplication + "/GetCcEmails"
      })
        .then(res => {
          this.itemsCcEmailSend = [];
          for (let items of res.data) {
            var result = {
              text: items.EmailTitle,
              value: items.Email1,
              EmailId: items.EmailId
            };

            this.itemsCcEmailSend.push(result);
            // //Default Selection
            // if (items.EmailId == 1) {
            //   this.selectCcEmailSend = result;
            // }
          }
        })
        .catch(error => {});
    },

    getRequestTypes() {
      axios({
        method: "get",
        url: this.$urlApplication + "/General/GetRequestTypes"
      })
        .then(res => {
          this.itemsRequestType = [];
          res.data = res.data.filter(w =>
            _.includes([1, 2, 3, 4, 9, 100], w.RequestTypeId)
          );

          for (let items of res.data) {
            var result = {
              RequestTypeId: items.RequestTypeId,
              Name: items.Name
            };

            //Dailog-Witout All Option
            if (items.RequestTypeId != 100) {
              this.itemsRequestType.push(result);
            }
            //Dailog-Default Selection For Review
            if (items.RequestTypeId == 3) {
              this.selectRequestType = result;
            }
            //Default Selection Approved Main

            //Default Selection Approved Main
            if (items.RequestTypeId == 1) {
              var forApproval = this.listOfRecord.filter(
                data => data.RequestTypeId == 9
              );
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
                Name: items.Name + " - " + approved.length + ""
              };
            }

            if (items.RequestTypeId == 1) {
              this.itemsRequestTypeMain.push({
                RequestTypeId: items.RequestTypeId,
                Name: items.Name + " - " + approved.length + ""
              });
            } else if (items.RequestTypeId == 2) {
              this.itemsRequestTypeMain.push({
                RequestTypeId: items.RequestTypeId,
                Name: items.Name + " - " + disapproved.length + ""
              });
            } else if (items.RequestTypeId == 3) {
              this.itemsRequestTypeMain.push({
                RequestTypeId: items.RequestTypeId,
                Name: items.Name + " - " + forReview.length + ""
              });
            } else if (items.RequestTypeId == 4) {
              this.itemsRequestTypeMain.push({
                RequestTypeId: items.RequestTypeId,
                Name: items.Name + " - " + pushback.length + ""
              });
            } else if (items.RequestTypeId == 9) {
              this.itemsRequestTypeMain.push({
                RequestTypeId: items.RequestTypeId,
                Name:
                  items.Name +
                  " - " +
                  this.listOfRecord.filter(data => data.RequestTypeId == 9)
                    .length +
                  ""
              });
            } else if (items.RequestTypeId == 100) {
              this.itemsRequestTypeMain.push({
                RequestTypeId: items.RequestTypeId,
                Name:
                  items.Name +
                  " - " +
                  this.listOfRecord
                  // .filter(
                  //   w => w.Active === this.selectActive.value
                  // )
                  .length
              });
            }
          }
        })
        .catch(error => {});
    },

    getMassNotificationCategories() {
      axios({
        method: "get",
        url: this.$urlApplication + "GetMassNotificationCategories"
      })
        .then(res => {
          this.itemsMassNotificationCategory = [];
          for (let items of res.data) {
            var result = {
              MassNotificationCategoryId: items.MassNotificationCategoryId,
              CategoryName: items.CategoryName
            };

            if (items.MassNotificationCategoryId != 100) {
              this.itemsMassNotificationCategory.push({
                MassNotificationCategoryId: items.MassNotificationCategoryId,
                CategoryName: items.CategoryName
              });
            }

            // this.itemsMassNotificationCategoryMain.push({
            //   MassNotificationCategoryId: 0,
            //   CategoryName: "All"
            // });

            this.itemsMassNotificationCategoryMain.push({
              MassNotificationCategoryId: items.MassNotificationCategoryId,
              CategoryName: items.CategoryName
            });
          }
        })
        .catch(error => {});
    },
    // getUserRightOnPage() {
    //   this.isAllowEdit = false;
    //   axios
    //     .get(this.$urlApplication + "GetRoleUserRuleMenu")
    //     .then(response => {
    //       var objData = response.data;
    //       var isTrue = false;
    //       for (var i = 0; i < objData.length; i++) {
    //         var obj = objData[i];
    //         var OptionId = obj.id;
    //         if (OptionId == 604) {
    //           this.isAllowEdit = true;
    //           break;
    //         }
    //       }
    //     })
    //     .catch(error => {
    //       console.log(error);
    //     })
    //     .finally(() => {});
    // },
    async getMassNotificationBcc(id) {
      var pId = id;
      this.filterTree = [];
      const res = await axios
        .get(this.$urlApplication + "GetMassNotificationBcc?id=" + pId)
        .then(res => {
          for (const items of res.data) {
            this.filterTree.push(items.TreeOptionId);
          }
        })
        .catch(error => {});
    },
    list_to_treeLocattion(list) {
      var map = {},
        node,
        roots = [],
        i;
      for (i = 0; i < list.length; i += 1) {
        map[list[i].id] = i; // initialize the map
        if (list[i].IsChild == false) {
          list[i].children = []; // initialize the children
        }
      }
      for (i = 0; i < list.length; i += 1) {
        node = list[i];
        if (node.ParentId != "0") {
          var objList = list[map[node.ParentId]];
          if (objList == undefined) {
          } else {
            objList.children.push(node);
          }
        } else {
          roots.push(node);
        }
      }
      return roots;
    },
    fetchTree() {
      if (this.arrayTree.length) return;

      return fetch(this.$urlApplication + "GetTreeOptionAll")
        .then(res => res.json())
        .then(data => {
          this.treeOptionAll = data;
          var convertedTree = this.list_to_treeLocattion(data);
          this.arrayTree = convertedTree;
        })
        .catch(err => console.log(err));
    },
    sendEmailConfirmation() {
      if (this.selectToEmailSend.length == 0) {
        this.dialogError = true;
      } else {
        this.dialogConfirmation = true;
      }
    },
    viewEmailBody() {
      this.dialogEmailBody = true;
      var htmlEmailBody = this.emailBodyFormatter();

      htmlEmailBody = htmlEmailBody
        .replace("<!DOCTYPE html>", "")
        .replace("<html>", "")
        .replace("<head></head>", "")
        .replace("body", "div")
        .replace("body", "div")
        .replace("</html>", "")
        .replace("75%", "100%")
        .replace(/<a/g, "<a style ='color: #06c;'");

      this.dialogEmailBodyContent = htmlEmailBody;
    },
    emailBodyFormatter() {
      var result = "";

      //Get BCC Emails///////////////////////////////////////
      var selectedTree = this.filterTree;
      var objBccEmail = this.treeOptionAll;
      var senderComments =
        this.editedItem.SenderComments == undefined
          ? ""
          : this.editedItem.SenderComments;

      senderComments = senderComments.replace(/(?:\r\n|\r|\n)/g, "<br>");

      var bccEmails = "";
      var intEmailCounter = 1;

      for (const itemsL1 of objBccEmail) {
        if (itemsL1.IsChild) {
          for (var i = 0; i < selectedTree.length; i++) {
            if (itemsL1.id == selectedTree[i]) {
              if (intEmailCounter <= 2) {
                bccEmails += itemsL1.name + "; ";
                intEmailCounter++;
              } else if (intEmailCounter > 2) {
                bccEmails += itemsL1.name + "; <br>";
                intEmailCounter = 1;
              }
              break;
            }
          }
        }
      }
      //END BCC Emails///////////////////////////////////////

      // var emailFontSize = "14.5px";
      // var emailFontFamily = "Calibri";
      var emailTemplate =
        " <!DOCTYPE html> " +
        " <html> " +
        " <head></head> " +
        " <body " +
        " style='color:black;font-family: " +
        this.emailFontFamily +
        "; font-size: " +
        this.emailFontSize +
        "'" +
        "> " +
        "senderComments? " +
        "     <table style='font-family: " +
        this.emailFontFamily +
        "; font-size: " +
        this.emailFontSize +
        ";width:75%; border: 1px solid black;border-collapse: collapse;' cellspacing='0'> " +
        "         <tr> " +
        "             <td width='15%' style='border: 1px solid black;border-collapse: collapse;'>To:</td> " +
        "             <td width='85%' style='border: 1px solid black;border-collapse: collapse;'>to? </td> " +
        "         </tr> " +
        "         <tr> " +
        "             <td style='border: 1px solid black;border-collapse: collapse;'>Cc:</td> " +
        "             <td style='border: 1px solid black;border-collapse: collapse;'>cc?</td> " +
        "         </tr> " +
        "         <tr> " +
        "             <td style='border: 1px solid black;border-collapse: collapse;'>Bcc:</td> " +
        "             <td style='border: 1px solid black;border-collapse: collapse;word-break: break-all;'>bcc?</td> " +
        "         </tr> " +
        "         <tr> " +
        "             <td style='border: 1px solid black;border-collapse: collapse;'>Subject:</td> " +
        "             <td style='border: 1px solid black;border-collapse: collapse;'> subject?</td> " +
        "         </tr> " +
        "         <tr> " +
        "             <td colspan='2' style='border: 1px solid black;border-collapse: collapse;'>body?</td> " +
        "         </tr> " +
        "     </table> " +
        " </body> " +
        " </html> ";

      var emailBody =
        this.editedItem.Body == undefined ? "" : this.editedItem.Body;

      emailBody = emailBody
        .split("<p>")
        .join("<p style='Margin-top:0;Margin-bottom:0;'>");

      result = emailTemplate
        .replace("to?", this.editedItem.toEmail)
        .replace(
          "cc?",
          this.editedItem.ccEmail == undefined ? "" : this.editedItem.ccEmail
        )
        .replace("bcc?", bccEmails == undefined ? "" : bccEmails)
        .replace(
          "subject?",
          this.editedItem.Subject == undefined ? "" : this.editedItem.Subject
        )
        .replace("body?", emailBody)
        .replace("senderComments?", senderComments + "<br><br>");

      return result;
    },
    sendEmail() {
      //Get To Emails///////////////////////////////////////////////////////////
      var toEmailIds = "";

      for (const items of this.selectToEmailSend) {
        if (toEmailIds.length == 0) {
          toEmailIds += items.value;
        } else {
          toEmailIds += "," + items.value;
        }
      }
      //Get CC Emails///////////////////////////////////////////////////////////
      var ccEmailIds = "";
      for (const items of this.selectCcEmailSend) {
        if (ccEmailIds.length == 0) {
          ccEmailIds += items.value;
        } else {
          ccEmailIds += "," + items.value;
        }
      }
      //End/////////////////////////////////////////////////////////////////////
      axios({
        method: "post",
        url: this.$urlApplication + "PostSendEmail",
        data: {
          Subject: this.editedItem.Subject,
          toEmail: toEmailIds,
          BodyHTML: this.emailBodyFormatter(),
          CCEmail: ccEmailIds
        }
      })
        .then(res => {
          this.dialogConfirmation = false;
          this.isLoading = false;
        })
        .catch(error => {
          alert(error.response.data);
          //alert("Alert! \n Email is not send kindly resend it");
        });
    },

    getMassNotification(id) {
      axios({
        method: "get",
        url: this.$urlApplication + "GetMassNotification?id=" + id
      })
        .then(res => {})
        .catch(error => {});
    },

    tableLoad() {
      axios({
        method: "get",
        url: this.$urlApplication + "GetMassNotifications"
      })
        .then(res => {
          this.listOfRecord = res.data;
          this.getRequestTypes();
        })
        .catch(error => {});
    },
    postMassNotification() {
      var obj = this.editedItem;

      obj.MassNotificationCategoryId = this.selectMassNotificationCategory.MassNotificationCategoryId;
      obj.RequestTypeId = this.selectRequestType.RequestTypeId;
      obj.massNotificationToEmail = this.selectToEmailSend;
      obj.massNotificationCcEmail = this.selectCcEmailSend;

      //////////////////////////////////////////////////////////////////////////////////BccEmail//////////////////////////////////////////////////////////////////
      var bccEmail = this.filterTree;
      var arrayBccEmail = [];

      for (var i = 0; i < bccEmail.length; i++) {
        if (Number.isInteger(bccEmail[i]) && bccEmail[i] != 0) {
          arrayBccEmail.push({
            TreeOptionId: bccEmail[i]
          });
        }
      }
      //////////////////////////////////////////////////////////////////////////////////BccEmail//////////////////////////////////////////////////////////////////
      obj.massNotificationBcc = arrayBccEmail;

      if (this.editedItem.Subject.length == 0) {
        alert("Please enter subject");
      } else {
        //Save
        axios({
          method: "post",
          url: this.$urlApplication + "PostMassNotification",
          data: obj
        })
          .then(res => {
            this.tableLoad();
            this.close();
            this.snackbar.isTrue = !this.snackbar.isTrue;
          })
          .catch(error => {
            alert(error.response.data);
          });
      }
    },
    putMassNotification() {
      var obj = this.editedItem;
      obj.MassNotificationCategoryId = this.selectMassNotificationCategory.MassNotificationCategoryId;
      obj.RequestTypeId = this.selectRequestType.RequestTypeId;
      obj.massNotificationToEmail = this.selectToEmailSend;
      obj.massNotificationCcEmail = this.selectCcEmailSend;

      //////////////////////////////////////////////////////////////////////////////////BccEmail//////////////////////////////////////////////////////////////////
      var bccEmail = this.filterTree;
      var arrayBccEmail = [];

      for (var i = 0; i < bccEmail.length; i++) {
        if (Number.isInteger(bccEmail[i]) && bccEmail[i] != 0) {
          arrayBccEmail.push({
            TreeOptionId: bccEmail[i]
          });
        }
      }
      //////////////////////////////////////////////////////////////////////////////////BccEmail//////////////////////////////////////////////////////////////////
      obj.massNotificationBcc = arrayBccEmail;

      if (this.editedItem.Subject.length == 0) {
        alert("Please enter subject");
      } else {
        //Update
        axios({
          method: "put",
          url:
            this.$urlApplication +
            "PutMassNotification?id=" +
            obj.MassNotificationId,
          data: obj
        })
          .then(res => {
            this.tableLoad();
            this.close();
            this.snackbar.isTrue = !this.snackbar.isTrue;
          })
          .catch(error => {
            alert(error.response.data);
          });
      }
    },

    deleteMassNotification(id) {
      var pId = id;
      axios({
        method: "delete",
        url: this.$urlApplication + "DeleteMassNotification?id=" + pId
      })
        .then(res => {
          this.tableLoad();
        })
        .catch(error => {});
    },
    clear() {
      this.editedItem.Body = "";
      this.editedItem.Subject = "";
      this.editedItem.Impact = "";
      this.editedItem.MassNotificationName = "";
      this.editedItem.KeyWord = "";
      this.editedItem.SenderComments = "";
      this.filterTree = [];
      this.editedItem.Active = false;
      this.selectToEmailSend = [];
      this.selectCcEmailSend = [];
    },

    getToEmail(id) {
      axios({
        method: "get",
        url: this.$urlApplication + "GetToEmail?id=" + id
      })
        .then(res => {
          this.selectToEmailSend = [];
          var obj = this.itemsToEmailSend;

          for (let v1 of res.data) {
            for (let v2 of obj) {
              if (v1.EmailId == v2.EmailId) {
                var result = {
                  text: v2.text,
                  value: v2.value,
                  EmailId: v2.EmailId
                };
                this.selectToEmailSend.push(result);
                break;
              }
            }
          }
        })
        .catch(error => {});
    },

    getCcEmail(id) {
      axios({
        method: "get",
        url: this.$urlApplication + "GetCcEmail?id=" + id
      })
        .then(res => {
          this.selectCcEmailSend = [];
          var obj = this.itemsCcEmailSend;

          for (let v1 of res.data) {
            for (let v2 of obj) {
              if (v1.EmailId == v2.EmailId) {
                var result = {
                  text: v2.text,
                  value: v2.value,
                  EmailId: v2.EmailId
                };
                this.selectCcEmailSend.push(result);
                break;
              }
            }
          }
        })
        .catch(error => {});
    },

    editItem(item) {
      var obj = item;

      //Massnotification Category Combobox--Start
      for (var items of this.itemsMassNotificationCategory) {
        if (
          obj.MassNotificationCategoryId == items.MassNotificationCategoryId
        ) {
          this.selectMassNotificationCategory = {
            MassNotificationCategoryId: obj.MassNotificationCategoryId,
            CategoryName: items.CategoryName
          };
          break;
        }
      }
      //Massnotification Category Combobox--End

      //Request Combobox--Start
      for (var items of this.itemsRequestType) {
        if (obj.RequestTypeId == items.RequestTypeId) {
          this.selectRequestType = {
            RequestTypeId: obj.RequestTypeId,
            Name: items.Name
          };
          break;
        }
      }
      //Request Combobox--End

      this.getToEmail(obj.MassNotificationId);
      this.getCcEmail(obj.MassNotificationId);
      this.editedIndex = this.listOfRecord.indexOf(obj);
      this.editedItem = Object.assign({}, obj);
      this.getMassNotificationBcc(obj.MassNotificationId);
      this.editedItem.toEmail = "it.servicedesk@aku.edu";
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.listOfRecord.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.deleteMassNotification(item.MassNotificationId);
    },
    close() {
      if (!this.dialog) {
        this.clear();
      }
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.filterTree = [];
      }, 300);
    }
  }
};
</script>