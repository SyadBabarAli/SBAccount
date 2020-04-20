<template>
  <div>
    <table id="csmTable">
      <thead>
        <th class="txtLeft">Account</th>
        <th class="txtLeft">Description</th>
        <th class="txtRight">Debit</th>
        <th class="txtRight">Credit</th>
        <th class="txtRight">Contact</th>
        <th class="txtCenter">Action</th>
      </thead>
      <tbody>
        <tr v-for="(items, index) in tableRow" :key="index">
          <td class="txtLeft">{{items.AccountName}}</td>
          <td class="txtLeft">{{items.Description}}</td>
          <td class="txtRight">{{items.Debit}}</td>
          <td class="txtRight">{{items.Credit}}</td>
          <td class="txtRight">{{items.CustomerName}}</td>
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
            <input
              type="number"
              min="0"
              step=".01"
              v-model="Debit"
              class="txtRight"
              v-on:blur="refreshData"
            />
          </td>
          <td>
            <input
              type="number"
              min="0"
              step=".01"
              v-model="Credit"
              class="txtRight"
              v-on:blur="refreshData"
            />
          </td>
          <td>
            <auto-complete
              :Name="CustomerName"
              :isAsync="true"
              :apiUrl="'SaleInvoice/GetCustomer?pSearch='"
              v-on:input="onChildClickAutoCompelete"
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
      <tfoot>
        <tr>
          <td class="txtRight">Total(Rs)</td>
          <td></td>
          <td class="txtRight">{{this.totalDebit}}</td>
          <td class="txtRight">{{this.totalCredit}}</td>
          <td></td>
          <td></td>
        </tr>
      </tfoot>
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
      selectSettingAccount: null,
      itemsSettingAccount: null,
      Description: "",
      CustomerName: "",
      Debit: 0,
      Credit: 0,
      ListCustomerContactId: 0,
      totalDebit: 0,
      totalCredit: 0,
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
      this.ListCustomerContactId = obj.split("~")[1];
      this.CustomerName = obj.split("~")[0];
    },
    calculateTotal() {
      var totalDebit = 0,
        totalCredit = 0;
      this.tableRow.map(function(value, key) {
        totalDebit += parseInt(value["Debit"]);
        totalCredit += parseInt(value["Credit"]);
      });

      this.totalDebit = this.convInt(totalDebit) + this.convInt(this.Debit);
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
      var SettingAccountId = this.selectSettingAccount.SettingAccountId;
      var AccountName = this.selectSettingAccount.Name;
      var Description = this.Description;
      var Debit = this.Debit;
      var Credit = this.Credit;
      var ListCustomerContactId = this.ListCustomerContactId;
      var CustomerName = this.CustomerName;

      this.tableRow.push({
        SettingAccountId: SettingAccountId,
        AccountName: AccountName,
        Description: Description,
        Debit: Debit,
        Credit: Credit,
        ListCustomerContactId: ListCustomerContactId,
        CustomerName: CustomerName
      });

      this.tableRowCompelete = {
        tableRow: this.tableRow
      };

      this.AccountName = "";
      this.Description = "";
      this.Debit = "";
      this.Credit = "";
      this.CustomerName = "";

      this.refreshData();
    },
    refreshData() {
      this.calculateTotal();
      this.tableRowCompelete = {
        tableRow: this.tableRow,
        Amount: this.totalDebit
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