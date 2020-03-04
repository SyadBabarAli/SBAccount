<template>
  <layout-one :title="'Unrecorded Call'">
    <v-card-title>
      <v-toolbar-title>Details</v-toolbar-title>
      <v-divider class="mx-2" inset vertical></v-divider>
      <v-spacer></v-spacer>
      <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
      <v-dialog v-model="dialog" max-width="500px" persistent>
        <v-btn v-show="rights.Modify" slot="activator" color="primary" dark class="mb-2">Add</v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <form>
                <v-layout v-show="false">
                  <v-flex lg12>
                    <v-text-field v-model="editedItem.GhostIRId" label="Unrecorded IR ID" disabled></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout>
                  <v-flex lg12>
                    <v-dialog
                      ref="dialogstartDate"
                      v-model="modalstartDate"
                      :return-value.sync="editedItem.GhostIRDate"
                      lazy
                      full-width
                      width="290px"
                    >
                      <v-text-field
                        slot="activator"
                        v-model="editedItem.GhostIRDate"
                        label="Unrecorded IR Date"
                        prepend-icon="event"
                        readonly
                      ></v-text-field>
                      <v-date-picker v-model="editedItem.GhostIRDate" scrollable color="colorDark">
                        <v-spacer></v-spacer>
                        <v-btn flat color="colorDark" @click="modalstartDate = false">Cancel</v-btn>
                        <v-btn
                          flat
                          color="colorDark"
                          @click="$refs.dialogstartDate.save(editedItem.GhostIRDate)"
                        >OK</v-btn>
                      </v-date-picker>
                    </v-dialog>
                  </v-flex>
                </v-layout>

                <v-layout>
                  <v-flex>
                    <v-combobox
                      v-model="selectUnRecordedIR"
                      :items="itemsUnRecordedIR"
                      label="Select unrecorded IR type"
                      item-text="text"
                      item-value="value"
                      v-on:change="slcUnrecordedType"
                    ></v-combobox>
                  </v-flex>
                </v-layout>

                <v-layout
                  v-if="selectUnRecordedIR.value==1 || selectUnRecordedIR.value==3
                || selectUnRecordedIR.value== 4
                || selectUnRecordedIR.value== 5
                || selectUnRecordedIR.value== 6"
                >
                  <v-flex lg12>
                    <v-text-field v-model="editedItem.IR" label="IR"></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout
                  v-if="selectUnRecordedIR.value==2 || selectUnRecordedIR.value==3 || selectUnRecordedIR.value== 7"
                >
                  <v-flex lg12>
                    <v-text-field v-model="editedItem.ContactNo" label="Contact No"></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout v-if="selectUnRecordedIR.value==3 || selectUnRecordedIR.value== 7">
                  <v-flex lg12>
                    <v-text-field v-model="editedItem.EmailIdName" label="Email ID Name"></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout v-if="selectUnRecordedIR.value==3">
                  <v-flex lg12>
                    <v-combobox
                      v-model="selectLocationCustom"
                      :items="itemsLocationCustom"
                      label="Location"
                      item-text="text"
                      item-value="value"
                    ></v-combobox>
                  </v-flex>
                </v-layout>

                <v-layout>
                  <v-flex lg12>
                    <!-- <v-textarea v-model="editedItem.Comment" label="Comments"></v-textarea> -->

                    <v-textarea
                      v-model="editedItem.Comment"
                      solo
                      rows="3"
                      label="Comments"
                      hint="Comments"
                    ></v-textarea>
                  </v-flex>
                </v-layout>
              </form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click="postUnRecordedIR" v-if="this.editedIndex === -1">save</v-btn>
            <v-btn flat @click="putUnRecordedIR" v-if="this.editedIndex != -1">update</v-btn>
            <v-btn flat @click="clear">clear</v-btn>
            <v-btn flat @click="close">cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="listOfRecords"
      class="elevation-3"
      :search="search"
      :pagination.sync="pagination"
    >
      <template slot="items" slot-scope="props">
        <td class="csmHide1">{{ props.item.GhostIRId }}</td>
        <td class="csmHide">{{ props.item.GhostIRTypeId }}</td>
        <td class="csmHide">{{ props.item.CreatedDate }}</td>
        <td class="text-xs-left">{{ props.item.UnRecordedIRType }}</td>
        <td class="text-xs-left">{{ props.item.IR }}</td>
        <td class="text-xs-left">{{ props.item.ContactNo }}</td>
        <td class="text-xs-left">{{ props.item.EmailIdName }}</td>
        <td class="text-xs-left">{{ props.item.Name }}</td>
        <td class="text-xs-left">{{ props.item.User }}</td>
        <td class="text-xs-left">{{ props.item.GhostIRDate | momentConvertDate }}</td>

        <td class="justify-center layout px-0">
          <v-btn
            color="primary"
            fab
            small
            dark
            style="height:22px;width:22px;font-size:13px;"
            v-if="rights.Modify"
            @click="editItem(props.item)"
          >
            <v-icon style="font-size:13px">edit</v-icon>
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
import MonthPicker from "../../../components/control/MonthPicker";
import SnackBar from "../../../components/control/SnackBar";
import axios from "axios";
import LayoutOne from "../../../components/control/layout/LayoutOne";

