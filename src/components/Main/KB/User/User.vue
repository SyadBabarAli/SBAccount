<template>
  <div id="user">
    <v-layout row wrap class="pa-2">
      <v-flex lg12 class="mt-12">
        <v-card class="black--text elevation-5">
          <v-layout>
            <v-flex lg12>
              <v-card-title class="headline grey lighten-3 pa-1 ma-0" primary-title>Define User</v-card-title>
              <v-card-title>
                <v-toolbar-title>Details</v-toolbar-title>
                <v-divider class="mx-2" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="search"
                  color="colorLight"
                  append-icon="search"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
                <v-dialog v-model="dialog" max-width="500px">
                  <!-- <v-btn slot="activator" color="colorLight" dark class="mb-2">Add</v-btn> -->
                  <v-card>
                    <v-card-title>
                      <span class="headline">{{ formTitle }}</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container grid-list-md>
                        <form>
                          <v-layout wrap id="divUserId" class="csmHide">
                            <v-flex lg12>
                              <v-text-field
                                v-model="editedItem.RoleUserId"
                                label="User Id"
                                disabled
                              ></v-text-field>
                            </v-flex>
                          </v-layout>
                          <v-layout wrap id="divFirstName">
                            <v-flex lg12>
                              <v-text-field
                                v-model="editedItem.FirstName"
                                label="First Name"
                                color="colorLight"
                              ></v-text-field>
                            </v-flex>
                          </v-layout>
                          <v-layout wrap id="divLastName">
                            <v-flex lg12>
                              <v-text-field
                                v-model="editedItem.LastName"
                                label="Last Name"
                                color="colorLight"
                              ></v-text-field>
                            </v-flex>
                          </v-layout>
                          <v-layout wrap id="divEmail">
                            <v-flex lg12>
                              <v-text-field
                                v-model="editedItem.Email"
                                label="User Id"
                                color="colorLight"
                              ></v-text-field>
                            </v-flex>
                          </v-layout>

                          <v-layout wrap id="divUserGroup">
                            <v-flex lg12>
                              <v-combobox
                                v-model="selectUserGroup"
                                :items="itemsUserGroup"
                                label="Select a user group"
                                item-text="name"
                                item-value="KBRoleUserGroupId"
                                multiple
                                color="colorLight"
                              ></v-combobox>
                            </v-flex>
                          </v-layout>
                        </form>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <!-- <v-btn
                        flat
                        @click="postUser"
                        v-show="this.editedIndex === -1 ? true : false"
                      >save</v-btn>-->
                      <v-btn
                        flat
                        @click="putUser"
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
                :items="listOfRecords"
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
                      color="colorLight"
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
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
    <snack-bar :isSnackbar="IsSnackBar" />
  </div>
</template>

