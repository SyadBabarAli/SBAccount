<template>
  <div>
    <table class="csmTable">
      <thead>
        <th class="txtLeft">Payment Mode</th>
        <th class="txtLeft">Account</th>
        <th class="txtLeft">Instrument No.</th>
        <th class="txtLeft">Amount</th>
        <th class="txtLeft">Action</th>
      </thead>
      <tbody>
        <tr v-for="(items, index) in tableRow" :key="index">
          <td class="txtLeft">{{items.PaymentMode}}</td>
          <td class="txtLeft">{{items.AccountName}}</td>
          <td class="txtLeft">{{items.DocumentNumber}}</td>
          <td class="txtRight">{{items.Amount}}</td>
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
            <select v-model="selectPaymentMode" style="width:100%">
              <option v-for="option in itemsPaymentMode" v-bind:value="option">{{ option.Name }}</option>
            </select>
          </td>
          <td>
            <select v-model="selectAccountType" style="width:100%">
              <option v-for="option in itemsAccountType" v-bind:value="option">{{ option.text }}</option>
            </select>
          </td>
          <td>
            <input type="text" v-model="DocumentNumber" />
          </td>
          <td>
            <input type="number" min="0" step=".01" v-model="Amount" class="txtRight" />
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
export default {
  props: ["paymentModeItems", "tableRows"],
  data() {
    return {
      selectPaymentMode: "",
      itemsPaymentMode: null,
      selectAccountType: "",
      itemsAccountType: [{ value: 201241, text: "Cash In Hand" }],
      DocumentNumber: "",
      Amount: "",

      table_subtotal: 0,
      table_total: 0,
      tableRow: [],
      tableRowCompelete: null
    };
  },
  mounted: function() {
    this.itemsPaymentMode = this.paymentModeItems;
  },
  watch: {
    paymentModeItems: function() {
      this.itemsPaymentMode = this.paymentModeItems;
    },
    tableRows: function() {
      this.tableRow = this.tableRows == undefined ? [] : this.tableRows;
    }
  },
  methods: {
    onChildClickAutoCompelete(obj) {
      this.PaymentMode = obj.text;
      this.AccountName = obj.value;
      this.Amount = obj.SalePrice;
    },
    calculateTotal() {
      var subtotal, total;
      if (this.tableRow != null && this.tableRow != undefined) {
        subtotal = this.tableRow.reduce(function(sum, product) {
          var lineTotal = parseFloat(product.Amount);
          if (!isNaN(lineTotal)) {
            return sum + lineTotal;
          }
        }, 0);
        this.table_subtotal = subtotal;
      }
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
      var PaymentModeId = this.selectPaymentMode.SettingPaymentModeId;
      var PaymentMode = this.selectPaymentMode.Name;

      var AccountId = this.selectAccountType.value;
      var AccountName = this.selectAccountType.text;

      var DocumentNumber = this.DocumentNumber;
      var Amount = this.Amount;

      this.tableRow.push({
        PaymentModeId: PaymentModeId,
        PaymentMode: PaymentMode,

        AccountId: AccountId,
        AccountName: AccountName,

        DocumentNumber: DocumentNumber,
        Amount: Amount
      });
      this.calculateTotal();

      this.tableRowCompelete = {
        tableRow: this.tableRow,
        subTotal: this.table_subtotal,
        total: this.table_total
      };

      this.DocumentNumber = "";
      this.Amount = "";
      this.refreshData();
    },
    refreshData() {
      this.calculateTotal();

      this.tableRowCompelete = {
        tableRow: this.tableRow,
        subTotal: this.table_subtotal,
        total: this.table_total
      };
    },

    emitToParent(event) {
      this.$emit("childToParent", this.tableRowCompelete);
    }
  }
};
</script>
<style scoped>
.csmTable {
  border-collapse: collapse;
  width: 100%;
}

.csmTable td,
.csmTable th {
  border: 1px solid #ddd;
  padding: 3px;
}

.csmTable tr:nth-child(even) {
  background-color: #f2f2f2;
}

.csmTable th {
  text-align: left;
  background-color: white;
  color: black;
}
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