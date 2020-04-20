<template>
  <v-layout row>
    <v-flex xs12>
      <v-card>
        <!-- <v-toolbar color="teal" dark dense>
          <v-toolbar-side-icon></v-toolbar-side-icon>
          <h1 class="font-weight-light">Menu</h1>
          <v-spacer></v-spacer>
        </v-toolbar>-->
        <v-list dense>
          <v-list-tile to="/">
            <v-list-tile-action class="pl-3">
              <v-icon>dashboard</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Dashboard</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-group
            v-for="item in filterMenu"
            :key="item.name"
            :prepend-icon="item.Icon"
            no-action
            expand="true"
          >
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>{{ item.name }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile
              v-for="subItem in item.children"
              :key="subItem.name"
              :to="'/'+subItem.name"
            >
              <v-list-tile-content class="pl-5">
                <v-list-tile-title>{{ subItem.UserRulesDescription }}</v-list-tile-title>
              </v-list-tile-content>

              <v-list-tile-action class="pr-3">
                <v-icon>{{ subItem.Icon }}</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list-group>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from "axios";
import _ from "lodash";
export default {
  data() {
    return {
      filterMenu: null
    };
  },
  created() {
    this.fetchMenu();
  },
  methods: {
    list_to_treeMenu(list) {
      var map = {},
        node,
        roots = [],
        i;
      for (i = 0; i < list.length; i += 1) {
        map[list[i].id] = i; // initialize the map
        if (list[i].ParentId == 0) {
          list[i].children = []; // initialize the children
        }
      }
      for (i = 0; i < list.length; i += 1) {
        node = list[i];
        var isChild = node.ParentId != 0;
        if (isChild) {
          // if you have dangling branches check that map[node.ParentId] exists
          var objList = list[map[node.ParentId]];
          if (objList == undefined) {
          } else {
            objList.children.push(node);
          }
        } else {
          roots.push(node);
        }
      }
      return roots;
    },
    fetchMenu() {
      var result = [
        {
          id: 1,
          ParentId: 0,
          Icon: "show_chart",
          name: "Sale",
          OrderBy: 1
        },
        {
          id: 5,
          ParentId: 1,
          name: "Invoice",
          UserRulesDescription: "Invoice",
          OrderBy: 1
        },
        {
          id: 6,
          ParentId: 1,
          name: "RecurringInvoice",
          UserRulesDescription: "Recurring Invoice",
          OrderBy: 1
        },
        {
          id: 7,
          ParentId: 1,
          name: "SaleReturn",
          UserRulesDescription: "Sale Return",
          OrderBy: 1
        },
        {
          id: 8,
          ParentId: 1,
          name: "SaleReceiveMoney",
          UserRulesDescription: "Receive Money",
          OrderBy: 1
        },
        {
          id: 9,
          ParentId: 1,
          name: "Refund",
          UserRulesDescription: "Refund",
          OrderBy: 1
        },
        {
          id: 10,
          ParentId: 1,
          name: "SaleSettlement",
          UserRulesDescription: "Settlement",
          OrderBy: 1
        },
        {
          id: 11,
          ParentId: 0,
          Icon: "add_shopping_cart",
          name: "Purchase",
          UserRulesDescription: "Purchase",
          OrderBy: 1
        },
        {
          id: 14,
          ParentId: 11,
          name: "PurchaseInvoice",
          UserRulesDescription: "Invoice",
          OrderBy: 1
        },
        {
          id: 15,
          ParentId: 11,
          name: "PurchaseReturn",
          UserRulesDescription: "Return",
          OrderBy: 1
        },
        {
          id: 16,
          ParentId: 11,
          name: "MakePayment",
          UserRulesDescription: "MakePayment",
          OrderBy: 1
        },
        {
          id: 17,
          ParentId: 11,
          name: "PurchaseRefund",
          UserRulesDescription: "Refund",
          OrderBy: 1
        },
        {
          id: 18,
          ParentId: 11,
          name: "Settlement",
          UserRulesDescription: "Settlement",
          OrderBy: 1
        },
        {
          id: 400,
          ParentId: 0,
          Icon: "account_tree",
          name: "Accounts",
          OrderBy: 1
        },

        {
          id: 401,
          ParentId: 400,
          name: "Expense",
          UserRulesDescription: "Expense"
        },

        {
          id: 402,
          ParentId: 400,
          name: "JournalEntry",
          UserRulesDescription: "Journal Entry"
        },
        {
          id: 24,
          ParentId: 22,
          name: "Journal Entry",
          UserRulesDescription: "POS",
          OrderBy: 1
        },
        {
          id: 30,
          ParentId: 0,
          Icon: "rotate_right",
          name: "Inventory",
          OrderBy: 1
        },

        {
          id: 31,
          ParentId: 30,
          name: "StockMovement",
          UserRulesDescription: "Stock Movement"
        },

        {
          id: 32,
          ParentId: 30,
          name: "StockAdjustment",
          UserRulesDescription: "Stock Adjustment"
        },

        {
          id: 101,
          ParentId: 25,
          name: "Customers",
          UserRulesDescription: "Customers",
          OrderBy: 1
        },
        {
          id: 27,
          ParentId: 25,
          name: "Vendor",
          UserRulesDescription: "Vendor",
          OrderBy: 1
        },
        {
          id: 28,
          ParentId: 25,
          name: "Product",
          UserRulesDescription: "Product",
          OrderBy: 1
        },
        {
          id: 1000,
          ParentId: 0,
          Icon: "settings",
          name: "Reports",
          UserRulesDescription: "Reports",
          OrderBy: 1
        },
        {
          id: 1001,
          ParentId: 1000,
          name: "Report",
          UserRulesDescription: "Report",
          OrderBy: 1
        }
      ];

      var convertedTree = this.list_to_treeMenu(result);
      this.filterMenu = convertedTree;

      return this.filterMenu;
      // })
      // .catch(err => console.log(err));
    }
  }
};
</script>