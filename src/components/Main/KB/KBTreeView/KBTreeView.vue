<template>
  <layout-one :title="'Define Categories'">
    <v-card-title>
      <v-toolbar-title>Details</v-toolbar-title>
      <v-divider class="mx-2" inset vertical></v-divider>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="search"
        color="colorLight"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
      <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        scrollable
      >
        <v-btn v-show="rights.Modify" slot="activator" color="colorLight" dark class="mb-2">Add</v-btn>
        <v-card>
          <v-toolbar card dark color="colorLight">
            <v-btn icon dark @click="dialog = false">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn flat @click="postForm" v-show="this.editedIndex === -1 ? true : false">save</v-btn>
              <v-btn flat @click="putForm" v-show="this.editedIndex === -1 ? false : true">update</v-btn>
              <v-btn flat @click="clear">clear</v-btn>
              <v-btn flat @click="close">cancel</v-btn>
            </v-toolbar-items>
          </v-toolbar>

          <v-card-text>
            <v-container grid-list-md>
              <form>
                <v-layout wrap>
                  <v-flex lg6>
                    <v-text-field
                      v-show="false"
                      v-model="editedItem.KBTreeViewId"
                      label="Categories Id"
                      disabled
                      color="colorLight"
                    ></v-text-field>
                  </v-flex>
                  <v-flex lg6 v-show="false">
                    <v-checkbox color="colorLight" v-model="editedItem.IsActive" label="Active"></v-checkbox>
                  </v-flex>
                </v-layout>

                <v-layout wrap>
                  <v-flex lg6>
                    <v-combobox
                      v-model="selectKBTreeOption"
                      :items="itemsKBTreeOption"
                      label="Select an option"
                      item-text="text"
                      item-value="value"
                      color="colorLight"
                    ></v-combobox>
                  </v-flex>
                </v-layout>

                <v-layout>
                  <v-flex lg6>
                    <v-text-field v-model="editedItem.Name" label="Name" color="colorLight"></v-text-field>
                  </v-flex>
                  <v-flex lg6 v-show="false">
                    <v-text-field
                      v-model="editedItem.Description"
                      label="Description"
                      color="colorLight"
                    ></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout>
                  <v-flex lg6 v-show="false">
                    <v-text-field v-model="editedItem.Id" label="Id" disabled color="colorLight"></v-text-field>
                  </v-flex>
                  <v-flex lg6 v-show="false">
                    <v-text-field
                      v-model="editedItem.ParentId"
                      label="Parent Id"
                      color="colorLight"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </form>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-card-title>
    <v-data-table
      must-sort
      :headers="headers"
      :items="listOfRecords"
      class="elevation-3"
      :search="search"
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.KBTreeViewId }}</td>
        <td class="text-xs-left">{{ props.item.Name }}</td>
        <td class="text-xs-left">{{ (props.item.IsActive == 1 ? 'Yes' : 'No') }}</td>
        <td class="justify-center layout px-0">
          <v-btn
            color="colorLight"
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
    <snack-bar :isSnackbar="isSnackBar" />
  </layout-one>
</template>

<script>
import { mixins } from "../../../../mixins/CustomMixins";
import Application from "../../../../services/application-service";
import MonthPicker from "../../../../components/control/MonthPicker";
import SnackBar from "../../../../components/control/SnackBar";
import axios from "axios";
import LayoutOne from "../../../../components/control/layout/LayoutOne";

