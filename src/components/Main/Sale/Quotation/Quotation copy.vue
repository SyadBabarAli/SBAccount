<template>
  <v-layout row wrap class="pa-2">
    <v-flex lg12 class="mt-12">
      <v-card class="black--text elevation-5">
        <v-layout>
          <v-flex lg12>
            <v-card-title class="headline grey lighten-3 pa-1 ma-0" primary-title>Sale Quotations</v-card-title>
            <v-btn flat @click="post">save</v-btn>
            <v-layout>
              <v-flex lg12 class="pa-0">{{this.editedItem}}</v-flex>
            </v-layout>
            <v-layout>
              <v-flex lg2 class="pa-1">
                <!-- Autocomplete -->
                Customer Name
                <br />
                <!-- - {{this.editedItem.autoCompelete}} -->
                <auto-complete
                  :isAsync="true"
                  :apiUrl="'SaleQuotation/GetCustomer?pSearch='"
                  v-on:input="onChildClickAutoCompelete"
                />
                <!-- <v-text-field v-model="editedItem.Name" label="Customer"></v-text-field> -->
              </v-flex>
              <v-flex class="pa-1">
                Number
                <br />
                <input v-model="editedItem.Number" />
                <!-- <v-text-field v-model="editedItem.Number" label="Number"></v-text-field> -->
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
                <!-- <select v-model="editedItem.selectBranch">
                  <option
                    v-for="option in editedItem.itemsBranch"
                    v-bind:value="option.value"
                  >{{ option.text }}</option>
                </select>-->
                <!-- <v-combobox
                  v-model="editedItem.selectBranch"
                  :items="editedItem.itemsBranch"
                  label="Branch"
                  item-text="text"
                  item-value="vaue"
                ></v-combobox>-->
                <!-- <v-text-field v-model="editedItem.Zip" label="Branch"></v-text-field> -->
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
                <!-- <v-combobox
                  v-model="editedItem.selectCurrency"
                  :items="editedItem.itemsCurrency"
                  label="Currency"
                  item-text="text"
                  item-value="vaue"
                ></v-combobox>-->
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex lg12 class="pa-1">
                <table-inline :objData="editedItem.itemsProduct" v-on:childToParent="onChildClick" />
              </v-flex>
            </v-layout>
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
      }
    };
  },
  watch: {},
  mounted: function() {
    this.getGroupBranches();
    this.getCurrencies();
    this.getProducts();
  },
  created: function() {},
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
      debugger;
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
          // this.IsSnackBar = false;
          // this.tableLoad();
          // this.close();
        })
        .catch(error => {
          //this.IsSnackBar = false;
        });
    },
    onChildClick(value) {
      this.editedItem.saleQuotationDetail = value.tableRow;

      //this.editedItem.saleQuotationDetail.Amount = parseInt(obj.saleQuotationDetail.Amount);
      //this.editedItem.saleQuotationDetail.CompanyId = 1;
    },
    onChildClickAutoCompelete(value) {
      this.editedItem.autoCompelete = value;
      this.editedItem.CustomerId = value.split("~")[1];
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