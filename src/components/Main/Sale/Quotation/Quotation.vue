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
                    <v-container>
                      <v-card class="elevation-10">
                        <v-card-title
                          class="headline grey lighten-3 pa-1 ma-0"
                          primary-title
                        >Sale Quotation - {{this.editedItem.SaleQuotationId}} - {{this.editedItem.StatusName}}</v-card-title>
                        <v-divider></v-divider>
                        <v-layout>
                          <v-flex lg2 class="pa-1">
                            <auto-complete
                              :Name="this.editedItem.CustomerName"
                              :isAsync="true"
                              :apiUrl="'SaleQuotation/GetCustomer?pSearch='"
                              v-on:input="onChildClickAutoCompelete"
                            />
                            <input readonly v-model="editedItem.CustomerId" style="display:none;" />
                          </v-flex>
                          <v-flex class="pa-1">
                            <v-text-field
                              v-model="editedItem.Number"
                              :append-icon="'autorenew'"
                              placeholder="Placeholder"
                              clearable
                              label="Number"
                              type="text"
                              @click:append="getProposedNumber"
                            ></v-text-field>
                          </v-flex>
                          <v-flex class="pa-1">
                            <v-text-field
                              label="Date"
                              placeholder="Placeholder"
                              :append-icon="'today'"
                              type="date"
                              :value="DateSale && DateSale.toISOString().split('T')[0]"
                            ></v-text-field>
                          </v-flex>
                          <v-flex class="pa-1">
                            <v-text-field
                              label="Expiry Date"
                              placeholder="Placeholder"
                              :append-icon="'today'"
                              type="date"
                              @click:append="''"
                              :value="ExpiryDate && ExpiryDate.toISOString().split('T')[0]"
                            ></v-text-field>
                          </v-flex>
                          <v-flex class="pa-1">
                            <v-text-field
                              label="Reference"
                              placeholder="Placeholder"
                              v-model="editedItem.Reference"
                            ></v-text-field>
                          </v-flex>
                          <v-flex class="pa-1">
                            Branch
                            <br />
                            <select v-model="selectBranch" style="width:100%">
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
                            <select v-model="selectSalePerson" style="width:100%">
                              <option
                                v-for="option in itemsSalePerson"
                                v-bind:value="option"
                              >{{ option.text }}</option>
                            </select>
                          </v-flex>
                          <v-flex lg2 class="pa-1">
                            Currency
                            <br />
                            <select v-model="selectCurrency" style="width:100%">
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

                        <v-layout class="pa-1">
                          <v-flex lg4>
                            <v-textarea
                              name="input-7-1"
                              label="Term"
                              v-model="editedItem.Term"
                              hint="Hint text"
                            ></v-textarea>
                          </v-flex>
                          <v-flex lg4></v-flex>
                          <v-flex lg4>
                            <v-layout>
                              <v-flex lg6 class="font-weight-regular">Gross</v-flex>
                              <v-flex lg6>
                                <input type="text" v-model="GrossAmount" class="txtRight" />
                              </v-flex>
                            </v-layout>
                            <v-layout>
                              <v-flex lg4 class="font-weight-regular">Discount</v-flex>
                              <v-flex lg4>
                                <input
                                  type="number"
                                  min="0"
                                  step=".01"
                                  v-model="DiscountPercent"
                                  v-on:change="calcDiscount(DiscountPercent)"
                                  class="txtRight"
                                />
                              </v-flex>
                              <v-flex lg4>
                                <input
                                  type="text"
                                  class="txtRight"
                                  v-model="DiscountAmount"
                                  v-on:change="calcDiscountAmount(DiscountAmount)"
                                />
                              </v-flex>
                            </v-layout>
                            <v-layout>
                              <v-flex lg6 class="font-weight-regular">TaxAmount</v-flex>
                              <v-flex lg6>
                                <input type="text" class="txtRight" />
                              </v-flex>
                            </v-layout>
                            <v-layout>
                              <v-flex lg6 class="font-weight-medium">Net (Rs)</v-flex>
                              <v-flex lg6>
                                <input type="text" class="txtRight" v-model="NetAmount" />
                              </v-flex>
                            </v-layout>
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
                <td class="text-xs-left">{{ props.item.DateSale | momentConvertDate }}</td>
                <td class="text-xs-left">{{ props.item.CustomerName }}</td>
                <td class="text-xs-left">{{ props.item.BranchName }}</td>
                <td class="text-xs-left">{{ props.item.SalePersonName }}</td>
                <td class="text-xs-left">{{ props.item.ExpiryDate | momentConvertDate }}</td>
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
      GrossAmount: 0,
      DiscountPercent: 0,
      DiscountAmount: 0,
      NetAmount: 0,
      TaxAmount: 0,
      editedItem: {
        DateSale: new Date(),
        ExpiryDate: new Date(),
        Number: "",
        Reference: "",
        AutoCompelete: "",
        Term: "",
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
        { text: "Date", value: "DateSale" },
        { text: "Customer", value: "CustomerName" },
        { text: "Branch", value: "BranchName" },
        { text: "Sales Man", value: "SalePersonName" },
        { text: "Expiry Date", value: "ExpiryDate" },
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
      obj.CustomerId = this.editedItem.AutoCompelete.split("~")[1];
      obj.BranchId = this.selectBranch.value;
      obj.CurrencyId = this.selectCurrency.value;
      obj.SalePersonId = this.selectSalePerson.value;
      obj.CompanyId = 1;
      obj.DateSale = this.DateSale;
      obj.ExpiryDate = this.ExpiryDate;
      obj.GrossAmount = this.GrossAmount;
      obj.DiscountPercent = this.DiscountPercent;
      obj.DiscountAmount = this.DiscountAmount;
      obj.TaxAmount = this.TaxAmount;
      obj.NetAmount = this.NetAmount;

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
    onChildClick(obj) {
      if (obj != null) {
        this.editedItem.saleQuotationDetail = obj.tableRow;
        this.GrossAmount = obj.subTotal;
        this.NetAmount = obj.total;
      }
    },
    onChildClickAutoCompelete(value) {
      this.editedItem.AutoCompelete = value;
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

      obj.GrossAmount = this.GrossAmount;
      obj.DiscountPercent = this.DiscountPercent;
      obj.DiscountAmount = this.DiscountAmount;
      obj.TaxAmount = this.TaxAmount;
      obj.NetAmount = this.NetAmount;

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
      this.editedItem.Term = obj.Term;
      this.GrossAmount = obj.GrossAmount;
      this.DiscountPercent = obj.DiscountPercent;
      this.DiscountAmount = obj.DiscountAmount;
      this.TaxAmount = obj.TaxAmount;
      this.NetAmount = obj.NetAmount;

      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.listOfRecords.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.delete(item.SaleQuotationId);
    },
    dialogOpen() {
      if (
        this.editedItem.SaleQuotationId == undefined ||
        this.editedItem.SaleQuotationId == ""
      ) {
        //When click add
        this.clear();
        this.getProposedNumber();
      } else {
        //Edite Record
        //this.changeSaleQuotations(this.selectSaleQuotations);
      }
    },
    clear() {
      this.editedIndex = -1;
      this.listOfRecordDetails = [];
      this.AutoCompelete = "";
      this.ExpiryDate = new Date();
      this.DateSale = new Date();

      this.editedItem.CustomerName = "";
      this.editedItem.Number = "";
      this.editedItem.Reference = "";
      this.editedItem.SalePersonId = "";
      this.editedItem.SettingStatusId = "";
      this.editedItem.CompanyId = "";
      this.editedItem.SaleQuotationId = "";
      this.editedItem.Name = "";
      this.editedItem.IsDeleted = false;
      this.editedItem.IsActive = true;
      this.editedItem.saleQuotationDetail = [];

      this.GrossAmount = "";
      this.DiscountPercent = "";
      this.DiscountAmount = "";
      this.NetAmount = "";
    },
    close() {
      if (!this.dialog) {
        this.clear();
      }
      this.dialog = false;
      // setTimeout(() => {
      //   this.editedItem = Object.assign({}, this.defaultItem);
      //   this.editedIndex = -1;
      // }, 300);
    },
    async getProposedNumber() {
      const res = await axios
        .get(this.$urlApplication + "SaleQuotation/GetProposedNumber")
        .then(res => {
          this.editedItem.Number = res.data;
        })
        .catch(error => {});
    },
    calcDiscount() {
      this.DiscountAmount = 0;
      var value = this.GrossAmount;
      var discount = this.DiscountPercent;
      var result = null;
      value = value - value * (parseFloat(discount) / 100);
      if (!isNaN(value)) {
        result = value.toFixed(2);
      }
      this.NetAmount = result;
    },

    calcDiscountAmount() {
      this.DiscountPercent = 0;
      var value = this.GrossAmount;
      var discount = this.DiscountAmount;
      var result = value - discount;
      this.NetAmount = result;
    }
  }
};
</script>
<style scoped>
select {
  -webkit-writing-mode: horizontal-tb !important;
  -webkit-appearance: menulist;
  -webkit-rtl-ordering: logical;
  cursor: default;
  margin: 0em;
  font: 400 13.3333px Arial;
  border-radius: 4px;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(169, 169, 169);
  border-image: initial;
  height: 25px;
}
/* select {
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
} */
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
/* input {
  border: 1px solid gray;
  border-radius: 4px;
} */
input {
  padding: 0.75rem;
  color: #2a2a2a;
  background-color: #fff;
  border: 2px solid #dadfe6;
  font-family: Roboto;
  border-radius: 0.375rem;
  height: 20px;
  width: 100%;
}

.txtRight {
  text-align: right !important;
}
.txtLeft {
  text-align: left !important;
}
.txtCenter {
  text-align: center !important;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  color: rgba(0, 0, 0, 0);
  opacity: 1;
  display: block;
  background: url(https://mywildalberta.ca/images/GFX-MWA-Parks-Reservations.png)
    no-repeat;
  width: 20px;
  height: 20px;
  border-width: thin;
}
</style>