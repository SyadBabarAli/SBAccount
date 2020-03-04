<template>
  <v-layout row wrap class="pa-2">
    <v-flex lg12 class="mt-12">
      <v-card class="black--text elevation-5">
        <v-layout>
          <v-flex lg12>
            <v-card-title class="headline grey lighten-3 pa-1 ma-0" primary-title>Task</v-card-title>
            <v-card-title>
              <v-toolbar-title>Details</v-toolbar-title>
              <v-divider class="mx-2" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
              <v-dialog
                v-model="dialog"
                max-width="500px"
                scrollable
                persistent
                fullscreen
                hide-overlay
              >
                <v-btn slot="activator" color="primary" dark class="mb-2">Add</v-btn>
                <v-card>
                  <v-toolbar dark color="primary">
                    <v-btn icon dark @click="close">
                      <v-icon>close</v-icon>
                    </v-btn>
                    <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                      <v-btn flat @click="post" v-show="this.editedIndex === -1 ? true : false">save</v-btn>
                      <v-btn
                        flat
                        @click="put"
                        v-show="this.editedIndex === -1 ? false : true"
                      >update</v-btn>
                      <v-btn flat @click="clear">clear</v-btn>
                      <v-btn flat @click="close">cancel</v-btn>
                    </v-toolbar-items>
                  </v-toolbar>
                  <v-card-text>
                    <v-container grid-list-md>
                      <v-layout wrap v-show="true">
                        <v-flex lg3>
                          <v-text-field v-model="editedItem.TaskId" label="ID" disabled></v-text-field>
                        </v-flex>
                        <v-flex lg3>
                          <v-text-field v-model="editedItem.TaskDesc" label="Task Name"></v-text-field>
                        </v-flex>
                        <v-flex lg3>
                          <v-text-field
                            v-model="editedItem.ConnString"
                            label="Conn String"
                            disabled
                          ></v-text-field>
                        </v-flex>
                        <v-flex lg1>
                          <v-checkbox color="colorDark" v-model="editedItem.Active" label="Active"></v-checkbox>
                        </v-flex>
                        <v-flex lg1>
                          <v-checkbox
                            color="colorDark"
                            v-model="editedItem.IsBackup"
                            label="Backup"
                            :disabled="isBackUp"
                          ></v-checkbox>
                        </v-flex>
                        <v-flex lg1>
                          <v-checkbox color="colorDark" v-model="editedItem.IsEmail" label="Email"></v-checkbox>
                        </v-flex>
                      </v-layout>
                      <v-layout wrap>
                        <v-flex lg12>
                          <v-card class="elevation-10">
                            <v-card-title
                              class="headline grey lighten-3 pa-1 ma-0"
                              primary-title
                            >Set Reports</v-card-title>
                            <v-divider></v-divider>
                            <v-toolbar flat color="white">
                              <v-dialog v-model="dialogTaskTypeBase" max-width="850px">
                                <template v-slot:activator="{ on }">
                                  <v-btn color="primary" dark class="mb-2" v-on="on">New Item</v-btn>
                                </template>
                                <v-card>
                                  <v-card-title>
                                    <span class="headline">{{ formTitleTaskTypeBase }}</span>
                                  </v-card-title>

                                  <v-card-text>
                                    <v-container grid-list-lg>
                                      <v-layout wrap>
                                        <v-flex lg2>
                                          <v-combobox
                                            v-model="selectTaskType"
                                            :items="itemsTaskType"
                                            label="Select task type"
                                            item-text="text"
                                            item-value="vaue"
                                          ></v-combobox>
                                        </v-flex>
                                        <v-flex lg3>
                                          <v-combobox
                                            v-model="selectTaskTypeBase"
                                            :items="itemsTaskTypeBase"
                                            label="Select task type base"
                                            item-text="text"
                                            item-value="value"
                                          ></v-combobox>
                                          <!-- <v-combobox
                                            v-model="selectTaskTypeBase"
                                            :items="itemsTaskTypeBase"
                                            label="Select task type base"
                                            item-text="text"
                                            item-value="value"
                                            v-on:change="changeTaskBaseType"
                                          ></v-combobox>-->
                                        </v-flex>
                                        <v-flex lg4>
                                          <v-combobox
                                            v-model="selectTaskFrequency"
                                            :items="itemsTaskFrequency"
                                            label="Task frequency"
                                            item-text="text"
                                            item-value="vaue"
                                          ></v-combobox>
                                        </v-flex>
                                        <v-flex lg3>
                                          <v-combobox
                                            v-model="selectExportFormatType"
                                            :items="itemsExportFormatType"
                                            label="Export Format Type"
                                            item-text="text"
                                            item-value="vaue"
                                          ></v-combobox>
                                        </v-flex>
                                      </v-layout>
                                    </v-container>
                                  </v-card-text>

                                  <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                      color="blue darken-1"
                                      flat
                                      @click="closeTaskTypeBase"
                                    >Cancel</v-btn>
                                    <v-btn color="blue darken-1" flat @click="saveTaskTypeBase">Save</v-btn>
                                  </v-card-actions>
                                </v-card>
                              </v-dialog>
                            </v-toolbar>

                            <v-data-table
                              :headers="headersTaskTypeBase"
                              :items="listOfRecordsTaskTypeBase"
                              class="elevation-1"
                            >
                              <template v-slot:items="props">
                                <td>{{ props.item.TaskDetailId }}</td>
                                <td>{{ props.item.TaskTypeDesc }}</td>
                                <td>{{ props.item.TaskTypeBaseDesc }}</td>
                                <td>{{ props.item.TaskFrequencyDesc }}</td>
                                <td>{{ props.item.TaskExportFormatTypeDesc }}</td>
                                <td class="justify-center layout px-0">
                                  <v-btn
                                    v-if="rights.Modify"
                                    color="primary"
                                    fab
                                    small
                                    dark
                                    style="height:22px;width:22px;font-size:13px;"
                                    @click="editItemTaskTypeBase(props.item)"
                                  >
                                    <v-icon style="font-size:13px">edit</v-icon>
                                  </v-btn>
                                  <v-btn
                                    v-if="rights.Delete"
                                    color="red"
                                    fab
                                    small
                                    dark
                                    style="height:22px;width:22px;font-size:13px;"
                                  >
                                    <v-icon
                                      style="font-size:13px"
                                      @click="deleteItemTaskTypeBase(props.item)"
                                    >delete</v-icon>
                                  </v-btn>
                                </td>
                              </template>
                              <!-- <template v-slot:no-data>
                                <v-btn color="primary" @click="initialize">Reset</v-btn>
                              </template>-->
                            </v-data-table>
                          </v-card>
                        </v-flex>
                      </v-layout>

                      <v-layout wrap>
                        <v-flex lg12>
                          <v-card class="elevation-10">
                            <v-card-title
                              class="headline grey lighten-3 pa-1 ma-0"
                              primary-title
                            >Execution Routine</v-card-title>
                            <v-divider></v-divider>
                            <v-layout row wrap align-center class="pa-2">
                              <v-flex lg2>
                                <v-combobox
                                  v-model="selectTaskNature"
                                  :items="itemsTaskNature"
                                  label="Task Nature"
                                  item-text="text"
                                  item-value="value"
                                  v-on:change="changeTaskNature"
                                ></v-combobox>
                              </v-flex>

                              <v-flex lg2>
                                <v-combobox
                                  v-model="selectTaskMonth"
                                  :items="itemsTaskMonth"
                                  label="Month"
                                  item-text="text"
                                  item-value="value"
                                  :disabled="isTaskMonth"
                                ></v-combobox>
                              </v-flex>

                              <v-flex lg2>
                                <v-combobox
                                  v-model="selectTaskDay"
                                  :items="itemsTaskDay"
                                  label="Day"
                                  item-text="text"
                                  item-value="value"
                                  :disabled="isTaskDay"
                                ></v-combobox>
                              </v-flex>
                              <v-flex lg2>
                                <v-combobox
                                  v-model="selectTaskTime"
                                  :items="itemsTaskTime"
                                  label="Time Hours"
                                  item-text="text"
                                  item-value="value"
                                  :disabled="isTaskTime"
                                ></v-combobox>
                              </v-flex>

                              <v-flex lg2>
                                <v-checkbox
                                  color="colorDark"
                                  v-model="editedItem.ExceptSaturday"
                                  label="Except Saturday"
                                  :disabled="isExceptSaturday"
                                ></v-checkbox>
                              </v-flex>
                              <v-flex lg2>
                                <v-checkbox
                                  color="colorDark"
                                  v-model="editedItem.ExceptSunday"
                                  label="Except Sunday"
                                  :disabled="isExceptSunday"
                                ></v-checkbox>
                              </v-flex>
                            </v-layout>
                          </v-card>
                        </v-flex>
                      </v-layout>

                      <v-layout wrap>
                        <v-flex lg12>
                          <v-card class="elevation-10">
                            <v-card-title
                              class="headline grey lighten-3 pa-1 ma-0"
                              primary-title
                            >Email Send</v-card-title>
                            <v-divider></v-divider>
                            <v-layout row wrap align-center class="pa-2">
                              <v-flex lg6>
                                <v-combobox
                                  v-model="selectTaskEmailToAssigned"
                                  :items="itemsTaskEmailToAssigned"
                                  label="To Email"
                                  item-text="text"
                                  item-value="value"
                                  multiple
                                ></v-combobox>
                              </v-flex>

                              <v-flex lg6>
                                <v-combobox
                                  v-model="selectTaskEmailCCAssigned"
                                  :items="itemsTaskEmailCCAssigned"
                                  label="CC Email"
                                  item-text="text"
                                  item-value="value"
                                  multiple
                                ></v-combobox>
                              </v-flex>

                              <v-flex lg6>
                                <v-text-field
                                  v-model="editedItem.SubjectEmail"
                                  label="Subject Email"
                                ></v-text-field>
                              </v-flex>
                            </v-layout>

                            <v-layout row wrap align-center class="pa-2">
                              <v-flex lg12>
                                <v-textarea
                                  v-model="editedItem.BodyEmail"
                                  solo
                                  rows="5"
                                  label="Email Body"
                                  hint="Email Body"
                                ></v-textarea>
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
              :headers="headers"
              :items="listOfRecords"
              class="elevation-3"
              :search="search"
            >
              <template slot="items" slot-scope="props">
                <td>{{ props.item.TaskId }}</td>
                <td class="text-xs-left">{{ props.item.TaskDesc }}</td>
                <td class="text-xs-left">{{ props.item.Nature }}</td>
                <td class="text-xs-left">{{ props.item.TimeHoure }}</td>
                <td class="text-xs-left">{{ props.item.CreatedBy }}</td>
                <td class="text-xs-left">{{ props.item.Created | momentDateDash }}</td>
                <td class="text-xs-left">{{ props.item.ModifiedBy }}</td>
                <td class="text-xs-left">{{ props.item.Modified | momentDateDash }}</td>
                <td class="text-xs-left">{{ props.item.Active == true ? 'Yes' : 'No' }}</td>
                <td class="justify-center layout px-0">
                  <v-btn
                    v-if="rights.Modify"
                    color="primary"
                    fab
                    small
                    dark
                    style="height:22px;width:22px;font-size:13px;"
                    @click="editItem(props.item)"
                  >
                    <v-icon style="font-size:13px">edit</v-icon>
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
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>
        <v-divider light></v-divider>
        <v-card-actions class="pa-0 ma-0 ml-1"></v-card-actions>
      </v-card>
    </v-flex>
    <snack-bar :isSnackbar="IsSnackBar" />
  </v-layout>
