<template>
  <v-layout row wrap class="pa-2">
    <v-flex lg12 class="mt-12">
      <v-card class="black--text elevation-5">
        <v-layout>
          <v-flex lg12>
            <v-card-title class="headline grey lighten-3 pa-1 ma-0" primary-title>
              Stock Adjustment - {{this.editedItem.InventoryStockAdjustmentId}} - {{this.editedItem.StatusName}}
              <v-toolbar-items>
                <v-btn flat color="colorLight" @click="post" v-if="this.$route.query.id == 0">save</v-btn>
                <v-btn flat color="colorLight" @click="put" v-if="this.$route.query.id > 0">update</v-btn>
                <v-btn flat color="colorLight" @click="clear(editedItem)">clear</v-btn>
                <v-btn flat color="colorLight" :to="urlRoute">close</v-btn>
              </v-toolbar-items>
            </v-card-title>
            <v-card>
              <v-layout>
                <v-flex class="pa-1">
                  Adjustment Type
                  <br />
                  <select v-model="editedItem.selectAdjustmentType" style="width:100%">
                    <option
                      v-for="option in editedItem.itemsAdjustmentType "
                      v-bind:value="option"
                    >{{ option.Name }}</option>
                  </select>
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
                    :value="Date && CreatedDate.toISOString().split('T')[0]"
                  ></v-text-field>
                </v-flex>
                <v-flex class="pa-1">
                  <v-text-field
                    label="Reference"
                    placeholder="Placeholder"
                    v-model="editedItem.Reference"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex lg12 class="pa-1">
                  <table-inline
                    :list1="editedItem.itemsGeneralWarehouse"
                    :tableRows="editedItem.InventoryStockAdjustmentDetail"
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
import TableInline from "../../../../components/Main/Inventory/StockAdjustment/TableInlineStockAdjustment";
import AutoComplete from "../../../../components/control/AutoCompelete/AutoCompeleteHtml";

export default {
  mixins: [mixins],
  components: {
    ButtonSmall,
    TableInline,
    AutoComplete
  },
  data() {
    return {
      CreatedDate: new Date(),
      editedItem: {
        InventoryStockAdjustmentId: 0,
        selectAdjustmentType: null,
        itemsAdjustmentType: [],
        Number: "",
        Date: "",
        DueDate: "",
        Reference: "",
        Comment: "",
        NetAmount: "",
        itemsGeneralWarehouse: [],
        // InventoryStockAdjustmentId: 0,
        // Number: "",
        // Date: "",
        // Reference: "",
        // selectGeneralWarehouseFrom: null,
        // itemsGeneralWarehouseFrom: [],
        // selectGeneralWarehouseTo: null,
        // itemsGeneralWarehouseTo: [],
        // Comment: "",
        StatusName: "Draft",
        InventoryStockAdjustmentDetail: []
      },
      componentName: "InventoryStockAdjustment",
      urlRoute: "/StockAdjustment",
      isLoading: true,
      IsSnackBar: false
    };
  },
  methods: {
    onChildClick(obj) {
      if (obj != null) {
        this.editedItem.InventoryStockAdjustmentDetail = obj.tableRow;
        this.editedItem.Amount = obj.Amount;
      }
    }
    // onChildClickAutoCompelete(value) {
    //   this.editedItem.AutoCompelete = value;
    //   this.editedItem.ListCustomerContactId = value.split("~")[1];
    // }
  }
};
</script>