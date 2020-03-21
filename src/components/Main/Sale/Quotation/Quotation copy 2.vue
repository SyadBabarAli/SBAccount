<template>
  <v-layout row wrap class="pa-2">
    <v-flex lg12 class="mt-12">
      <v-card class="black--text elevation-5">
        <v-layout>
          <v-flex lg12>
            <v-card-title class="headline grey lighten-3 pa-1 ma-0" primary-title>Sale Quotations</v-card-title>
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
                        >Sale Quotation - {{this.editedItem.StatusName}} - {{this.editedItem.StatusName}}</v-card-title>
                        <v-divider></v-divider>
                        <v-layout>
                          <v-flex lg2 class="pa-1">
                            Customer Name
                            <auto-complete
                              :Name="this.editedItem.CustomerName"
                              :isAsync="true"
                              :apiUrl="'SaleQuotation/GetCustomer?pSearch='"
                              v-on:input="onChildClickAutoCompelete"
                            />
                            <input readonly v-model="editedItem.CustomerId" style="display:none;" />
                          </v-flex>
                          <v-flex class="pa-1">
                            <!-- Number
                            <br /> -->
                            <!-- <input v-model="editedItem.Number" /> -->
                            <v-text-field label="Number" placeholder="Placeholder" v-model="editedItem.Number" ></v-text-field>
                          </v-flex>
                          <v-flex class="pa-1">
                            <!-- Date Sale
                            <br /> -->
                            <!-- {{this.editItem.DateSale}}
                          
                            />
                            New-->
                            <!-- <input
                              type="date"
                              :value="editedItem.DateSale && editedItem.DateSale.toISOString().split('T')[0]"
                              v-on:input="editedItem.DateSale = $event.target.valueAsDate"
                            />-->
                            <v-text-field label="Number" placeholder="Placeholder" v-model="editedItem.Number" ></v-text-field>
                            <!-- <input
                              type="date"
                              :value="DateSale && DateSale.toISOString().split('T')[0]"
                              v-on:input="DateSale = $event.target.valueAsDate"
                            /> -->
                            <!-- <v-btn
                              small
                              color="colorLight"
                              class="colorDark white--text font-weight-light"
                              @click="setMyDateToToday"
                            />-->
                          </v-flex>
                          <v-flex class="pa-1">
                            <!-- <v-btn flat color="silver" @click="setDate">Set Date</v-btn> -->
                            Expiry Date
                            <br />
                            <input
                              type="date"
                              :value="ExpiryDate && ExpiryDate.toISOString().split('T')[0]"
                              v-on:input="ExpiryDate = $event.target.valueAsDate"
                            />
                          </v-flex>
                          <v-flex class="pa-1">
                            Reference
                            <br />
                            <input v-model="editedItem.Reference" />
                          </v-flex>
                          <v-flex class="pa-1">
                            Branch
                            <br />
                            <select v-model="selectBranch">
                              <option
                                v-for="option in itemsBranch"
                                v-bind:value="option"
                              >{{ option.text }}</option>
                            </select>
                          </v-flex>
                        </v-layout>
                        <v-layout>
                          <v-flex lg2 class="pa-1">
                            Sales Person
                            <br />
                            <select v-model="selectSalePerson">
                              <option
                                v-for="option in itemsSalePerson"
                                v-bind:value="option"
                              >{{ option.text }}</option>
                            </select>
                          </v-flex>
                          <v-flex lg2 class="pa-1">
                            Currency
                            <br />
                            <select v-model="selectCurrency">
                              <option
                                v-for="option in itemsCurrency"
                                v-bind:value="option"
                              >{{ option.text }}</option>
                            </select>
                          </v-flex>
                        </v-layout>
                        <v-layout>
                          <v-flex lg12 class="pa-1">
                            <table-inline
                              :objData="itemsProduct"
                              :tableRows="listOfRecordDetails"
                              v-on:childToParent="onChildClick"
                            />
                          </v-flex>
                        </v-layout>
                      </v-card>
                    </v-container>
                  </v-card-text>
                </v-card>
              </v-dialog>
            </v-card-title>
            <v-data-table
              :headers="headers"
              :items="listOfRecords"
              class="elevation-3"
              :search="search"
              :loading="isLoading"
            >
              <template slot="items" slot-scope="props">
                <td class="text-xs-left">{{ props.item.Number }}</td>
                <td class="text-xs-left">{{ props.item.DateSale }}</td>
                <td class="text-xs-left">{{ props.item.CustomerName }}</td>
                <td class="text-xs-left">{{ props.item.BranchName }}</td>
                <td class="text-xs-left">{{ props.item.SalePersonName }}</td>
                <td class="text-xs-left">{{ props.item.ExpiryDate }}</td>
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
  </v-layout>
