<template>
  <v-layout class="pa-2">
    <v-flex xs12>
      <v-card class="black--text elevation-5">
        <v-layout row>
          <v-flex xs12>
            <v-card-title class="headline grey lighten-3 pa-1 ma-0" primary-title>Product</v-card-title>
            <v-card-title>
              <v-toolbar-title>Details</v-toolbar-title>
              <v-divider class="mx-2" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
              <v-dialog
                v-model="dialog"
                max-width="500px"
                scrollable
                persistent
                fullscreen
                hide-overlay
              >
                <v-btn slot="activator" color="primary" dark class="mb-2">Add</v-btn>
                <v-card>
                  <v-toolbar dark color="primary" dense>
                    <v-btn icon dark @click="close">
                      <v-icon>close</v-icon>
                    </v-btn>
                    <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                      <v-btn flat @click="post" v-show="this.editedIndex === -1 ? true : false">save</v-btn>
                      <v-btn
                        flat
                        @click="put"
                        v-show="this.editedIndex === -1 ? false : true"
                      >update</v-btn>
                      <v-btn flat @click="clear">clear</v-btn>
                      <v-btn flat @click="close">cancel</v-btn>
                    </v-toolbar-items>
                  </v-toolbar>
                  <v-card-text>
                    <v-container fluid>
                      <v-card class="elevation-10">
                        <v-card-title
                          class="headline grey lighten-3 pa-1 ma-0"
                          primary-title
                        >Product</v-card-title>
                        <v-divider></v-divider>
                        <v-tabs v-model="activeTab" color="colorDark" dark slider-color="yellow">
                          <v-tab v-for="n in 2" :key="n" ripple>{{ n==1 ? 'General' : 'Detail' }}</v-tab>
                          <v-tab-item v-for="n in 2" :key="n">
                            <v-card flat>
                              <v-card-text>
                                <div v-show="tabDetail">
                                  <v-layout row>
                                    <v-flex xs3>
                                      <v-combobox
                                        v-model="selectCategoryProduct"
                                        :items="itemsCategoryProduct"
                                        label="Product Category "
                                        item-text="text"
                                        item-value="vaue"
                                      ></v-combobox>
                                    </v-flex>

                                    <v-flex xs3>
                                      <v-combobox
                                        v-model="selectCategoryProductPrinciple"
                                        :items="itemsCategoryProductPrinciple"
                                        label="Principle"
                                        item-text="text"
                                        item-value="vaue"
                                      ></v-combobox>
                                    </v-flex>

                                    <v-flex xs3>
                                      <v-text-field
                                        placeholder="Placeholder"
                                        v-model="editedItem.Name"
                                        label="Product Short Name"
                                      ></v-text-field>
                                    </v-flex>
                                  </v-layout>

                                  <v-layout row>
                                    <v-flex xs3>
                                      <v-text-field
                                        placeholder="Placeholder"
                                        v-model="editedItem.SKU"
                                        label="SKU"
                                      ></v-text-field>
                                    </v-flex>

                                    <v-flex xs3>
                                      <v-text-field
                                        placeholder="Placeholder"
                                        v-model="editedItem.ProductBarcode"
                                        label="Product Barcode"
                                      ></v-text-field>
                                    </v-flex>

                                    <v-flex xs3>
                                      <v-combobox
                                        v-model="selectCategoryBrand"
                                        :items="itemsCategoryBrand"
                                        label="Brand"
                                        item-text="text"
                                        item-value="vaue"
                                      ></v-combobox>
                                    </v-flex>
                                  </v-layout>
                                  <v-layout row>
                                    <v-flex xs3>
                                      <v-text-field
                                        placeholder="Placeholder"
                                        v-model="editedItem.ModelNumber"
                                        label="Model Number"
                                      ></v-text-field>
                                    </v-flex>

                                    <!-- <v-flex xs3>
                                      <v-combobox
                                        v-model="selectHSCode"
                                        :items="itemsHSCode"
                                        label="HS Code"
                                        item-text="text"
                                        item-value="vaue"
                                      ></v-combobox>
                                    </v-flex>-->

                                    <v-flex xs3>
                                      <v-textarea
                                        solo
                                        label="Short Description"
                                        v-model="editedItem.ShortDescription"
                                        rows="2"
                                      ></v-textarea>
                                    </v-flex>
                                  </v-layout>
                                  <v-layout row>
                                    <v-flex xs3>
                                      <v-textarea
                                        solo
                                        label="Description"
                                        v-model="editedItem.Description"
                                        rows="3"
                                      ></v-textarea>
                                    </v-flex>
                                  </v-layout>
                                </div>

                                <div v-show="tabGeneral">
                                  <v-layout>
                                    <v-flex>
                                      <v-radio-group v-model="editedItem.SettingProductTypeId" row>
                                        <v-radio label="Product" :value="1" color="colorLight"></v-radio>
                                        <v-radio label="Services" :value="2" color="colorLight"></v-radio>
                                        <v-radio
                                          label="Product Assembly"
                                          :value="3"
                                          color="colorLight"
                                        ></v-radio>
                                      </v-radio-group>
                                    </v-flex>
                                  </v-layout>
                                  <v-layout row>
                                    <v-flex xs4>
                                      <input
                                        readonly
                                        v-model="editedItem.CompanyId"
                                        label="CompanyId"
                                        style="display:none"
                                      />
                                    </v-flex>
                                  </v-layout>
                                  <v-layout row>
                                    <v-flex xs4>
                                      <input
                                        readonly
                                        v-model="editedItem.ProductId"
                                        label="ProductId"
                                        style="display:none"
                                      />
                                    </v-flex>
                                  </v-layout>
                                  <v-layout row>
                                    <v-flex xs4>
                                      <v-text-field
                                        placeholder="Placeholder"
                                        v-model="editedItem.Code"
                                        label="Code"
                                      ></v-text-field>
                                    </v-flex>

                                    <v-flex xs4>
                                      <v-text-field
                                        placeholder="Placeholder"
                                        v-model="editedItem.Name"
                                        label="Name"
                                      ></v-text-field>
                                    </v-flex>

                                    <v-flex xs4>
                                      <v-combobox
                                        v-model="selectUnitOfMeasurement"
                                        :items="itemsUnitOfMeasurement"
                                        label="Unit Of Measurement"
                                        item-text="text"
                                        item-value="vaue"
                                      ></v-combobox>
                                    </v-flex>
                                  </v-layout>

                                  <v-layout row>
                                    <v-flex xs12>
                                      <v-checkbox
                                        dense
                                        color="colorDark"
                                        v-model="editedItem.FractionalUnit"
                                        label="Do you sell or purchase in fractional units? (e.g. 0.5 kg, 2.25 lt, etc.)"
                                      ></v-checkbox>
                                    </v-flex>
                                  </v-layout>

                                  <v-layout row>
                                    <v-flex xs12>
                                      <v-checkbox
                                        color="colorDark"
                                        v-model="editedItem.HasCalculationfield"
                                        label="Do you want to have a calculation field to calculate product quantity? (e.g. 10 * 10 = 100 sq.ft, 10 * 10 * 10 = 1000 cb.ft, etc.)"
                                      ></v-checkbox>
                                    </v-flex>
                                  </v-layout>

                                  <v-layout row>
                                    <v-flex xs12>
                                      <v-checkbox
                                        color="colorDark"
                                        v-model="editedItem.TrackInventory"
                                        label="Track Inventory (Cannot be changed once product created.)"
                                      ></v-checkbox>
                                    </v-flex>
                                  </v-layout>

                                  <v-layout row>
                                    <v-flex xs12>
                                      <v-checkbox
                                        color="colorDark"
                                        v-model="editedItem.HasBatch"
                                        label="Do you manage batch for this product? (Cannot be changed once product created.)"
                                      ></v-checkbox>
                                    </v-flex>
                                  </v-layout>

                                  <v-layout row>
                                    <v-flex xs12>
                                      <v-checkbox
                                        color="colorDark"
                                        v-model="editedItem.HasSerialnumber"
                                        label="Do you manage serial number for this product? (Cannot be changed once product created.)"
                                      ></v-checkbox>
                                    </v-flex>
                                  </v-layout>

                                  <v-layout row>
                                    <v-flex xs3>
                                      <v-text-field
                                        placeholder="Placeholder"
                                        v-model="editedItem.MinimumStockLevel"
                                        label="Minimum Stock Level"
                                      ></v-text-field>
                                    </v-flex>

                                    <v-flex xs3>
                                      <v-combobox
                                        v-model="selectInventoryAccount"
                                        :items="itemsInventoryAccount"
                                        label="Inventory Account"
                                        item-text="text"
                                        item-value="vaue"
                                      ></v-combobox>
                                    </v-flex>
                                  </v-layout>

                                  <v-layout row>
                                    <v-flex xs12>
                                      <v-checkbox
                                        color="colorDark"
                                        v-model="editedItem.IsForPurchase"
                                        label="Do you purchase this product?"
                                      ></v-checkbox>
                                    </v-flex>
                                  </v-layout>
                                  <v-layout row>
                                    <v-flex xs3>
                                      <v-text-field
                                        placeholder="Placeholder"
                                        v-model="editedItem.PurchasePrice"
                                        label="Purchase Price"
                                      ></v-text-field>
                                    </v-flex>
                                    <v-flex xs3>
                                      <v-combobox
                                        v-model="selectExpenseAccount"
                                        :items="itemsExpenseAccount"
                                        label="Expense Account"
                                        item-text="text"
                                        item-value="vaue"
                                      ></v-combobox>
                                    </v-flex>

                                    <v-flex xs3>
                                      <v-combobox
                                        v-model="selectPurchaseDiscountAccount"
                                        :items="itemsPurchaseDiscountAccount"
                                        label="Purchase Discount Account"
                                        item-text="text"
                                        item-value="vaue"
                                      ></v-combobox>
                                    </v-flex>
                                  </v-layout>
                                  <v-layout row>
                                    <v-flex xs3>
                                      <v-checkbox
                                        color="colorDark"
                                        v-model="editedItem.IsForSale"
                                        label="Do you sale this product?"
                                      ></v-checkbox>
                                    </v-flex>
                                  </v-layout>
                                  <v-layout row>
                                    <v-flex xs3>
                                      <v-text-field
                                        placeholder="Placeholder"
                                        v-model="editedItem.SalePrice"
                                        label="Sale Price"
                                      ></v-text-field>
                                    </v-flex>

                                    <v-flex xs3>
                                      <v-combobox
                                        v-model="selectSaleAccount"
                                        :items="itemsSaleAccount"
                                        label="Sale Account"
                                        item-text="text"
                                        item-value="vaue"
                                      ></v-combobox>
                                    </v-flex>
                                    <v-flex xs3>
                                      <v-combobox
                                        v-model="selectSaleDiscountAccount"
                                        :items="itemsSaleDiscountAccount"
                                        label="Sale Discount Account"
                                        item-text="text"
                                        item-value="vaue"
                                      ></v-combobox>
                                    </v-flex>
                                  </v-layout>
                                  <v-layout row>
                                    <v-flex xs3>
                                      <v-text-field
                                        placeholder="Placeholder"
                                        v-model="editedItem.MaximumRetailPrice"
                                        label="MaximumRetailPrice"
                                      ></v-text-field>
                                    </v-flex>

                                    <v-flex xs3>
                                      <v-checkbox
                                        color="colorDark"
                                        v-model="editedItem.IsMRPExclusiveTax"
                                        label="Is retail price exclusive of tax?"
                                      ></v-checkbox>
                                    </v-flex>
                                  </v-layout>
                                  <!-- </v-card> -->
                                </div>
                              </v-card-text>
                            </v-card>
                          </v-tab-item>
                        </v-tabs>
                      </v-card>
                    </v-container>
                  </v-card-text>
                </v-card>
              </v-dialog>
            </v-card-title>
            <v-data-table
              :headers="headers"
              :items="listOfRecords"
              class="elevation-3"
              :search="search"
              :loading="isLoading"
            >
              <template slot="items" slot-scope="props">
                <td class="text-xs-left">{{ props.item.Code }}</td>
                <td class="text-xs-left">{{ props.item.Name }}</td>
                <td class="text-xs-left">{{ props.item.ProductTypeName }}</td>
                <td class="text-xs-left">{{ props.item.CategoryProductName }}</td>
                <td class="text-xs-left">{{ props.item.CategoryBrandName }}</td>
                <td class="text-xs-left">{{ props.item.SalePrice }}</td>
                <td class="justify-center layout px-0">
                  <v-btn
                    color="primary"
                    fab
                    small
                    dark
                    style="height:22px;width:22px;font-size:13px;"
                    @click="editItem(props.item)"
                  >
                    <v-icon style="font-size:13px">edit</v-icon>
                  </v-btn>
                  <v-btn color="red" fab small dark style="height:22px;width:22px;font-size:13px;">
                    <v-icon style="font-size:13px" @click="deleteItem(props.item)">delete</v-icon>
                  </v-btn>
                </td>
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>
        <v-divider light></v-divider>
        <v-card-actions class="pa-0 ma-0 ml-1"></v-card-actions>
      </v-card>
    </v-flex>
    <snack-bar :isSnackbar="IsSnackBar" />
  </v-layout>
