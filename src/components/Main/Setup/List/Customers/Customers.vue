<template>
  <v-layout row wrap class="pa-2">
    <v-flex lg12 class="mt-12">
      <v-card class="black--text elevation-5">
        <v-layout>
          <v-flex lg12>
            <v-card-title class="headline grey lighten-3 pa-1 ma-0" primary-title>Customer</v-card-title>
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
                    <v-container grid-list-md>
                      <v-card class="elevation-10">
                        <v-card-title
                          class="headline grey lighten-3 pa-1 ma-0"
                          primary-title
                        >Customer</v-card-title>
                        <v-divider></v-divider>
                        <v-flex lg6>
                          <v-text-field
                            v-model="editedItem.CustomerId"
                            label="ID"
                            disabled
                            v-show="false"
                          ></v-text-field>
                        </v-flex>
                        <v-layout row wrap>
                          <v-flex lg6>
                            <v-text-field v-model="editedItem.CustomerCode" label="Customer Code"></v-text-field>
                          </v-flex>
                          <v-flex lg6>
                            <v-text-field v-model="editedItem.CustomerName" label="Customer Name"></v-text-field>
                          </v-flex>
                        </v-layout>
                        <v-layout row wrap>
                          <v-flex lg6>
                            <v-text-field v-model="editedItem.PrintName" label="Print Name"></v-text-field>
                          </v-flex>
                          <v-flex lg6>
                            <v-text-field v-model="editedItem.DisplayName" label="Display Name"></v-text-field>
                          </v-flex>
                        </v-layout>
                        <v-layout row wrap>
                          <v-flex lg6>
                            <v-combobox
                              v-model="selectCustomerCategory"
                              :items="itemsCustomerCategory"
                              label="Customer Category"
                              item-text="text"
                              item-value="vaue"
                            ></v-combobox>
                          </v-flex>
                        </v-layout>
                        <v-layout row wrap>
                          <v-flex lg6>
                            <v-combobox
                              v-model="selectCurrency"
                              :items="itemsCurrency"
                              label="Currency"
                              item-text="text"
                              item-value="vaue"
                            ></v-combobox>
                          </v-flex>
                          <v-flex lg6>
                            <v-text-field
                              v-model="editedItem.OpeningBalance"
                              label="Opening Balance"
                            ></v-text-field>
                          </v-flex>
                        </v-layout>
                        <v-layout row wrap>
                          <v-flex lg6>
                            <v-text-field
                              v-model="editedItem.CreditLimitAmount"
                              label="Credit Limit Amount (Rs)"
                            ></v-text-field>
                          </v-flex>

                          <v-flex lg6>
                            <v-text-field
                              v-model="editedItem.CreditLimitDays"
                              label="Credit Limit Days"
                            ></v-text-field>
                          </v-flex>
                        </v-layout>
                        <v-layout row wrap>
                          <v-flex lg6>
                            <v-text-field v-model="editedItem.Discount" label="Discount (%)"></v-text-field>
                          </v-flex>
                        </v-layout>
                        <!-- <v-layout row wrap>
                          <v-flex lg6>
                            <v-combobox
                              v-model="selectCurrency"
                              :items="itemsCurrency"
                              label="Sub Area"
                              item-text="text"
                              item-value="vaue"
                            ></v-combobox>
                          </v-flex>
                        </v-layout>-->
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
                <td>{{ props.item.CustomerCode }}</td>
                <td class="text-xs-left">{{ props.item.CustomerName }}</td>
                <td class="text-xs-left">{{ props.item.CustomerCategoryId }}</td>
                <!-- <td class="text-xs-left">{{ props.item.CreatedBy }}</td>
                <td class="text-xs-left">{{ props.item.Created | momentDateDash }}</td>
                <td class="text-xs-left">{{ props.item.ModifiedBy }}</td>
                <td class="text-xs-left">{{ props.item.Modified | momentDateDash }}</td> -->
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
    selectCustomerCategory: null,
    itemsCustomerCategory: [],

    selectCurrency: null,
    itemsCurrency: [],

    dialog: false,
    search: "",
    headers: [
      { text: "Code", value: "CustomerCode" },
      { text: "Name", value: "CustomerName" },
      { text: "Category", value: "CustomerCategoryId" },
      // { text: "Created By", value: "CreatedBy" },
      // { text: "Created", value: "Created" },
      // { text: "Modified By", value: "ModifiedBy" },
      // { text: "Modified", value: "Modified" },
      // { text: "Active", value: "Active" },
      { text: "Actions", value: "", sortable: false, align: "center" }
    ],
    isLoading: true,
    IsSnackBar: false,
    listOfRecords: [],
    editedIndex: -1,
    editedItem: {},
    defaultItem: {}
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Customer" : "Edit Customer";
    }
  },
  watch: {
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
    getCustomerCategory() {
      axios({
        method: "get",
        url: this.$urlApplication + "ListCustomers/GetCustomerCategory"
      })
        .then(res => {
          this.itemsCustomerCategory = [];
          var isTrue = true;
          for (let items of res.data) {
            var result = {
              value: items.value,
              text: items.text
            };
            if (isTrue) {
              this.selectCustomerCategory = result;
              isTrue = false;
            }
            this.itemsCustomerCategory.push(result);
          }
        })
        .catch(error => {});
    },
    getCurrencies() {
      axios({
        method: "get",
        url: this.$urlApplication + "ListCustomers/GetCurrencies"
      })
        .then(res => {
          this.itemsCurrency = [];
          var isTrue = true;
          for (let items of res.data) {
            var result = {
              value: items.value,
              text: items.text
            };
            if (isTrue) {
              this.selectCurrency = result;
              isTrue = false;
            }
            this.itemsCurrency.push(result);
          }
        })
        .catch(error => {});
    },

    initialize() {
      this.tableLoad();
      this.getCustomerCategory();
      this.getCurrencies();
    },

    async tableLoad() {
      this.isLoading = true;
      const res = await axios
        .get(this.$urlApplication + "ListCustomers/GetListCustomers")
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
      obj.CompanyId = 1;
      obj.CustomerName = this.editedItem.CustomerName;
      obj.PrintName = this.editedItem.PrintName;
      obj.CustomerCategoryId = this.selectCustomerCategory.value;
      obj.OpeningBalance = this.editedItem.OpeningBalance;
      obj.CreditLimitAmount = this.editedItem.CreditLimitAmount;
      obj.CreditLimitDays = this.editedItem.CreditLimitDays;
      obj.Discount = this.editedItem.Discount;
      obj.CurrencyId = this.selectCurrency.value;

      this.IsSnackBar = true;

      axios({
        method: "post",
        url: this.$urlApplication + "ListCustomers/Post",
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

    put() {
      var obj = this.editedItem;
      obj.CompanyId = 1;
      obj.CustomerName = this.editedItem.CustomerName;
      obj.PrintName = this.editedItem.PrintName;
      obj.CustomerCategoryId = this.selectCustomerCategory.value;
      obj.OpeningBalance = this.editedItem.OpeningBalance;
      obj.CreditLimitAmount = this.editedItem.CreditLimitAmount;
      obj.CreditLimitDays = this.editedItem.CreditLimitDays;
      obj.Discount = this.editedItem.Discount;
      obj.CurrencyId = this.selectCurrency.value;

      this.IsSnackBar = true;

      axios({
        method: "put",
        url: this.$urlApplication + "ListCustomers/Put?id=" + obj.CustomerId,
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
        url: this.$urlApplication + "ListCustomers/Delete?companyId=1&id=" + pId
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
      //this.editedItem.CustomerId = "";
      this.editedItem.CustomerName = "";
      this.editedItem.PrintName = "";
    },
    editItem(item) {
      var obj = item;

      //1
      for (var items of this.itemsCustomerCategory) {
        if (obj.CustomerCategoryId == items.value) {
          this.selectCustomerCategory = {
            value: items.value,
            text: items.text
          };
          break;
        }
      }

      //2
      for (var items of this.itemsCurrency) {
        if (obj.CurrencyId == items.value) {
          this.selectCurrency = {
            value: items.value,
            text: items.text
          };
          break;
        }
      }

      this.editedIndex = this.listOfRecords.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.listOfRecords.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.delete(item.CustomerId);
    },
    dialogOpen() {
      if (this.editedItem.CustomerId == undefined) {
        //When click add
        this.editedItem.Active = true;
        this.clear();
      } else {
        //Edite Record
        //this.changeCustomerCategory(this.selectCustomerCategory);
      }
    },
    close() {
      if (!this.dialog) {
        this.clear();
      }
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
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
</style>