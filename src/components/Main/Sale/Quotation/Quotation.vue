<template>
  <v-layout row wrap class="pa-2">
    <v-flex lg12 class="mt-12">
      <v-card class="black--text elevation-5">
        <v-layout>
          <v-flex lg12>
            <v-card-title class="headline grey lighten-3 pa-1 ma-0" primary-title>Sale Quotations</v-card-title>
            <v-layout>
              <v-flex lg2 class="pa-1">
                <!-- Autocomplete -->
                Customer Name - {{this.autoCompelete}}
                <auto-complete
                  :isAsync="true"
                  :apiUrl="'SaleQuotation/GetCustomer?pSearch='"
                  v-on:input="onChildClickAutoCompelete"
                />
                <!-- <v-text-field v-model="editedItem.Name" label="Customer"></v-text-field> -->
              </v-flex>
              <v-flex class="pa-1">
                <v-text-field v-model="editedItem.AddressLine1" label="Number"></v-text-field>
              </v-flex>
              <v-flex class="pa-1">
                <input type="date" v-model="DateCreated" />

                <!-- <v-text-field v-model="editedItem.AddressLine2" label="Date"></v-text-field> -->
              </v-flex>
              <v-flex class="pa-1">
                <input type="date" v-model="ExpiryDate" />

                <!-- <date-picker /> -->
                <!-- <v-text-field v-model="editedItem.City" label="Expiry Date"></v-text-field> -->
              </v-flex>
              <v-flex class="pa-1">
                <v-text-field v-model="editedItem.State" label="Reference"></v-text-field>
              </v-flex>
              <v-flex class="pa-1">
                <v-combobox
                  v-model="selectBranch"
                  :items="itemsBranch"
                  label="Branch"
                  item-text="text"
                  item-value="vaue"
                ></v-combobox>
                <!-- <v-text-field v-model="editedItem.Zip" label="Branch"></v-text-field> -->
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex lg2 class="pa-1">
                <v-text-field v-model="editedItem.ContactPerson" label="Salesman"></v-text-field>
              </v-flex>
              <v-flex lg2 class="pa-1">
                <v-combobox
                  v-model="selectCurrency"
                  :items="itemsCurrency"
                  label="Currency"
                  item-text="text"
                  item-value="vaue"
                ></v-combobox>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex lg12 class="pa-1">
                <table-inline :objData="this.itemsBranch" v-on:childToParent="onChildClick" />
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex lg12 class="pa-0">{{this.tableRow}}</v-flex>
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
      DateCreated: "",
      ExpiryDate: "",
      autoCompelete: "",
      editedItem: {},
      defaultItem: {},
      selectBranch: null,
      itemsBranch: [],

      selectCurrency: null,
      itemsCurrency: [],

      
      tableRow: []
    };
  },
  watch: {},
  mounted: function() {
    this.getGroupBranches();
    this.getCurrencies();
  },
  created: function() {},
  methods: {
    getGroupBranches() {
      axios({
        method: "get",
        url: this.$urlApplication + "SaleQuotation/GetGroupBranches"
      })
        .then(res => {
          this.itemsBranch = [];
          var isTrue = true;
          for (let items of res.data) {
            var result = {
              value: items.value,
              text: items.text
            };
            if (isTrue) {
              this.selectBranch = result;
              isTrue = false;
            }
            this.itemsBranch.push(result);
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
              this.selectCurrency = result;
              isTrue = false;
            }
            this.itemsCurrency.push(result);
          }
        })
        .catch(error => {});
    },

    onChildClick(value) {
      this.tableRow = value;
    },
    onChildClickAutoCompelete(value) {
      this.autoCompelete = value;
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