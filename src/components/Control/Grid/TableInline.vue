<template>
  <div>
    <!-- {{this.objData}} -->
    <!-- <input id="child-input" type="text"  v-on:keyup="onClickButton"/> -->
    <!-- <input id="child-input" type="text" v-on:keyup="onClickButton " /> -->

    <table class="v-table table-bordered">
      <thead>
        <th class="text-xs-left caption">Product</th>
        <th class="text-xs-left caption">Quantiy</th>
        <th class="text-xs-left caption">Price</th>
        <th class="text-xs-left caption">Discount</th>
        <th class="text-xs-left caption">Amount</th>
        <th class="text-xs-left caption">Action</th>
      </thead>
      <tbody>
        <tr v-for="(items, index) in tableRow" :key="index">
          <td>{{items.Product.text}}</td>
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
            >delete</v-icon>
          </td>
        </tr>
        <!-- ------------------Break-------------------- -->
        <tr>
          <td>
            <select
              v-model="selectProduct"
              v-bind:class="[validation.requiredProduct ? '': 'txtRequired' ]"
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
              step=".01"
              v-model="Price"
              @change="calculateLineTotal(tableRow)"
              v-bind:class="[this.validation.requiredPrice ?  '': 'txtRequired' ]"
            />
          </td>
          <td>
            <input
              type="number"
              min="0"
              max="100"
              v-model="Discount"
              @change="calculateLineTotal(tableRow)"
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
    },
    addNewRow() {
      var Product = this.selectProduct.value;
      var Quantity = this.Quantity;
      var Price = this.Price;
      var Discount = this.Discount;
      var Total = this.Total;

      if (Product == undefined || Product.length == 0) {
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
          Product: this.selectProduct,
          Price: this.Price,
          Quantity: this.Quantity,
          Discount: this.Discount,
          Total: this.Total
        });

        this.Discount = "";
        this.Name = "";
        this.Price = "";
        this.Quantity = "";
        this.Total = "";
      }
    },

    //Inlin Grid
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
    onClickButton(event) {
      this.$emit("clicked", this.tableRow);
    }
    // emitToParent(event) {
    //   this.$emit("childToParent", this.tableRow);
    // }
  }
};
</script>
<style scoped>
.table-bordered,
.table-bordered td,
.table-bordered th {
  border: 1px solid #dee2e6;
}
table.v-table tbody td,
table.v-table tbody th {
  height: 30px;
}
.txtRequired {
  border: 1px solid red;
  border-radius: 4px;
}
input {
  border: 1px solid gray;
  border-radius: 4px;
}
</style>