</template>

<script>
import axios from "axios";
import { mixins } from "../../../../mixins/CustomMixins";
import ButtonSmall from "../../../../components/control/ButtonSmall";
import TableInline from "../../../../components/control/Grid/TableInline";
//import DatePicker from "../../../../components/control/DatePickerFrom";
import AutoComplete from "../../../../components/control/AutoCompelete/AutoCompelete";
import DatePicker from "../../../../components/control/DatePicker/DatePicker";
import moment from "moment";

export default {
  mixins: [mixins],
  components: {
    ButtonSmall,
    TableInline,
    DatePicker,
    AutoComplete
  },
  data() {
    return {
      DateSale: new Date(),
      ExpiryDate: new Date(),
      // data: {
      //   message: "Hello Vue.js!",
      //   DateSale: new Date("2011-04-11T10:20:30Z")
      // },
      editedItem: {
        DateSale: new Date(),
        ExpiryDate: new Date(),
        Number: "SQ-101",
        Reference: "First customer",
        autoCompelete: "",

        saleQuotationDetail: [],
        tableDetail: []
      },
      selectSalePerson: null,
      itemsSalePerson: [],
      selectCurrency: null,
      itemsCurrency: [],
      selectProduct: null,
      itemsProduct: [],
      selectBranch: null,
      itemsBranch: [],

      dialog: false,
      search: "",
      headers: [
        { text: "Number", value: "Number" },
        { text: "DateSale", value: "DateSale" },
        { text: "CustomerName", value: "CustomerName" },
        { text: "BranchName", value: "BranchName" },
        { text: "SalePersonName", value: "SalePersonName" },
        { text: "ExpiryDate", value: "ExpiryDate" },
        { text: "GrossAmount", value: "GrossAmount" },
        { text: "NetAmount", value: "NetAmount" },
        { text: "StatusName", value: "StatusName" },
        { text: "Action", value: "1" }
      ],
      isLoading: true,
      IsSnackBar: false,
      listOfRecords: [],
      listOfRecordDetails: [],
      editedIndex: -1
      // editedItem: {},
      // defaultItem: {}
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Quotation" : "Edit Quotation";
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
  mounted: function() {
    this.tableLoad();
    this.getGroupBranches();
    this.getCurrencies();
    this.getProducts();
    this.getSalePersons();
  },
  methods: {
    // setMyDateToToday() {
    //   //      this.DateSale = new Date();
    //   this.DateSale = new Date("12/19/2012");
    // },
    // setDate() {
    //   this.editItem.DateSale = new Date("2011-04-11T10:20:30Z");
    // },
    async getSalePersons() {
      var result = await this.refillSelectOption(
        this.$urlApplication + "SaleQuotation/GetSalePersons"
      );
      this.selectSalePerson = result.selected;
      this.itemsSalePerson = result.option;
    },

    async getGroupBranches() {
      var result = await this.refillSelectOption(
        this.$urlApplication + "SaleQuotation/GetGroupBranches"
      );
      this.selectBranch = result.selected;
      this.itemsBranch = result.option;
    },
    async getCurrencies() {
      var result = await this.refillSelectOption(
        this.$urlApplication + "SaleQuotation/GetCurrencies"
      );
      this.selectCurrency = result.selected;
      this.itemsCurrency = result.option;
    },

    async getProducts() {
      var result = await this.refillSelectOption(
        this.$urlApplication + "SaleQuotation/GetProducts"
      );
      this.selectProduct = result.selected;
      this.itemsProduct = result.option;
    },

    post() {
      var obj = this.editedItem;
      obj.CustomerId = this.editedItem.autoCompelete.split("~")[1];
      obj.BranchId = this.selectBranch.value;
      obj.CurrencyId = this.selectCurrency.value;
      obj.SalePersonId = this.selectSalePerson.value;
      obj.CompanyId = 1;
      obj.DateSale = this.DateSale;
      obj.ExpiryDate = this.ExpiryDate;
      axios({
        method: "post",
        url: this.$urlApplication + "SaleQuotation/Post",
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
    onChildClick(value) {
      this.editedItem.saleQuotationDetail = value.tableRow;
    },
    onChildClickAutoCompelete(value) {
      this.editedItem.autoCompelete = value;
      this.editedItem.CustomerId = value.split("~")[1];
    },

    async tableLoad() {
      this.isLoading = true;
      const res = await axios
        .get(this.$urlApplication + "SaleQuotation/GetSaleQuotationes")
        .then(res => {
          this.listOfRecords = res.data;
          this.isLoading = false;
        })
        .catch(error => {
          this.isLoading = false;
        });
    },

    async tableLoadDetail(id) {
      const res = await axios
        .get(
          this.$urlApplication +
            "SaleQuotation/GetSaleQuotationDetails?id=" +
            id
        )
        .then(res => {
          this.listOfRecordDetails = res.data;
          this.editedItem.saleQuotationDetail = res.data;
        })
        .catch(error => {});
    },

    put() {
      var obj = this.editedItem;
      obj.SalePersonId = this.selectSalePerson.value;
      obj.SettingStatusId = 1;
      obj.CompanyId = 1;
      obj.SaleQuotationId = this.editedItem.SaleQuotationId;
      obj.Name = this.editedItem.Name;
      obj.IsDeleted = false;
      obj.IsActive = true;
      obj.DateSale = this.DateSale;
      obj.ExpiryDate = this.ExpiryDate;
      //obj.ProductId = this.editedItem.tableRow.Product.value;
      this.IsSnackBar = true;

      axios({
        method: "put",
        url:
          this.$urlApplication + "SaleQuotation/Put?id=" + obj.SaleQuotationId,
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
        url: this.$urlApplication + "SaleQuotation/Delete?companyId=1&id=" + pId
      })
        .then(res => {
          this.IsSnackBar = false;
          this.tableLoad();
        })
        .catch(error => {
          this.IsSnackBar = false;
        });
    },

    editItem(item) {
      var obj = item;
      //1
      this.selectBranch = this.refillSelect(obj.BranchId, this.itemsBranch);
      this.selectCurrency = this.refillSelect(
        obj.CurrencyId,
        this.itemsCurrency
      );

      this.tableLoadDetail(obj.SaleQuotationId);
      this.editedIndex = this.listOfRecords.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editedItem.CustomerId = item.CustomerId;
      this.editedItem.DateSale = obj.DateSale.split("T")[0];
      this.editedItem.ExpiryDate = obj.ExpiryDate.split("T")[0];
      this.editedItem.CustomerName = obj.CustomerName;
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.listOfRecords.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.delete(item.SaleQuotationId);
    },
    dialogOpen() {
      if (this.editedItem.SaleQuotationId == undefined) {
        //When click add
        this.listOfRecordDetails = [];
        this.autoCompelete = "";

        this.ExpiryDate = new Date();
        this.DateSale = new Date();
        //this.editItem.DateSale = new Date();
        this.clear();
      } else {
        //Edite Record
        //this.changeSaleQuotations(this.selectSaleQuotations);
      }
    },
    clear() {
      this.editedItem = {};
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
select {
  -webkit-writing-mode: horizontal-tb !important;
  text-rendering: auto;
  color: -internal-light-dark-color(black, white);
  letter-spacing: normal;
  word-spacing: normal;
  text-transform: none;
  text-indent: 0px;
  text-shadow: none;
  display: inline-block;
  text-align: start;
  -webkit-appearance: menulist;
  box-sizing: border-box;
  align-items: center;
  white-space: pre;
  -webkit-rtl-ordering: logical;
  background-color: -internal-light-dark-color(white, black);
  cursor: default;
  margin: 0em;
  font: 400 13.3333px Arial;
  border-radius: 0px;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(169, 169, 169);
  border-image: initial;
}
input {
  -webkit-writing-mode: horizontal-tb !important;
  text-rendering: auto;
  color: -internal-light-dark-color(black, white);
  letter-spacing: normal;
  word-spacing: normal;
  text-transform: none;
  text-indent: 0px;
  text-shadow: none;
  display: inline-block;
  text-align: start;
  -webkit-appearance: textfield;
  background-color: -internal-light-dark-color(white, black);
  -webkit-rtl-ordering: logical;
  cursor: text;
  margin: 0em;
  font: 400 13.3333px Arial;
  padding: 1px 0px;
  border-width: 2px;
  border-style: inset;
  border-color: initial;
  border-image: initial;
}
.txtRequired {
  border: 1px solid red;
  border-radius: 4px;
}
input {
  border: 1px solid gray;
  border-radius: 4px;
}
</style>