</template>

<script>
import { mixins } from "../../../../../mixins/CustomMixins";
import Application from "../../../../../services/application-service";
import SnackBar from "../../../../../components/control/SnackBar";
import axios from "axios";

export default {
  mixins: [mixins],
  components: {
    SnackBar
  },
  data: () => ({
    activeTab: 0,
    selectCategoryProduct: [],
    itemsCategoryProduct: [],
    selectUnitOfMeasurement: [],
    itemsUnitOfMeasurement: [],
    selectExpenseAccount: [],
    itemsExpenseAccount: [],
    selectPurchaseDiscountAccount: [],
    itemsPurchaseDiscountAccount: [],
    selectSaleAccount: [],
    itemsSaleAccount: [],
    selectSaleDiscountAccount: [],
    itemsSaleDiscountAccount: [],
    selectInventoryAccount: [],
    itemsInventoryAccount: [],
    selectCategoryBrand: [],
    itemsCategoryBrand: [],

    selectCategoryProductPrinciple: [],
    itemsCategoryProductPrinciple: [],

    editedItem: {
      SettingProductTypeId: "1",
      Code: "1",
      Barcode: "1",
      Name: "1",
      Description: "1",
      ShortDescription: "1",
      Symbol: "1",
      Precision: "1",
      FractionalUnit: true,
      TrackInventory: true,
      IsForSale: true,
      SalePrice: 1,
      SaleTax: "1",
      IsForPurchase: true,
      PurchasePrice: 0,
      PurchaseTax: "1",
      MaximumRetailPrice: "1",
      IsMRPExclusiveTax: true,
      ImageUrl: "1",
      Base64imagestring: "1",
      ConversionFactor: "2",
      HasCalculationfield: true,
      AverageCost: "1",
      HasBatch: true,
      IsOpening: true,
      HasSerialnumber: true,
      MinimumStockLevel: "1",
      IsDeleted: true,
      IsActive: true
    },

    dialog: false,
    search: "",
    headers: [
      { text: "Code", value: "Code" },
      { text: "Name", value: "Name" },
      { text: "Type", value: "ProductTypeName" },
      { text: "Category", value: "CategoryProductName" },
      { text: "Brand", value: "CategoryBrandName" },
      { text: "Sale Price", value: "SalePrice" },
      { text: "Action", value: 0, class: "text-xs-center" }
    ],
    isLoading: true,
    IsSnackBar: false,
    listOfRecords: [],
    editedIndex: -1,
    defaultItem: {},
    tabGeneral: true,
    tabDetail: false
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Product" : "Edit Product";
    }
  },
  watch: {
    activeTab(val) {
      if (val == 0) {
        this.tabGeneral = true;
        this.tabDetail = false;
      } else {
        this.tabGeneral = false;
        this.tabDetail = true;
      }
    },
    dialog(val) {
      var isTrue = val;
      if (isTrue) {
        this.dialogOpen();
      } else {
        isTrue || this.close();
      }
    }
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.tableLoad();
      this.getSettingUnitOfMeasurments();
      this.getSettingInventoryAccounts();
      this.getSettingAccounts();
      this.getSettingSaleAccounts();
      this.getCategoryBrands();
      this.getCategoryProductPrinciples();
      this.getCategoryProducts();
    },

    async getSettingUnitOfMeasurments() {
      var result = await this.refillSelectOption(
        this.$urlApplication + "ListProduct/GetSettingUnitOfMeasurments"
      );
      this.selectUnitOfMeasurement = result.selected;
      this.itemsUnitOfMeasurement = result.option;
    },
    async getCategoryProducts() {
      var result = await this.refillSelectOption(
        this.$urlApplication + "ListProduct/GetCategoryProducts"
      );
      this.selectCategoryProduct = result.selected;
      this.itemsCategoryProduct = result.option;
    },

    async getCategoryBrands() {
      var result = await this.refillSelectOption(
        this.$urlApplication + "ListProduct/GetCategoryBrands"
      );
      this.selectCategoryBrand = result.selected;
      this.itemsCategoryBrand = result.option;
    },

    async getCategoryProductPrinciples() {
      var result = await this.refillSelectOption(
        this.$urlApplication + "ListProduct/GetCategoryProductPrinciples"
      );
      this.selectCategoryProductPrinciple = result.selected;
      this.itemsCategoryProductPrinciple = result.option;
    },
    async getSettingInventoryAccounts() {
      var result = await this.refillSelectOption(
        this.$urlApplication + "ListProduct/GetSettingInventoryAccounts"
      );
      this.selectInventoryAccount = result.selected;
      this.itemsInventoryAccount = result.option;
    },

    async getSettingAccounts() {
      var result = await this.refillSelectOption(
        this.$urlApplication + "ListProduct/GetSettingAccounts"
      );
      this.selectSaleDiscountAccount = this.selectPurchaseDiscountAccount = this.selectExpenseAccount =
        result.selected;
      this.itemsSaleDiscountAccount = this.itemsPurchaseDiscountAccount = this.itemsExpenseAccount =
        result.option;
    },

    async getSettingSaleAccounts() {
      var result = await this.refillSelectOption(
        this.$urlApplication + "ListProduct/GetSettingSaleAccounts"
      );
      this.selectSaleAccount = result.selected;
      this.itemsSaleAccount = result.option;
    },

    async tableLoad() {
      this.isLoading = true;
      const res = await axios
        .get(this.$urlApplication + "ListProduct/GetListProducts")
        .then(res => {
          this.listOfRecords = res.data;
          this.isLoading = false;
        })
        .catch(error => {
          this.isLoading = false;
        });
    },

    post() {
      var obj = this.editedItem;
      obj.Code = this.editedItem.Code;
      obj.Barcode = this.editedItem.Barcode;
      obj.Name = this.editedItem.Name;
      obj.Description = this.editedItem.Description;
      obj.ShortDescription = this.editedItem.ShortDescription;
      obj.Symbol = this.editedItem.Symbol;
      obj.Precision = this.editedItem.Precision;
      obj.FractionalUnit = this.editedItem.FractionalUnit;
      obj.TrackInventory = this.editedItem.TrackInventory;
      obj.IsForSale = this.editedItem.IsForSale;
      obj.SalePrice = this.editedItem.SalePrice;
      obj.SaleTax = this.editedItem.SaleTax;
      obj.IsForPurchase = this.editedItem.IsForPurchase;
      obj.PurchasePrice = this.editedItem.PurchasePrice;
      obj.SaleAccountId = this.selectSaleAccount.value;
      obj.InventoryAccountId = this.selectInventoryAccount.value;
      obj.SaleDiscountAccountId = this.selectSaleDiscountAccount.value;
      obj.ExpenseAccountId = this.selectExpenseAccount.value;
      obj.PurchaseDiscountAccountId = this.selectPurchaseDiscountAccount.value;
      obj.CategoryProductId = this.selectCategoryProduct.value;
      obj.UnitOfMeasurementId = this.selectUnitOfMeasurement.value;
      obj.PurchaseTax = this.editedItem.PurchaseTax;
      obj.MaximumRetailPrice = this.editedItem.MaximumRetailPrice;
      obj.IsMRPExclusiveTax = this.editedItem.IsMRPExclusiveTax;
      obj.ImageUrl = this.editedItem.ImageUrl;
      obj.Base64imagestring = this.editedItem.Base64imagestring;
      obj.ConversionFactor = this.editedItem.ConversionFactor;
      obj.HasCalculationfield = this.editedItem.HasCalculationfield;
      obj.AverageCost = this.editedItem.AverageCost;
      obj.HasBatch = this.editedItem.HasBatch;
      obj.IsOpening = this.editedItem.IsOpening;
      obj.HasSerialnumber = this.editedItem.HasSerialnumber;
      obj.MinimumStockLevel = this.editedItem.MinimumStockLevel;

      obj.CategoryProductPrincipleId = this.selectCategoryProductPrinciple.value;
      obj.CategoryBrandId = this.selectCategoryBrand.value;
      //obj.HSCodeId = this.selectHSCode.value;
      this.IsSnackBar = true;

      axios({
        method: "post",
        url: this.$urlApplication + "ListProduct/Post",
        data: obj
      })
        .then(res => {
          //this.IsSnackBar = false;
          this.tableLoad();
          this.close();
        })
        .catch(error => {
          this.IsSnackBar = false;
        });
    },

    put() {
      var obj = this.editedItem;

      obj.Code = this.editedItem.Code;
      obj.Barcode = this.editedItem.Barcode;
      obj.Name = this.editedItem.Name;
      obj.Description = this.editedItem.Description;
      obj.ShortDescription = this.editedItem.ShortDescription;
      obj.Symbol = this.editedItem.Symbol;
      obj.Precision = this.editedItem.Precision;
      obj.FractionalUnit = this.editedItem.FractionalUnit;
      obj.TrackInventory = this.editedItem.TrackInventory;
      obj.IsForSale = this.editedItem.IsForSale;
      obj.SalePrice = this.editedItem.SalePrice;
      obj.SaleTax = this.editedItem.SaleTax;
      obj.IsForPurchase = this.editedItem.IsForPurchase;
      obj.PurchasePrice = this.editedItem.PurchasePrice;
      obj.SaleAccountId = this.selectSaleAccount.value;
      obj.InventoryAccountId = this.selectInventoryAccount.value;
      obj.SaleDiscountAccountId = this.selectSaleDiscountAccount.value;
      obj.ExpenseAccountId = this.selectExpenseAccount.value;
      obj.PurchaseDiscountAccountId = this.selectPurchaseDiscountAccount.value;
      obj.CategoryProductId = this.selectCategoryProduct.value;
      obj.UnitOfMeasurementId = this.selectUnitOfMeasurement.value;
      obj.PurchaseTax = this.editedItem.PurchaseTax;
      obj.MaximumRetailPrice = this.editedItem.MaximumRetailPrice;
      obj.IsMRPExclusiveTax = this.editedItem.IsMRPExclusiveTax;
      obj.ImageUrl = this.editedItem.ImageUrl;
      obj.Base64imagestring = this.editedItem.Base64imagestring;
      obj.ConversionFactor = this.editedItem.ConversionFactor;
      obj.HasCalculationfield = this.editedItem.HasCalculationfield;
      obj.AverageCost = this.editedItem.AverageCost;
      obj.HasBatch = this.editedItem.HasBatch;
      obj.IsOpening = this.editedItem.IsOpening;
      obj.HasSerialnumber = this.editedItem.HasSerialnumber;
      obj.MinimumStockLevel = this.editedItem.MinimumStockLevel;

      obj.CategoryProductPrincipleId = this.selectCategoryProductPrinciple.value;
      obj.CategoryBrandId = this.selectCategoryBrand.value;
      this.IsSnackBar = true;

      axios({
        method: "put",
        url: this.$urlApplication + "ListProduct/Put?id=" + obj.ProductId,
        data: obj
      })
        .then(res => {
          this.IsSnackBar = false;
          this.tableLoad();
          this.close();
        })
        .catch(error => {
          this.IsSnackBar = false;
        });
    },

    delete(id) {
      var pId = id;
      this.IsSnackBar = true;
      axios({
        method: "delete",
        url: this.$urlApplication + "ListProduct/Delete?companyId=1&id=" + pId
      })
        .then(res => {
          this.IsSnackBar = false;
          this.tableLoad();
        })
        .catch(error => {
          this.IsSnackBar = false;
        });
    },
    clear() {
      this.editedIndex = -1;
      this.editedItem.Code = "";
      this.editedItem.Barcode = "";
      this.editedItem.Name = "";
      this.editedItem.Description = "";
      this.editedItem.ShortDescription = "";
      this.editedItem.Symbol = "";
      this.editedItem.Precision = "";
      this.editedItem.FractionalUnit = true;
      this.editedItem.TrackInventory = true;

      this.editedItem.IsForSale = true;
      this.editedItem.SalePrice = "";
      this.editedItem.SettingProductTypeId = 1;
      // this.selectSaleAccount = [];
      // this.itemsSaleAccount = [];
      // this.selectInventoryAccount = [];
      // this.itemsInventoryAccount = [];
      // this.selectSaleDiscountAccount = [];
      // this.itemsSaleDiscountAccount = [];
      // this.selectExpenseAccount = [];
      // this.itemsExpenseAccount = [];
      // this.selectPurchaseDiscountAccount = [];
      // this.itemsPurchaseDiscountAccount = [];
      // this.editedItem.selectCategoryProduct = [];
      // this.itemsCategoryProduct = [];
      // this.selectUnitOfMeasurement = [];
      // this.itemsUnitOfMeasurement = [];
      // this.selectCategoryProductPrinciple = [];
      // this.itemsCategoryProductPrinciple = [];
      // this.selectCategoryBrand = [];
      // this.itemsCategoryBrand = [];
      // this.selectHSCode = [];
      // this.itemsHSCode = [];
      // this.selectSettingProductType = [];
      // this.itemsSettingProductType = [];
      this.editedItem.SaleTax = "";
      this.editedItem.IsForPurchase = true;
      this.editedItem.PurchasePrice = "";
      this.editedItem.PurchaseTax = "";
      this.editedItem.MaximumRetailPrice = "";
      this.editedItem.IsMRPExclusiveTax = true;
      this.editedItem.ImageUrl = "";
      this.editedItem.Base64imagestring = "";
      this.editedItem.ConversionFactor = "";
      this.editedItem.HasCalculationfield = true;
      this.editedItem.AverageCost = "";
      this.editedItem.HasBatch = true;
      this.editedItem.IsOpening = true;
      this.editedItem.HasSerialnumber = true;
      this.editedItem.MinimumStockLevel = "";

      this.editedItem.IsDeleted = true;
      this.editedItem.IsActive = true;
      this.editedItem.Created = "";
      this.editedItem.CreatedBy = "";
      this.editedItem.Modified = "";
      this.editedItem.ModifiedBy = "";

      this.tabGeneral = true;
      this.tabDetail = false;
      this.activeTab = 0;
    },
    editItem(item) {
      var obj = item;

      this.selectUnitOfMeasurement = this.refillSelect(
        obj.UnitOfMeasurementId,
        this.itemsUnitOfMeasurement
      );

      this.selectInventoryAccount = this.refillSelect(
        obj.InventoryAccountId,
        this.itemsInventoryAccount
      );

      this.selectExpenseAccount = this.refillSelect(
        obj.ExpenseAccountId,
        this.itemsExpenseAccount
      );

      this.selectPurchaseDiscountAccount = this.refillSelect(
        obj.PurchaseDiscountAccountId,
        this.itemsPurchaseDiscountAccount
      );

      this.selectSaleAccount = this.refillSelect(
        obj.SaleAccountId,
        this.itemsSaleAccount
      );

      this.selectCategoryProduct = this.refillSelect(
        obj.CategoryProductId,
        this.itemsCategoryProduct
      );

      this.selectCategoryProductPrinciple = this.refillSelect(
        obj.CategoryProductPrincipleId,
        this.itemsCategoryProductPrinciple
      );

      this.selectCategoryBrand = this.refillSelect(
        obj.CategoryBrandId,
        this.itemsCategoryBrand
      );

      this.editedIndex = this.listOfRecords.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.listOfRecords.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.delete(item.ProductId);
    },
    dialogOpen() {
      if (
        this.editedItem.ProductId == undefined ||
        this.editedItem.ProductId == ""
      ) {
        //When click add
        this.editedItem.Active = true;
        this.clear();
      } else {
        //Edite Record
      }
    },
    close() {
      if (!this.dialog) {
        this.clear();
      }
      this.dialog = false;
      //   setTimeout(() => {
      //     this.editedItem = Object.assign({}, this.defaultItem);
      //     this.editedIndex = -1;
      //   }, 300);
    }
  }
};
</script>
<style scoped>
/* Table Self Style*/
table.v-table tbody td:first-child,
table.v-table tbody td:not(:first-child),
table.v-table tbody th:first-child,
table.v-table tbody th:not(:first-child),
table.v-table thead td:first-child,
table.v-table thead td:not(:first-child),
table.v-table thead th:first-child,
table.v-table thead th:not(:first-child) {
  padding: 10 10px;
  width: inherit;
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 32px;
}
table.v-table tbody td,
table.v-table tbody th {
  height: 30px;
}
/* 
.v-label {
  font-size: 13px !important;
}

.v-icon {
  font-size: 20px !important;
} */
</style>