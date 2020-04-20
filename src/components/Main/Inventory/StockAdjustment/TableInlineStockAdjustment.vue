<template>
  <div>
    <table id="csmTable">
      <thead>
        <th class="txtRight">Product</th>
        <th class="txtRight">Warehouse</th>
        <th class="txtRight">Quantity</th>
        <th class="txtRight">Cost</th>
        <th class="txtRight">Net Amount</th>
        <th class="txtCenter">Action</th>
      </thead>
      <tbody>
        <tr v-for="(items, index) in tableRow" :key="index">
          <td class="txtLeft">
            {{items.ProductName}}
            <br />
            {{items.Description}}
          </td>
          <td>{{items.WarehouseName}}</td>
          <td class="txtRight">{{items.Quantity}}</td>
          <td class="txtRight">{{items.Cost}}</td>
          <td class="txtRight">{{items.NetAmount}}</td>
          <td class="txtCenter">
            <v-icon
              style="font-size:18px"
              onmouseover="this.style.color='red'"
              onmouseout="this.style.color='gray'"
              @click="deleteRow(index, items)"
              v-on:click="emitToParent"
            >delete</v-icon>
          </td>
        </tr>
        <!-- ------------------Break-------------------- -->
        <tr>
          <td>
            <auto-complete
              :Name="ProductName"
              :isAsync="true"
              :apiUrl="'SaleInvoice/GetProduct?pSearch='"
              v-on:input="onChildClickAutoCompelete"
            />
          </td>

          <td>
            <select v-model="selectGeneralWarehouse" style="width:100px">
              <option v-for="option in itemsGeneralWarehouse" v-bind:value="option">{{ option.Name }}</option>
            </select>
          </td>

          <td>
            <input
              type="number"
              min="0"
              step=".01"
              v-model="Quantity"
              class="txtRight"
              v-on:blur="refreshData"
            />
          </td>
          <td>
            <input
              type="number"
              min="0"
              step=".01"
              v-model="Cost"
              class="txtRight"
              v-on:blur="refreshData"
            />
          </td>
          <td>
            <input
              type="number"
              min="0"
              step=".01"
              v-model="NetAmount"
              class="txtRight"
              v-on:blur="refreshData"
            />
          </td>
          <td class="txtCenter">
            <v-icon
              style="font-size:18px"
              onmouseover="this.style.color='green'"
              onmouseout="this.style.color='gray'"
              @click="addNewRow"
              v-on:click="emitToParent"
            >edit</v-icon>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import AutoComplete from "../../../../components/control/AutoCompelete/AutoCompeleteHtml";
import { generalFunctions } from "../../../../mixins/Functions";

export default {
  mixins: [generalFunctions],
  components: {
    AutoComplete
  },
  props: ["list1", "tableRows"],
  data() {
    return {
      ListProductId: 0,
      ProductName: "",
      Description: "",
      selectGeneralWarehouse: null,
      itemsGeneralWarehouse: null,
      GeneralWarehouseId: 0,
      WarehouseName: "",
      Quantity: 0,
      Cost: 0,
      NetAmount: 0,
      totalNetAmount: 0,
      tableRow: [],
      tableRowCompelete: null
    };
  },
  watch: {
    tableRows: function() {
      this.tableRow = this.tableRows == undefined ? [] : this.tableRows;
    },
    list1: function() {
      this.itemsGeneralWarehouse = this.list1;
    }
  },
  methods: {
    onChildClickAutoCompelete(obj) {
      this.ListProductId = obj.split("~")[1];
      this.ProductName = obj.split("~")[0];
    },
    deleteRow(index, items) {
      var idx = this.tableRow.indexOf(items);
      console.log(idx, index);
      if (idx > -1) {
        this.tableRow.splice(idx, 1);
      }
      this.refreshData();
    },
    addNewRow() {
      var ListProductId = this.ListProductId;
      var ProductName = this.ProductName;
      var Description = this.Description;
      var GeneralWarehouseId = this.selectGeneralWarehouse.GeneralWarehouseId;
      var WarehouseName = this.selectGeneralWarehouse.Name;
      var Quantity = this.Quantity;
      var Cost = this.Cost;
      var NetAmount = this.NetAmount;

      this.tableRow.push({
        ListProductId: ListProductId,
        ProductName: ProductName,
        Description: Description,
        GeneralWarehouseId: GeneralWarehouseId,
        WarehouseName: WarehouseName,
        Quantity: Quantity,
        Cost: Cost,
        NetAmount: NetAmount
      });

      this.tableRowCompelete = {
        tableRow: this.tableRow
      };
      this.ProductName = "";
      this.Description = "";
      this.Cost = "";
      this.Quantity = "";
      this.NetAmount = "";

      this.refreshData();
    },
    refreshData() {
      this.tableRowCompelete = {
        tableRow: this.tableRow,
        NetAmount: this.totalNetAmount
      };
    },

    emitToParent(event) {
      this.$emit("childToParent", this.tableRowCompelete);
    }
  }
};
</script>
<style scoped>
#csmTable {
  /* font-family: "Trebuchet MS", Arial, Helvetica, sans-serif; */
  border-collapse: collapse;
  width: 100%;
}

#csmTable td,
#csmTable th {
  border: 1px solid #ddd;
  padding: 3px;
}

#csmTable tr:nth-child(even) {
  background-color: #f2f2f2;
}

#csmTable th {
  /* padding-top: 10px;
  padding-bottom: 10px; */
  text-align: left;
  background-color: white;
  color: black;
}
/* .table-bordered,
.table-bordered td,
.table-bordered th {
  border: 1px solid #dee2e6;
}

.table {
  width: 100%;
  max-width: 100%;
  margin-bottom: 1rem;
  background-color: transparent;
}
table {
  border-collapse: collapse;
}
.table td,
.table th {
  padding: 0.75rem 0.45rem !important;
}
.align-top-table td,
.align-top-table th {
  vertical-align: top !important;
} */
.txtRequired {
  border: 1px solid red;
  border-radius: 4px;
}
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
</style>