<template>
  <v-layout row wrap class="pa-2">
    <v-flex lg12 class="mt-12">
      <v-card class="black--text elevation-5">
        <v-layout>
          <v-flex lg12>
            <v-card-title class="headline grey lighten-3 pa-1 ma-0" colorLight-title>Define Group</v-card-title>

            <v-card-title>
              <v-toolbar-title>Details</v-toolbar-title>
              <v-divider class="mx-2" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Search"
                color="colorLight"
                single-line
                hide-details
              ></v-text-field>
              <v-dialog v-model="dialog" max-width="500px">
                <v-btn
                  v-show="rights.Modify"
                  slot="activator"
                  color="colorLight"
                  dark
                  class="mb-2"
                >Add</v-btn>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container grid-list-md>
                      <form>
                        <v-layout wrap class="csmHide" id="divKBRoleUserGroupId">
                          <v-flex lg12>
                            <v-text-field
                              v-model="editedItem.KBRoleUserGroupId"
                              label="KBRoleUserGroupId"
                              disabled
                            ></v-text-field>
                          </v-flex>
                        </v-layout>
                        <v-layout wrap>
                          <v-flex lg12>
                            <v-text-field
                              v-model="editedItem.UserGroupName"
                              label="User Group Name"
                              color="colorLight"
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
                      @click="postKBRoleUserGroup"
                      v-show="this.editedIndex === -1 ? true : false"
                    >save</v-btn>
                    <v-btn
                      flat
                      @click="putKBRoleUserGroup"
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
              :pagination.sync="pagination"
            >
              <template slot="items" slot-scope="props">
                <td class="text-xs-left">{{ props.item.KBRoleUserGroupId }}</td>
                <td class="text-xs-left">{{ props.item.UserGroupName }}</td>

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
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>
        <v-divider light></v-divider>
        <v-card-actions class="pa-0 ma-0 ml-1"></v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mixins } from "../../../../mixins/CustomMixins";
import Application from "../../../../services/application-service";
import MonthPicker from "../../../../components/control/MonthPicker";
import axios from "axios";
export default {
  mixins: [mixins],
  components: {
    MonthPicker
  },
  data: () => ({
    rights: {
      View: false,
      Modify: false,
      Delete: false
    },
    dialog: false,

    pagination: {
      descending: true,
      sortBy: "KBRoleUserGroupId",
      rowsPerPage: 10
    },

    search: "",
    headers: [
      { text: "Role User Group Id", value: "KBRoleUserGroupId" },
      { text: "User Group Name", value: "UserGroupName" },
      { text: "Actions", value: "", sortable: false, align: "center" }
    ],
    isLoading: true,
    isValidate: true,
    desserts: [],
    editedIndex: -1,
    editedItem: {
      KBRoleUserGroupId: "",
      UserGroupName: ""
    },
    defaultItem: {
      KBRoleUserGroupId: "0",
      UserGroupName: ""
    }
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New User Group" : "Edit User Group";
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
      this.getKBRoleUserGroup();

      this.getUserRights([2027, 2028, 2029, 2030, 2031]).then(result => {
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
    async getKBRoleUserGroup() {
      const res = await axios
        .get(this.$urlApplication + "KBRoleUserGroup/GetKBRoleUserGroups")
        .then(res => {
          this.desserts = res.data;
        })
        .catch(error => {});
    },
    postKBRoleUserGroup() {
      var obj = this.editedItem;
      debugger;
      obj.KBRoleUserGroupId = 0;
      axios({
        method: "post",
        url: this.$urlApplication + "KBRoleUserGroup/PostKBRoleUserGroup",
        data: obj
      })
        .then(res => {
          this.getKBRoleUserGroup();
          this.close();
        })
        .catch(error => {});
    },

    putKBRoleUserGroup() {
      var obj = this.editedItem;
      axios({
        method: "put",
        url:
          this.$urlApplication +
          "PutKBRoleUserGroup?id=" +
          obj.KBRoleUserGroupId,
        data: obj
      })
        .then(res => {
          this.getKBRoleUserGroup();
          this.close();
        })
        .catch(error => {});
    },

    deleteKBRoleUserGroup(id) {
      var pId = id;
      axios({
        method: "delete",
        url: this.$urlApplication + "KBRoleUserGroup/DeleteKBRoleUserGroup?id=" + pId
      })
        .then(res => {
          this.getKBRoleUserGroup();
        })
        .catch(error => {});
    },
    clear() {
      this.editedItem.KBRoleUserGroupId = "";
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
        this.deleteKBRoleUserGroup(item.KBRoleUserGroupId);
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
