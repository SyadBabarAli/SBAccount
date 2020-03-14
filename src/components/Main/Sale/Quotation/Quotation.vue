<template>
  <v-layout row wrap class="pa-2">
    <v-flex lg12 class="mt-12">
      <v-card class="black--text elevation-5">
        <v-layout>
          <v-flex lg12>
            <v-card-title class="headline grey lighten-3 pa-1 ma-0" primary-title>Sale Quotations</v-card-title>
            <v-btn flat @click="post">save</v-btn>

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
                        >Sale Quotation</v-card-title>
                        <v-divider></v-divider>
                        <v-layout>
                          <v-flex lg2 class="pa-1">
                            Customer Name
                            <br />
                            <auto-complete
                              :isAsync="true"
                              :apiUrl="'SaleQuotation/GetCustomer?pSearch='"
                              v-on:input="onChildClickAutoCompelete"
                            />
                          </v-flex>
                          <v-flex class="pa-1">
                            Number
                            <br />
                            <input v-model="editedItem.Number" />
                          </v-flex>
                          <v-flex class="pa-1">
                            Date Sale
                            <br />
                            <input type="date" v-model="editedItem.Number" />
                          </v-flex>
                          <v-flex class="pa-1">
                            Expiry Date
                            <br />
                            <input type="date" v-model="editedItem.ExpiryDate" />
                          </v-flex>
                          <v-flex class="pa-1">
                            Reference
                            <br />
                            <input v-model="editedItem.Reference" />
                          </v-flex>
                          <v-flex class="pa-1">
                            Branch
                            <br />
                            <select v-model="editedItem.selectBranch">
                              <option
                                v-for="option in editedItem.itemsBranch"
                                v-bind:value="option.value"
                              >{{ option.text }}</option>
                            </select>
                          </v-flex>
                        </v-layout>
                        <v-layout>
                          <v-flex lg2 class="pa-1">
                            <v-text-field v-model="editedItem.SalesManId" label="Salesman"></v-text-field>
                          </v-flex>
                          <v-flex lg2 class="pa-1">
                            Currency
                            <br />
                            <select v-model="editedItem.selectCurrency">
                              <option
                                v-for="option in editedItem.itemsCurrency"
                                v-bind:value="option.value"
                              >{{ option.text }}</option>
                            </select>
                          </v-flex>
                        </v-layout>
                        <v-layout>
                          <v-flex lg12 class="pa-1">
                            Babar
                            {{this.editedItem.selectProduct}}
                            {{this.editedItem.itemsProduct}}
                            <table-inline
                              :objData="editedItem.itemsProduct"
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
import DatePicker from "../../../../components/control/DatePickerFrom";
import AutoComplete from "../../../../components/control/AutoCompelete/AutoCompelete";

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
      editedItem: {
        DateCreated: "03/11/2020",
        ExpiryDate: "03/11/2020",
        Number: "SQ-101",
        Reference: "First customer",
        autoCompelete: "",
        selectBranch: null,
        itemsBranch: [],

        selectCurrency: null,
        itemsCurrency: [],

        selectProduct: null,
        itemsProduct: [],

        saleQuotationDetail: []
      },

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
  },
  methods: {
    getGroupBranches() {
      axios({
        method: "get",
        url: this.$urlApplication + "SaleQuotation/GetGroupBranches"
      })
        .then(res => {
          this.editedItem.itemsBranch = [];
          var isTrue = true;
          for (let items of res.data) {
            var result = {
              value: items.value,
              text: items.text
            };
            if (isTrue) {
              this.editedItem.selectBranch = result;
              isTrue = false;
            }
            this.editedItem.itemsBranch.push(result);
          }
        })
        .catch(error => {});
    },
    getCurrencies() {
      axios({
        method: "get",
        url: this.$urlApplication + "SaleQuotation/GetCurrencies"
      })
        .then(res => {
          this.itemsCurrency = [];
          var isTrue = true;
          for (let items of res.data) {
            var result = {
              value: items.value,
              text: items.text
            };
            if (isTrue) {
              this.editedItem.selectCurrency = result;
              isTrue = false;
            }
            this.editedItem.itemsCurrency.push(result);
          }
        })
        .catch(error => {});
    },

    getProducts() {
      axios({
        method: "get",
        url: this.$urlApplication + "SaleQuotation/GetProducts"
      })
        .then(res => {
          this.editedItem.itemsProduct = [];
          var isTrue = true;
          for (let items of res.data) {
            var result = {
              value: items.value,
              text: items.text
            };
            if (isTrue) {
              this.editedItem.selectProduct = result;
              isTrue = false;
            }
            this.editedItem.itemsProduct.push(result);
          }
        })
        .catch(error => {});
    },
    post() {
      var obj = this.editedItem;
      obj.CustomerId = this.editedItem.autoCompelete.split("~")[1];
      obj.BranchId = this.editedItem.selectBranch.value;
      obj.CurrencyId = this.editedItem.selectCurrency.value;
      obj.SalesManId = 1;
      obj.CompanyId = 1;

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

    put() {
      var obj = this.editedItem;
      obj.CompanyId = 1;
      obj.SaleQuotationId = this.editedItem.SaleQuotationId;
      obj.Name = this.editedItem.Name;
      obj.ProductId = this.editedItem.tableRow.Product.value;
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
    clear() {
      this.editedItem.SaleQuotationName = "";
      this.editedItem.Name = "";
    },
    editItem(item) {
      var obj = item;
      //1
      for (var items of this.editedItem.itemsProduct) {
        if (obj.ProductId == items.value) {
          debugger
          this.editedItem.selectProduct = {
            value: items.value,
            text: items.text
          };
          break;
        }
      }
      // this.editedItem.SaleQuotationId = obj.SaleQuotationId;
      // this.editedItem.CompanyId = obj.CompanyId;
      // this.editedItem.CustomerId = obj.CustomerId;
      // this.editedItem.Number = obj.Number;
      // this.editedItem.DateSale = obj.DateSale;
      // this.editedItem.ExpiryDate = obj.ExpiryDate;
      // this.editedItem.Reference = obj.Reference;
      // this.editedItem.BranchId = obj.BranchId;
      // this.editedItem.SalePersonId = obj.SalePersonId;
      // this.editedItem.CurrencyId = obj.CurrencyId;
      // this.editedItem.Term = obj.Term;
      // this.editedItem.AttachedId = obj.AttachedId;
      // this.editedItem.IsDeleted = obj.IsDeleted;
      // this.editedItem.IsActive = obj.IsActive;
      // this.editedItem.Created = obj.Created;
      // this.editedItem.CreatedBy = obj.CreatedBy;
      // this.editedItem.Modified = obj.Modified;
      // this.editedItem.ModifiedBy = obj.ModifiedBy;
      // this.editedItem.GrossAmount = obj.GrossAmount;
      // this.editedItem.NetAmount = obj.NetAmount;
      // this.editedItem.SettingStatusId = obj.SettingStatusId;
      debugger;
      this.editedIndex = this.listOfRecords.indexOf(item);
      this.editedItem = Object.assign({}, item);
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
        this.editedItem.Active = true;
        this.clear();
      } else {
        //Edite Record
        //this.changeSaleQuotations(this.selectSaleQuotations);
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
.txtRequired {
  border: 1px solid red;
  border-radius: 4px;
}
input {
  border: 1px solid gray;
  border-radius: 4px;
}
</style>