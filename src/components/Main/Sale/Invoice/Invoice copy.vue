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
              <v-text-field
                v-model="search"
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
                      <td>{{row.InvoiceDate | momentConvertDate }}</td>
                      <td>{{row.CustomerName}}</td>
                      <td>{{row.Reference}}</td>
                      <td>{{row.BranchName}}</td>
                      <td>{{row.SalePersonName}}</td>
                      <td>{{row.InvoiceDueDate | momentConvertDate}}</td>
                      <td>{{row.GrossAmount}}</td>
                      <td>{{row.NetAmount}}</td>
                      <td>{{row.StatusName}}</td>
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
                  @input="change_page(currentPage)"
                ></v-pagination>
              </v-flex>
            </v-layout>

            <!-- <v-data-table
              :headers="headers"
              :items="listOfRecords"
              class="elevation-3"
              :search="search"
              :loading="isLoading"
            >
              <template slot="items" slot-scope="props">
                <td class="text-xs-left">{{ props.item.Number }}</td>
                <td class="text-xs-left">{{ props.item.InvoiceDate | momentConvertDate }}</td>
                <td class="text-xs-left">{{ props.item.CustomerName }}</td>
                <td class="text-xs-left">{{ props.item.Reference }}</td>
                <td class="text-xs-left">{{ props.item.BranchName }}</td>
                <td class="text-xs-left">{{ props.item.SalePersonName }}</td>
                <td class="text-xs-left">{{ props.item.InvoiceDueDate | momentConvertDate }}</td>
                <td class="text-xs-left">{{ props.item.GrossAmount }}</td>
                <td class="text-xs-left">{{ props.item.NetAmount }}</td>
                <td class="text-xs-left">{{ props.item.StatusName }}</td>
                <td class="justify-center layout px-0">
                  <v-btn
                    color="primary"
                    fab
                    small
                    dark
                    style="height:22px;width:22px;font-size:13px;"
                    :to="'/InvoiceEdit?id=' +props.item.SaleInvoiceId"
                  >
                    <v-icon style="font-size:13px">edit</v-icon>
                  </v-btn>
                  <v-btn color="red" fab small dark style="height:22px;width:22px;font-size:13px;">
                    <v-icon style="font-size:13px" @click="deleteItem(props.item)">delete</v-icon>
                  </v-btn>
                </td>
              </template>
            </v-data-table>-->
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
      currentPage: 1,
      pageSize: 2,
      ascending: false,
      sortColumn: "Number",
      rows: [],
      searchable: "Number",
      search: "",
      selectTableRowNo: 1,
      itemsTableRowNo: [1, 2, 3, 4, 5],
      totalPages: 1,

      headers: [
        { text: "Number", value: "Number" },
        { text: "Date", value: "InvoiceDate" },
        { text: "Customer", value: "CustomerName" },
        { text: "Reference", value: "Reference" },
        { text: "Branch", value: "BranchName" },
        { text: "Sales Man", value: "SalePersonName" },
        { text: "Expiry InvoiceDate", value: "InvoiceDueDate" },
        { text: "Gross Amount", value: "GrossAmount" },
        { text: "Net Amount", value: "NetAmount" },
        { text: "Status ", value: "StatusName" },
        { text: "Action", value: "1" }
      ],
      isLoading: true,
      IsSnackBar: false,
      listOfRecords: [],
      listOfRecordDetails: [],
      editedIndex: -1
    };
  },
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
  mounted: function() {
    this.tableLoad();
  },
  methods: {
    sortTable: function sortTable(col) {
      this.sortColumn = col;
      this.ascending = !this.ascending;
      this.asc = this.ascending;
      this.tableLoad();
    },

    change_page: function change_page(page) {
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
    // async tableLoad() {
    //   this.isLoading = true;
    //   const res = await axios
    //     .get(this.$urlApplication + "SaleInvoice")
    //     .then(res => {
    //       this.listOfRecords = res.data;
    //       this.isLoading = false;
    //     })
    //     .catch(error => {
    //       this.isLoading = false;
    //     });
    // },

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
}
</style>