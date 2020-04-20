<template>
  <div>
    <!-- {{tableRow}} -->
    <table id="csmTable">
      <thead>
        <th class="txtLeft">Payment Mode</th>
        <th class="txtLeft">Account</th>
        <th class="txtLeft">Reference</th>
        <th class="txtLeft">Bank Name</th>
        <th class="txtLeft">Instrument No.</th>
        <th class="txtLeft">Instrument Date</th>
        <th class="txtLeft">Amount</th>
        <th class="txtLeft">Action</th>
      </thead>
      <tbody>
        <tr v-for="(items, index) in tableRow" :key="index">
          <td class="txtLeft">{{items.PaymentMode}}</td>
          <td class="txtLeft">{{items.AccountName}}</td>
          <td class="txtLeft">{{items.Reference}}</td>
          <td class="txtLeft">{{items.BankName}}</td>
          <td class="txtLeft">{{items.Instrument}}</td>
          <td class="txtRight">{{items.InstrumentDate}}</td>
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
            <select v-model="selectPaymentMode" style="width:100px">
              <option v-for="option in itemsPaymentMode" v-bind:value="option">{{ option.Name }}</option>
            </select>
          </td>
          <td>
            <select v-model="selectAccountType" style="width:100px">
              <option v-for="option in itemsAccountType" v-bind:value="option">{{ option.text }}</option>
            </select>
          </td>
          <td>
            <input type="text" v-model="Reference" class="txtRight" />
          </td>
          <td>
            <input type="text" v-model="BankName" class="txtRight" />
          </td>
          <td>
            <input type="text" v-model="Instrument" class="txtRight" />
          </td>
          <td>
            <input
              type="date"
              :value="InstrumentDate && InstrumentDate.toISOString().split('T')[0]"
            />
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
      AutoCompelete: "",
      selectPaymentMode: "",
      itemsPaymentMode: null,
      selectAccountType: "",
      itemsAccountType: [{ value: 201241, text: "Cash In Hand" }],
      Reference: "",
      BankName: "",
      Instrument: "",
      InstrumentDate: new Date(),
      Amount: "",

      table_subtotal: 0,
      table_total: 0,
      tableRow: [],
      tableRowCompelete: null
    };
  },
  mounted: function() {
    this.itemsPaymentMode = this.paymentModeItems;
    //this.itemsAccountType = this.accountTypeItems;
    //this.tableRow = this.tableRows;
  },
  watch: {
    paymentModeItems: function() {
      this.itemsPaymentMode = this.paymentModeItems;
    },
    // accountTypeItems: function() {
    //   this.itemsAccountType = this.accountTypeItems;
    // },
    tableRows: function() {
      this.tableRow = this.tableRows == undefined ? [] : this.tableRows;
    }

    // DiscountAmount: function(val) {
    //   this.calculateLineTotal(this.tableRow);
    // }
  },
  methods: {
    onChildClickAutoCompelete(obj) {
      this.ProductName = obj.text;
      this.ProductId = obj.value;
      this.Price = obj.data.SalePrice;
      this.DiscountAmount = 0;
      this.Quantity = 1;
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
    // calculateLineTotal(items) {
    //   var items = this;
    //   if (items != null && items != undefined) {
    //     var Amount = items.Amount;
    //     var total = Amount;
    //     if (!isNaN(total)) {
    //       items.NetAmount = total;
    //     }
    //     this.calculateTotal();
    //   }
    // },
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

      var Reference = this.Reference;
      var BankName = this.BankName;
      var Instrument = this.Instrument;
      var InstrumentDate = this.InstrumentDate.toISOString().split("T")[0];
      var Amount = this.Amount;

      this.tableRow.push({
        PaymentModeId: PaymentModeId,
        PaymentMode: PaymentMode,

        AccountId: AccountId,
        AccountName: AccountName,

        Reference: Reference,
        BankName: BankName,
        Instrument: Instrument,
        InstrumentDate: InstrumentDate,
        Amount: Amount
      });
      this.calculateTotal();
      //this.calculateLineTotal(this.tableRow);

      this.tableRowCompelete = {
        tableRow: this.tableRow,
        subTotal: this.table_subtotal,
        total: this.table_total
      };

      this.Reference = "";
      this.BankName = "";
      this.Instrument = "";
      this.InstrumentDate = new Date();
      this.Amount = "";
      this.refreshData();
    },
    refreshData() {
      this.calculateTotal();
      //this.calculateLineTotal(this.tableRow);

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
#csmTable {
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