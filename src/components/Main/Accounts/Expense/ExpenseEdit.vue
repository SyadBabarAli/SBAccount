<template>
  <v-layout row wrap class="pa-2">
    <v-flex lg12 class="mt-12">
      <v-card class="black--text elevation-5">
        <v-layout>
          <v-flex lg12>
            <v-card-title class="headline grey lighten-3 pa-1 ma-0" primary-title>
              Expense Expense - {{this.editedItem.AccountExpenseId}} - {{this.editedItem.StatusName}}
              <v-toolbar-items>
                <v-btn flat color="colorLight" @click="post" v-if="this.$route.query.id == 0">save</v-btn>
                <v-btn flat color="colorLight" @click="put" v-if="this.$route.query.id > 0">update</v-btn>
                <v-btn flat color="colorLight" @click="clear(editedItem)">clear</v-btn>
                <v-btn flat color="colorLight" to="/Expense">close</v-btn>
              </v-toolbar-items>
            </v-card-title>
            <v-card>
              <v-layout>
                <v-flex lg2 class="pa-1">
                  Pay From
                  <br />
                  <select v-model="editedItem.selectSettingAccountPayFrom" style="width:100%">
                    <option
                      v-for="option in editedItem.itemsSettingAccountPayFrom"
                      v-bind:value="option"
                    >{{ option.Name }}</option>
                  </select>
                </v-flex>

                <v-flex lg2 class="pa-1">
                  Customer
                  <br />
                  <auto-complete
                    :Name="this.editedItem.CustomerName"
                    :isAsync="true"
                    :apiUrl="'AccountExpense/GetCustomer?pSearch='"
                    v-on:input="onChildClickAutoCompelete"
                  />
                  <input readonly v-model="editedItem.ListCustomerContactId" style="display:none;" />
                </v-flex>
                <v-flex class="pa-1">
                  <v-text-field
                    v-model="editedItem.Number"
                    :append-icon="'autorenew'"
                    placeholder="Placeholder"
                    clearable
                    label="Number"
                    type="text"
                    @click:append="getProposedNumber"
                  ></v-text-field>
                </v-flex>
                <v-flex class="pa-1">
                  <v-text-field
                    label="Date"
                    placeholder="Placeholder"
                    :append-icon="'today'"
                    type="date"
                    :value="Date && CreatedDate.toISOString().split('T')[0]"
                  ></v-text-field>
                </v-flex>
                <v-flex class="pa-1">
                  <v-text-field
                    label="Reference"
                    placeholder="Placeholder"
                    v-model="editedItem.Reference"
                  ></v-text-field>
                </v-flex>
                <v-flex class="pa-1">
                  Branch
                  <br />
                  <select v-model="editedItem.selectGroupBranch" style="width:100%">
                    <option
                      v-for="option in editedItem.itemsGroupBranch "
                      v-bind:value="option"
                    >{{ option.Name }}</option>
                  </select>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex lg2 class="pa-1">
                  Currency
                  <br />
                  <select v-model="editedItem.selectSettingCurrency" style="width:100%">
                    <option
                      v-for="option in editedItem.itemsSettingCurrency"
                      v-bind:value="option"
                    >{{ option.Name }}</option>
                  </select>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex lg12 class="pa-1">
                  <table-inline
                    :objSettingAccount="editedItem.itemsSettingAccount"
                    :tableRows="editedItem.AccountExpenseDetail"
                    v-on:childToParent="onChildClick"
                  />
                </v-flex>
              </v-layout>

              <v-layout class="pa-1">
                <v-flex lg4>
                  <v-textarea
                    name="input-7-1"
                    label="Comment"
                    v-model="editedItem.Comment"
                    hint="Hint text"
                  ></v-textarea>
                </v-flex>
                <v-flex lg4></v-flex>
                <v-flex lg4>
                  <v-layout>
                    <v-flex lg6 class="font-weight-regular">Gross</v-flex>
                    <v-flex lg6>
                      <input type="text" v-model="editedItem.GrossAmount" class="txtRight" />
                    </v-flex>
                  </v-layout>
                  <v-layout>
                    <v-flex lg6 class="font-weight-regular">Tax Amount</v-flex>
                    <v-flex lg6>
                      <input type="text" class="txtRight" v-model="editedItem.TaxAmount" />
                    </v-flex>
                  </v-layout>
                  <v-layout>
                    <v-flex lg6 class="font-weight-medium">Net (Rs)</v-flex>
                    <v-flex lg6>
                      <input type="text" class="txtRight" v-model="editedItem.NetAmount" />
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from "axios";
import { mixins } from "../../../../mixins/CustomMixins";
import ButtonSmall from "../../../../components/control/ButtonSmall";
import TableInline from "../../../../components/Main/Accounts/Expense/TableInlineExpense";
import AutoComplete from "../../../../components/control/AutoCompelete/AutoCompeleteHtml";

export default {
  mixins: [mixins],
  components: {
    ButtonSmall,
    TableInline,
    AutoComplete
  },
  data() {
    return {
      CreatedDate: new Date(),
      editedItem: {
        AccountExpenseId: 0,
        Date: new Date(),
        Number: "",
        Reference: "",
        AutoCompelete: "",
        Comment: "",
        AccountExpenseDetail: [],
        GrossAmount: 101,
        NetAmount: 0,
        TaxAmount: 0,
        ListCustomerContactId: 0,
        CustomerName: "",
        GroupBranchId: 0,
        selectGroupBranch: null,
        itemsGroupBranch: [],
        selectSettingCurrency: null,
        itemsSettingCurrency: [],
        selectSettingAccount: null,
        itemsSettingAccount: [],
        selectSettingAccountPayFrom: null,
        itemsSettingAccountPayFrom: [],
        StatusName: "Draft"
      },
      componentName: "AccountExpense",
      isLoading: true,
      IsSnackBar: false
    };
  },
  methods: {
    onChildClick(obj) {
      if (obj != null) {
        this.editedItem.AccountExpenseDetail = obj.tableRow;
        this.editedItem.GrossAmount = obj.subTotal;
        this.editedItem.NetAmount = obj.total;
      }
    },
    onChildClickAutoCompelete(value) {
      this.editedItem.AutoCompelete = value;
      this.editedItem.ListCustomerContactId = value.split("~")[1];
    }
  }
};
</script>