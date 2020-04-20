<template>
  <v-layout row wrap class="pa-2">
    <v-flex lg12 class="mt-12">
      <v-card class="black--text elevation-5">
        <v-layout>
          <v-flex lg12>
            <v-card-title class="headline grey lighten-3 pa-1 ma-0" primary-title>Account Expense</v-card-title>
            <v-card-title>
              <v-toolbar-title>Details</v-toolbar-title>
              <v-divider class="mx-2" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-text-field
                @keyup="searchTxt"
                v-model="value"
                append-icon="search"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
              <v-btn slot="activator" color="primary" dark class="mb-2" to="/ExpenseEdit?id=0">Add</v-btn>
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
                      <th v-on:click="sortTable('Date',$event)">
                        Date
                        <v-icon style="font-size:15px">keyboard_arrow_up</v-icon>
                      </th>
                      <th v-on:click="sortTable('CustomerName',$event)">
                        Customer
                        <v-icon style="font-size:15px">keyboard_arrow_up</v-icon>
                      </th>

                      <th v-on:click="sortTable('AccountName',$event)">
                        Account Name
                        <v-icon style="font-size:15px">keyboard_arrow_up</v-icon>
                      </th>

                      <th v-on:click="sortTable('Comment',$event)">
                        Comment
                        <v-icon style="font-size:15px">keyboard_arrow_up</v-icon>
                      </th>
                      <th v-on:click="sortTable('BranchName',$event)">
                        Branch
                        <v-icon style="font-size:15px;text-align: right;">keyboard_arrow_up</v-icon>
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
                      <td class="text-xs-left">{{row.Date | momentConvertDate }}</td>
                      <td class="text-xs-left">{{row.CustomerName}}</td>
                      <td class="text-xs-left">{{row.AccountName}}</td>
                      <td class="text-xs-left">{{row.Comment}}</td>
                      <td class="text-xs-left">{{row.BranchName}}</td>
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
                          :to="'/ExpenseEdit?id=' +row.AccountExpenseId"
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
                          <v-icon style="font-size:13px" @click="deleted(row)">delete</v-icon>
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
      timeout: null,
      //////////
      currentPage: 1,
      pageSize: 2,
      ascending: true,
      sortColumn: "Number",
      rows: [],
      searchable: "Number",
      search: "",
      selectTableRowNo: 5,
      itemsTableRowNo: [5, 10, 15],
      totalPages: 1,
      isLoading: true,
      IsSnackBar: false,
      componentName: "AccountExpense"
    };
  },
  // mounted: function() {
  //   this.componentName = "AccountExpense";
  //   debugger;
  // }
};
</script>