<script>
import { mixins } from "../../../../mixins/CustomMixins";
import Application from "../../../../services/application-service";
import MonthPicker from "../../../../components/control/MonthPicker";
import SnackBar from "../../../../components/control/SnackBar";
import axios from "axios";
export default {
  mixins: [mixins],
  components: {
    MonthPicker,
    SnackBar
  },
  data: () => ({
    rights: {
      Modify: false,
      Delete: false
    },
    snackbar: {
      isTrue: true
    },

    selectUserGroup: null,
    itemsUserGroup: [],

    selectUserGroup2: null,
    itemsUserGroup2: [
      {
        name2: "A",
        UserGroupId2: 2
      }
    ],
    dialog: false,
    search: "",
    headers: [
      { text: "Role User ID", value: "RoleUserId" },
      { text: "First Name", value: "FirstName" },
      { text: "Last Name", value: "LastName" },
      { text: "User ID", value: "Email" },
      { text: "Actions", value: "", sortable: false, align: "Center" }
    ],
    listOfRecords: [],
    editedIndex: -1,

    editedItem: {
      UserRoleId: "",
      FirstName: "",
      LastName: "",
      Email: "",
      Password: "",
      LocationId: 1,
      KBUserGroupIds: []
    },
    defaultItem: {
      UserRoleId: "0",
      FirstName: "",
      LastName: "",
      Password: "",
      Email: "",
      LocationId: 1,
      KBUserGroupIds: []
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
      this.tableLoad();
      this.getRoleUserGroup();

      this.getUserRights([2032, 2033, 2035]).then(result => {
        result.forEach(element => {
          if (element.name == "View") {
            this.rights.View = true;
          }

          if (element.name == "Modify") {
            this.rights.Modify = true;
          }
        });
      });
    },

    getRoleUserGroup() {
      axios({
        method: "get",
        url: this.$urlApplication + "KBRoleUserGroup/GetKBRoleUserGroups"
      })
        .then(res => {
          this.itemsUserGroup = [];
          for (let value of res.data) {
            var result = {
              KBRoleUserGroupId: value.KBRoleUserGroupId,
              name: value.UserGroupName
            };
            this.itemsUserGroup.push(result);
          }
        })
        .catch(error => {});
    },

    getKBRoleUserAssignUserGroups(id) {
      axios({
        method: "get",
        url: this.$urlApplication + "GetKBRoleUserAssignUserGroups?id=" + id
      })
        .then(res => {
          this.selectUserGroup = [];
          var userGroup = this.itemsUserGroup;

          for (let v1 of res.data) {
            for (let v2 of userGroup) {
              if (v1.KBRoleUserGroupId == v2.KBRoleUserGroupId) {
                var id = v2.KBRoleUserGroupId;
                var value = v2.name;
                var result = {
                  KBRoleUserGroupId: id,
                  name: value
                };
                this.selectUserGroup.push(result);
              }
            }
          }
        })
        .catch(error => {});
    },

    tableLoad() {
      axios({
        method: "get",
        url: this.$urlApplication + "RoleUser/GetRoleUsers"
      })
        .then(res => {
          this.listOfRecords = res.data;
          //debugger
        })
        .catch(error => {});
    },
    // postUser() {
    //   var obj = this.editedItem;
    //   obj.UserRoleId = 0;
    //   this.editedItem.KBUserGroupIds = this.selectUserGroup;
    //   //Save
    //   axios({
    //     method: "post",
    //     url: this.$urlApplication + "PostKBRoleUser",
    //     data: obj
    //   })
    //     .then(res => {
    //       this.tableLoad();
    //       this.close();
    //       this.snackbar.isTrue = !this.snackbar.isTrue;
    //     })
    //     .catch(error => {});
    // },
    putUser() {
      var obj = this.editedItem;
      if (typeof this.selectUserGroup == "string") {
        for (var items of this.itemsUserGroup) {
          if (this.selectUserGroup == items.name) {
            this.editedItem.KBUserGroupIds.push(items);
            break;
          }
        }
      } else if (typeof this.selectUserGroup == "object") {
        this.editedItem.KBUserGroupIds = this.selectUserGroup;
      }

      //Update
      axios({
        method: "put",
        url: this.$urlApplication + "PutKBRoleUser?id=" + obj.RoleUserId,
        data: obj
      })
        .then(res => {
          this.tableLoad();
          this.close();
          this.snackbar.isTrue = !this.snackbar.isTrue;
        })
        .catch(error => {});
    },

    deleteUser(id) {
      var pId = id;
      axios({
        method: "delete",
        url: this.$urlApplication + "DeleteKBRoleUser?id=" + pId
      })
        .then(res => {
          this.tableLoad();
        })
        .catch(error => {});
    },
    clear() {
      this.editedItem.UserRoleId = "";
      this.editedItem.FirstName = "";
      this.editedItem.LastName = "";
      this.editedItem.Email = "";
      this.selectUserGroup = [];
    },
    editItem(item) {
      var obj = item;
      //User Group Combobox--Start
      for (var items of this.itemsUserGroup) {
        if (obj.KBRoleUserGroupId == items.KBRoleUserGroupId) {
          this.selectUserGroup = items.name;
          break;
        }
      }
      //User Group Combobox--End
      this.getKBRoleUserAssignUserGroups(obj.RoleUserId);
      this.editedIndex = this.listOfRecords.indexOf(obj);
      this.editedItem = Object.assign({}, obj);
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.listOfRecords.indexOf(item);
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