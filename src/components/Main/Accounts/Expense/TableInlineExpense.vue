<template>
  <div>
    <table id="csmTable">
      <thead>
        <th class="txtLeft">Expense Account</th>
        <th class="txtLeft">Description</th>
        <th class="txtRight">Amount</th>
        <th class="txtCenter">Action</th>
      </thead>
      <tbody>
        <tr v-for="(items, index) in tableRow" :key="index">
          <td class="txtLeft">{{items.AccountName}}</td>
          <td class="txtLeft">{{items.Description}}</td>
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
            <select v-model="selectSettingAccount" style="width:100%">
              <option v-for="option in itemsSettingAccount" v-bind:value="option">{{ option.Name }}</option>
            </select>
          </td>
          <td>
            <input type="text" v-model="Description" class="txtLeft" />
          </td>
          <td>
            <input type="number" min="0" step=".01" v-model="NetAmount" class="txtRight" />
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

export default {
  components: {
    AutoComplete
  },
  props: ["objSettingAccount", "tableRows"],
  data() {
    return {
      selectSettingAccount: null,
      itemsSettingAccount: null,
      Description: "",
      NetAmount: 0,
      // validation: [
      //   { requiredName: false },
      //   //{ requiredQuantity: false },
      //   //{ requiredPrice: false },
      //   { requiredProduct: false },
      //   { requiredSettingAccount: false }
      // ],
      table_subtotal: 0,
      table_total: 0,
      table_tax: 0,
      tableRow: [],
      tableRowCompelete: null
    };
  },
  // mounted: function() {
  //   this.itemsSettingAccount = this.objSettingAccount;
  //   this.tableRow = this.tableRows == null ? [] : this.tableRows;
  // },
  watch: {
    // tableRows: function() {
    //   this.tableRow = this.tableRows;
    // },

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
      this.AutoCompelete = obj;

      this.SettingAccountId = obj.SettingAccountId;

      this.ProductName = obj.text;
      this.ProductId = obj.value;
      this.Price = obj.data.SalePrice;
      this.DiscountAmount = 0;
      this.Description = 1;
    },
    calculateTotal() {
      var subtotal, total;
      subtotal = this.tableRow.reduce(function(sum, product) {
        var lineTotal = parseFloat(product.NetAmount);
        if (!isNaN(lineTotal)) {
          return sum + lineTotal;
        }
      }, 0);
      this.table_subtotal = subtotal.toFixed(2);
      total = subtotal * (this.table_tax / 100) + subtotal;
      total = parseFloat(total);
      if (!isNaN(total)) {
        this.table_total = total.toFixed(2);
      } else {
        this.table_total = "0.00";
      }
    },
    calculateLineTotal(items) {
      var items = this;
      if (items != undefined) {
        var Price = items.Price;
        var Description = items.Description;
        var DiscountAmount = items.DiscountAmount;

        var total = parseFloat(Price) * parseFloat(Description);
        // //Discount Calculation
        total = total - total * (parseFloat(DiscountAmount) / 100);
        if (!isNaN(total)) {
          items.NetAmount = total.toFixed(2);
        }
        this.calculateTotal();
      }
      //this.emitToParent(obj);
    },
    deleteRow(index, items) {
      var idx = this.tableRow.indexOf(items);
      console.log(idx, index);
      if (idx > -1) {
        this.tableRow.splice(idx, 1);
      }
      this.calculateTotal();
      this.refreshData();
    },
    addNewRow() {
      var SettingAccountId = this.selectSettingAccount.SettingAccountId;
      var AccountName = this.selectSettingAccount.Name;
      var Description = this.Description;
      var NetAmount = this.NetAmount;

      this.tableRow.push({
        SettingAccountId: SettingAccountId,
        AccountName: AccountName,
        Description: Description,
        NetAmount: this.NetAmount
      });

      this.calculateTotal();
      this.calculateLineTotal(this.tableRow);

      this.tableRowCompelete = {
        tableRow: this.tableRow,
        subTotal: this.table_subtotal,
        total: this.table_total
      };

      this.AccountName = "";
      this.Description = "";
      this.NetAmount = "";
      this.refreshData();
    },
    refreshData() {
      this.calculateTotal();
      this.calculateLineTotal(this.tableRow);

      this.tableRowCompelete = {
        tableRow: this.tableRow,
        subTotal: this.table_subtotal,
        total: this.table_total
      };
    },

    //Inline Grid
    isRequiredField(pObj, pRequired) {
      var obj = pObj;
      var required = pRequired;
      var result = false;
      if (obj == undefined || obj.length == 0) {
        result = false;
      } else {
        result = true;
      }
      return result;
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