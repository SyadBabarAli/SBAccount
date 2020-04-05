<template>
  <v-layout row wrap class="pa-2">
    <v-flex lg12 class="mt-12">
      <v-card class="black--text elevation-5">
        <v-layout>
          <v-flex lg12>
            <v-card-title class="headline grey lighten-3 pa-1 ma-0" primary-title>Group Branch</v-card-title>
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
                  <v-toolbar dark color="primary" dense>
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
                      <v-card class="elevation-10">
                        <v-card-title
                          class="headline grey lighten-3 pa-1 ma-0"
                          primary-title
                        >Group Branch</v-card-title>
                        <v-divider></v-divider>
                        <!-- <v-flex lg6>
                          <v-text-field
                            v-model="editedItem.GroupBranchId"
                            label="GroupBranchId"
                          ></v-text-field>
                        </v-flex>-->

                        <v-flex lg6>
                          <v-text-field
                            v-model="editedItem.GroupBranchId"
                            label="ID"
                            disabled
                            v-show="false"
                          ></v-text-field>
                        </v-flex>
                        <v-flex lg6>
                          <v-text-field v-model="editedItem.Name" label="Name"></v-text-field>
                        </v-flex>
                        <!-- <v-flex lg6>
                          <v-text-field v-model="editedItem.IsActive" label="IsActive"></v-text-field>
                        </v-flex>
                        <v-flex lg6>
                          <v-text-field v-model="editedItem.IsDeleted" label="IsDeleted"></v-text-field>
                        </v-flex>-->
                      </v-card>
                    </v-container>
                  </v-card-text>
                </v-card>
              </v-dialog>
            </v-card-title>
            <v-flex lg12 class="pa-2">
              <div id="sixthTable">
                <table id="csmTable">
                  <thead>
                    <tr>
                      <th v-for="col in columns" v-on:click="sortTable(col)">
                        {{col}}
                        <div
                          class="arrow"
                          v-if="col == sortColumn"
                          v-bind:class="[ascending ? 'arrow_up' : 'arrow_down']"
                        ></div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in get_rows()">
                      <td v-for="col in columns">{{row[col]}}</td>
                    </tr>
                  </tbody>
                </table>
                <div class="pagination">
                  <div
                    class="number"
                    v-for="i in num_pages()"
                    v-bind:class="[i == currentPage ? 'active' : '']"
                    v-on:click="change_page(i)"
                  >{{i}}</div>
                </div>
              </div>
            </v-flex>
            <v-data-table
              :headers="headers"
              :items="listOfRecords"
              class="elevation-3"
              :search="search"
              :loading="isLoading"
            >
              <template slot="items" slot-scope="props">
                <td class="text-xs-left">{{ props.item.GroupBranchId }}</td>
                <td class="text-xs-left">{{ props.item.Name }}</td>
                <td class="text-xs-left">{{ props.item.IsActive }}</td>
                <td class="text-xs-left">{{ props.item.IsDeleted }}</td>
                <td class="justify-center layout px-0">
                  <v-btn
                    color="primary"
                    fab
                    small
                    dark
                    style="height:22px;width:22px;font-size:13px;"
                    @click="editItem(props.item)"
                  >
                    <v-icon style="font-size:13px">edit</v-icon>
                  </v-btn>
                  <v-btn color="red" fab small dark style="height:22px;width:22px;font-size:13px;">
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
import { mixins } from "../../../../../mixins/CustomMixins";
import Application from "../../../../../services/application-service";
import SnackBar from "../../../../../components/control/SnackBar";
import axios from "axios";

