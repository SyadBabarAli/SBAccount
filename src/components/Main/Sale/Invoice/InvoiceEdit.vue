<template>
  <v-layout row wrap class="pa-2">
    <v-flex lg12 class="mt-12">
      <v-card class="black--text elevation-5">
        <v-layout>
          <v-flex lg12>
            <v-card-title class="headline grey lighten-3 pa-1 ma-0" primary-title>
              Sale Invoice - {{this.editedItem.SaleInvoiceId}} - {{this.editedItem.StatusName}}
              <v-toolbar-items>
                <v-btn flat color="colorLight" @click="post" v-if="this.$route.query.id == 0">save</v-btn>
                <v-btn flat color="colorLight" @click="put" v-if="this.$route.query.id > 0">update</v-btn>
                <v-btn flat color="colorLight" @click="clear">clear</v-btn>
                <v-btn flat color="colorLight" to="/Invoice">close</v-btn>
              </v-toolbar-items>
            </v-card-title>
            <v-card>
              <v-layout>
                <v-flex lg2 class="pa-1">
                  <auto-complete
                    :Name="this.editedItem.CustomerName"
                    :isAsync="true"
                    :apiUrl="'SaleInvoice/GetCustomer?pSearch='"
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
                    label="Invoice Date"
                    placeholder="Placeholder"
                    :append-icon="'today'"
                    type="date"
                    :value="InvoiceDate && InvoiceDate.toISOString().split('T')[0]"
                  ></v-text-field>
                </v-flex>
                <v-flex class="pa-1">
                  <v-text-field
                    label="Invoice Due Date"
                    placeholder="Placeholder"
                    :append-icon="'today'"
                    type="date"
                    :value="InvoiceDueDate && InvoiceDueDate.toISOString().split('T')[0]"
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
                  <select v-model="editedItem.selectBranch" style="width:100%">
                    <option
                      v-for="option in editedItem.itemsBranch "
                      v-bind:value="option"
                    >{{ option.Name }}</option>
                  </select>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex lg2 class="pa-1">
                  Sales Person
                  <br />
                  <select v-model="editedItem.selectSalePerson" style="width:100%">
                    <option
                      v-for="option in editedItem.itemsSalePerson"
                      v-bind:value="option"
                    >{{ option.SalePersonName }}</option>
                  </select>
                </v-flex>
                <v-flex lg2 class="pa-1">
                  Currency
                  <br />
                  <select v-model="editedItem.selectCurrency" style="width:100%">
                    <option
                      v-for="option in editedItem.itemsCurrency"
                      v-bind:value="option"
                    >{{ option.Name }}</option>
                  </select>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex lg12 class="pa-1">
                  <table-inline
                    :objWarehouse="editedItem.itemsWarehouse"
                    :tableRows="listOfRecordDetails"
                    v-on:childToParent="onChildClick"
                  />
                </v-flex>
              </v-layout>

              <v-layout class="pa-1">
                <v-flex lg4>
                  <v-textarea
                    name="input-7-1"
                    label="Comments"
                    v-model="editedItem.Comments"
                    hint="Hint text"
                  ></v-textarea>
                </v-flex>
                <v-flex lg4></v-flex>
                <v-flex lg4>
                  <v-layout>
                    <v-flex lg6 class="font-weight-regular">Gross {{editedItem.GrossAmount}}</v-flex>
                    <v-flex lg6>
                      <input type="text" v-model="editedItem.GrossAmount" class="txtRight" />
                    </v-flex>
                  </v-layout>
                  <v-layout>
                    <v-flex lg4 class="font-weight-regular">Discount</v-flex>
                    <v-flex lg4>
                      <input
                        type="number"
                        min="0"
                        step=".01"
                        v-model="editedItem.DiscountPercent"
                        v-on:change="calcDiscount(editedItem.DiscountPercent)"
                        class="txtRight"
                      />
                    </v-flex>
                    <v-flex lg4>
                      <input
                        type="text"
                        class="txtRight"
                        v-model="editedItem.DiscountAmount"
                        v-on:change="calcDiscountAmount(editedItem.DiscountAmount)"
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
                      <input type="text" class="txtRight" v-model="editedItem.NetAmount" />
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-card>
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
import TableInline from "../../../../components/control/Grid/TableInlineInvoice";
import AutoComplete from "../../../../components/control/AutoCompelete/AutoCompelete";

