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
            </v-card-title>
            <v-flex lg12 class="pa-2">
              <div>
                <table class="csmTable">
                  <thead>
                    <tr>
                      <!-- <th>Company Id</th> -->
                      <th v-on:click="sortTable('GroupBranchId',$event)" style="cursor: pointer">
                        Category Brand Id
                        <v-icon style="font-size:15px">keyboard_arrow_up</v-icon>
                      </th>
                      <th v-on:click="sortTable('Name',$event)" style="cursor: pointer">
                        Name
                        <v-icon style="font-size:15px">keyboard_arrow_up</v-icon>
                      </th>
                      <th class="text-xs-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in rows">
                      <!-- <td>{{row.CompanyId}}</td> -->
                      <td>{{row.GroupBranchId}}</td>
                      <td>{{row.Name}}</td>
                      <td class="justify-center layout px-0">
                        <v-btn
                          color="primary"
                          fab
                          small
                          dark
                          style="height:22px;width:22px;font-size:13px;"
                          :to="'/InvoiceEdit?id=' +row.SaleInvoiceId"
                        >
                          <v-icon style="font-size:13px">edit</v-icon>
                        </v-btn>
                        <v-btn
                          color="red"
                          fab
                          small
                          dark
                          style="height:22px;width:22px;font-size:13px;"
                        >
                          <v-icon style="font-size:13px" @click="deleteItem(row)">delete</v-icon>
                        </v-btn>
                      </td>
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
                      :total-visible="4"
                      :length="totalPages"
                      @input="changePage(currentPage)"
                    ></v-pagination>
                  </v-flex>
                </v-layout>
              </div>
            </v-flex>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mixins } from "../../../../../mixins/CustomMixins";
import Application from "../../../../../services/application-service";
import axios from "axios";

export default {
  mixins: [mixins],
  data: () => ({
    currentPage: 1,
    pageSize: 5,
    ascending: false,
    sortColumn: "Name",
    rows: [],
    searchable: "Name",
    search: "",
    selectTableRowNo: 5,
    itemsTableRowNo: [1, 2, 3, 4, 5],
    totalPages: 1,
    isLoading: true
  }),
  watch: {
    search(val) {
      this.search = val;
      this.currentPage = 1;
      this.tableLoad();
    },
    selectTableRowNo(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.tableLoad();
    }
  },
  created() {
    this.tableLoad();
  },
  methods: {
    sortTable: function sortTable(col, obj) {
      var v1 = obj;

      if (obj.toElement.lastElementChild.innerText == "keyboard_arrow_down") {
        obj.toElement.lastElementChild.innerText = "keyboard_arrow_up";
      } else if (
        obj.toElement.lastElementChild.innerText == "keyboard_arrow_up"
      ) {
        obj.toElement.lastElementChild.innerText = "keyboard_arrow_down";
      }
      this.sortColumn = col;
      this.ascending = !this.ascending;
      this.asc = this.ascending;
      this.tableLoad();
    },

    changePage: function changePage(page) {
      this.currentPage = page;
      this.tableLoad();
    },

    async tableLoad() {
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
        url: this.$urlApplication + "GroupBranch/GetGroupBranches",
        data: pagedResult
      })
        .then(res => {
          this.pageSize = res.data.PageSize;
          this.totalPages = res.data.PageCount;
          this.rows = res.data.Results;
          this.isLoading = false;
        })
        .catch(error => {
          this.isLoading = false;
        });
    }
  }
};
</script>
<style scoped>
.csmTable {
  border-collapse: collapse;
  width: 100%;
}
.csmTable td,
.csmTable th {
  border: 1px solid #ddd;
  padding: 3px;
}
.csmTable tr:nth-child(even) {
  background-color: #f2f2f2;
}
.csmTable th {
  text-align: left;
  background-color: white;
  color: black;
}
</style>