export default {
  mixins: [mixins],
  components: {
    SnackBar
  },
  data: () => ({
    currentPage: 1,
    elementsPerPage: 2,
    ascending: false,
    sortColumn: "",
    rows: [],
    ///
    GroupBranchId: 0,
    Name: "",
    IsActive: "",
    IsDeleted: "",

    dialog: false,
    search: "",
    headers: [
      { text: "GroupBranchId", value: "GroupBranchId" },
      { text: "Name", value: "Name" },
      { text: "IsActive", value: "IsActive" },
      { text: "IsDeleted", value: "IsDeleted" },
      { text: "Actions", value: "", sortable: false, align: "center" }
    ],
    isLoading: true,
    IsSnackBar: false,
    listOfRecords: [],
    editedIndex: -1,
    editedItem: {},
    defaultItem: {}
  }),
  computed: {
    columns: function columns() {
      if (this.rows.length == 0) {
        return [];
      }
      return Object.keys(this.rows[0]);
    },
    ///
    formTitle() {
      return this.editedIndex === -1 ? "New Group Branch" : "Edit Group Branch";
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
    }
  },
  created() {
    this.initialize();
  },
  methods: {
    sortTable: function sortTable(col) {
      if (this.sortColumn === col) {
        this.ascending = !this.ascending;
      } else {
        this.ascending = true;
        this.sortColumn = col;
      }

      var ascending = this.ascending;

      this.rows.sort(function(a, b) {
        if (a[col] > b[col]) {
          return ascending ? 1 : -1;
        } else if (a[col] < b[col]) {
          return ascending ? -1 : 1;
        }
        return 0;
      });
    },
    num_pages: function num_pages() {
      return Math.ceil(this.rows.length / this.elementsPerPage);
    },
    get_rows: function get_rows() {
      var start = (this.currentPage - 1) * this.elementsPerPage;
      var end = start + this.elementsPerPage;
      return this.rows.slice(start, end);
    },
    change_page: function change_page(page) {
      this.currentPage = page;
    },
    /////
    initialize() {
      this.tableLoad();
    },

    async tableLoad() {
      this.isLoading = true;
      const res = await axios
        .get(this.$urlApplication + "GroupBranch/GetGroupBranches")
        .then(res => {
          this.listOfRecords = res.data;
          this.rows = this.listOfRecords;
          this.isLoading = false;
        })
        .catch(error => {
          this.isLoading = false;
        });
    },

    post() {
      var obj = this.editedItem;
      obj.CompanyId = 1;
      obj.Name = this.editedItem.Name;

      this.IsSnackBar = true;

      axios({
        method: "post",
        url: this.$urlApplication + "GroupBranch/Post",
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
    },

    put() {
      var obj = this.editedItem;
      obj.CompanyId = 1;
      obj.GroupBranchId = this.editedItem.GroupBranchId;
      obj.Name = this.editedItem.Name;
      this.IsSnackBar = true;

      axios({
        method: "put",
        url: this.$urlApplication + "GroupBranch/Put?id=" + obj.GroupBranchId,
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
    },

    delete(id) {
      var pId = id;
      this.IsSnackBar = true;
      axios({
        method: "delete",
        url: this.$urlApplication + "GroupBranch/Delete?companyId=1&id=" + pId
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
      this.editedItem.GroupBranchName = "";
      this.editedItem.Name = "";
    },
    editItem(item) {
      var obj = item;
      debugger;
      // this.editedIndex = this.listOfRecords.indexOf(item);
      // this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.listOfRecords.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.delete(item.GroupBranchId);
    },
    dialogOpen() {
      if (this.editedItem.GroupBranchId == undefined) {
        //When click add
        this.editedItem.Active = true;
        this.clear();
      } else {
        //Edite Record
        //this.changeGroupBranchs(this.selectGroupBranchs);
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
    }
  }
};
</script>
<style scoped>
#csmTable {
  /* font-family: "Trebuchet MS", Arial, Helvetica, sans-serif; */
  border-collapse: collapse;
  width: 100%;
}

#csmTable td,
#csmTable th {
  border: 1px solid #ddd;
  padding: 3px;
}

#csmTable tr:nth-child(even) {
  background-color: #f2f2f2;
}

/* #csmTable tr {
  padding-top: 10px;
  padding-bottom: 10px;
} */
/* 
#csmTable tr:hover {
  background-color: #ddd;
} */

#csmTable th {
  /* padding-top: 10px;
  padding-bottom: 10px; */
  text-align: left;
  background-color: white;
  color: black;
}
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