export default {
  mixins: [mixins],
  components: {
    ButtonSmall,
    TableInline,
    AutoComplete
  },
  data() {
    return {
      InvoiceDate: new Date(),
      InvoiceDueDate: new Date(),

      editedItem: {
        InvoiceDate: new Date(),
        InvoiceDueDate: new Date(),
        Number: "",
        Reference: "",
        AutoCompelete: "",
        Comments: "",
        saleInvoiceDetail: [],
        tableDetail: [],
        GrossAmount: 101,
        DiscountPercent: 0,
        DiscountAmount: 0,
        NetAmount: 0,
        TaxAmount: 0,
        selectBranch: null,
        itemsBranch: [],
        selectSalePerson: null,
        itemsSalePerson: [],
        selectCurrency: null,
        itemsCurrency: [],
        selectWarehouse: null,
        itemsWarehouse: []
      },

      isLoading: true,
      IsSnackBar: false,
      listOfRecordDetails: []
    };
  },

  mounted: function() {
    this.editItem(this.$route.query.id);
  },
  methods: {
    onChildClick(obj) {
      if (obj != null) {
        this.editedItem.saleInvoiceDetail = obj.tableRow;
        this.editedItem.GrossAmount = obj.subTotal;
        this.editedItem.NetAmount = obj.total;
      }
    },
    onChildClickAutoCompelete(value) {
      this.editedItem.AutoCompelete = value;
      this.editedItem.CustomerId = value.split("~")[1];
    },

    async tableLoadDetail(id) {
      let response = await axios.get(
        //this.$urlApplication + "SaleInvoice/GetSaleInvoiceDetails?id=" + id
        this.$urlApplication + "SaleInvoice/" + id
      );
      if (id == 0) {
        this.getProposedNumber();
      }

      var data = response.data;
      this.editedItem = data;

      this.listOfRecordDetails = data.saleInvoiceDetailModel;
      this.editedItem.saleInvoiceDetail = data.saleInvoiceDetailModel;

      this.editedItem.GroupBranchId = data.GroupBranchId;
      this.editedItem.itemsBranch = data.groupBranchModel;

      this.editedItem.selectBranch = this.refillSelect2(
        this.editedItem.GroupBranchId,
        data.groupBranchModel,
        "GroupBranchId"
      );

      this.editedItem.SalePersonId = data.SalePersonId;
      this.editedItem.itemsSalePerson = data.salePersonModel;
      this.editedItem.selectSalePerson = this.refillSelect2(
        this.editedItem.SalePersonId,
        data.salePersonModel,
        "SalePersonId"
      );

      this.editedItem.CurrencyId = data.CurrencyId;
      this.editedItem.itemsCurrency = data.currencyModel;
      this.editedItem.selectCurrency = this.refillSelect2(
        data.CurrencyId,
        data.currencyModel,
        "CurrencyId"
      );

      this.editedItem.GeneralWarehouseId = data.GeneralWarehouseId;
      this.editedItem.itemsWarehouse = data.generalWarehouseModel;
      this.editedItem.selectWarehouse = this.refillSelect2(
        data.GeneralWarehouseId,
        data.generalWarehouseModel,
        "GeneralWarehouseId"
      );
    },
    post() {
      this.editedItem.GroupBranchId = this.editedItem.selectBranch.GroupBranchId;
      this.editedItem.SalePersonId = this.editedItem.selectSalePerson.SalePersonId;
      this.editedItem.CurrencyId = this.editedItem.selectCurrency.CurrencyId;
      this.editedItem.InvoiceDate = this.InvoiceDate;
      this.editedItem.InvoiceDueDate = this.InvoiceDueDate;
      this.IsSnackBar = true;

      axios({
        method: "post",
        url: this.$urlApplication + "SaleInvoice/Post",
        data: this.editedItem
      })
        .then(res => {
          this.$router.push("/Invoice");
          this.IsSnackBar = false;
        })
        .catch(error => {
          this.IsSnackBar = false;
        });
    },
    put() {
      this.editedItem.GroupBranchId = this.editedItem.selectBranch.GroupBranchId;
      this.editedItem.SalePersonId = this.editedItem.selectSalePerson.SalePersonId;
      this.editedItem.CurrencyId = this.editedItem.selectCurrency.CurrencyId;
      this.editedItem.InvoiceDate = this.InvoiceDate;
      this.editedItem.InvoiceDueDate = this.InvoiceDueDate;

      this.IsSnackBar = true;

      axios({
        method: "put",
        url:
          this.$urlApplication +
          "SaleInvoice/Put?id=" +
          this.editedItem.SaleInvoiceId,
        data: this.editedItem
      })
        .then(res => {
          this.$router.push("/Invoice");
          this.IsSnackBar = false;
        })
        .catch(error => {
          this.IsSnackBar = false;
        });
    },

    editItem(item) {
      if (item != null) {
        this.tableLoadDetail(this.$route.query.id);
      }
    },
    clear() {
      this.listOfRecordDetails = [];
      this.AutoCompelete = "";
      this.editedItem.InvoiceDueDate = new Date();
      this.editedItem.InvoiceDate = new Date();

      this.editedItem.CustomerName = "";
      this.editedItem.Number = "";
      this.editedItem.Reference = "";
      this.editedItem.SalePersonId = "";
      this.editedItem.SettingStatusId = "";
      this.editedItem.CompanyId = "";
      this.editedItem.SaleInvoiceId = "";
      this.editedItem.Name = "";
      this.editedItem.Comments = "";
      this.editedItem.IsDeleted = false;
      this.editedItem.IsActive = true;
      this.editedItem.saleInvoiceDetail = [];

      this.editedItem.GrossAmount = "";
      this.editedItem.DiscountPercent = "";
      this.editedItem.DiscountAmount = "";
      this.editedItem.NetAmount = "";
    },
    async getProposedNumber() {
      const res = await axios
        .get(this.$urlApplication + "SaleInvoice/GetProposedNumber")
        .then(res => {
          this.editedItem.Number = res.data;
        })
        .catch(error => {});
    },
    calcDiscount() {
      this.editedItem.DiscountAmount = 0;
      var value = this.editedItem.GrossAmount;
      var discount = this.editedItem.DiscountPercent;
      var result = null;
      value = value - value * (parseFloat(discount) / 100);
      if (!isNaN(value)) {
        result = value.toFixed(2);
      }
      this.editedItem.NetAmount = result;
    },

    calcDiscountAmount() {
      this.editedItem.DiscountPercent = 0;
      var value = this.editedItem.GrossAmount;
      var discount = this.editedItem.DiscountAmount;
      var result = value - discount;
      this.editedItem.NetAmount = result;
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