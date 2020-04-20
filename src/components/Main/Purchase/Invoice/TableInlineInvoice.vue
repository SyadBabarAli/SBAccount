<template>
  <div>
    <table id="csmTable">
      <thead>
        <th class="txtLeft">Product</th>
        <th class="txtLeft">Warehouse</th>
        <th class="txtRight">Quantity</th>
        <th class="txtRight">Price</th>
        <th class="txtRight">Discount</th>
        <th class="txtRight">Amount</th>
        <th class="txtCenter">Action</th>
      </thead>
      <tbody>
        <tr v-for="(items, index) in tableRow" :key="index">
          <td>
            {{items.ProductName}}
            <br />
            {{items.Description}}
          </td>
          <td>{{items.WarehouseName}}</td>
          <td class="txtRight">{{items.Quantity}}</td>
          <td class="txtRight">{{items.Price}}</td>
          <td class="txtRight">{{items.DiscountAmount}}</td>
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
            <input v-model="Description" />
          </td>
          <td>
            <select
              v-model="selectWarehouse"
              v-bind:class="[validation.requiredWarehouse ? '': 'txtRequired' ]"
              style="width:100px"
            >
              <option v-for="option in itemsWarehouse" v-bind:value="option">{{ option.Name }}</option>
            </select>
          </td>
          <td>
            <input
              type="number"
              min="0"
              maxlength="12"
              v-model="Quantity"
              v-on:change="calculateLineTotal(tableRow);"
              v-bind:class="[this.validation.requiredQuantity ? '': 'txtRequired' ]"
              class="txtRight"
            />
          </td>
          <td>
            <input
              type="number"
              min="0"
              maxlength="12"
              v-model="Price"
              @change="calculateLineTotal(tableRow)"
              v-bind:class="[this.validation.requiredPrice ?  '': 'txtRequired' ]"
              class="txtRight"
            />
          </td>
          <td>
            <input
              type="text"
              maxlength="12"
              min="0"
              v-model="DiscountAmount"
              @change="calculateLineTotal(tableRow)"
              @keypress="preventNumericInput($event)"
              class="txtRight"
            />
          </td>
          <td>
            <input readonly type="number" min="0" step=".01" v-model="NetAmount" class="txtRight" />
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
  props: ["objData", "objWarehouse", "tableRows"],
  data() {
    return {
      selectWarehouse: null,
      itemsWarehouse: null,

      AutoCompelete: "",
      ProductName: "",
      selectProduct: null,
      itemsProduct: null,
      Description: "",
      Quantity: "",
      Price: "",
      DiscountAmount: 0,
      NetAmount: 0,
      validation: [
        { requiredName: false },
        { requiredQuantity: false },
        { requiredPrice: false },
        { requiredProduct: false },
        { requiredWarehouse: false }
      ],
      table_subtotal: 0,
      table_total: 0,
      table_tax: 0,
      tableRow: [],
      tableRowCompelete: null
    };
  },
  mounted: function() {
    this.itemsProduct = this.objData;
    this.itemsWarehouse = this.objWarehouse;
    this.tableRow = this.tableRows == undefined ? [] : this.tableRows;
  },
  watch: {
    tableRows: function() {
      //this.tableRow = this.tableRows;
      this.tableRow = this.tableRows == undefined ? [] : this.tableRows;
    },
    objData: function() {
      this.itemsProduct = this.objData;
    },
    objWarehouse: function() {
      this.itemsWarehouse = this.objWarehouse;
    },
    selectProduct: function(val) {
      this.validation.requiredProduct = this.isRequiredField(
        val,
        this.validation.requiredProduct
      );
    },
    selectWarehouse: function(val) {
      this.validation.requiredWarehouse = this.isRequiredField(
        val,
        this.validation.requiredWarehouse
      );
    },
    Quantity: function(val) {
      this.validation.requiredQuantity = this.isRequiredField(
        val,
        this.validation.requiredQuantity
      );
      this.calculateLineTotal(this.tableRow);
    },
    Price: function(val) {
      this.validation.requiredPrice = this.isRequiredField(
        val,
        this.validation.requiredPrice
      );
      this.calculateLineTotal(this.tableRow);
    },
    DiscountAmount: function(val) {
      this.calculateLineTotal(this.tableRow);
    }
  },
  methods: {
    onChildClickAutoCompelete(obj) {
      this.AutoCompelete = obj;

      this.WarehouseId = obj.WarehouseId;

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
      }
    },
    calculateLineTotal(items) {
      var items = this;
      if (items != undefined) {
        var Price = items.Price;
        var Quantity = items.Quantity;
        var DiscountAmount = items.DiscountAmount;

        var total = parseFloat(Price) * parseFloat(Quantity);
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
      var ProductId = 0;
      var WarehouseId = this.selectWarehouse.WarehouseId;
      var WarehouseName = this.selectWarehouse.Name;

      var ProductName = "";
      var Quantity = this.Quantity;
      var Price = this.Price;
      var DiscountAmount = this.DiscountAmount;
      var NetAmount = this.NetAmount;
      var Description = this.Description;

      if (WarehouseId == undefined || WarehouseId.length == 0) {
        this.validation.requiredWarehouse = false;
      } else {
        this.validation.requiredWarehouse = true;
      }
      if (ProductId == undefined || ProductId.length == 0) {
        this.validation.requiredProduct = false;
      } else {
        this.validation.requiredProduct = true;
      }
      if (Quantity == undefined || Quantity.length == 0) {
        this.validation.requiredQuantity = false;
      } else {
        this.validation.requiredQuantity = true;
      }
      if (Price == undefined || Price.length == 0) {
        this.validation.requiredPrice = false;
      } else {
        this.validation.requiredPrice = true;
      }

      if (
        this.validation.requiredProduct &&
        this.validation.requiredQuantity &&
        this.validation.requiredPrice
      ) {
        ProductName = this.ProductName; // this.selectProduct.text;
        ProductId = this.ProductId; //this.selectProduct.value;

// var v1 = this.tableRow;
//         debugger

        
        this.tableRow.push({
          ProductId: ProductId,
          ProductName: ProductName,
          WarehouseId: WarehouseId,
          WarehouseName: WarehouseName,
          Description: Description,
          Price: this.Price,
          Quantity: this.Quantity,
          DiscountAmount: this.DiscountAmount,
          NetAmount: this.NetAmount
        });
        this.calculateTotal();
        this.calculateLineTotal(this.tableRow);

        this.tableRowCompelete = {
          tableRow: this.tableRow,
          subTotal: this.table_subtotal,
          total: this.table_total
        };

        this.DiscountAmount = "";
        this.Name = "";
        this.Description = "";
        this.Price = "";
        this.Quantity = "";
        this.NetAmount = "";
        this.refreshData();
      }
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
    // Triggered when `childToParent` event is emitted by the child.
    // Define the method that emits data to the parent as the first parameter to `$emit()`.
    // This is referenced in the <template> call in the parent. The second parameter is the payload.
    emitToParent(event) {
      this.$emit("childToParent", this.tableRowCompelete);
    },

    preventNumericInput(obj) {
      // var input = obj.target.value;
      // var result = 0;

      // if (input == null || input == undefined) {
      //   input = result;
      // } else {
      //   input = parseInt(input);
      //   if (input < 0) {
      //     obj.target.value = 0;
      //   }
      //   if (input > 100) {
      //     obj.target.value = 100;
      //   }
      // }

      var evt = obj.target;

      var iKeyCode = evt.which ? evt.which : evt.keyCode;
      if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57))
        return false;
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

/* #csmTable tr {
  padding-top: 10px;
  padding-bottom: 10px;
} */
/* 
#csmTable tr:hover {
  background-color: #ddd;
} */

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