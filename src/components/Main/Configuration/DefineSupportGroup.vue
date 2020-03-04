<template>
  <layout-one :title="'Define Support Group'" :breadcrumbsItems="breadcrumbsItems">
    <v-layout>
      <v-flex lg12>
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
          <v-dialog v-model="dialog" max-width="500px">
            <v-btn slot="activator" color="primary" dark class="mb-2">Add</v-btn>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container grid-list-md>
                  <form>
                    <v-layout wrap class="csmHide">
                      <v-flex lg12>
                        <v-text-field
                          v-model="editedItem.ReportSupportGroupId"
                          label="User Id"
                          disabled
                        ></v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout wrap>
                      <v-flex lg12>
                        <v-text-field v-model="editedItem.Name" label="Name"></v-text-field>
                      </v-flex>
                    </v-layout>

                    <v-layout wrap>
                      <v-flex lg12>
                        <v-combobox
                          v-model="selectSupportGroupCustom"
                          :items="itemsSupportGroupCustom"
                          label="Select support group"
                          item-text="text"
                          item-value="value"
                        ></v-combobox>
                      </v-flex>
                    </v-layout>

                    <v-layout wrap>
                      <v-flex lg12>
                        <v-text-field v-model="editedItem.RequirmentBy" label="Requested By"></v-text-field>
                      </v-flex>
                    </v-layout>

                    <v-layout wrap>
                      <v-flex lg12>
                        <v-checkbox color="colorDark" v-model="editedItem.Active" label="Active"></v-checkbox>
                      </v-flex>
                    </v-layout>
                  </form>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn flat @click="postForm" v-show="this.editedIndex === -1 ? true : false">save</v-btn>
                <v-btn flat @click="putForm" v-show="this.editedIndex === -1 ? false : true">update</v-btn>
                <v-btn flat @click="clear">clear</v-btn>
                <v-btn flat @click="close">cancel</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card-title>
        <v-data-table
          must-sort
          :headers="headers"
          :items="ListOfRecords"
          class="elevation-3"
          :search="search"
        >
          <template slot="items" slot-scope="props">
            <td>{{ props.item.ReportSupportGroupId }}</td>
            <td class="text-xs-left">{{ props.item.Name }}</td>
            <td class="text-xs-left">{{ props.item.RequirmentBy }}</td>
            <td class="text-xs-left">{{ props.item.SupportGroupName }}</td>

            <td class="justify-center layout px-0">
              <v-btn color="primary" fab small dark style="height:22px;width:22px;font-size:13px;">
                <v-icon style="font-size:13px" @click="editItem(props.item)">edit</v-icon>
              </v-btn>
              <v-btn color="red" fab small dark style="height:22px;width:22px;font-size:13px;">
                <v-icon style="font-size:13px" @click="deleteItem(props.item)">delete</v-icon>
              </v-btn>
            </td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
    <snack-bar :isSnackbar="IsSnackBar" />
  </layout-one>
</template>

<script>
import { mixins } from "../../../mixins/CustomMixins";
import Application from "../../../services/application-service";
import MonthPicker from "../../../components/control/MonthPicker";
import SnackBar from "../../../components/control/SnackBar";
import LayoutOne from "../../../components/control/layout/LayoutOne";

import axios from "axios";
import { defer } from "q";
export default {
  mixins: [mixins],
  components: {
    LayoutOne,
    MonthPicker,
    SnackBar
  },
  data: () => ({
    snackbar: {
      isTrue: true
    },

    breadcrumbsItems: [
      {
        text: "Tier-2",
        disabled: false,
        href: "#/Tier-2"
      }
    ],

    selectSupportGroupCustom: null,
    itemsSupportGroupCustom: [],

    dialog: false,
    search: "",
    headers: [
      { text: "ID", value: "ReportSupportGroupId" },
      { text: "Name", value: "Name" },
      { text: "Requested By", value: "RequirmentBy" },
      { text: "Support Group", value: "SupportGroupName" },
      { text: "Actions", value: "", sortable: false, align: "Center" }
    ],
    ListOfRecords: [],
    editedIndex: -1,

    editedItem: {
      ReportSupportGroupId: "",
      Name: "",
      RequirmentBy: "",
      SupportGroupName: "",
      Active: true
    },
    defaultItem: {
      ReportSupportGroupId: "0",
      Name: "",
      RequirmentBy: "",
      Password: "",
      SupportGroupName: "",
      Active: true
    }
  }),
  computed: {
    IsSnackBar() {
      return this.snackbar.isTrue;
    },
    formTitle() {
      return this.editedIndex === -1 ? "New Support Group" : "Edit Support Group";
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
      this.getData();
      this.getSupportGroupCustom();
    },

    getSupportGroupCustom() {
      axios({
        method: "get",
        url: this.$urlApplication + "ReportSupportGroup/GetSupportGroupCustom"
      })
        .then(res => {
          this.itemsSupportGroupCustom = [];

          for (let items of res.data) {
            var id = items.IncidentTierQueuesId;
            if (id != null && id != undefined) {
              var result = {
                value: items.IncidentTierQueuesId,
                text: items.Name
              };
              this.itemsSupportGroupCustom.push(result);
            }
          }
        })
        .catch(error => {});
    },

    getData() {
      axios({
        method: "get",
        url: this.$urlApplication + "ReportSupportGroup/Get"
      })
        .then(res => {
          this.ListOfRecords = res.data;
        })
        .catch(error => {});
    },
    postForm() {
      var obj = this.editedItem;
      this.editedItem.IncidentTierQueuesId = this.selectSupportGroupCustom.value;

      //Save
      axios({
        method: "post",
        url: this.$urlApplication + "ReportSupportGroup/Post",
        data: obj
      })
        .then(res => {
          this.getData();
          this.close();
          this.snackbar.isTrue = !this.snackbar.isTrue;
        })
        .catch(error => {});
    },
    putForm() {
      var obj = this.editedItem;

      //Update
      axios({
        method: "put",
        url:
          this.$urlApplication +
          "ReportSupportGroup/Put?id=" +
          obj.ReportSupportGroupId,
        data: obj
      })
        .then(res => {
          this.getData();
          this.close();
          this.snackbar.isTrue = !this.snackbar.isTrue;
        })
        .catch(error => {});
    },

    delete(id) {
      var pId = id;
      axios({
        method: "delete",
        url: this.$urlApplication + "ReportSupportGroup/Delete?id=" + pId
      })
        .then(res => {
          this.getData();
        })
        .catch(error => {});
    },
    clear() {
      this.editedItem.ReportSupportGroupId = "";
      this.editedItem.Name = "";
      this.editedItem.RequirmentBy = "";
      this.editedItem.SupportGroupName = "";
      this.selectSupportGroupCustom = [];
      this.editedItem.Active = true;
    },

    editItem(item) {
      var obj = item;

      //Support Group Combobox--Start
      for (var items of this.itemsSupportGroupCustom) {
        if (obj.IncidentTierQueuesId == items.value) {
          this.selectSupportGroupCustom = {
            value: items.value,
            text: items.text
          };
          break;
        }
      }
      //Support Group Combobox--End

      this.editedIndex = this.ListOfRecords.indexOf(obj);
      this.editedItem = Object.assign({}, obj);
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.ListOfRecords.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.delete(item.ReportSupportGroupId);
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