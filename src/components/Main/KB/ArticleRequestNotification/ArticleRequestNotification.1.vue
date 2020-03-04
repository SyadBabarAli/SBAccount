<template>
  <v-layout row wrap class="pa-2">
    <v-flex lg12 class="mt-12">
      <v-card class="black--text elevation-5">
        <v-layout>
          <v-flex lg12>
            <v-card-title
              class="headline grey lighten-3 pa-1 ma-0"
              primary-title
            >Article Request Notification</v-card-title>
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
                <v-btn v-show="rights.Modify" slot="activator" color="primary" dark class="mb-2">Add</v-btn>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container grid-list-md>
                      <form>
                        <v-layout wrap>
                          <v-flex lg12>
                            <v-text-field
                              v-model="editedItem.KBArticleRequestNotificationId"
                              label="Id"
                              disabled
                            ></v-text-field>
                          </v-flex>
                        </v-layout>

                        <!-- <v-layout wrap>
                          <v-flex lg12>
                            <v-text-field
                              v-model="editedItem.Name"
                              label="Name"
                              color="colorLight"
                            ></v-text-field>
                          </v-flex>
                        </v-layout>-->

                        <v-layout wrap>
                          <v-flex lg12>
                            <v-combobox
                              v-model="selectRequestType"
                              :items="itemsRequestType"
                              label="Select a request type"
                              item-text="text"
                              item-value="value"
                              color="colorLight"
                            ></v-combobox>
                          </v-flex>
                        </v-layout>

                        <v-layout wrap>
                          <v-flex lg12>
                            <v-text-field
                              v-model="editedItem.EmailId"
                              label="Email Ids"
                              color="colorLight"
                            ></v-text-field>
                          </v-flex>
                        </v-layout>

                        <v-layout wrap>
                          <v-flex lg12>
                            <v-checkbox
                              color="colorDark"
                              v-model="editedItem.Active"
                              label="Active"
                            ></v-checkbox>
                          </v-flex>
                        </v-layout>

                        <!-- <v-layout wrap >
                          <v-flex lg12>
                            <v-text-field
                              v-model="editedItem.Active"
                              label="User Id"
                              color="colorLight"
                            ></v-text-field>
                          </v-flex>
                        </v-layout>-->
                      </form>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn flat @click="post" v-show="this.editedIndex === -1 ? true : false">save</v-btn>
                    <v-btn flat @click="put" v-show="this.editedIndex === -1 ? false : true">update</v-btn>
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
                <td>{{ props.item.KBArticleRequestNotificationId }}</td>
                <!-- <td class="text-xs-left">{{ props.item.Name }}</td> -->
                <td class="text-xs-left">{{ props.item.RequestDescription }}</td>
                <td class="text-xs-left">{{ props.item.EmailId }}</td>
                <td class="text-xs-left">{{ props.item.Active == true ?"Yes" :"No" }}</td>

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
                  <v-btn
                    color="colorLight"
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
                </td>-->
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>
    <snack-bar :isSnackbar="IsSnackBar" />

    <v-dialog v-model="dialog2" max-width="500px" scrollable persistent>
      <v-btn v-show="rights.Modify" slot="activator" color="primary" dark class="mb-2">Add</v-btn>
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap v-show="false">
              <v-flex lg12>
                <v-text-field
                  v-model="editedItem.QualityIndicatorId"
                  label="Quality Indicator Id"
                  disabled
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { mixins } from "../../../../mixins/CustomMixins";
import SnackBar from "../../../../components/control/SnackBar";
import axios from "axios";
export default {
  mixins: [mixins],
  components: {
    SnackBar
  },
  data: () => ({
    rights: {
      View: false,
      Modify: false,
      Delete: false
    },
    snackbar: {
      isTrue: true
    },

    selectRequestType: null,
    itemsRequestType: [],

    dialog: false,
    dialog2:false,
    search: "",
    headers: [
      {
        text: "Id",
        value: "KBArticleRequestNotificationId"
      },
      //{ text: "Name", value: "Name" },
      { text: "Request Type", value: "RequestDescription" },
      { text: "Email Ids", value: "EmailId" },
      { text: "Active", value: "Active" },
      { text: "Actions", value: "", sortable: false, align: "Center" }
    ],
    listOfRecords: [],
    editedIndex: -1,

    editedItem: {
      UserRoleId: "",
      RequestTypeId: "",
      EmailId: "",
      Active: "",
      Password: "",
      LocationId: 1,
      KBUserGroupIds: []
    },
    defaultItem: {
      UserRoleId: "0",
      RequestTypeId: "",
      EmailId: "",
      Password: "",
      Active: "",
      LocationId: 1,
      KBUserGroupIds: []
    }
  }),
  computed: {
    IsSnackBar() {
      return this.snackbar.isTrue;
    },
    formTitle() {
      return this.editedIndex === -1
        ? "New Article Request Notification"
        : "Edit Article Request Notification";
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
      this.getRequestTypes();

      this.getUserRights([2038, 2040, 2041]).then(result => {
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

    getRequestTypes() {
      axios({
        method: "get",
        url:
          this.$urlApplication + "KBArticleRequestNotification/GetRequestType"
      })
        .then(res => {
          this.itemsRequestType = [];
          for (let obj of res.data) {
            var result = {
              value: obj.value,
              text: obj.text
            };
            this.itemsRequestType.push(result);
          }
        })
        .catch(error => {});
    },

    tableLoad() {
      axios({
        method: "get",
        url: this.$urlApplication + "KBArticleRequestNotification/Get"
      })
        .then(res => {
          this.listOfRecords = res.data;
          //debugger
        })
        .catch(error => {});
    },
    post() {
      var obj = this.editedItem;
      obj.UserRoleId = 0;
      this.editedItem.RequestTypeId = this.selectRequestType.value;
      //Save
      axios({
        method: "post",
        url: this.$urlApplication + "KBArticleRequestNotification/Post",
        data: obj
      })
        .then(res => {
          this.tableLoad();
          this.close();
          this.snackbar.isTrue = !this.snackbar.isTrue;
        })
        .catch(error => {
          alert("This request already created.");
        });
    },
    put() {
      var obj = this.editedItem;
      this.editedItem.RequestTypeId = this.selectRequestType.value;
      if (typeof this.selectRequestType == "string") {
        for (var items of this.itemsRequestType) {
          if (this.selectRequestType == items.name) {
            this.editedItem.KBUserGroupIds.push(items);
            break;
          }
        }
      } else if (typeof this.selectRequestType == "object") {
        this.editedItem.KBUserGroupIds = this.selectRequestType;
      }

      //Update
      axios({
        method: "put",
        url:
          this.$urlApplication +
          "KBArticleRequestNotification/Put?id=" +
          obj.KBArticleRequestNotificationId,
        data: obj
      })
        .then(res => {
          this.tableLoad();
          this.close();
          this.snackbar.isTrue = !this.snackbar.isTrue;
        })
        .catch(error => {});
    },

    delete(id) {
      var pId = id;
      axios({
        method: "delete",
        url:
          this.$urlApplication + "KBArticleRequestNotification/Delete?id=" + pId
      })
        .then(res => {
          this.tableLoad();
        })
        .catch(error => {});
    },
    clear() {
      this.editedItem.KBArticleRequestNotificationId = "";
      this.editedItem.RequestTypeId = "";
      this.editedItem.EmailId = "";
      this.editedItem.Active = "";
      this.selectRequestType = [];
    },
    editItem(item) {
      var obj = item;
      //User Group Combobox--Start
      for (var items of this.itemsRequestType) {
        // debugger
        if (obj.RequestTypeId == items.value) {
          this.selectRequestType = {
            value: items.value,
            text: items.text
          };

          break;
        }
      }
      //User Group Combobox--End
      //this.getKBRoleUserAssignUserGroups(obj.KBArticleRequestNotificationId);
      this.editedIndex = this.listOfRecords.indexOf(obj);
      this.editedItem = Object.assign({}, obj);
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.listOfRecords.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.delete(item.KBArticleRequestNotificationId);
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