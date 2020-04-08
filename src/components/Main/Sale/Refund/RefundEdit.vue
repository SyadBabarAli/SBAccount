<template>
  <v-layout row wrap class="pa-2">
    <v-flex lg12 class="mt-12">
      <v-card class="black--text elevation-5">
        <v-layout>
          <v-flex lg12>
            <v-card-title class="headline grey lighten-3 pa-1 ma-0" primary-title>
              Sale Refund - {{this.editedItem.SaleRecurringInvoiceId}} - {{this.editedItem.StatusName}}
              <v-toolbar-items>
                <v-btn flat color="colorLight" @click="post" v-if="this.$route.query.id == 0">save</v-btn>
                <v-btn flat color="colorLight" @click="put" v-if="this.$route.query.id > 0">update</v-btn>
                <v-btn flat color="colorLight" @click="clear">clear</v-btn>
                <v-btn flat color="colorLight" to="/Refund">close</v-btn>
              </v-toolbar-items>
            </v-card-title>
            <v-card>
              <v-layout>
                <v-flex lg4 class="pa-1">
                  <auto-complete
                    :Name="this.editedItem.CustomerName"
                    :isAsync="true"
                    :apiUrl="'SaleRefund/GetCustomer?pSearch='"
                    v-on:input="onChildClickAutoCompelete"
                  />
                  <input readonly v-model="editedItem.CustomerId" style="display:none;" />
                </v-flex>

                <v-flex lg2 class="pa-1">
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

                <v-flex lg3 class="pa-1">
                  <v-text-field
                    label="Date*"
                    placeholder="Placeholder"
                    :append-icon="'today'"
                    type="date"
                    :value="SaleRefundDate && SaleRefundDate.toISOString().split('T')[0]"
                  ></v-text-field>
                </v-flex>
                <v-flex lg2 class="pa-1">
                  <v-text-field
                    label="Reference"
                    placeholder="Placeholder"
                    v-model="editedItem.Reference"
                  ></v-text-field>
                </v-flex>
                <v-flex lg2 class="pa-1">
                  Invoice Status
                  <br />
                  <select v-bind:value="editedItem.selectSettingStatus" style="width:100%">
                    <option
                      v-for="option in editedItem.itemsSettingStatus"
                      v-bind:value="option"
                    >{{ option.Name }}</option>
                  </select>
                </v-flex>
              </v-layout>

              <v-layout>
                <v-flex lg12 class="pa-1">
                  <table-inline
                    :paymentModeItems="editItem.itemsSettingPaymentMode"
                    :tableRows="listOfRecordDetails"
                    v-on:childToParent="onChildClick"
                  />
                </v-flex>
              </v-layout>

              <v-layout class="pa-1">
                <v-flex lg4>
                  <v-textarea
                    name="input-7-1"
                    label="Comment"
                    v-model="editedItem.Comment"
                    hint="Hint text"
                  ></v-textarea>
                </v-flex>
                <v-flex lg4></v-flex>
                <v-flex lg4>
                  <v-layout>
                    <v-flex lg6 class="font-weight-medium">Total Amount (PKR)</v-flex>
                    <v-flex lg6>
                      <input type="text" class="txtRight" v-model="editedItem.TotalAmount" />
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
import TableInline from "../../../../components/control/Grid/TableInlineSaleRefund";
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
      SaleRefundDate: new Date(),
      EndDate: new Date(),

      editedItem: {
        SaleRefundDate: new Date(),
        EndDate: new Date(),

        Number: "",
        Reference: "",
        AutoCompelete: "",
        Comment: "",
        SaleRefundDetail: [],
        tableDetail: [],
        TotalAmount: 0,

        SettingStatusId: 0,
        selectSettingStatus: null,
        itemsSettingStatus: [],
        SettingStatusId: 0,

        itemsSettingPaymentMode: []
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
        this.editedItem.saleRefundDetail = [];
        this.editedItem.SaleRefundDetail = obj.tableRow;
        this.editedItem.TotalAmount = obj.subTotal;
      }
    },
    onChildClickAutoCompelete(value) {
      this.editedItem.AutoCompelete = value;
      this.editedItem.CustomerId = value.split("~")[1];
    },

    async tableLoadDetail(id) {
      let response = await axios.get(this.$urlApplication + "SaleRefund/" + id);
      if (id == 0) {
        this.getProposedNumber();
      }
      var data = response.data;
      this.editedItem = data;

      this.listOfRecordDetails = data.saleRefundDetailModel;
      this.editedItem.saleRefundDetail = data.saleRefundDetailModel;
      this.editItem.itemsSettingPaymentMode = data.settingPaymentMode;

      this.editedItem.SettingStatusId = data.SettingStatusId;
      this.editedItem.itemsSettingStatus = data.settingStatus;
      this.editedItem.selectSettingStatus = this.refillSelect2(
        this.editedItem.SettingStatusId,
        data.settingStatus,
        "SettingStatusId"
      );
    },
    post() {
      this.editedItem.SettingStatusId = this.editedItem.selectSettingStatus.SettingStatusId;
      this.editedItem.Date = this.SaleRefundDate;
      this.IsSnackBar = true;

      axios({
        method: "post",
        url: this.$urlApplication + "SaleRefund/Post",
        data: this.editedItem
      })
        .then(res => {
          this.$router.push("/Refund");
          this.IsSnackBar = false;
        })
        .catch(error => {
          this.IsSnackBar = false;
        });
    },
    put() {
      this.editedItem.SettingStatusId = this.editedItem.selectSettingStatus.SettingStatusId;
      this.editedItem.Date = this.SaleRefundDate;

debugger
      this.IsSnackBar = true;

      axios({
        method: "put",
        url:
          this.$urlApplication + "SaleRefund/Put?id=" + +this.$route.query.id,
        data: this.editedItem
      })
        .then(res => {
          this.$router.push("/Refund");
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
      this.editedItem.Date = new Date();

      this.editedItem.CustomerName = "";
      this.editedItem.Number = "";
      this.editedItem.Reference = "";
      this.editedItem.SettingStatusId = "";
      this.editedItem.CompanyId = "";
      this.editedItem.Name = "";
      this.editedItem.Comment = "";
      this.editedItem.IsDeleted = false;
      this.editedItem.SaleRefundDetail = [];
      this.editedItem.TotalAmount = "";
    },
    async getProposedNumber() {
      const res = await axios
        .get(this.$urlApplication + "SaleRefund/GetProposedNumber")
        .then(res => {
          this.editedItem.Number = res.data;
        })
        .catch(error => {});
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