export default {
  mixins: [mixins],
  components: {
    MonthPicker,
    SnackBar,
    LayoutOne
  },
  data: () => ({
    rating: 3,
    rights: {
      View: false,
      Modify: false,
      Delete: false
    },
    snackbar: {
      isTrue: true
    },
    selectKBTreeOption: null,
    itemsKBTreeOption: [],

    selectKBTreeOption2: null,
    itemsKBTreeOption2: [],

    dialog: false,
    search: "",
    headers: [
      {
        text: "Category Id",
        value: "KBTreeViewId",
        align: "left"
      },
      { text: "Tree", value: "Name" },
      { text: "Active", value: "IsActive" },
      { text: "Actions", value: "", sortable: false, align: "Center" }
    ],
    listOfRecords: [],
    editedIndex: -1,

    editedItem: {
      Active: true,
      Id: "",
      Ids: []
    },
    defaultItem: {
      Active: true,
      Id: "0",
      Ids: []
    }
  }),
  computed: {
    isSnackBar() {
      return this.snackbar.isTrue;
    },
    formTitle() {
      return this.editedIndex === -1 ? "New Categories" : "Edit Categories";
    }
  },
  watch: {
    dialog(val) {
      var isTrue = val;

      if (isTrue) {
        this.dialogOpen();
      } else {
        this.close();
      }
    }
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.tableLoad();
      this.getKBTreeViewOption2();

      this.getUserRights([2022, 2023, 2024, 2025, 2026]).then(result => {
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

    getKBTreeViewOption() {
      axios({
        method: "get",
        url: this.$urlApplication + "GetKBTreeViewOption"
      })
        .then(res => {
          this.itemsKBTreeOption = [];
          var result2 = {
            text: "Top-Level",
            value: "0"
          };
          this.itemsKBTreeOption.push(result2);
          for (let value of res.data) {
            var result = {
              text: value.Name,
              value: value.Id
            };
            this.itemsKBTreeOption.push(result);
          }
        })
        .catch(error => {});
    },

    getKBTreeViewOption2() {
      axios({
        method: "get",
        url: this.$urlApplication + "KBTree/GetKBTree"
      })
        .then(res => {
          this.itemsKBTreeOption = [];

          var result2 = {
            text: "Top-Level",
            value: "0"
          };

          this.itemsKBTreeOption.push(result2);

          for (let value of res.data) {
            var result = {
              text: value.TREE,
              value: value.ID
            };
            this.itemsKBTreeOption.push(result);
          }
        })
        .catch(error => {});
    },

    tableLoad() {
      axios({
        method: "get",
        url: this.$urlApplication + "KBTree/GetKBTreeViews"
      })
        .then(res => {
          this.listOfRecords = res.data;
        })
        .catch(error => {});
    },
    postForm() {
      var obj = this.editedItem;
      var selectKBTreeOption = this.selectKBTreeOption;
      var name = obj.Name;

      if (selectKBTreeOption == null || selectKBTreeOption < 0) {
        alert("Please select main group");
      } else if (name == undefined) {
        alert("Please insert name");
      } else {
        obj.OrderBy = 1;
        obj.ParentId = selectKBTreeOption.value;
        //Save
        axios({
          method: "post",
          url: this.$urlApplication + "KBTree/PostKBTreeView",
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
    putForm() {
      var obj = this.editedItem;
      var selectKBTreeOption = this.selectKBTreeOption;
      var name = obj.Name;

      if (selectKBTreeOption == null || selectKBTreeOption < 0) {
        alert("Please select main group");
      } else if (name == undefined) {
        alert("Please insert name");
      } else {
        obj.OrderBy = 1;
        obj.ParentId = this.selectKBTreeOption.value;

        //Update
        axios({
          method: "put",
          url: this.$urlApplication + "KBTree/PutKBTreeView?id=" + obj.KBTreeViewId,
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

    deleteKBTreeView(id) {
      var pId = id;
      axios({
        method: "delete",
        url: this.$urlApplication + "KBTree/DeleteKBTreeView?id=" + pId
      })
        .then(res => {
          this.tableLoad();
        })
        .catch(error => {});
    },
    clear() {
      this.editedItem.KBTreeViewId = "";
      this.editedItem.Name = "";
    },
    editItem(item) {
      var obj = item;

      //debugger
      //Combobox--Start-1
      for (var items of this.itemsKBTreeOption) {
        if (obj.ParentId == items.value) {
          this.selectKBTreeOption = {
            value: items.value,
            text: items.text
          };
          break;
        }
      }
      //Combobox-End-1

      this.editedIndex = this.listOfRecords.indexOf(obj);
      this.editedItem = Object.assign({}, obj);
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.listOfRecords.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.deleteKBTreeView(item.KBTreeViewId);
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
    dialogOpen() {
      //Add New Entry
      if (this.editedIndex === -1) {
        this.editedItem.IsActive = true;
        this.editedItem.ParentId = 0;
        //var id = 0;
        axios({
          method: "get",
          url: this.$urlApplication + "KBTree/GetKBTreeViewMaxId"
        })
          .then(res => {
            var id = res.data != null ? res.data : 0;
            this.editedItem.Id = id + 1;
          })
          .catch(error => {});
      }
      //Edit
      else {
      }
    }
  }
};
</script>