<template>
  <layout-one :title="'Administrative Rights Exception'">
    <v-card-title>
      <v-toolbar-title>Details</v-toolbar-title>
      <v-divider class="mx-2" inset vertical></v-divider>
      <v-flex lg4 class="text-xs-left">
        <download-excel type="xls" :fields="json_fields" :data="filtered">
          <v-btn small color="colorLight" class="colorDark white--text font-weight-light">
            Export Excel
            <v-icon right dark>cloud_download</v-icon>
          </v-btn>
        </download-excel>
      </v-flex>
      <v-spacer></v-spacer>
      <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
      <v-dialog v-model="dialog" max-width="500px" persistent scrollable>
        <v-btn v-show="rights.Modify" slot="activator" color="primary" dark class="mb-2">Add</v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <form>
                <!-- <v-layout>
                  <v-flex lg3>
                    <v-checkbox color="primary" v-model="editedItem.Active" label="Active"></v-checkbox>
                  </v-flex>
                </v-layout>-->

                <v-layout row>
                  <v-flex lg5>
                    <v-btn v-on:click="addFiles()">
                      <v-icon>attach_file</v-icon>attachment
                    </v-btn>
                    <input
                      type="file"
                      id="files"
                      ref="files"
                      multiple
                      v-on:change="handleFilesUpload()"
                      style="display:none"
                    />
                  </v-flex>

                  <v-flex lg3>
                    <v-checkbox color="primary" v-model="editedItem.ARAF" label="ARAF"></v-checkbox>

                     


                  </v-flex>
                  <v-flex lg4>
                    <v-checkbox color="primary" v-model="editedItem.T2Comment" label="IT Comments"></v-checkbox>
                  </v-flex>
                </v-layout>

                <v-layout>
                  <v-flex lg6>
                    <v-combobox
                      v-model="selectRequestTypeIdCIORemark"
                      :items="itemsRequestTypeIdCIORemark"
                      label="CIO Remarks"
                      item-text="text"
                      item-value="value"
                    ></v-combobox>
                  </v-flex>
                  <v-flex lg6>
                    <v-combobox
                      v-model="selectRequestTypeIdRightsAssignment"
                      :items="itemsRequestTypeIdRightsAssignment"
                      label="Rights Assignment"
                      item-text="text"
                      item-value="value"
                    ></v-combobox>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex>
                    <div v-if="!isFileUploadError">
                      <div v-if="isFileUpload">
                        <v-progress-linear :indeterminate="true"></v-progress-linear>
                      </div>
                      <ul class="nobull" v-else>
                        <li v-for="(input, index) in this.tempfiles" :key>
                          <a
                            v-on:click.stop="getGenerate(input)"
                            class="blue--text"
                          >{{input.FileNameUser}}</a>
                          <v-icon color="red" @click="deleteAttachment(index)">close</v-icon>
                        </li>
                      </ul>
                    </div>
                    <v-alert
                      style="height:36px"
                      :value="true"
                      type="error"
                      v-else
                    >No file uploaded or invalid file type!</v-alert>
                  </v-flex>
                </v-layout>

                <v-layout>
                  <v-flex lg12>
                    <v-textarea
                      v-model="editedItem.Computer"
                      label="Computer Names"
                      hint="Computer Names"
                      solo
                    ></v-textarea>
                  </v-flex>
                </v-layout>

                <v-layout>
                  <v-flex lg6>
                    <v-text-field v-model="editedItem.AuthorizedId" label="Authorized IDs"></v-text-field>
                    </v-flex>
                    
                  <v-flex lg6>                    
                    <v-dialog
                      ref="dialogstartDate"
                      v-model="modalstartDate"
                      :return-value.sync="editedItem.Expiry"
                      lazy
                      full-width
                      width="290px"
                    >
                      <v-text-field
                        slot="activator"
                        v-model="editedItem.Expiry"
                        label="Expiry Date"
                        prepend-icon="event"
                        readonly
                      ></v-text-field>
                      <v-date-picker v-model="editedItem.Expiry" scrollable color="colorDark">
                        <v-spacer></v-spacer>
                        <v-btn flat color="colorDark" @click="modalstartDate = false">Cancel</v-btn>
                        <v-btn
                          flat
                          color="colorDark"
                          @click="$refs.dialogstartDate.save(editedItem.Expiry)"
                        >OK</v-btn>
                      </v-date-picker>
                    </v-dialog>
                  </v-flex>
                </v-layout>

                <v-layout>
                  <v-flex lg4>
                    <v-text-field v-model="editedItem.Total" label="Total"></v-text-field>
                  </v-flex>
                  <v-flex lg8>
                    <v-text-field v-model="editedItem.Service" label="Services"></v-text-field>
                  </v-flex>
                </v-layout>
                <!-- <v-layout>
                  <v-flex lg8>
                    <v-text-field v-model="editedItem.Service" label="Services"></v-text-field>
                  </v-flex>
                </v-layout>-->

                <v-layout>
                  <v-flex lg12>
                    <v-textarea
                      v-model="editedItem.ITRemarks"
                      label="IT Remarks"
                      hint="IT Remarks"
                      solo
                    ></v-textarea>
                  </v-flex>
                </v-layout>
              </form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click="postForm" v-if="this.editedIndex === -1">save</v-btn>
            <v-btn flat @click="putForm" v-if="this.editedIndex != -1">update</v-btn>
            <v-btn flat @click="clear">clear</v-btn>
            <v-btn flat @click="close">cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Attachment List Dialog Start-->
      <v-dialog v-model="dialogAttachment" max-width="500px" scrollable v-if="rights.View">
        <v-card>
          <v-card-title>
            <span class="headline">Attachment List</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <form>
                <v-layout row>
                  <v-flex>
                    <div v-for="item in  this.tempfiles">
                      <a
                        v-on:click.stop="getGenerate(item )"
                        class="blue--text"
                      >{{item.FileNameUser}}</a>
                    </div>
                  </v-flex>
                </v-layout>
              </form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click="closeAttachment">cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Attachment List Dialog-End-->
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="filtered"
      class="elevation-3 tableAdministrativeRight"
      :search="search"
      :pagination.sync="pagination"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">
          <v-icon
            v-if="props.item.IsAttachment"
            color="colorLight"
            v-on:click="viewAttachment(props.item)"
          >attach_file</v-icon>
        </td>

        <!-- <td class="text-xs-left">{{ props.item.ARAF }}</td> -->

        <td class="text-xs-left">
          <v-icon style="font-size:20px" color="colorLight" v-if="props.item.ARAF == true">done</v-icon>
          <v-icon style="font-size:20px" color="red" v-if="props.item.ARAF == false">clear</v-icon>
          <!-- <v-icon style="font-size:20px" color="red" v-else>clear</v-icon>
          {{ props.item.ARAF }}-->
        </td>

        <!-- <td class="text-xs-left">{{ props.item.T2Comment }}</td> -->

        <td class="text-xs-left">
          <v-icon style="font-size:20px" color="colorLight" v-if="props.item.T2Comment == true">done</v-icon>
          <v-icon style="font-size:20px" color="red" v-if="props.item.T2Comment == false">clear</v-icon>
          <!-- <v-icon style="font-size:20px" color="red" v-else>clear</v-icon>
          {{ props.item.ARAF }}-->
        </td>

        <td class="text-xs-left">{{ props.item.CIORemark }}</td>
        <td class="text-xs-left">{{ props.item.RightsAssignment }}</td>

        <td class="text-xs-left">{{ props.item.Service }}</td>
        <td class="text-xs-left">{{ props.item.AuthorizedId }}</td>
        <td class="text-xs-left">{{ props.item.Total }}</td>
        <td class="text-xs-left">{{ props.item.Computer }}</td>
        <td class="text-xs-left">{{ props.item.ITRemarks }}</td>
        <td class="text-xs-left">{{ props.item.Expiry | momentDateOnly}}</td>
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
import { mixins } from "../../../mixins/CustomMixins";
import Application from "../../../services/application-service";
import SnackBar from "../../../components/control/SnackBar";
import axios from "axios";
import LayoutOne from "../../../components/control/layout/LayoutOne";
export default {
  mixins: [mixins],
  components: {
    SnackBar,
    LayoutOne
  },
  data: () => ({
    selectRequestTypeIdCIORemark: {},
    itemsRequestTypeIdCIORemark: [],

    selectRequestTypeIdRightsAssignment: {},
    itemsRequestTypeIdRightsAssignment: [],

    search: "",
    headers: [
      { text: "Attachment", value: "IsAttachment", width: "1%" },

      { text: "ARAF", value: "ARAF", width: "1%" },
      { text: "IT Comments", value: "T2Comment", width: "1%" },
      { text: "CIO Remarks", value: "CIORemark", width: "1%" },
      { text: "Rights Assignment", value: "RightsAssignment", width: "1%" },

      { text: "Services", value: "Service", width: "10%" },
      { text: "Authorized IDs", value: "AuthorizedId", width: "10%" },
      { text: "Total", value: "Total", width: "1%" },
      { text: "Computer Names", value: "Computer", width: "1%" },
      { text: "IT Remarks ", value: "ITRemarks", width: "40%" },
      { text: "Expiry Date", value: "Expiry", width: "10%",align:"left" },
      { text: "Actions", value: "", sortable: false, align: "center" }
    ],

    isFileUpload: false,
    isFileUploadError: false,
    isFileUploadClient: false,
    tempfiles: [],
    overlay: false,
    files: [],
    rights: {
      View: false,
      Modify: false,
      Delete: false,
      Class: "csmHide"
    },

    // clientfiles: [],
    // serverfiles: [],

    selectAdministrativeRightType: {},
    itemsAdministrativeRightType: [],
    selectAdministrativeRightStatus: {},
    itemsAdministrativeRightStatus: [],
    selectAdministrativeRightOperatingSystem: {},
    itemsAdministrativeRightOperatingSystem: [],
    loading3: false,

    json_fields: { 
      //ID: "AdministrativeRightId",
      ARAF: "ARAF",
      "IT Comments": "T2Comment",
      "CIO Remark": "CIORemark",
      "Rights Assignment": "RightsAssignment",

      Services: "Service",
      "Authorized IDs": "AuthorizedId",
      Total: "Total",
      "Computer Names": "Computer",
      "IT Remarks": "ITRemarks"
    },

    dialog: false,
    dialogAttachment: false,
    pagination: {
      descending: true,
      sortBy: "AdministrativeRightId",
      rowsPerPage: 25
    },

    snackbar: {
      isTrue: true
    },
    modalstartDate: false,
    listOfRecord: [],
    editedIndex: -1,
    editedItem: {
      AdministrativeRightId: 0,
      Ftag: "",
      Computer: "",
      ITRemarks: "",
      AuthorizedId: "",
      Total: "",
      AdministrativeRightTypeId: 1,
      AdministrativeRightStatusId: 1,
      AdministrativeRightOperatingSystemId: 1,
      Service: "",
      FileNameUsers: [],
      FileNamePhysicals: [],
      Extensions: [],

      ARAF: null,
      T2Comment: null,
      Expiry: null, // new Date().toISOString().substr(0, 10),
    },
    defaultItem: {
      AdministrativeRightId: 0,
      Ftag: "",
      Computer: "",
      ITRemarks: "",
      AuthorizedId: "",
      Total: "",
      AdministrativeRightTypeId: 1,
      AdministrativeRightStatusId: 1,
      AdministrativeRightOperatingSystemId: 1,
      Service: "",
      FileNameUsers: [],
      FileNamePhysicals: [],
      Extensions: [],
      ARAF: null,
      T2Comment: null,
      Expiry:null, // new Date().toISOString().substr(0, 10),
    }
  }),
  computed: {
    filtered() {
      var result = null;
      result = this.listOfRecord;
      return result;
    },
    formTitle() {
      return this.editedIndex === -1
        ? "New Administrative Rights Exception"
        : "Edit Administrative Rights Exception";
    },
    IsSnackBar() {
      return this.snackbar.isTrue;
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
    initialize() {
      this.loadTable();

      this.getRequestTypes();
      this.getUserRights([811, 812, 813]).then(result => {
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

    getRequestTypes() {
      axios({
        method: "get",
        url: this.$urlApplication + "/General/GetRequestTypes"
      })
        .then(res => {
          this.itemsRequestType = [];
          var cioRemarks = res.data.filter(w =>
            _.includes([1, 2, 5], w.RequestTypeId)
          );
          var rightsAssignment = res.data.filter(w =>
            _.includes([6, 7], w.RequestTypeId)
          );

          //1
          for (let items of cioRemarks) {
            var result = {
              value: items.RequestTypeId,
              text: items.Name
            };
            this.itemsRequestTypeIdCIORemark.push(result);
            //Dailog-Default Selection Pending
            if (items.RequestTypeId == 5) {
              this.selectRequestTypeIdCIORemark = result;
            }
          }

          //2
          for (let items of rightsAssignment) {
            var result = {
              value: items.RequestTypeId,
              text: items.Name
            };
            this.itemsRequestTypeIdRightsAssignment.push(result);
            //Dailog-Default Selection Assigned
            if (items.RequestTypeId == 6) {
              this.selectRequestTypeIdRightsAssignment = result;
            }
          }
        })
        .catch(error => {});
    },

    excelExport(data, input) {
      var result = [];
      result = data;
      return result;
    },

    async loadTable() {
      axios({
        method: "get",
        url:
          this.$urlApplication + "AdministrativeRight/GetAdministrativeRights"
      })
        .then(res => {
          this.listOfRecord = res.data;
        })
        .catch(error => {});
    },

    deleteAttachment(index) {
      this.tempfiles.splice(index, 1);
    },
    forceFileDownload(fileName, response) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName); //or any other extension
      document.body.appendChild(link);
      link.click();
    },

    getGenerate(obj) {
      if (obj.FileNamePhysical == undefined) {
        alert("File does not exist");
      } else {
        var fileNamePhysical = obj.FileNamePhysical + obj.Extension;
        axios({
          method: "get",
          url:
            this.$urlApplication +
            "AdministrativeRight/Generate?fileName=" +
            fileNamePhysical,
          responseType: "arraybuffer"
        })
          .then(response => {
            this.forceFileDownload(fileNamePhysical, response);
          })
          .catch(ex => {
            alert(ex.response.statusText);
          });
      }
    },

    getDocuments(id) {
      axios({
        method: "get",
        url: this.$urlApplication + "AdministrativeRight/GetDocuments?id=" + id
      })
        .then(res => {
          this.tempfiles = [];
          res.data.forEach(element => {
            this.tempfiles.push({
              FileNameUser: element.FileNameUser,
              FileNamePhysical: element.FileNamePhysical,
              Extension: element.Extension
            });
          });
        })
        .catch(error => {});
    },

    addFiles() {
      this.$refs.files.click();
    },

    handleFilesUpload() {
      this.isFileUpload = true;
      this.isFileUploadError = false;

      let uploadedFiles = this.$refs.files.files;
      for (var i = 0; i < uploadedFiles.length; i++) {
        this.files.push(uploadedFiles[i]);
        //Get User File Name
        this.tempfiles.push({ FileNameUser: uploadedFiles[i].name });
      }
      this.isFileUpload = false;
      this.isFileUploadClient = uploadedFiles.length > 0 ? true : false;
    },

    editItem(obj) {
      //RequestTypeIdRightsAssignment Combobox--Start
      for (var items of this.itemsRequestTypeIdRightsAssignment) {
        if (obj.RequestTypeIdRightsAssignment == items.value) {
          this.selectRequestTypeIdRightsAssignment = {
            value: obj.RequestTypeIdRightsAssignment,
            text: items.text
          };
          break;
        }
      }
      //RequestTypeIdRightsAssignment Combobox--End

      //RequestTypeIdCIORemark Combobox--Start
      for (var items of this.itemsRequestTypeIdCIORemark) {
        if (obj.RequestTypeIdCIORemark == items.value) {
          this.selectRequestTypeIdCIORemark = {
            value: obj.RequestTypeIdCIORemark,
            text: items.text
          };
          break;
        }
      }
      //RequestTypeIdCIORemark Combobox--End

      //AdministrativeRight Type
      for (var items of this.itemsAdministrativeRightType) {
        if (obj.AdministrativeRightTypeId == items.value) {
          this.selectAdministrativeRightType = {
            text: items.text,
            value: items.AdministrativeRightTypeId
          };
          break;
        }
      }
      obj.AdministrativeRightTypeId = this.selectAdministrativeRightType.value;

      //AdministrativeRight Status
      for (var items of this.itemsAdministrativeRightStatus) {
        if (obj.AdministrativeRightStatusId == items.value) {
          this.selectAdministrativeRightStatus = {
            text: items.text,
            value: items.AdministrativeRightStatusId
          };
          break;
        }
      }
      obj.AdministrativeRightStatusId = this.selectAdministrativeRightStatus.value;

      //AdministrativeRight Operating System
      for (var items of this.itemsAdministrativeRightOperatingSystem) {
        if (obj.AdministrativeRightOperatingSystemId == items.value) {
          this.selectAdministrativeRightOperatingSystem = {
            text: items.text,
            value: items.AdministrativeRightOperatingSystemId
          };
          break;
        }
      }
      obj.AdministrativeRightOperatingSystemId = this.selectAdministrativeRightOperatingSystem.value;

      obj.Expiry = obj.Expiry == undefined ? null : obj.Expiry.split("T")[0];

      this.getDocuments(obj.AdministrativeRightId);

      this.editedIndex = this.listOfRecord.indexOf(obj);
      this.editedItem = Object.assign({}, obj);
      this.dialog = true;
    },
    delete(id) {
      var pId = id;
      axios({
        method: "delete",
        url:
          this.$urlApplication +
          "AdministrativeRight/DeleteAdministrativeRight?id=" +
          pId
      })
        .then(res => {
          this.snackbar.isTrue = !this.snackbar.isTrue;
          this.loadTable();
        })
        .catch(error => {});
    },
    clear() {
      this.editedItem.Ftag = "";
      this.editedItem.Computer = "";
      this.editedItem.ITRemarks = "";
      this.editedItem.AuthorizedId = "";
      this.editedItem.Total = "";
      this.editedItem.AdministrativeRightStatusId = "";
      this.editedItem.OperatingSystemModel = "";
      this.editedItem.Service = "";

      this.files = [];
      this.tempfiles = [];
      this.isFileUpload = false;
      this.isFileUploadError = false;
      this.isFileUploadClient = false;
    },
    viewAttachment(obj) {
      this.getDocuments(obj.AdministrativeRightId);
      this.dialogAttachment = true;
    },

    deleteItem(item) {
      const index = this.listOfRecord.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.delete(item.AdministrativeRightId);
      this.loadTable();
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
    closeAttachment() {
      if (!this.dialogAttachment) {
      }
      this.dialogAttachment = false;
    },

    async fileUpload() {
      let formData = new FormData();
      for (var i = 0; i < this.files.length; i++) {
        let file = this.files[i];
        formData.append("files[" + i + "]", file);
      }

      return axios
        .post(this.$urlApplication + "AdministrativeRight/PostFile", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(res => {
          this.isFileUpload = false;
          return res.data;
        })
        .catch(error => {
          this.isFileUpload = true;
          this.isFileUploadError = true;
        });
    },

    async postForm() {
      var obj = this.editedItem;
      if (this.isFileUploadClient) {
        var objFileUpload = await this.fileUpload();
        if (objFileUpload != undefined) {
          obj.FileNameUsers = objFileUpload.FileNameUsers;
          obj.FileNamePhysicals = objFileUpload.FileNamePhysicals;
          obj.Extensions = objFileUpload.Extensions;
        }
      }

      if (obj.Computer == null || obj.Computer.length == 0) {
        alert("Please enter computer");
      } else {
        obj.RequestTypeIdCIORemark = this.selectRequestTypeIdCIORemark.value;
        obj.RequestTypeIdRightsAssignment = this.selectRequestTypeIdRightsAssignment.value;

        axios({
          method: "post",
          url:
            this.$urlApplication +
            "AdministrativeRight/PostAdministrativeRight",
          data: obj
        })
          .then(res => {
            var id = res.data.AdministrativeRightId;
            this.loadTable();
            this.close();
            this.files = [];
            this.tempfiles = [];
            this.snackbar.isTrue = !this.snackbar.isTrue;
          })
          .catch(error => {
            alert(error.response.data);
          });
      }
    },

    async putForm() {
      var obj = this.editedItem;
      var arrayOldFile = this.tempfiles;

      obj.FileNameUsers = [];
      obj.FileNamePhysicals = [];
      obj.Extensions = [];

      var objFileUpload = [];
      if (this.isFileUploadClient) {
        var objFileUpload = await this.fileUpload();
        if (objFileUpload != undefined) {
          obj.FileNameUsers = objFileUpload.FileNameUsers;
          obj.FileNamePhysicals = objFileUpload.FileNamePhysicals;
          obj.Extensions = objFileUpload.Extensions;
        }
      }

      var fileNameUsersTemp = [];
      var fileNamePhysicalsTemp = [];
      var extensionsTemp = [];

      for (var j = 0; j < arrayOldFile.length; j++) {
        //Prevent Dupliation Between Old and New Files
        var isNotExist = true;
        for (var k = 0; k < obj.FileNameUsers; k++) {
          var nameOld = arrayOldFile[i]["FileNameUser"];
          var nameNew = obj.FileNameUsers[k];
          if (nameOld == nameNew) {
            isNotExist = false;
            break;
          }
        }

        if (isNotExist) {
          var FileNameUser =
            arrayOldFile[j].FileNameUser == undefined
              ? null
              : arrayOldFile[j].FileNameUser;
          var FileNamePhysical =
            arrayOldFile[j].FileNamePhysical == undefined
              ? null
              : arrayOldFile[j].FileNamePhysical;
          var Extension =
            arrayOldFile[j].Extension == undefined
              ? null
              : arrayOldFile[j].Extension;

          //Get New UploadFile Physical Name--Start
          var isNewUpload = false;
          if (
            objFileUpload.FileNameUsers != undefined &&
            objFileUpload.FileNameUsers.length > 0
          ) {
            for (var l = 0; l < objFileUpload.FileNameUsers.length; l++) {
              var newFile = objFileUpload.FileNameUsers[l];
              if (FileNameUser == newFile) {
                isNewUpload = true;
                FileNamePhysical = objFileUpload.FileNamePhysicals[l];
                Extension = objFileUpload.Extensions[l];
                break;
              }
            }
          }
          //Get New UploadFile Physical Name--End
          fileNameUsersTemp.push(FileNameUser);
          fileNamePhysicalsTemp.push(FileNamePhysical);
          extensionsTemp.push(Extension);
        }
      }

      obj.FileNameUsers = fileNameUsersTemp;
      obj.FileNamePhysicals = fileNamePhysicalsTemp;
      obj.Extensions = extensionsTemp;

      if (obj.Computer == null || obj.Computer.length == 0) {
        alert("Please enter computer names");
      } else {
        obj.RequestTypeIdCIORemark = this.selectRequestTypeIdCIORemark.value;
        obj.RequestTypeIdRightsAssignment = this.selectRequestTypeIdRightsAssignment.value;

        axios({
          method: "put",
          url:
            this.$urlApplication +
            "AdministrativeRight/PutAdministrativeRight?id=" +
            obj.AdministrativeRightId,
          data: obj
        })
          .then(res => {
            this.loadTable();
            this.close();
            this.snackbar.isTrue = !this.snackbar.isTrue;
          })
          .catch(error => {
            alert(error.response.data);
          });
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
  padding: 0 10px;
}
/* table.v-table tbody td:first-child,
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
  white-space: pre-wrap;
  height: 32px;
} */
/* table.v-table tbody td,
table.v-table tbody th {
  height: 30px;
} */
</style>
