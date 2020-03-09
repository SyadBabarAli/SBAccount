<template>
  <v-layout row wrap class="pa-2">
    <v-flex lg12 class="mt-12">
      <v-card class="black--text elevation-5">
        <v-layout>
          <v-flex lg12>
            <v-card-title class="headline grey lighten-3 pa-1 ma-0" primary-title>Sale Quotations</v-card-title>

            <v-layout>
              <v-flex lg2 class="pa-1">
                <v-text-field v-model="editedItem.Name" label="Customer"></v-text-field>
              </v-flex>
              <v-flex class="pa-1">
                <v-text-field v-model="editedItem.AddressLine1" label="Number"></v-text-field>
              </v-flex>
              <v-flex class="pa-1">
                <v-text-field v-model="editedItem.AddressLine2" label="Date"></v-text-field>
              </v-flex>
              <v-flex class="pa-1">
                <date-picker/>
                <!-- <v-text-field v-model="editedItem.City" label="Expiry Date"></v-text-field> -->
              </v-flex>
              <v-flex class="pa-1">
                <v-text-field v-model="editedItem.State" label="Reference"></v-text-field>
              </v-flex>
              <v-flex class="pa-1">
                <v-text-field v-model="editedItem.Zip" label="Branch"></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex lg2 class="pa-1">
                <v-text-field v-model="editedItem.ContactPerson" label="Salesman"></v-text-field>
              </v-flex>
              <v-flex lg2 class="pa-1">
                <v-text-field v-model="editedItem.Email" label="Currency"></v-text-field>
              </v-flex>
             
            </v-layout>
            <v-layout>
              <v-flex lg12 class="pa-1">
                <table-inline :objData="this.itemsProduct" v-on:childToParent="onChildClick" />
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

export default {
  mixins: [mixins],
  components: {
    ButtonSmall,
    TableInline,
    DatePicker
  },
  data() {
    return {
      editedItem: {},
      defaultItem: {},
      selectProduct: null,
      itemsProduct: [],

      Product: "",
      Quantity: "",
      Price: "",
      Discount: 0,
      Total: 0,
      validation: [
        { requiredName: true },
        { requiredQuantity: true },
        { requiredPrice: true },
        { requiredProduct: true }
      ],
      table_subtotal: 0,
      table_total: 0,
      table_tax: 5,
      tableRow: []
    };
  },
  watch: {},
  mounted: function() {
    this.GetSettingCountries();
  },
  created: function() {},
  methods: {
    GetSettingCountries() {
      axios({
        method: "get",
        url: this.$urlApplication + "GeneralWarehouse/GetSettingCountries"
      })
        .then(res => {
          this.itemsProduct = [];
          var isTrue = true;
          for (let items of res.data) {
            var result = {
              value: items.value,
              text: items.text
            };
            if (isTrue) {
              this.selectProduct = result;
              isTrue = false;
            }
            this.itemsProduct.push(result);
          }
        })
        .catch(error => {});
    },
    onChildClick(value) {
      this.tableRow = value;
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