<template>
  <!-- <v-layout row wrap class="pa-2">
    <v-flex lg12 class="mt-12">
      <v-card class="black--text elevation-5">
        <v-layout>
          <v-flex lg12>
  <v-card-title class="headline grey lighten-3 pa-1 ma-0" primary-title>Define Analyst</v-card-title>-->
  <layout-one :title="'Define Analyst'">
    <v-card-title>
      <v-toolbar-title>Details</v-toolbar-title>
      <v-divider class="mx-2" inset vertical></v-divider>
      <v-spacer></v-spacer>
      <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
      <v-dialog v-model="dialog" max-width="500px" scrollable persistent>
        <v-btn slot="activator" color="primary" dark class="mb-2">Add</v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <form>
                <v-layout wrap v-show="false">
                  <v-flex lg12>
                    <v-text-field v-model="editedItem.AgentUserId" label="Analyst Id" disabled></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout wrap>
                  <v-flex lg12>
                    <v-combobox
                      v-model="selectRoleUser"
                      :items="itemsRoleUser"
                      label="Select an analyst"
                      item-text="FirstName"
                      item-value="RoleUserId"
                    ></v-combobox>
                  </v-flex>
                </v-layout>

                <v-layout wrap>
                  <v-flex lg12>
                    <v-combobox
                      v-model="selectRoleUser2"
                      :items="itemsRoleUser2"
                      label="Select an analyst "
                      item-text="FirstName"
                      item-value="RoleUserId"
                      multiple
                    ></v-combobox>
                  </v-flex>
                </v-layout>

                <v-layout wrap>
                  <v-flex>
                    <v-checkbox color="colorDark" v-model="editedItem.Active" label="Active"></v-checkbox>
                  </v-flex>
                </v-layout>
              </form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click="postUser" v-show="this.editedIndex === -1 ? true : false">save</v-btn>
            <v-btn flat @click="putAgentUser" v-show="this.editedIndex === -1 ? false : true">update</v-btn>
            <v-btn flat @click="clear">clear</v-btn>
            <v-btn flat @click="close">cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-title>
    <v-data-table
      must-sort
      :headers="headers"
      :items="listOfRecords"
      class="elevation-3"
      :search="search"
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.AgentUserId }}</td>
        <td class="text-xs-left">{{ props.item.FirstName }}</td>
        <td class="text-xs-left">{{ (props.item.Active == 1 ? 'Yes' : 'No') }}</td>
        <td class="justify-center layout px-0">
          <v-btn
            color="primary"
            fab
            small
            dark
            style="height:22px;width:22px;font-size:13px;"
            v-if="rights.Modify"
          >
            <v-icon style="font-size:13px" @click="editItem(props.item)">edit</v-icon>
          </v-btn>
          <v-btn
            color="red"
            fab
            small
            dark
            style="height:22px;width:22px;font-size:13px;"
            v-if="rights.Delete"
          >
            <v-icon style="font-size:13px" @click="deleteItem(props.item)">delete</v-icon>
          </v-btn>
        </td>

        <!-- <td class="justify-center layout px-0">
                  <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                  <v-icon small @click="deleteItem(props.item)">delete</v-icon>
        </td>-->
      </template>
    </v-data-table>
    <snack-bar :isSnackbar="isSnackBar"/>
    <!-- </v-flex>
        </v-layout>
      </v-card>
    </v-flex>
    <snack-bar :isSnackbar="isSnackBar"/>
    </v-layout>-->
  </layout-one>
</template>

<script>
import { mixins } from "../../../mixins/CustomMixins";
import Application from "../../../services/application-service";
import MonthPicker from "../../../components/control/MonthPicker";
import SnackBar from "../../../components/control/SnackBar";
import axios from "axios";
import LayoutOne from "../../../components/control/layout/LayoutOne";

