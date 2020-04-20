<template>
  <v-layout row wrap class="pa-2">
    <v-flex lg12 class="mt-12">
      <v-card class="black--text elevation-5">
        <v-layout>
          <v-flex lg12>
            <v-card-title class="headline grey lighten-3 pa-1 ma-0" primary-title>Sale Invoice</v-card-title>
            <v-card-title>
              <v-toolbar-title>Details</v-toolbar-title>
              <v-divider class="mx-2" inset vertical></v-divider>
              <v-spacer></v-spacer>

              <!-- <p>Value: {{ search }}</p> -->
              <v-text-field
                @keyup="searchTxt"
                v-model="value"
                append-icon="search"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
              <v-btn slot="activator" color="primary" dark class="mb-2" to="/InvoiceEdit?id=0">Add</v-btn>
            </v-card-title>
            <v-layout lg12>
              <v-flex lg12 class="pl-1 pr-1">
                <table class="csmTable">
                  <thead>
                    <tr>
                      <th v-on:click="sortTable('Number',$event)">
                        Number
                        <v-icon style="font-size:15px;">keyboard_arrow_up</v-icon>
                      </th>
                      <th v-on:click="sortTable('InvoiceDate',$event)">
                        Invoice Date
                        <v-icon style="font-size:15px">keyboard_arrow_up</v-icon>
                      </th>
                      <th v-on:click="sortTable('CustomerName',$event)">
                        Customer
                        <v-icon style="font-size:15px">keyboard_arrow_up</v-icon>
                      </th>
                      <th v-on:click="sortTable('Reference',$event)">
                        Reference
                        <v-icon style="font-size:15px">keyboard_arrow_up</v-icon>
                      </th>
                      <th v-on:click="sortTable('BranchName',$event)">
                        Branch
                        <!-- <div style="text-align: right;"> -->
                          <v-icon style="font-size:15px;text-align: right;">keyboard_arrow_up</v-icon>
                        <!-- </div> -->
                      </th>
                      <th v-on:click="sortTable('SalePersonName',$event)">
                        Sale Person
                        <v-icon style="font-size:15px">keyboard_arrow_up</v-icon>
                      </th>
                      <th v-on:click="sortTable('InvoiceDueDate',$event)">
                        Invoice DueDate
                        <v-icon style="font-size:15px">keyboard_arrow_up</v-icon>
                      </th>
                      <th v-on:click="sortTable('GrossAmount',$event)">
                        Gross Amount
                        <v-icon style="font-size:15px">keyboard_arrow_up</v-icon>
                      </th>
                      <th v-on:click="sortTable('NetAmount',$event)">
                        Net Amount
                        <v-icon style="font-size:15px">keyboard_arrow_up</v-icon>
                      </th>
                      <th v-on:click="sortTable('StatusName',$event)">
                        Status
                        <v-icon style="font-size:15px">keyboard_arrow_up</v-icon>
                      </th>
                      <th class="text-xs-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in rows">
                      <td class="text-xs-left">{{row.Number}}</td>
                      <td class="text-xs-left">{{row.InvoiceDate | momentConvertDate }}</td>
                      <td class="text-xs-left">{{row.CustomerName}}</td>
                      <td class="text-xs-left">{{row.Reference}}</td>
                      <td class="text-xs-left">{{row.BranchName}}</td>
                      <td class="text-xs-left">{{row.SalePersonName}}</td>
                      <td class="text-xs-left">{{row.InvoiceDueDate | momentConvertDate}}</td>
                      <td class="text-xs-right">{{row.GrossAmount}}</td>
                      <td class="text-xs-right">{{row.NetAmount}}</td>
                      <td class="text-xs-left">{{row.StatusName}}</td>
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
              </v-flex>
            </v-layout>
            <v-layout class="pl-1 pr-1">
              <v-flex lg1>
                <v-select v-model="selectTableRowNo" :items="itemsTableRowNo" label="Row List"></v-select>
              </v-flex>
              <v-flex lg1>
                <v-pagination
                  class="pt-2"
                  v-model="currentPage"
                  :total-visible="3"
                  :length="totalPages"
                  @input="changePage(currentPage)"
                ></v-pagination>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from "axios";
import { mixins } from "../../../../mixins/CustomMixins";
import ButtonSmall from "../../../../components/control/ButtonSmall";
import moment from "moment";

export default {
  mixins: [mixins],
  components: {
    ButtonSmall
  },
  data() {
    return {
      value: "",
      outputValue: "",
      timeout: null,
      //////////
      currentPage: 1,
      pageSize: 2,
      ascending: false,
      sortColumn: "Number",
      rows: [],
      searchable: "Number",
      search: "",
      selectTableRowNo: 5,
      itemsTableRowNo: [1, 2, 3, 4, 5],
      totalPages: 1,
      isLoading: true,
      IsSnackBar: false
    };
  },
  watch: {
    search() {
      this.currentPage = 1;
      this.tableLoad();
    },
    selectTableRowNo(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.tableLoad();
    }
  },
  mounted: function() {
    this.tableLoad();
  },
  methods: {
    // after entering some text in the input field
    // the text will be shown after 1 second
    searchTxt: function() {
      // clear timeout variable
      clearTimeout(this.timeout);

      var self = this;
      this.timeout = setTimeout(function() {
        // enter this block of code after 1 second
        // handle stuff, call search API etc.
        self.search = self.value;
      }, 500);
    },
    //sortTable: function sortTable(col) {

    sortTable: function sortTable(col, obj) {
      obj =
        obj.toElement.lastElementChild == null
          ? obj.srcElement
          : obj.toElement.lastElementChild;
      if (obj.innerText == "keyboard_arrow_down") {
        obj.innerText = "keyboard_arrow_up";
      } else if (obj.innerText == "keyboard_arrow_up") {
        obj.innerText = "keyboard_arrow_down";
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
        url: this.$urlApplication + "SaleInvoice/GetSaleInvoice",
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
    },
    delete(id) {
      var pId = id;
      this.IsSnackBar = true;
      axios({
        method: "delete",
        url: this.$urlApplication + "SaleInvoice/Delete?companyId=1&id=" + pId
      })
        .then(res => {
          this.IsSnackBar = false;
          this.tableLoad();
        })
        .catch(error => {
          this.IsSnackBar = false;
        });
    },
    deleteItem(item) {
      confirm("Are you sure you want to delete this item?") &&
        this.delete(item.SaleInvoiceId);
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
  cursor: pointer;
}

.csmTable th i {
  text-align: right;
}
</style>