export default {
  mixins: [mixins],
  components: {
    MonthPicker,
    SnackBar,
    LayoutOne
  },
  data: () => ({
    selectLocationCustom: [],
    itemsLocationCustom: [],

    rights: {
      View: false,
      Modify: false,
      Delete: false
    },
    selectUnRecordedIR: { text: "Re Open", value: "1" },
    itemsUnRecordedIR: [],
    dialog: false,
    pagination: {
      descending: true,
      sortBy: "CreatedDate",
      rowsPerPage: 10
    },
    search: "",
    headers: [
      { text: "GhostIRId", value: "GhostIRId" },
      { text: "GhostIRTypeId", value: "GhostIRTypeId", class: "csmHide" },
      { text: "CreatedDate", value: "CreatedDate", class: "csmHide" },
      { text: "Unrecorded IR Type	", value: "UnRecordedIRType" },
      { text: "IR", value: "IR" },
      { text: "Contact No", value: "ContactNo" },
      { text: "Email ID Name", value: "EmailIdName" },
      { text: "Location", value: "Name" },
      { text: "User", value: "User" },
      { text: "IR Date", value: "GhostIRDate" },
      { text: "Actions", value: "", sortable: false, align: "center" }
    ],
    snackbar: {
      isTrue: true
    },
    modalstartDate: false,
    listOfRecords: [],
    editedIndex: -1,
    editedItem: {
      GhostIRId: "1",
      GhostIRTypeId: "",
      GhostIRDate: new Date().toISOString().substr(0, 10),
      ContactNo: "",
      IR: "",
      EmailIdName: "",
      Property_Location: null,
      Comment: ""
    },
    defaultItem: {
      GhostIRId: "",
      GhostIRTypeId: "1",
      GhostIRDate: new Date().toISOString().substr(0, 10),
      ContactNo: "",
      IR: "",
      EmailIdName: "",
      Property_Location: null,
      Comment: ""
    }
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "New Unrecorded IR"
        : "Edit Unrecorded IR";
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
    slcUnrecordedType(obj) {
      var ghostIRType = obj.value;
      if (ghostIRType == 1) {
        this.editedItem.ContactNo = "";
        this.editedItem.Property_Location = null;
        this.editedItem.EmailIdName = null;
        this.selectLocationCustom.value = null;
      } else if (ghostIRType == 2) {
        this.editedItem.IR = "";
        this.editedItem.Property_Location = null;
        this.editedItem.EmailIdName = null;
        this.selectLocationCustom.value = null;
      }
    },
    initialize() {
      this.getLocationCustoms();
      this.getUnRecordedIR();
      this.getGhostIRType();

      this.getUserRights([631, 632, 633]).then(result => {
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
    getLocationCustoms: function() {
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
    getGhostIRType() {
      axios({
        method: "get",
        url: this.$urlApplication + "GetGhostIRType"
      })
        .then(res => {
          this.itemsUnRecordedIR = [];
          for (let items of res.data) {
            var result = {
              value: items.GhostIRTypeId,
              text: items.Name
            };

            this.itemsUnRecordedIR.push(result);
          }
        })
        .catch(error => {});
    },
    async getUnRecordedIR() {
      axios({
        method: "get",
        url: this.$urlApplication + "GetGhostIRs"
      })
        .then(res => {
          this.listOfRecords = res.data;
        })
        .catch(error => {});
    },
    postUnRecordedIR() {
      var obj = this.editedItem;
      var isTrue = true;

      if (this.selectUnRecordedIR.value == 7) {
        if (
          this.editedItem.ContactNo == null ||
          this.editedItem.ContactNo.length == 0
        ) {
          alert("please enter contact no");
          isTrue = false;
          return;
        } else if (
          this.editedItem.EmailIdName == null ||
          this.editedItem.EmailIdName.length == 0
        ) {
          alert("please enter email id or name");
          isTrue = false;
          return;
        }
      }

      if (obj.Comment.length == 0) {
        alert("please enter comments");
      } else {
        if (isTrue) {
          obj.GhostIRTypeId = this.selectUnRecordedIR.value;
          obj.Property_Location = this.selectLocationCustom.value;

          axios({
            method: "post",
            url: this.$urlApplication + "PostGhostIR",
            data: obj
          })
            .then(res => {
              this.getUnRecordedIR();
              this.close();
              this.snackbar.isTrue = !this.snackbar.isTrue;
            })
            .catch(error => {});
        }
      }
    },

    putUnRecordedIR() {
      var isTrue = true;

      if (this.selectUnRecordedIR.value == 7) {
        if (
          this.editedItem.ContactNo == null ||
          this.editedItem.ContactNo.length == 0
        ) {
          alert("please enter contact no");
          isTrue = false;
          return;
        } else if (
          this.editedItem.EmailIdName == null ||
          this.editedItem.EmailIdName.length == 0
        ) {
          alert("please enter email id or name");
          isTrue = false;
          return;
        }
      }

      var obj = this.editedItem;
      if (obj.Comment.length == 0) {
        alert("please enter comments");
      } else {
        if (isTrue) {
          obj.GhostIRTypeId = this.selectUnRecordedIR.value;
          obj.Property_Location = this.selectLocationCustom.value;

          axios({
            method: "put",
            url: this.$urlApplication + "PutGhostIR?id=" + obj.GhostIRId,
            data: obj
          })
            .then(res => {
              this.getUnRecordedIR();
              this.close();
              this.snackbar.isTrue = !this.snackbar.isTrue;
            })
            .catch(error => {});
        }
      }
    },

    deleteUnRecordedIR(id) {
      var pId = id;
      axios({
        method: "delete",
        url: this.$urlApplication + "DeleteGhostIR?id=" + pId
      })
        .then(res => {
          this.snackbar.isTrue = !this.snackbar.isTrue;
          this.getUnRecordedIR();
        })
        .catch(error => {});
    },
    clear() {
      this.editedItem.ContactNo = "";
      this.editedItem.IR = "";
      this.editedItem.EmailIdName = "";
      this.editedItem.Location = "";
      this.editedItem.Comment = "";
    },
    editItem(item) {
      var obj = item;

      for (var items of this.itemsUnRecordedIR) {
        if (obj.GhostIRTypeId == items.value) {
          this.selectUnRecordedIR = {
            text: items.text,
            value: obj.GhostIRTypeId
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

      obj.GhostIRTypeId = this.selectUnRecordedIR;
      obj.GhostIRDate = obj.GhostIRDate.split("T")[0];
      this.editedIndex = this.listOfRecords.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.listOfRecords.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.deleteUnRecordedIR(item.GhostIRId);
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