export default {
  mixins: [mixins],
  components: {
    MonthPicker,
    SnackBar,
    LayoutOne
  },
  data: () => ({
    rights: {
      View: false,
      Modify: false,
      Delete: false,
      Class: "csmHide"
    },
    snackbar: {
      isTrue: true
    },
    selectRoleUser: null,
    itemsRoleUser: [],

    selectRoleUser2: null,
    itemsRoleUser2: [],

    dialog: false,
    search: "",
    headers: [
      { text: "Analyst Id", value: "AgentUserId", align: "left" },
      { text: "Analyst", value: "FirstName" },
      { text: "Active", value: "Active" },
      { text: "Actions", value: "", sortable: false, align: "Center" }
    ],
    listOfRecords: [],
    editedIndex: -1,

    editedItem: {
      Active: true,
      AgentUserId: "",
      AgentUserIds: []
    },
    defaultItem: {
      Active: true,
      AgentUserId: "0",
      AgentUserIds: []
    }
  }),
  computed: {
    isSnackBar() {
      return this.snackbar.isTrue;
    },
    formTitle() {
      return this.editedIndex === -1 ? "New Analyst" : "Edit Analyst";
    }
  },
  watch: {
    dialog(val) {
      var isTrue = val;
      isTrue || this.close();
    }
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.getAgentUser();
      this.getRoleUsersAgents();

       this.getUserRights([621,622,623]).then(result => {
        result.forEach(element => {
          if (element.name == "View") {
            this.rights.View = true;
          }
          if (element.name == "Modify") {
            this.rights.Modify = true;
          }
          if (element.name == "Delete") {
            this.rights.Delete = true;
          }
        });
      });

    },

    getRoleUsersAgents() {
      axios({
        method: "get",
        url: this.$urlApplication + "GetRoleUsersAgents"
      })
        .then(res => {
          this.itemsRoleUser = [];
          this.itemsRoleUser2 = [];
          for (let value of res.data) {
            var result = {
              RoleUserId: value.RoleUserId,
              FirstName: value.FirstName
            };
            this.itemsRoleUser.push(result);
            this.itemsRoleUser2.push(result);
          }
        })
        .catch(error => {});
    },

    getAgentUserAssignUserRoles(id) {
      axios({
        method: "get",
        url: this.$urlApplication + "GetAgentUserAssignUserRoles?id=" + id
      })
        .then(res => {
          this.selectRoleUser2 = [];
          var AgentUser = this.itemsRoleUser2;
          for (let v1 of res.data) {
            for (let v2 of AgentUser) {
              if (v1.RoleUserId == v2.RoleUserId) {
                var userGroupId = v2.RoleUserId;
                var name = v2.FirstName;
                var result = {
                  RoleUserId: userGroupId,
                  FirstName: name
                };
                this.selectRoleUser2.push(result);
                break;
              }
            }
          }
        })
        .catch(error => {});
    },

    getAgentUser() {
      axios({
        method: "get",
        url: this.$urlApplication + "GetAgentUsers"
      })
        .then(res => {
          this.listOfRecords = res.data;
        })
        .catch(error => {});
    },
    postUser() {
      var obj = this.editedItem;

      this.editedItem.AgentUserIds = this.selectRoleUser2;
      this.editedItem.RoleUserId = this.selectRoleUser.RoleUserId;

      //Save
      axios({
        method: "post",
        url: this.$urlApplication + "PostAgentUser",
        data: obj
      })
        .then(res => {
          this.getAgentUser();
          this.close();
          this.snackbar.isTrue = !this.snackbar.isTrue;
        })
        .catch(error => {});
    },
    putAgentUser() {
      var obj = this.editedItem;
      this.editedItem.AgentUserIds = this.selectRoleUser2;
      this.editedItem.RoleUserId = this.selectRoleUser.RoleUserId;

      //Update
      axios({
        method: "put",
        url: this.$urlApplication + "PutAgentUser?id=" + obj.AgentUserId,
        data: obj
      })
        .then(res => {
          this.getAgentUser();
          this.close();
          this.snackbar.isTrue = !this.snackbar.isTrue;
        })
        .catch(error => {});
    },

    deleteAgentUser(id) {
      var pId = id;
      axios({
        method: "delete",
        url: this.$urlApplication + "DeleteAgentUser?id=" + pId
      })
        .then(res => {
          this.getAgentUser();
        })
        .catch(error => {});
    },
    clear() {
      this.editedItem.AgentUserId = "";
      this.selectRoleUser = [];
      this.selectRoleUser2 = [];
    },
    editItem(item) {
      var obj = item;

      //Agent User Assign Combobox--Start
      for (var items of this.itemsRoleUser) {
        if (obj.RoleUserId == items.RoleUserId) {
          this.selectRoleUser = {
            RoleUserId: obj.RoleUserId,
            FirstName: items.FirstName
          };
          break;
          // this.selectRoleUser.FirstName = items.FirstName;
          // break;
        }
      }

      //Agent User Assign Combobox--End
      this.getAgentUserAssignUserRoles(obj.RoleUserId);
      this.editedIndex = this.listOfRecords.indexOf(obj);
      this.editedItem = Object.assign({}, obj);
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.listOfRecords.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.deleteAgentUser(item.AgentUserId);
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