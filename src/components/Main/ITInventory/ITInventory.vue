<template>
  <layout-one :title="'IT Inventory'">
    <v-card-title>
      <v-toolbar-title>Details</v-toolbar-title>
      <v-divider class="mx-2" inset vertical></v-divider>
      <v-flex lg4 class="text-xs-left">
        <download-excel type="xls" :fields="json_fields" :data="filterd">
          <v-btn small color="colorLight" class="colorDark white--text font-weight-light">
            Export Excel
            <v-icon right dark>cloud_download</v-icon>
          </v-btn>
        </download-excel>
      </v-flex>
      <v-spacer></v-spacer>
      <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
      <v-dialog v-model="dialog" max-width="500px" persistent scrollable>
        <v-btn slot="activator" color="primary" dark class="mb-2">Add</v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <form>
                <v-layout>
                  <v-flex lg12>
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
                  <v-flex lg6>
                    <v-combobox
                      v-model="selectInventoryType"
                      :items="itemsInventoryType"
                      label="Select inventory type"
                      item-text="text"
                      item-value="value"
                    ></v-combobox>
                  </v-flex>
                  <v-flex lg6>
                    <v-checkbox color="colorDark" v-model="editedItem.Active" label="Active"></v-checkbox>
                  </v-flex>
                </v-layout>

                <v-layout>
                  <v-flex lg4>
                    <v-text-field v-model="editedItem.Model" label="Model"></v-text-field>
                  </v-flex>
                  <v-flex lg4>
                    <v-text-field v-model="editedItem.Ftag" label="Computer Name"></v-text-field>
                  </v-flex>

                  <v-flex lg4>
                    <v-text-field v-model="editedItem.EmployeeId" label="Owner ID"></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout>
                  <v-flex lg6>
                    <v-combobox
                      v-model="selectLocationCustom"
                      :items="itemsLocationCustom"
                      label="Location"
                      item-text="text"
                      item-value="value"
                    ></v-combobox>
                  </v-flex>
                  <v-flex lg6>
                    <v-text-field v-model="editedItem.Location" label="Description"></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout>
                  <v-flex lg6>
                    <v-combobox
                      v-model="selectInventoryStatus"
                      :items="itemsInventoryStatus"
                      label="Select inventory status"
                      item-text="text"
                      item-value="value"
                    ></v-combobox>
                  </v-flex>
                  <v-flex lg6>
                    <v-combobox
                      v-model="selectInventoryOperatingSystem"
                      :items="itemsInventoryOperatingSystem"
                      label="Select operating system"
                      item-text="text"
                      item-value="value"
                    ></v-combobox>
                  </v-flex>
                </v-layout>

                <v-layout>
                  <v-flex lg12>
                    <v-text-field v-model="editedItem.WindowsVersion" label="OS Build"></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout>
                  <v-flex lg12>
                    <v-text-field v-model="editedItem.BitLocker" label="Bit Locker Key Drive One"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout>
                  <v-flex lg12>
                    <v-text-field
                      v-model="editedItem.BitLockerKeyDriveTwo"
                      label="Bit Locker Key Drive Two"
                    ></v-text-field>
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
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="filterd"
      class="elevation-3 mytable"
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

        <td>{{ props.item.InventoryId }}</td>
        <td>{{ props.item.Ftag }}</td>
        <td class="text-xs-left">{{ props.item.InventoryType }}</td>
        <td>{{ props.item.Model }}</td>
        <td class="text-xs-left">{{ props.item.EmployeeId }}</td>
        <td class="text-xs-left">{{ props.item.Name }}</td>
        <td class="text-xs-left">{{ props.item.Location }}</td>
        <td class="text-xs-left">{{ props.item.InventoryStatu }}</td>
        <td class="text-xs-left">{{ props.item.InventoryOperatingSystem }}</td>
        <td class="text-xs-left">{{ props.item.WindowsVersion }}</td>
        <td class="text-xs-left">{{ props.item.BitLocker }}</td>
        <td class="text-xs-left">{{ props.item.BitLockerKeyDriveTwo }}</td>
        <td class="text-xs-left">{{ (props.item.Active == true ? 'Yes' : 'No') }}</td>
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
                    <a v-on:click.stop="getGenerate(item )" class="blue--text">{{item.FileNameUser}}</a>
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
  </layout-one>
</template>

