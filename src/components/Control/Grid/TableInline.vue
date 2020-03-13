<template>
  <div>
    <table class="v-table table-bordered">
      <thead>
        <th class="text-xs-left caption">ProductId</th>
        <th class="text-xs-left caption">Quantiy</th>
        <th class="text-xs-left caption">Price</th>
        <th class="text-xs-left caption">Discount</th>
        <th class="text-xs-left caption">Amount</th>
        <th class="text-xs-left caption">Action</th>
      </thead>
      <tbody>
        <tr v-for="(items, index) in tableRow" :key="index">
          <td>{{items.ProductId.text}}</td>
          <td>{{items.Quantity}}</td>
          <td>{{items.Price}}</td>
          <td>{{items.Discount}}</td>
          <td>{{items.Total}}</td>
          <td>
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
            <select
              v-model="selectProduct"
              v-bind:class="[validation.requiredProduct ? '': 'txtRequired' ]"
              style="width:100px"
            >
              <option v-for="option in itemsProduct" v-bind:value="option">{{ option.text }}</option>
            </select>
          </td>
          <td>
            <input
              type="number"
              min="0"
              maxlength="12"
              v-model="Quantity"
              @change="calculateLineTotal(tableRow)"
              v-bind:class="[this.validation.requiredQuantity ?  '': 'txtRequired' ]"
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
            />
          </td>
          <td>
            <input
              type="text"
              maxlength="12"
              min="0"
              v-model="Discount"
              @change="calculateLineTotal(tableRow)"
              @keypress="preventNumericInput($event)"
            />
          </td>
          <td>
            <input readonly type="number" min="0" step=".01" v-model="Total" />
          </td>
          <td>
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
  props: ["objData"],
  data() {
    return {
      selectProduct: null,
      itemsProduct: null,

      Quantity: "",
      Price: "",
      Discount: 0,
      Total: 0,
      validation: [
        { requiredName: false },
        { requiredQuantity: false },
        { requiredPrice: false },
        { requiredProduct: false }
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
  },
  watch: {
    objData: function() {
      this.itemsProduct = this.objData;
    },
    selectProduct: function(val) {
      this.validation.requiredProduct = this.isRequiredField(
        val,
        this.validation.requiredProduct
      );
    },
    Quantity: function(val) {
      this.validation.requiredQuantity = this.isRequiredField(
        val,
        this.validation.requiredQuantity
      );
    },
    Price: function(val) {
      this.validation.requiredPrice = this.isRequiredField(
        val,
        this.validation.requiredPrice
      );
    }
  },
  methods: {
    calculateTotal() {
      var subtotal, total;
      subtotal = this.tableRow.reduce(function(sum, product) {
        var lineTotal = parseFloat(product.Total);
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
        var Quantity = items.Quantity;
        var Discount = items.Discount;

        var total = parseFloat(Price) * parseFloat(Quantity);
        // //Discount Calculation
        total = total - total * (parseFloat(Discount) / 100);
        if (!isNaN(total)) {
          items.Total = total.toFixed(2);
        }
        this.calculateTotal();
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
      var ProductId = this.selectProduct.value;
      var Quantity = this.Quantity;
      var Price = this.Price;
      var Discount = this.Discount;
      var Total = this.Total;

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
        this.tableRow.push({
          ProductId: ProductId,
          Price: this.Price,
          Quantity: this.Quantity,
          Discount: this.Discount,
          Total: this.Total
        });
        this.calculateTotal();
        this.calculateLineTotal(this.tableRow);

        this.tableRowCompelete = {
          tableRow: this.tableRow,
          subTotal: this.table_subtotal,
          total: this.table_total
        };

        this.Discount = "";
        this.Name = "";
        this.Price = "";
        this.Quantity = "";
        this.Total = "";
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
.table-bordered,
.table-bordered td,
.table-bordered th {
  border: 1px solid #dee2e6;
}
/* Table Self Style*/
table.v-table tbody td:first-child,
table.v-table tbody td:not(:first-child),
table.v-table tbody th:first-child,
table.v-table tbody th:not(:first-child),
table.v-table thead td:first-child,
table.v-table thead td:not(:first-child),
table.v-table thead th:first-child,
table.v-table thead th:not(:first-child) {
  padding: 0 10px;
  width: inherit;
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 30px;
}
.txtRequired {
  border: 1px solid red;
  border-radius: 4px;
}
input,
select {
  border: 1px solid gray;
  border-radius: 4px;
  width: 100%;
  -moz-appearance: none;
  -webkit-appearance: none;
}

/* select.selector {
  width: 100px;
  border-style: solid;
} */
</style>