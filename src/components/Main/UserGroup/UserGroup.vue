<template>
  <div id="userGroup">
    <v-layout row wrap class="pa-2">
      <v-flex lg12 class="mt-12">
        <v-card class="black--text elevation-5">
          <v-layout>
            <v-flex lg12>
              <v-card-title class="headline grey lighten-3 pa-1 ma-0" primary-title>User Group</v-card-title>

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
                          <v-layout wrap v-show="false" >
                            <v-flex lg12>
                              <v-text-field
                                v-model="editedItem.RoleUserGroupId"
                                label="RoleUserGroupId"
                                disabled
                              ></v-text-field>
                            </v-flex>
                          </v-layout>
                          <v-layout wrap class id="divUserGroupName">
                            <v-flex lg12>
                              <v-text-field
                                v-model="editedItem.UserGroupName"
                                label="User Group Name"
                              ></v-text-field>
                            </v-flex>
                          </v-layout>
                        </form>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        flat
                        @click="postRoleUserGroup"
                        v-show="this.editedIndex === -1 ? true : false"
                      >save</v-btn>
                      <v-btn
                        flat
                        @click="putRoleUserGroup"
                         v-show="this.editedIndex === -1 ? false : true"
                      >update</v-btn>
                      <v-btn flat @click="clear">clear</v-btn>
                      <v-btn flat @click="close">cancel</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-card-title>
              <v-data-table
                :headers="headers"
                :items="desserts"
                class="elevation-3"
                :search="search"
              >
                <template slot="items" slot-scope="props">
                  <td>{{ props.item.RoleUserGroupId }}</td>
                  <td class="text-xs-left">{{ props.item.UserGroupName }}</td>
                  <td class="justify-center layout px-0">
                    <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                    <v-icon small @click="deleteItem(props.item)">delete</v-icon>
                  </td>
                </template>
              </v-data-table>
            </v-flex>
          </v-layout>
          <v-divider light></v-divider>
          <v-card-actions class="pa-0 ma-0 ml-1"></v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mixins } from "../../../mixins/CustomMixins";
import Application from "../../../services/application-service";
import MonthPicker from "../../../components/control/MonthPicker";
import axios from "axios";
export default {
  mixins: [mixins],
  components: {
    MonthPicker
  },
  data: () => ({
    dialog: false,
    search: "",
    headers: [
      { text: "Role User Group Id", value: "RoleUserGroupId" },
      { text: "User Group Name", value: "UserGroupName" },
      { text: "Actions", value: "", sortable: false ,align:"center"}
    ],
    isLoading: true,
    isValidate: true,
    desserts: [],
    editedIndex: -1,
    editedItem: {
      RoleUserGroupId: "",
      UserGroupName: ""
    },
    defaultItem: {
      RoleUserGroupId: "0",
      UserGroupName: ""
    }
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "New User Group"
        : "Edit User Group";
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
      this.getRoleUserGroup();
    },
    async getRoleUserGroup() {
      const res = await axios
        //.get("http://localhost:60868/api/GetRoleUserGroups")
        .get(this.$urlApplication + "RoleUserGroup/GetRoleUserGroups")
        .then(res => {
          this.desserts = res.data;
        })
        .catch(error => {});
    },

    // async getRoleUserGroup() {
    //   const res = await Application.getRoleUserGroup()
    //     .then(res => {
    //       this.desserts = res.data;
    //     })
    //     .catch(error => {});
    // },
    postRoleUserGroup() {
      var obj = this.editedItem;
      debugger;
      obj.RoleUserGroupId = 0;
      axios({
        method: "post",
        //url: "http://localhost:60868/api/PostRoleUserGroup",
        url: this.$urlApplication + "RoleUserGroup/PostRoleUserGroup",
        data: obj
      })
        .then(res => {
          this.getRoleUserGroup();
          this.close();
        })
        .catch(error => {});
    },

    putRoleUserGroup() {
      var obj = this.editedItem;
      axios({
        method: "put",
        url:
          this.$urlApplication +
          "RoleUserGroup/PutRoleUserGroup?id=" +
          //"http://localhost:60868/api/PutRoleUserGroup?id=" +
          obj.RoleUserGroupId,
        data: obj
      })
        .then(res => {
          this.getRoleUserGroup();
          this.close();
        })
        .catch(error => {});
    },

    deleteRoleUserGroup(id) {
      var pId = id;
      axios({
        method: "delete",
        //url: "http://localhost:60868/api/DeleteRoleUserGroup?id=" + pId
        url: this.$urlApplication + "RoleUserGroup/DeleteRoleUserGroup?id=" + pId
      })
        .then(res => {
          this.getRoleUserGroup();
        })
        .catch(error => {});
    },
    clear() {
      this.editedItem.RoleUserGroupId = "";
      this.editedItem.UserGroupName = "";
    },
    editItem(item) {
      var obj = item;
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.desserts.indexOf(item);

      confirm("Are you sure you want to delete this item?") &&
        this.deleteRoleUserGroup(item.RoleUserGroupId);
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