<script>
import Application from "../../../services/application-service";
import SnackBar from "../../../components/control/SnackBar";
import axios from "axios";
import LayoutOne from "../../../components/control/layout/LayoutOne";
import { mixins } from "../../../mixins/CustomMixins";
export default {
  mixins: [mixins],
  components: {
    SnackBar,
    LayoutOne
  },
  data: () => ({
    rights: {
      View: true,
      Modify: false,
      Delete: false,
      Class: "csmHide"
    },

    selectLocationCustom: [],
    itemsLocationCustom: [],

    selectInventoryType: {},
    itemsInventoryType: [],

    selectInventoryStatus: {},
    itemsInventoryStatus: [],

    selectInventoryOperatingSystem: {},
    itemsInventoryOperatingSystem: [],
    loading3: false,

    json_fields: {
      ID: "InventoryId",
      "Inventory Type": "InventoryType",
      Model: "Model",
      "F-Tag": "Ftag",
      "Owner ID": "EmployeeId",
      Description: "Location",
      Location: "Name",
      "Inventory Status": "InventoryStatu",
      "OS Model": "InventoryOperatingSystem",
      "OS Build": "WindowsVersion",
      "Bit Locker Key Drive One": "BitLocker"
    },

    dialog: false,

    dialogAttachment: false,
    isFileUpload: false,
    isFileUploadError: false,
    isFileUploadClient: false,
    tempfiles: [],
    files: [],

    pagination: {
      descending: true,
      sortBy: "InventoryId",
      rowsPerPage: 5
    },
    search: "",
    headers: [
      { text: "Attachment", value: "IsAttachment" },
      { text: "ID", value: "InventoryId" },
      { text: "Computer Name", value: "Ftag" },
      { text: "Inventory Type", value: "InventoryType" },
      { text: "Model", value: "Model" },
      { text: "Owner ID	", value: "EmployeeId" },
      { text: "Location", value: "Name" },
      { text: "Description", value: "Location" },
      { text: "Inventory Status", value: "InventoryStatu" },
      { text: "OS Model", value: "InventoryOperatingSystem" },
      { text: "OS Build", value: "WindowsVersion" },
      { text: "Bit Locker Key Drive One", value: "BitLocker" },
      { text: "Bit Locker Key Drive Two", value: "BitLockerKeyDriveTwo" },
      { text: "Active", value: "Active" },
      {
        text: "Actions",
        value: "",
        sortable: false,
        align: "center",
        class: ""
      }
    ],
    snackbar: {
      isTrue: true
    },
    modalstartDate: false,
    listOfRecord: [],
    editedIndex: -1,
    editedItem: {
      InventoryId: 0,
      Ftag: "",
      Model: "",
      EmployeeId: "",
      Location: "",
      WindowsVersion: "",
      InventoryTypeId: 1,
      InventoryStatusId: 1,
      InventoryOperatingSystemId: 1,
      Property_Location: null,
      BitLocker: "",
      Active: true,
      FileNameUsers: [],
      FileNamePhysicals: [],
      Extensions: []
    },
    defaultItem: {
      InventoryId: 0,
      Ftag: "",
      Model: "",
      EmployeeId: "",
      Location: "",
      WindowsVersion: "",
      InventoryTypeId: 1,
      InventoryStatusId: 1,
      InventoryOperatingSystemId: 1,
      Property_Location: null,
      BitLocker: "",
      Active: true,
      FileNameUsers: [],
      FileNamePhysicals: [],
      Extensions: []
    },
    Result: "Test"
  }),
  computed: {
    filterd() {
      var result = null;
      result = this.listOfRecord.filter(data =>
        _.includes(
          this.$store.getters.filterLocation,
          data.Property_Location == undefined
            ? ""
            : data.Property_Location.toUpperCase()
        )
      );
      return result;
    },
    formTitle() {
      return this.editedIndex === -1
        ? "New IT Inventory"
        : "Edit IT Inventory - ID : " + this.editedItem.InventoryId;
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
      this.getForm();
      this.getInventoryType();
      this.getInventoryStatus();
      this.getOperatingSystem();
      this.getLocationCustoms();

      this.getUserRights([816, 817, 818]).then(result => {
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

    getLocationCustoms() {
      axios({
        method: "get",
        url: this.$urlApplication + "/Inventory/GetLocationCustoms"
      })
        .then(res => {
          this.itemsLocationCustom = [];
          for (let items of res.data) {
            var result = {
              value: items.Property_Location,
              text: items.Name
            };

            if (items.Property_Location != 100) {
              this.itemsLocationCustom.push({
                value: items.Property_Location,
                text: items.Name
              });
            }
          }
        })
        .catch(error => {});
    },

    excelExport(data, input) {
      var result = [];
      result = data; //this.filterBy(data, input);
      return result;
    },
    filterBy(list, val) {
      if (val) {
        val = val.trim().toLowerCase();
        let searchData = list.filter(obj => {
          var InventoryId = obj.InventoryId == undefined ? "" : obj.InventoryId;
          var Ftag = obj.Ftag == undefined ? "" : obj.Ftag;
          var Model = obj.Model == undefined ? "" : obj.Model;
          var EmployeeId = obj.EmployeeId == undefined ? "" : obj.EmployeeId;
          var Location = obj.Location == undefined ? "" : obj.Location;
          var WindowsVersion =
            obj.WindowsVersion == undefined ? "" : obj.WindowsVersion;

          var InventoryStatu =
            obj.InventoryStatu == undefined ? "" : obj.InventoryStatu;
          var OperatingSystemModel =
            obj.OperatingSystemModel == undefined
              ? ""
              : obj.OperatingSystemModel;
          var BitLocker = obj.BitLocker == undefined ? "" : obj.BitLocker;
          var searchField = this.filterInput;

          if (searchField == "InventoryId") {
            return (
              InventoryId.toString()
                .toLowerCase()
                .indexOf(val) > -1
            );
          } else if (searchField == "Ftag") {
            return Ftag.toLowerCase().indexOf(val) > -1;
          } else if (searchField == "Model") {
            return Model.toLowerCase().indexOf(val) > -1;
          } else if (searchField == "EmployeeId") {
            return (
              EmployeeId.toString()
                .toLowerCase()
                .indexOf(val) > -1
            );
          } else if (searchField == "Location") {
            return Location.toLowerCase().indexOf(val) > -1;
          } else if (searchField == "WindowsVersion") {
            return WindowsVersion.toLowerCase().indexOf(val) > -1;
          } else if (searchField == "InventoryStatu") {
            return InventoryStatu.toLowerCase().indexOf(val) > -1;
          } else if (searchField == "OperatingSystemModel") {
            return (
              OperatingSystemModel.toString()
                .toLowerCase()
                .indexOf(val) > -1
            );
          } else if (searchField == "BitLocker") {
            return (
              BitLocker.toString()
                .toLowerCase()
                .indexOf(val) > -1
            );
          }
          // else if (searchField == "Active") {
          //   return Active.toLowerCase().indexOf(val) > -1;
          // }
          else {
            return (
              InventoryId.toString()
                .toLowerCase()
                .indexOf(val) > -1 ||
              Ftag.toLowerCase().indexOf(val) > -1 ||
              Model.toLowerCase().indexOf(val) > -1 ||
              EmployeeId.toLowerCase().indexOf(val) > -1 ||
              Location.toLowerCase().indexOf(val) > -1 ||
              WindowsVersion.toLowerCase().indexOf(val) > -1 ||
              InventoryStatu.toLowerCase().indexOf(val) > -1 ||
              OperatingSystemModel.toString()
                .toLowerCase()
                .indexOf(val) > -1 ||
              BitLocker.toString()
                .toLowerCase()
                .indexOf(val) > -1
              //   ||
              // Active.toLowerCase().indexOf(val) > -1
            );
          }
        });

        return searchData;
      }
      return list;
    },

    getInventoryType() {
      axios({
        method: "get",
        url: this.$urlApplication + "Inventory/GetInventoryTypes"
      })
        .then(res => {
          this.itemsInventoryType = [];
          for (let items of res.data) {
            var result = {
              value: items.InventoryTypeId,
              text: items.Name
            };

            //Default Selection
            if (items.InventoryTypeId == 1) {
              this.selectInventoryType = result;
            }

            this.itemsInventoryType.push(result);
          }
        })
        .catch(error => {});
    },

    getInventoryStatus() {
      axios({
        method: "get",
        url: this.$urlApplication + "Inventory/GetInventoryStatus"
      })
        .then(res => {
          this.itemsInventoryStatus = [];
          for (let items of res.data) {
            var result = {
              value: items.InventoryStatusId,
              text: items.Name
            };

            //Default Selection
            if (items.InventoryStatusId == 1) {
              this.selectInventoryStatus = result;
            }

            this.itemsInventoryStatus.push(result);
          }
        })
        .catch(error => {});
    },

    getOperatingSystem() {
      axios({
        method: "get",
        url: this.$urlApplication + "Inventory/GetInventoryOperatingSystems"
      })
        .then(res => {
          this.itemsInventoryOperatingSystem = [];
          for (let items of res.data) {
            var result = {
              value: items.InventoryOperatingSystemId,
              text: items.Name
            };

            //Default Selection
            if (items.InventoryOperatingSystemId == 1) {
              this.selectInventoryOperatingSystem = result;
            }

            this.itemsInventoryOperatingSystem.push(result);
          }
        })
        .catch(error => {});
    },

    async getForm() {
      axios({
        method: "get",
        url: this.$urlApplication + "inventory/GetInventories"
      })
        .then(res => {
          this.listOfRecord = res.data;
        })
        .catch(error => {});
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

      if (obj.Ftag == null || obj.Ftag.length == 0) {
        alert("Please enter computer name");
      } else {
        obj.InventoryTypeId = this.selectInventoryType.value;
        obj.InventoryStatusId = this.selectInventoryStatus.value;
        obj.InventoryOperatingSystemId = this.selectInventoryOperatingSystem.value;
        obj.Property_Location = this.selectLocationCustom.value;

        axios({
          method: "post",
          url: this.$urlApplication + "inventory/PostInventory",
          data: obj
        })
          .then(res => {
            this.getForm();
            this.close();
            this.snackbar.isTrue = !this.snackbar.isTrue;
          })
          .catch(error => {
            alert(error.response.data);
          });
      }
    },

    async putForm() {
      var obj = this.editedItem;

      //Attachment....................................................Start

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
      //Attachment....................................................End

      if (obj.Ftag == null || obj.Ftag.length == 0) {
        alert("Please enter Ftag");
      } else {
        obj.InventoryTypeId = this.selectInventoryType.value;
        obj.InventoryStatusId = this.selectInventoryStatus.value;
        obj.InventoryOperatingSystemId = this.selectInventoryOperatingSystem.value;
        obj.Property_Location = this.selectLocationCustom.value;

        axios({
          method: "put",
          url:
            this.$urlApplication +
            "inventory/PutInventory?id=" +
            obj.InventoryId,
          data: obj
        })
          .then(res => {
            this.getForm();
            this.close();
            this.snackbar.isTrue = !this.snackbar.isTrue;
          })
          .catch(error => {
            alert(error.response.data);
          });
      }
    },

    deleteUnRecordedIR(id) {
      var pId = id;
      axios({
        method: "delete",
        url: this.$urlApplication + "inventory/DeleteInventory?id=" + pId
      })
        .then(res => {
          this.snackbar.isTrue = !this.snackbar.isTrue;
          this.getForm();
        })
        .catch(error => {});
    },
    clear() {
      //this.editedItem.InventoryId = "";
      this.editedItem.Ftag = "";
      this.editedItem.Model = "";
      this.editedItem.EmployeeId = "";
      this.editedItem.Location = "";
      this.editedItem.WindowsVersion = "";
      this.editedItem.InventoryStatusId = "";
      this.editedItem.OperatingSystemModel = "";
      this.editedItem.BitLocker = "";
      this.editedItem.Active = true;

      this.files = [];
      this.tempfiles = [];
      this.isFileUpload = false;
      this.isFileUploadError = false;
      this.isFileUploadClient = false;
    },
    editItem(obj) {
      //Inventory Type
      for (var items of this.itemsInventoryType) {
        if (obj.InventoryTypeId == items.value) {
          this.selectInventoryType = {
            text: items.text,
            value: items.value
          };
          break;
        }
      }
      obj.InventoryTypeId = this.selectInventoryType.value;

      //Inventory Status
      for (var items of this.itemsInventoryStatus) {
        if (obj.InventoryStatusId == items.value) {
          this.selectInventoryStatus = {
            text: items.text,
            value: items.value
          };
          break;
        }
      }
      obj.InventoryStatusId = this.selectInventoryStatus.value;

      //Inventory Operating System
      for (var items of this.itemsInventoryOperatingSystem) {
        if (obj.InventoryOperatingSystemId == items.value) {
          this.selectInventoryOperatingSystem = {
            text: items.text,
            value: items.value
          };
          break;
        }
      }

      //Property_Location Combobox--Start
      for (var items of this.itemsLocationCustom) {
        if (obj.Property_Location == items.value) {
          this.selectLocationCustom = {
            text: items.text,
            value: items.value
          };
          break;
        }
      }
      //Property_Location Combobox--End

      obj.InventoryOperatingSystemId = this.selectInventoryOperatingSystem.value;
      this.getDocuments(obj.InventoryId);
      this.editedIndex = this.listOfRecord.indexOf(obj);
      this.editedItem = Object.assign({}, obj);
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.listOfRecord.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.deleteUnRecordedIR(item.InventoryId);
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
    //.........................................File Attachment Methods .............................................

    async fileUpload() {
      let formData = new FormData();
      for (var i = 0; i < this.files.length; i++) {
        let file = this.files[i];
        formData.append("files[" + i + "]", file);
      }

      return axios
        .post(this.$urlApplication + "Inventory/PostFile", formData, {
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
    deleteAttachment(index) {
      this.tempfiles.splice(index, 1);
    },
    viewAttachment(obj) {
      this.getDocuments(obj.InventoryId);
      this.dialogAttachment = true;
    },
    getDocuments(id) {
      axios({
        method: "get",
        url: this.$urlApplication + "Inventory/GetDocuments?id=" + id
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
            "Inventory/Generate?fileName=" +
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
    closeAttachment() {
      if (!this.dialogAttachment) {
      }
      this.dialogAttachment = false;
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