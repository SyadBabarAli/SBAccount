<template>
  <v-layout row wrap class="pa-2">
    <v-flex lg12 class="mt-12">
      <v-card class="black--text elevation-5">
        <v-layout>
          <v-flex lg12>
            <v-card-title class="headline grey lighten-3 pa-1 ma-0" primary-title>Group Branch</v-card-title>
            <v-card-title>
              <v-toolbar-title>Details {{this.currentPage}}</v-toolbar-title>
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
                            v-model="editedItem.CategoryBrandId"
                            label="CategoryBrandId"
                          ></v-text-field>
                        </v-flex>-->

                        <v-flex lg6>
                          <v-text-field
                            v-model="editedItem.CategoryBrandId"
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
                <!-- {{rows}} -->
                <!-- <table id="csmTable">
                  <thead>
                    <tr>
                      <th v-on:click="sortTable('CompanyId')">Company Id</th>
                      <th v-on:click="sortTable('CategoryBrandId')">Category Brand Id</th>
                      <th v-on:click="sortTable('Name')">Name</th>
                      <th v-on:click="sortTable('IsActive')">Active</th>
                      <th v-on:click="sortTable('IsDeleted')">Deleted</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in rows">
                      <td>{{row.CompanyId}}</td>
                      <td>{{row.CategoryBrandId}}</td>
                      <td>{{row.Name}}</td>
                      <td>{{row.IsActive}}</td>
                      <td>{{row.IsDeleted}}</td>
                    </tr>
                  </tbody>
                </table>-->

                <table id="csmTable">
                  <thead>
                    <tr>
                      <th v-on:click="sortTable('Number')">Number</th>
                      <th v-on:click="sortTable('InvoiceDate')">Invoice Date</th>
                      <th v-on:click="sortTable('CustomerName')">Customer</th>
                      <th v-on:click="sortTable('Reference')">Reference</th>
                      <th v-on:click="sortTable('BranchName')">Branch</th>
                      <th v-on:click="sortTable('SalePersonName')">SalePerson</th>
                      <th v-on:click="sortTable('InvoiceDueDate')">Invoice DueDate</th>
                      <th v-on:click="sortTable('GrossAmount')">Gross Amount</th>
                      <th v-on:click="sortTable('NetAmount')">Net Amount</th>
                      <th v-on:click="sortTable('StatusName')">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in rows">
                      <td>{{row.Number}}</td>
                      <td>{{row.InvoiceDate}}</td>
                      <td>{{row.CustomerName}}</td>
                      <td>{{row.Reference}}</td>
                      <td>{{row.BranchName}}</td>
                      <td>{{row.SalePersonName}}</td>
                      <td>{{row.InvoiceDueDate}}</td>
                      <td>{{row.GrossAmount}}</td>
                      <td>{{row.NetAmount}}</td>
                      <td>{{row.StatusName}}</td>
                    </tr>
                  </tbody>
                </table>
                <v-layout>
                  <v-flex lg1>
                    <v-select v-model="selectTableRowNo" :items="itemsTableRowNo" label="Row List"></v-select>
                  </v-flex>
                  <v-flex lg1>
                    <v-pagination
                      class="pt-2"
                      v-model="currentPage"
                      :total-visible="3"
                      :length="totalPages"
                      @input="change_page(currentPage)"
                    ></v-pagination>
                  </v-flex>
                </v-layout>
                <!-- <div class="pagination">
                  <div
                    class="number"
                    v-for="i in totalPages"
                    v-bind:class="[i == currentPage ? 'active' : '']"
                    v-on:click="change_page(i)"
                  >{{i}}</div>
                </div>-->
              </div>
            </v-flex>
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
    pageSize: 2,
    ascending: false,
    sortColumn: "Number",
    rows: [],
    searchable: "Number",
    search: "",

    selectTableRowNo: 1,
    itemsTableRowNo: [1, 2, 3, 4, 5],
    ///
    totalPages: 1,
    CategoryBrandId: 0,
    Name: "",
    IsActive: "",
    IsDeleted: "",

    dialog: false,

    isLoading: true,
    IsSnackBar: false,
    listOfRecords: [],
    editedIndex: -1,
    editedItem: {},
    defaultItem: {}
  }),
  computed: {
    columns: function columns() {
      var result = null;
      if (this.rows.length == 0) {
        return [];
      }

      result = Object.keys(this.rows[0]);

      return ["Company Id", "Group Branch Id", "Name", "Active", "Deleted"];
    },
    ///
    formTitle() {
      return this.editedIndex === -1 ? "New Group Branch" : "Edit Group Branch";
    }
  },
  watch: {
    search(val) {
      var search = val;
      this.search = search;
      this.tableLoad4();
    },
    selectTableRowNo(val) {
      this.pageSize = val;
      this.tableLoad4();
    },
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
      this.sortColumn = col;
      this.ascending = !this.ascending;
      this.asc = this.ascending;
      this.tableLoad4();

      // if (this.sortColumn === col) {
      //   this.ascending = !this.ascending;
      // } else {
      //   this.ascending = true;
      //   this.sortColumn = col;
      // }

      // var ascending = this.ascending;

      // this.rows.sort(function(a, b) {
      //   if (a[col] > b[col]) {
      //     return ascending ? 1 : -1;
      //   } else if (a[col] < b[col]) {
      //     return ascending ? -1 : 1;
      //   }
      //   return 0;
      // });
    },

    change_page: function change_page(page) {
      this.currentPage = page;
      this.tableLoad4();
    },
    /////
    initialize() {
      this.tableLoad4();
    },
    async tableLoad4() {
      this.isLoading = true;
      var pagedResult = {
        CurrentPage: this.currentPage,
        PageSize: this.selectTableRowNo,
        SortColumn: this.sortColumn,
        IsAsc: this.ascending,
        Searchable: this.searchable,
        Search: this.search
      };

      axios({
        method: "put",
        url: this.$urlApplication + "GroupBranch/PutCustomer",
        data: pagedResult
      })
        .then(res => {
          this.currentPage = res.data.CurrentPage;
          this.pageSize = res.data.PageSize;
          this.totalPages = res.data.PageCount;
          this.rows = res.data.Results;
          this.isLoading = false;
          debugger
        })
        .catch(error => {
          this.isLoading = false;
        });

      // const res = await axios
      //   .get(
      //     this.$urlApplication +
      //       "GroupBranch/GetCustomer?&page=" +
      //       this.currentPage +
      //       "&pageSize=" +
      //       this.pageSize +
      //       "&orderBy=" +
      //       this.sortColumn +
      //       "&ascending=" +
      //       this.ascending
      //   )
      //   .then(res => {
      //     debugger;
      //     // this.currentPage = res.Results.PageNumber;
      //     // this.pageSize = res.Results.PageSize;
      //     // this.totalPages = res.Results.TotalNumberOfPages;
      //     this.rows = res.Results;
      //     debugger;
      //     this.isLoading = false;
      //   })
      //   .catch(error => {
      //     this.isLoading = false;
      //   });
    },
    async tableLoad3() {
      this.isLoading = true;
      const res = await axios
        .get(
          this.$urlApplication +
            "GroupBranch/GetCustomer?&page=" +
            this.currentPage +
            "&pageSize=" +
            this.pageSize +
            "&orderBy=" +
            this.sortColumn +
            "&ascending=" +
            this.ascending
        )
        .then(res => {
          debugger;
          // this.currentPage = res.data.PageNumber;
          // this.pageSize = res.data.PageSize;
          // this.totalPages = res.data.TotalNumberOfPages;
          this.rows = res.data;
          debugger;
          this.isLoading = false;
        })
        .catch(error => {
          this.isLoading = false;
        });
    },

    async tableLoad2() {
      this.isLoading = true;
      const res = await axios
        .get(
          this.$urlApplication +
            "GroupBranch/GetCustomer?&pageNumber=" +
            this.currentPage +
            "&pageSize=" +
            this.pageSize +
            "&orderBy=" +
            this.sortColumn +
            "&asc=" +
            this.ascending
        )
        .then(res => {
          var objParam = JSON.parse(res.headers["paging-headers"]);
          this.currentPage = objParam.currentPage;
          this.pageSize = objParam.pageSize;
          this.totalPages = objParam.totalPages;
          this.rows = res.data;
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
      obj.CategoryBrandId = this.editedItem.CategoryBrandId;
      obj.Name = this.editedItem.Name;
      this.IsSnackBar = true;

      axios({
        method: "put",
        url: this.$urlApplication + "GroupBranch/Put?id=" + obj.CategoryBrandId,
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
        this.delete(item.CategoryBrandId);
    },
    dialogOpen() {
      if (this.editedItem.CategoryBrandId == undefined) {
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