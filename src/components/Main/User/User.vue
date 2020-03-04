<template>
  <v-layout row wrap class="pa-2">
    <v-flex lg12 class="mt-12">
      <v-card class="black--text elevation-5">
        <v-layout>
          <v-flex lg12>
            <v-card-title class="headline grey lighten-3 pa-1 ma-0" primary-title>User</v-card-title>
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
              <v-dialog v-model="dialog" max-width="500px">
                <v-btn slot="activator" color="primary" dark class="mb-2">Add</v-btn>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container grid-list-md>
                      <form>
                        <v-layout wrap id="divUserId" class="csmHide">
                          <v-flex lg12>
                            <v-text-field v-model="editedItem.UserRoleId" label="User Id" disabled></v-text-field>
                          </v-flex>
                        </v-layout>
                        <v-layout wrap id="divFirstName">
                          <v-flex lg12>
                            <v-text-field v-model="editedItem.FirstName" label="First Name"></v-text-field>
                          </v-flex>
                        </v-layout>
                        <v-layout wrap id="divLastName">
                          <v-flex lg12>
                            <v-text-field v-model="editedItem.LastName" label="Last Name"></v-text-field>
                          </v-flex>
                        </v-layout>
                        <v-layout wrap id="divEmail">
                          <v-flex lg12>
                            <v-text-field v-model="editedItem.Email" label="User Id"></v-text-field>
                          </v-flex>
                        </v-layout>

                        <v-layout wrap v-show="false">
                          <v-flex lg12>
                            <v-combobox
                              v-model="selectRoleUser"
                              :items="itemsRoleUser"
                              label="Select an user support group"
                              item-text="text"
                              item-value="value"
                            ></v-combobox>
                          </v-flex>
                        </v-layout>

                        <v-layout wrap>
                          <v-flex lg12>
                            <v-combobox
                              v-model="selectUserGroup"
                              :items="itemsUserGroup"
                              label="Select a user roles group"
                              item-text="name"
                              item-value="UserGroupId"
                              multiple
                            ></v-combobox>
                          </v-flex>
                        </v-layout>
                      </form>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      flat 
                      @click="postForm"
                      v-show="this.editedIndex === -1 ? true : false"
                    >save</v-btn>
                    <v-btn
                      flat
                      @click="putForm"
                      v-show="this.editedIndex === -1 ? false : true"
                    >update</v-btn>
                    <v-btn flat @click="clear">clear</v-btn>
                    <v-btn flat @click="close">cancel</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-card-title>
            <v-data-table
              must-sort
              :headers="headers"
              :items="desserts"
              class="elevation-3"
              :search="search"
            >
              <template slot="items" slot-scope="props">
                <td>{{ props.item.RoleUserId }}</td>
                <td class="text-xs-left">{{ props.item.FirstName }}</td>
                <td class="text-xs-left">{{ props.item.LastName }}</td>
                <td class="text-xs-left">{{ props.item.Email }}</td>

                <td class="justify-center layout px-0">
                  <v-btn
                    color="primary"
                    fab
                    small
                    dark
                    style="height:22px;width:22px;font-size:13px;"
                  >
                    <v-icon style="font-size:13px" @click="editItem(props.item)">edit</v-icon>
                  </v-btn>
                  <v-btn color="red" fab small dark style="height:22px;width:22px;font-size:13px;">
                    <v-icon style="font-size:13px" @click="deleteItem(props.item)">delete</v-icon>
                  </v-btn>
                </td>
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>
    <snack-bar :isSnackbar="IsSnackBar" />
  </v-layout>
</template>