</template>

<script>
import { mixins } from "../../../mixins/CustomMixins";
import Application from "../../../services/application-service";
import MonthPicker from "../../../components/control/MonthPicker";
import SnackBar from "../../../components/control/SnackBar";
import axios from "axios";
import moment from "moment";

export default {
  mixins: [mixins],
  components: {
    MonthPicker,
    SnackBar
  },
  data: () => ({
    selectExportFormatType: null,
    itemsExportFormatType: [],

    selectTaskFrequency: null,
    itemsTaskFrequency: [],

    selectTaskNature: null,
    itemsTaskNature: [],

    selectTaskType: null,
    itemsTaskType: [],

    selectTaskTime: null,
    itemsTaskTime: [],

    selectTaskAction: null,
    itemsTaskAction: [],

    selectTaskMonth: null,
    itemsTaskMonth: [],

    selectTaskDay: null,
    itemsTaskDay: [],

    selectTaskTypeBase: [],
    itemsTaskTypeBase: [],

    selectTaskEmailToAssigned: [],
    itemsTaskEmailToAssigned: [],

    selectTaskEmailCCAssigned: [],
    itemsTaskEmailCCAssigned: [],

    isTaskTime: false,

    isTaskMonth: true,
    isTaskDay: true,

    isBackUp: false,
    isExceptSaturday: false,
    isExceptSunday: false,
    dialog: false,
    search: "",
    headers: [
      { text: "ID", value: "TaskId" },
      { text: "Task Name", value: "TaskDesc" },
      { text: "Nature", value: "Nature" },
      { text: "Time Hr", value: "TimeHoure" },
      { text: "Created By", value: "CreatedBy" },
      { text: "Created", value: "Created" },
      { text: "Modified By", value: "ModifiedBy" },
      { text: "Modified", value: "Modified" },
      { text: "Active", value: "Active" },
      { text: "Actions", value: "", sortable: false, align: "center" }
    ],
    isLoading: true,
    IsSnackBar: false,
    listOfRecords: [],
    editedIndex: -1,
    editedItem: {
      ConnString: "TicketDB",
      Active: true
    },
    defaultItem: {
      ConnString: "TicketDB"
    },
    rights: {
      View: false,
      Modify: false,
      Delete: false
    },

    dialogTaskTypeBase: false,
    headersTaskTypeBase: [
      {
        text: "ID",
        align: "left",
        sortable: false,
        value: "TaskDetailId",
        class: "1"
      },
      {
        text: "TaskTypeId",
        align: "left",
        // sortable: true,
        value: "TaskTypeId",
        class: "csmHide"
      },
      {
        text: "TaskTypeBaseId",
        value: "TaskTypeBaseId",
        align: "left",
        class: "csmHide"
      },
      {
        text: "TaskFrequencyId",
        value: "TaskFrequencyId",
        align: "left",
        class: "csmHide"
      },
      {
        text: "TaskExportFormatTypeId",
        value: "TaskExportFormatTypeId",
        align: "left",
        class: "csmHide"
      },
      { text: "Task Type Desc", value: "TaskTypeDesc", align: "left" },
      { text: "Task Type Base Desc", value: "TaskTypeBaseDesc", align: "left" },
      {
        text: "Task Frequency Desc",
        value: "TaskFrequencyDesc"
      },
      {
        text: "Task Export Format Type Desc",
        value: "TaskExportFormatTypeDesc"
      },
      { text: "Actions", value: "name", sortable: false }
    ],
    listOfRecordsTaskTypeBase: [],
    editedIndexTaskTypeBase: -1,
    editedItemTaskTypeBase: {
      TaskDetailId: 0,
      TaskTypeId: 0,
      TaskTypeBaseId: 0,
      TaskFrequencyId: 0,
      TaskExportFormatTypeId: 0,
      TaskTypeDesc: "",
      TaskTypeBaseDesc: "",
      TaskFrequencyDesc: "",
      TaskExportFormatTypeDesc: "",

      IsEmail: false,
      IsBackup: false,
      ExceptSunday: false,
      ExceptSaturday: false
    },
    defaultItemTaskTypeBase: {
      TaskDetailId: 0,
      TaskTypeId: 0,
      TaskTypeBaseId: 0,
      TaskFrequencyId: 0,
      TaskExportFormatTypeId: 0,
      TaskTypeDesc: "",
      TaskTypeBaseDesc: "",
      TaskFrequencyDesc: "",
      TaskExportFormatTypeDesc: "",
      IsEmail: false,
      IsBackup: false,
      ExceptSunday: false,
      ExceptSaturday: false
    },
    TaskDetailIdPrimaryKey: 0
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Task" : "Edit Task";
    },
    formTitleTaskTypeBase() {
      return this.editedIndexTaskTypeBase === -1 ? "New Item" : "Edit Item";
    }
  },
  watch: {
    dialog(val) {
      var isTrue = val;
      if (isTrue) {
        this.dialogOpen();
      } else {
        isTrue || this.close();
      }
    },

    dialogTaskTypeBase(val) {
      var isTrue = val;
      if (isTrue) {
        this.openTaskTypeBase();
      } else {
        val || this.closeTaskTypeBase();
      }
    }
  },
  created() {
    this.initialize();
  },
  methods: {
    editItemTaskTypeBase(item) {
      this.editedIndexTaskTypeBase = this.listOfRecordsTaskTypeBase.indexOf(
        item
      );
      this.editedItemTaskTypeBase = Object.assign({}, item);
      this.dialogTaskTypeBase = true;

      var obj = item;

      //2
      for (var items of this.itemsTaskType) {
        if (obj.TaskTypeId == items.value) {
          this.selectTaskType = {
            value: items.value,
            text: items.text
          };
          break;
        }
      }

      //4
      for (var items of this.itemsExportFormatType) {
        if (obj.TaskExportFormatTypeId == items.value) {
          this.selectExportFormatType = {
            value: items.value,
            text: items.text
          };
          break;
        }
      }

      //5
      for (var items of this.itemsTaskTypeBase) {
        if (obj.TaskTypeBaseId == items.value) {
          this.selectTaskTypeBase = {
            value: items.value,
            text: items.text
          };
          break;
        }
      }

      //6
      for (var items of this.itemsTaskFrequency) {
        if (obj.TaskFrequencyId == items.value) {
          this.selectTaskFrequency = {
            value: items.value,
            text: items.text
          };
          break;
        }
      }
      // this.editedIndexTaskTypeBase = this.listOfRecordsTaskTypeBase.indexOf(
      //   item
      // );
      // this.editedItemTaskTypeBase = Object.assign({}, item);
      this.dialogTaskTypeBase = true;
    },

    deleteItemTaskTypeBase(item) {
      const index = this.listOfRecordsTaskTypeBase.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.listOfRecordsTaskTypeBase.splice(index, 1);
    },
    openTaskTypeBase() {},
    closeTaskTypeBase() {
      this.dialogTaskTypeBase = false;
      setTimeout(() => {
        this.editedItemTaskTypeBase = Object.assign(
          {},
          this.defaultItemTaskTypeBase
        );
        this.editedIndexTaskTypeBase = -1;
      }, 300);
    },

    saveTaskTypeBase() {
      if (this.selectTaskType == null || this.selectTaskType.length == 0) {
        alert("Please select task type");
      } else if (
        this.selectTaskTypeBase == null ||
        this.selectTaskTypeBase.length == 0
      ) {
        alert("Please select task type base");
      } else if (
        this.selectTaskFrequency == null ||
        this.selectTaskFrequency.length == 0
      ) {
        alert("Please select task frequency");
      } else if (
        this.selectExportFormatType == null ||
        this.selectExportFormatType.length == 0
      ) {
        alert("Please select export format type");
      } else {
        if (this.editedIndexTaskTypeBase > -1) {
          this.editedItemTaskTypeBase.TaskTypeId = this.selectTaskType.value;
          this.editedItemTaskTypeBase.TaskTypeBaseId = this.selectTaskTypeBase.value;
          this.editedItemTaskTypeBase.TaskFrequencyId = this.selectTaskFrequency.value;
          this.editedItemTaskTypeBase.TaskExportFormatTypeId = this.selectExportFormatType.value;

          this.editedItemTaskTypeBase.TaskTypeDesc = this.selectTaskType.text;
          this.editedItemTaskTypeBase.TaskTypeBaseDesc = this.selectTaskTypeBase.text;
          this.editedItemTaskTypeBase.TaskFrequencyDesc = this.selectTaskFrequency.text;
          this.editedItemTaskTypeBase.TaskExportFormatTypeDesc = this.selectExportFormatType.text;

          Object.assign(
            this.listOfRecordsTaskTypeBase[this.editedIndexTaskTypeBase],
            this.editedItemTaskTypeBase
          );
        } else {
          //var cnt =1;

          // debugger
          // if (this.listOfRecordsTaskTypeBase.TaskDetailId == 0) {
          //   this.TaskDetailIdPrimaryKey = 1;
          // } else {
          //   this.TaskDetailIdPrimaryKey = this.listOfRecordsTaskTypeBase.length + 1;
          // }

          this.TaskDetailIdPrimaryKey =
            this.listOfRecordsTaskTypeBase.length + 1;

          this.editedItemTaskTypeBase.TaskDetailId = this.TaskDetailIdPrimaryKey;

          this.editedItemTaskTypeBase.TaskTypeId = this.selectTaskType.value;
          this.editedItemTaskTypeBase.TaskTypeBaseId = this.selectTaskTypeBase.value;
          this.editedItemTaskTypeBase.TaskFrequencyId = this.selectTaskFrequency.value;
          this.editedItemTaskTypeBase.TaskExportFormatTypeId = this.selectExportFormatType.value;

          this.editedItemTaskTypeBase.TaskTypeDesc = this.selectTaskType.text;
          this.editedItemTaskTypeBase.TaskTypeBaseDesc = this.selectTaskTypeBase.text;
          this.editedItemTaskTypeBase.TaskFrequencyDesc = this.selectTaskFrequency.text;
          this.editedItemTaskTypeBase.TaskExportFormatTypeDesc = this.selectExportFormatType.text;

          this.listOfRecordsTaskTypeBase.push(this.editedItemTaskTypeBase);
        }
        this.closeTaskTypeBase();
      }
    },

    getToEmails() {
      axios({
        method: "get",
        url: this.$urlApplication + "/Task/GetEmails"
      })
        .then(res => {
          //this.itemsToEmailSend = [];
          this.itemsTaskEmailToAssigned = [];
          this.itemsTaskEmailCCAssigned = [];

          this.select;
          for (let items of res.data) {
            var result = {
              text: items.EmailTitle,
              value: items.Email1,
              EmailId: items.EmailId
            };
            //this.itemsToEmailSend.push(result);
            this.itemsTaskEmailToAssigned.push(result);
            this.itemsTaskEmailCCAssigned.push(result);
          }
        })
        .catch(error => {});
    },

    getTaskEmailToAssigned(id) {
      axios({
        method: "get",
        url: this.$urlApplication + "Task/GetTaskEmailToAssigned?id=" + id
      })
        .then(res => {
          this.selectTaskEmailToAssigned = [];
          var obj = this.itemsTaskEmailToAssigned;
          for (let v1 of res.data) {
            for (let v2 of obj) {
              if (v1.EmailId == v2.EmailId) {
                var result = {
                  text: v2.text,
                  value: v2.value,
                  EmailId: v2.EmailId
                };
                this.selectTaskEmailToAssigned.push(result);
                break;
              }
            }
          }
        })
        .catch(error => {});
    },

    getTaskEmailCCAssigned(id) {
      axios({
        method: "get",
        url: this.$urlApplication + "Task/GetTaskEmailCCAssigned?id=" + id
      })
        .then(res => {
          this.selectTaskEmailCCAssigned = [];
          var obj = this.itemsTaskEmailCCAssigned;
          for (let v1 of res.data) {
            for (let v2 of obj) {
              if (v1.EmailId == v2.EmailId) {
                var result = {
                  text: v2.text,
                  value: v2.value,
                  EmailId: v2.EmailId
                };
                this.selectTaskEmailCCAssigned.push(result);
                break;
              }
            }
          }
        })
        .catch(error => {});
    },
    getTaskNature() {
      axios({
        method: "get",
        url: this.$urlApplication + "Task/GetTaskNature"
      })
        .then(res => {
          this.itemsTaskNature = [];
          var isTrue = true;
          for (let items of res.data) {
            var result = {
              value: items.value,
              text: items.text
            };
            if (isTrue) {
              this.selectTaskNature = result;
              isTrue = false;
              this.changeTaskNature(result);
            }
            this.itemsTaskNature.push(result);
          }
        })
        .catch(error => {});
    },

    getTaskMonth() {
      axios({
        method: "get",
        url: this.$urlApplication + "Task/GetTaskMonth"
      })
        .then(res => {
          this.itemsTaskMonth = [];
          var isTrue = true;
          for (let items of res.data) {
            var result = {
              value: items.value,
              text: items.text
            };
            if (isTrue) {
              this.selectTaskMonth = result;
              isTrue = false;
            }
            this.itemsTaskMonth.push(result);
          }
        })
        .catch(error => {});
    },

    getTaskDay() {
      axios({
        method: "get",
        url: this.$urlApplication + "Task/GetTaskDay"
      })
        .then(res => {
          this.itemsTaskDay = [];
          var isTrue = true;
          for (let items of res.data) {
            var result = {
              value: items.value,
              text: items.text
            };
            if (isTrue) {
              this.selectTaskDay = result;
              isTrue = false;
            }
            this.itemsTaskDay.push(result);
          }
        })
        .catch(error => {});
    },

    getTaskTime() {
      axios({
        method: "get",
        url: this.$urlApplication + "Task/GetTaskTime"
      })
        .then(res => {
          this.itemsTaskTime = [];
          var isTrue = true;
          for (let items of res.data) {
            var result = {
              value: items.value,
              text: items.text
            };
            if (isTrue) {
              this.selectTaskTime = result;
              isTrue = false;
            }
            this.itemsTaskTime.push(result);
          }
        })
        .catch(error => {});
    },

    getTaskType() {
      axios({
        method: "get",
        url: this.$urlApplication + "Task/GetTaskType"
      })
        .then(res => {
          this.itemsTaskType = [];
          var isTrue = true;
          for (let items of res.data) {
            var result = {
              value: items.value,
              text: items.text
            };

            if (isTrue) {
              this.selectTaskType = result;
              isTrue = false;
            }
            this.itemsTaskType.push(result);
          }
        })
        .catch(error => {});
    },

    getTaskExportFormatType() {
      axios({
        method: "get",
        url: this.$urlApplication + "Task/GetTaskExportFormatType"
      })
        .then(res => {
          this.itemsExportFormatType = [];
          var isFirst = true;
          for (let items of res.data) {
            var result = {
              value: items.value,
              text: items.text
            };
            this.itemsExportFormatType.push(result);

            if (isFirst) {
              this.selectExportFormatType = result;
              isFirst = false;
            }
          }
        })
        .catch(error => {});
    },

    getTaskTypeBase() {
      axios({
        method: "get",
        url: this.$urlApplication + "Task/GetTaskTypeBase"
      })
        .then(res => {
          this.itemsTaskTypeBase = [];

          var isFirst = true;
          for (let items of res.data) {
            var result = {
              value: items.value,
              text: items.text,
              TaskTypeBaseId: items.value
            };

            this.itemsTaskTypeBase.push(result);
            //this.changeTaskBaseType(result);
            if (isFirst) {
              this.selectTaskTypeBase.push(result);
              isFirst = false;
            }
          }
        })
        .catch(error => {});
    },

    getTaskFrequency() {
      axios({
        method: "get",
        url: this.$urlApplication + "Task/GetTaskFrequency"
      })
        .then(res => {
          this.itemsTaskFrequency = [];

          var isFirst = true;
          for (let items of res.data) {
            var result = {
              value: items.value,
              text: items.text
            };
            this.itemsTaskFrequency.push(result);

            if (isFirst) {
              this.selectTaskFrequency = result;
              isFirst = false;
            }
          }
        })
        .catch(error => {});
    },
    initialize() {
      this.getUserRights([641, 642, 643]).then(result => {
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
      this.tableLoad();
      this.getTaskNature();
      this.getTaskType();
      this.getTaskTime();
      this.getTaskExportFormatType();
      this.getTaskTypeBase();
      this.getTaskFrequency();
      this.getTaskMonth();
      this.getTaskDay();
      this.getToEmails();
    },

    async tableLoad() {
      const res = await axios
        .get(this.$urlApplication + "Task/Gets")
        .then(res => {
          this.listOfRecords = res.data;
        })
        .catch(error => {});
    },

    post() {
      var obj = this.editedItem;

      if (
        this.editedItem.TaskDesc == null ||
        this.editedItem.TaskDesc.length == 0
      ) {
        alert("Please enter task name");
      } else if (
        this.listOfRecordsTaskTypeBase == null ||
        this.listOfRecordsTaskTypeBase.length == 0
      ) {
        alert("Please add reports");
      } else if (
        this.editedItem.SubjectEmail == null ||
        this.editedItem.SubjectEmail.length == 0
      ) {
        alert("Please enter subject email");
      } else {
        obj.TaskDetails = this.listOfRecordsTaskTypeBase;
        obj.taskEmailToAssignedIds = this.selectTaskEmailToAssigned;
        obj.taskEmailCCAssignedIds = this.selectTaskEmailCCAssigned;

        obj.TaskNatureId = this.selectTaskNature.value;
        obj.TaskMonthId = this.selectTaskMonth.value;
        obj.TaskDayId = this.selectTaskDay.value;
        obj.TaskTimeId = this.selectTaskTime.value;

        obj.IsEmail =
          this.editedItem.IsEmail == null ? false : this.editedItem.IsEmail;
        obj.IsBackup =
          this.editedItem.IsBackup == null ? false : this.editedItem.IsBackup;
        obj.ExceptSunday =
          this.editedItem.ExceptSunday == null
            ? false
            : this.editedItem.ExceptSunday;
        obj.ExceptSaturday =
          this.editedItem.ExceptSaturday == null
            ? false
            : this.editedItem.ExceptSaturday;

        this.IsSnackBar = true;

        axios({
          method: "post",
          url: this.$urlApplication + "Task/Post",
          data: obj
        })
          .then(res => {
            this.IsSnackBar = false;
            this.tableLoad();
            this.close();
          })
          .catch(error => {
            this.IsSnackBar = false;
          });
      }
    },

    put() {
      var obj = this.editedItem;

      if (
        this.editedItem.TaskDesc == null ||
        this.editedItem.TaskDesc.length == 0
      ) {
        alert("Please enter task name");
      } else if (
        this.editedItem.SubjectEmail == null ||
        this.editedItem.SubjectEmail.length == 0
      ) {
        alert("Please enter subject email");
      } else if (
        this.listOfRecordsTaskTypeBase == null ||
        this.listOfRecordsTaskTypeBase.length == 0
      ) {
        alert("Please add reports");
      } else {
        obj.TaskDetails = this.listOfRecordsTaskTypeBase;
        obj.taskEmailToAssignedIds = this.selectTaskEmailToAssigned;
        obj.taskEmailCCAssignedIds = this.selectTaskEmailCCAssigned;

        obj.TaskNatureId = this.selectTaskNature.value;
        obj.TaskMonthId = this.selectTaskMonth.value;
        obj.TaskDayId = this.selectTaskDay.value;
        obj.TaskTimeId = this.selectTaskTime.value;

        obj.IsEmail =
          this.editedItem.IsEmail == null ? false : this.editedItem.IsEmail;
        obj.IsBackup =
          this.editedItem.IsBackup == null ? false : this.editedItem.IsBackup;
        obj.ExceptSunday =
          this.editedItem.ExceptSunday == null
            ? false
            : this.editedItem.ExceptSunday;
        obj.ExceptSaturday =
          this.editedItem.ExceptSaturday == null
            ? false
            : this.editedItem.ExceptSaturday;

        this.IsSnackBar = true;

        axios({
          method: "put",
          url: this.$urlApplication + "Task/Put?id=" + obj.TaskId,
          data: obj
        })
          .then(res => {
            this.IsSnackBar = false;
            this.tableLoad();
            this.close();
          })
          .catch(error => {
            this.IsSnackBar = false;
          });
      }
    },

    delete(id) {
      var pId = id;
      this.IsSnackBar = true;
      axios({
        method: "delete",
        url: this.$urlApplication + "Task/Delete?id=" + pId
      })
        .then(res => {
          this.IsSnackBar = false;
          this.tableLoad();
        })
        .catch(error => {
          this.IsSnackBar = false;
        });
    },
    clear() {
      this.editedItem.TaskId = "";
      this.editedItem.TaskDesc = "";
      this.editedItem.Nature = "";
      this.editedItem.TaskTypeDesc = "";
      this.editedItem.TimeHoure = "";
      this.editedItem.TaskActionDesc = "";
      this.editedItem.BodyEmail = "";
      this.editedItem.SubjectEmail = "";
      this.editedItem.TaskNatureId = "";
      this.editedItem.TaskTimeId = "";
      this.selectTaskTypeBase = [];
      this.selectTaskEmailToAssigned = [];
      this.selectTaskEmailCCAssigned = [];
      this.selectTaskFrequency = null;

      this.listOfRecordsTaskTypeBase = [];
    },
    async tableLoadTaskDetail(id) {
      const res = await axios
        .get(this.$urlApplication + "Task/GetTaskDetail?id=" + id)
        .then(res => {
          this.listOfRecordsTaskTypeBase = res.data;
        })
        .catch(error => {});
    },
    editItem(item) {
      var obj = item;

      //this.getTaskTypeBaseAssigned(obj.TaskId);
      this.getTaskEmailToAssigned(obj.TaskId);
      this.getTaskEmailCCAssigned(obj.TaskId);
      this.tableLoadTaskDetail(obj.TaskId);

      //1
      for (var items of this.itemsTaskNature) {
        if (obj.TaskNatureId == items.value) {
          this.selectTaskNature = {
            value: items.value,
            text: items.text
          };
          break;
        }
      }

      //2
      for (var items of this.itemsTaskType) {
        if (obj.TaskTypeId == items.value) {
          this.selectTaskType = {
            value: items.value,
            text: items.text
          };
          break;
        }
      }
      //3
      for (var items of this.itemsTaskTime) {
        if (obj.TaskTimeId == items.value) {
          this.selectTaskTime = {
            value: items.value,
            text: items.text
          };
          break;
        }
      }

      //4
      for (var items of this.itemsExportFormatType) {
        if (obj.TaskExportFormatTypeId == items.value) {
          this.selectExportFormatType = {
            value: items.value,
            text: items.text
          };
          break;
        }
      }

      //5
      for (var items of this.itemsTaskTypeBase) {
        if (obj.TaskTypeBaseId == items.value) {
          this.selectTaskTypeBase = {
            value: items.value,
            text: items.text
          };
          break;
        }
      }

      //6
      for (var items of this.itemsTaskFrequency) {
        if (obj.TaskFrequencyId == items.value) {
          this.selectTaskFrequency = {
            value: items.value,
            text: items.text
          };
          break;
        }
      }

      this.editedIndex = this.listOfRecords.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.listOfRecords.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.delete(item.TaskId);
    },
    dialogOpen() {
      if (this.editedItem.TaskId == undefined) {
        //When click add
        this.editedItem.Active = true;
        this.clear();
      } else {
        //Edite Record
        this.changeTaskNature(this.selectTaskNature);
        //this.changeTaskBaseType(this.selectTaskTypeBase);
      }
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
    },

    // changeTaskBaseType(pObj) {
    //   var obj = pObj;
    //   if (obj != null) {
    //     var id = obj.value;
    //     if (id == 1 || id == 2 || id == 3) {
    //       this.isBackUp = false;
    //     } else {
    //       this.isBackUp = true;
    //     }
    //   }
    // },

    changeTaskNature(pObj) {
      var obj = pObj;
      if (obj != null) {
        var id = obj.value;
        if (id == 8) {
          //Real Time
          this.isTaskMonth = true;
          this.isTaskDay = true;
          this.isExceptSaturday = false;
          this.isExceptSunday = false;
        } else 
        if (id == 10) {
          //Monthly
          //this.isTaskMonth = false;
          this.isTaskDay = false;
          this.isTaskTime = false;
          this.isExceptSaturday = false;
          this.isExceptSunday = false;
        } else if (id == 9) {
          //Daily
          this.isExceptSaturday = false;
          this.isExceptSunday = false;
        } else {
          //Weekly
          this.isTaskMonth = true;
          this.isTaskDay = true;

          //Open Option
          this.isExceptSaturday = true;
          this.isExceptSunday = true;
          this.editedItem.ExceptSaturday = false;
          this.editedItem.ExceptSunday = false;
        }
      }
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
  padding: 10 10px;
  width: inherit;
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 32px;
}
table.v-table tbody td,
table.v-table tbody th {
  height: 30px;
}
</style>