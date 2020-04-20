<template>
  <div>
    <table id="csmTable">
      <thead>
        <th class="txtRight">Product</th>
        <th class="txtRight">Quantity</th>
        <th class="txtCenter">Action</th>
      </thead>
      <tbody>
        <tr v-for="(items, index) in tableRow" :key="index">
          <td class="txtLeft">
            {{items.ProductName}}
            <br />
            {{items.Description}}
          </td>
          <td class="txtRight">{{items.Quantity}}</td>
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
            <input
              type="number"
              min="0"
              step=".01"
              v-model="Quantity"
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
      <!-- <tfoot>
        <tr>
          <td class="txtRight">Total(Rs)</td>
          <td></td>
          <td class="txtRight">{{this.totalQuantity}}</td>
          <td class="txtRight">{{this.totalCredit}}</td>
          <td></td>
          <td></td>
        </tr>
      </tfoot>-->
    </table>
  </div>
</template>
<script>
import AutoComplete from "../../../../components/control/AutoCompelete/AutoCompeleteHtml";
//import { mixins } from "../../../../mixins/Functions";
import { generalFunctions } from "../../../../mixins/Functions";

export default {
  mixins: [generalFunctions],
  components: {
    AutoComplete
  },
  props: ["objSettingAccount", "tableRows"],
  data() {
    return {
      Description: "",
      ProductName: "",
      Quantity: 0,
      ListProductId: 0,
      totalQuantity: 0,
      tableRow: [],
      tableRowCompelete: null
    };
  },
  watch: {
    tableRows: function() {
      this.tableRow = this.tableRows == undefined ? [] : this.tableRows;
    },
    objData: function() {
      this.itemsProduct = this.objData;
    },
    objSettingAccount: function() {
      this.itemsSettingAccount = this.objSettingAccount;
    }
  },
  methods: {
    onChildClickAutoCompelete(obj) {
      this.ListProductId = obj.split("~")[1];
      this.ProductName = obj.split("~")[0];
    },
    calculateTotal() {
      var totalQuantity = 0,
        totalCredit = 0;
      this.tableRow.map(function(value, key) {
        totalQuantity += parseInt(value["Quantity"]);
        totalCredit += parseInt(value["Credit"]);
      });

      this.totalQuantity =
        this.convInt(totalQuantity) + this.convInt(this.Quantity);
      this.totalCredit = this.convInt(totalCredit) + this.convInt(this.Credit);
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
      var ProductName = this.ProductName;
      var Description = this.Description;
      var Quantity = this.Quantity;
      var ListProductId = this.ListProductId;

      this.tableRow.push({
        ListProductId: ListProductId,
        ProductName: ProductName,
        Description: Description,
        Quantity: Quantity,
      });

      this.tableRowCompelete = {
        tableRow: this.tableRow
      };
      this.ProductName = "";
      this.Description = "";
      this.Quantity = "";

      this.refreshData();
    },
    refreshData() {
      //this.calculateTotal();
      this.tableRowCompelete = {
        tableRow: this.tableRow,
        Amount: this.totalQuantity
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