<script>
import { mixins } from "../../../mixins/CustomMixins";
import Application from "../../../services/application-service";
import MonthPicker from "../../../components/control/MonthPicker";
import SnackBar from "../../../components/control/SnackBar";
import axios from "axios";
import { defer } from 'q';
export default {
  mixins: [mixins],
  components: {
    MonthPicker,
    SnackBar
  },
  data: () => ({
    snackbar: {
      isTrue: true
    },

    selectUserGroup: null,
    itemsUserGroup: [],

    selectRoleUser: null,
    itemsRoleUser: [],

    // selectRoleUser: null,
    // itemsRoleUser: [
    //   {
    //     name2: "A",
    //     UserGroupId2: 2
    //   }
    //],
    dialog: false,
    search: "",
    headers: [
      { text: "Role User ID", value: "RoleUserId" },
      { text: "First Name", value: "FirstName" },
      { text: "Last Name", value: "LastName" },
      { text: "User ID", value: "Email" },
      { text: "Actions", value: "", sortable: false, align: "Center" }
    ],
    desserts: [],
    editedIndex: -1,

    editedItem: {
      UserRoleId: "",
      FirstName: "",
      LastName: "",
      Email: "",
      Password: "",
      LocationId: 1,
      UserGroupIds: []
    },
    defaultItem: {
      UserRoleId: "0",
      FirstName: "",
      LastName: "",
      Password: "",
      Email: "",
      LocationId: 1,
      UserGroupIds: []
    }
  }),
  computed: {
    IsSnackBar() {
      return this.snackbar.isTrue;
    },
    formTitle() {
      return this.editedIndex === -1 ? "New User" : "Edit User";
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
      this.getUser();
      this.getRoleUserGroup();
      this.getSupportGroupByUser();
    },

    getRoleUserGroup() {
      axios({
        method: "get",
        url: this.$urlApplication + "RoleUserGroup/GetRoleUserGroups"
      })
        .then(res => {
          this.itemsUserGroup = [];
          //this.itemsRoleUser = [];

          for (let value of res.data) {
            var result = {
              UserGroupId: value.RoleUserGroupId,
              name: value.UserGroupName
            };

            this.itemsUserGroup.push(result);
            //this.itemsRoleUser.push(result);
          }
        })
        .catch(error => {});
    },

    getRoleUserAssignUserGroups(id) {
      axios({
        method: "get",
        url: this.$urlApplication + "RoleUser/GetRoleUserAssignUserGroups?id=" + id
      })
        .then(res => {
          this.selectUserGroup = [];
          var userGroup = this.itemsUserGroup;

          for (let v1 of res.data) {
            for (let v2 of userGroup) {
              if (v1.RoleUserGroupId == v2.UserGroupId) {
                var userGroupId = v2.UserGroupId;
                var name = v2.name;
                var result = {
                  UserGroupId: userGroupId,
                  name: name
                };
                this.selectUserGroup.push(result);
              }
            }
          }
        })
        .catch(error => {});
    },

    getUser() {
      axios({
        method: "get",
        url: this.$urlApplication + "RoleUser/GetRoleUsers"
      })
        .then(res => {
          this.desserts = res.data;
        })
        .catch(error => {});
    },
    postForm() {
      var obj = this.editedItem;
      obj.UserRoleId = 0;
      this.editedItem.UserGroupIds = this.selectUserGroup;

      //obj.IncidentTierQueuesId = this.selectRoleUser.value;

      //Save
      axios({
        method: "post",
        url: this.$urlApplication + "RoleUser/PostRoleUser",
        data: obj
      })
        .then(res => {
          this.getUser();
          this.close();
          this.snackbar.isTrue = !this.snackbar.isTrue;
        })
        .catch(error => {});
    },
    putForm() {
      var obj = this.editedItem;
      if (typeof this.selectUserGroup == "string") {
        for (var items of this.itemsUserGroup) {
          if (this.selectUserGroup == items.name) {
            this.editedItem.UserGroupIds.push(items);
            break;
          }
        }
      } else if (typeof this.selectUserGroup == "object") {
        this.editedItem.UserGroupIds = this.selectUserGroup;
      }

      //obj.IncidentTierQueuesId = this.selectRoleUser.value;

      //Update
      axios({
        method: "put",
        url: this.$urlApplication + "RoleUser/PutRoleUser?id=" + obj.RoleUserId,
        data: obj
      })
        .then(res => {
          this.getUser();
          this.close();
          this.snackbar.isTrue = !this.snackbar.isTrue;
        })
        .catch(error => {});
    },

    deleteUser(id) {
      var pId = id;
      axios({
        method: "delete",
        url: this.$urlApplication + "RoleUser/DeleteRoleUser?id=" + pId
      })
        .then(res => {
          this.getUser();
        })
        .catch(error => {});
    },
    clear() {
      this.editedItem.UserRoleId = "";
      this.editedItem.FirstName = "";
      this.editedItem.LastName = "";
      this.editedItem.Email = "";
      this.selectUserGroup = [];
      this.selectRoleUser = [];
    },


 getSupportGroupByUser() {
      axios({
        method: "get",
        url: this.$urlApplication + "general/GetSupportGroupByUser"
      })
        .then(res => {
          this.itemsRoleUser = [];

          for (let value of res.data) {
            var result = {
              value: value.value,
              text: value.text
            };

            this.itemsRoleUser.push(result);
          }
        })
        .catch(error => {});
    },
    //  getSupportGroupByUser() {
    //   axios({
    //     method: "get",
    //     //url: this.$urlApplication + "general/GetAgentActivityType"
    //     url: this.$urlApplication + "general/GetSupportGroupByUser"
    //   })
    //     .then(res => {
    //       this.itemsRoleUserIdMain = [];

    //       var IsSelect = true;
    //       this.itemsRoleUserIdMain.push(result);
    //       for (let items of res.data) {
    //         var result = {
    //           value: items.value,
    //           text: items.text
    //         };

    //         if (IsSelect) {
    //           this.selectRoleUserIdMain = {
    //             value: items.value,
    //             text: items.text
    //           };
    //           IsSelect = false;
    //         }
    //         this.itemsRoleUserIdMain.push(result);
    //       }
    //     })
    //     .catch(error => {});
    // },

    editItem(item) {
      var obj = item;
      //User Group Combobox--Start
      for (var items of this.itemsUserGroup) {
        if (obj.UserGroupId == items.UserGroupId) {
          this.selectUserGroup = items.name;
          break;
        }
      }
      //User Group Combobox--End

      //User Group 2 Combobox--Start
      for (var items of this.itemsRoleUser) {
        
        if (obj.IncidentTierQueuesId == items.value) {
          
          this.selectRoleUser = {
            value: items.value,
            text: items.text
          };

          //this.selectRoleUser = items.name;
          break;
        }
      }
      //User Group 2 Combobox--End

      this.getRoleUserAssignUserGroups(obj.RoleUserId);
      this.editedIndex = this.desserts.indexOf(obj);
      this.editedItem = Object.assign({}, obj);
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.desserts.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.deleteUser(item.RoleUserId);
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