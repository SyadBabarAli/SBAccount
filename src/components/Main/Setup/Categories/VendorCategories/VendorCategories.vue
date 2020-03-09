<template>
  <v-layout row wrap class="pa-2">
    <v-flex lg12 class="mt-12">
      <v-card class="black--text elevation-5">
        <v-layout>
          <v-flex lg12>
            <v-card-title class="headline grey lighten-3 pa-1 ma-0" primary-title>Category Vendor</v-card-title>
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
                        >Category Vendor</v-card-title>
                        <v-divider></v-divider>
                        <!-- <v-flex lg6>
                          <v-text-field
                            v-model="editedItem.CategoryVendorId"
                            label="CategoryVendorId"
                          ></v-text-field>
                        </v-flex>-->

                        <v-flex lg6>
                          <v-text-field
                            v-model="editedItem.CategoryVendorId"
                            label="ID"
                            disabled
                            v-show="false"
                          ></v-text-field>
                        </v-flex>
                        <v-flex lg6>
                          <v-text-field v-model="editedItem.Name" label="Name"></v-text-field>
                        </v-flex>
                        <!-- <v-flex lg6>
                          <v-text-field v-model="editedItem.IsActive" label="IsActive"></v-text-field>
                        </v-flex>
                        <v-flex lg6>
                          <v-text-field v-model="editedItem.IsDeleted" label="IsDeleted"></v-text-field>
                        </v-flex>-->
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
                <td class="text-xs-left">{{ props.item.CategoryVendorId }}</td>
                <td class="text-xs-left">{{ props.item.Name }}</td>
                <td class="text-xs-left">{{ props.item.IsActive }}</td>
                <td class="text-xs-left">{{ props.item.IsDeleted }}</td>
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
    CategoryVendorId: 0,
    Name: "",
    IsActive: "",
    IsDeleted: "",

    dialog: false,
    search: "",
    headers: [
      { text: "CategoryVendorId", value: "CategoryVendorId" },
      { text: "Name", value: "Name" },
      { text: "IsActive", value: "IsActive" },
      { text: "IsDeleted", value: "IsDeleted" },
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
      return this.editedIndex === -1
        ? "New Category Vendor"
        : "Edit Category Vendor";
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
    initialize() {
      this.tableLoad();
    },

    async tableLoad() {
      this.isLoading = true;
      const res = await axios
        .get(this.$urlApplication + "CategoryVendor/GetCategoryVendors")
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
      obj.Name = this.editedItem.Name;

      this.IsSnackBar = true;

      axios({
        method: "post",
        url: this.$urlApplication + "CategoryVendor/Post",
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
      obj.CategoryVendorId = this.editedItem.CategoryVendorId;
      obj.Name = this.editedItem.Name;     
      this.IsSnackBar = true;

      axios({
        method: "put",
        url:
          this.$urlApplication +
          "CategoryVendor/Put?id=" +
          obj.CategoryVendorId,
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
        url:
          this.$urlApplication + "CategoryVendor/Delete?companyId=1&id=" + pId
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
      this.editedItem.CategoryVendorName = "";
      this.editedItem.Name = "";
    },
    editItem(item) {
      var obj = item;

      this.editedIndex = this.listOfRecords.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.listOfRecords.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.delete(item.CategoryVendorId);
    },
    dialogOpen() {
      if (this.editedItem.CategoryVendorId == undefined) {
        //When click add
        this.editedItem.Active = true;
        this.clear();
      } else {
        //Edite Record
        //this.changeCategoryVendors(this.selectCategoryVendors);
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