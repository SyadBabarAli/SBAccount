<template>
  <v-layout row wrap class="pa-2">
    <v-flex lg12 class="mt-12">
      <v-card class="black--text elevation-5">
        <v-layout>
          <v-flex lg12>
            <v-card-title
              class="headline grey lighten-3 pa-1 ma-0"
              primary-title
            >Quality Control Category</v-card-title>
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
                        <v-layout wrap v-show="false">
                          <v-flex lg12>
                            <v-text-field
                              v-model="editedItem.QualityCategoryId"
                              label="QualityCategoryId"
                              disabled
                            ></v-text-field>
                          </v-flex>
                        </v-layout>
                        <v-layout wrap class>
                          <v-flex lg12>
                            <v-text-field v-model="editedItem.Description" label="Name"></v-text-field>
                          </v-flex>
                        </v-layout>

                        <v-layout wrap class>
                          <v-flex lg12>
                            <v-text-field v-model="editedItem.Score" label="Score"></v-text-field>
                          </v-flex>
                        </v-layout>

                        <v-layout wrap class>
                          <v-flex lg12>
                            <v-text-field v-model="editedItem.Impact" label="Impact"></v-text-field>
                          </v-flex>
                        </v-layout>

                        <v-layout wrap class>
                          <v-flex lg12>
                            <v-checkbox
                              color="colorDark"
                              v-model="editedItem.Active"
                              label="Active"
                            ></v-checkbox>
                          </v-flex>
                        </v-layout>
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
              :headers="headers"
              :items="listOfRecords"
              class="elevation-3"
              :search="search"
            >
              <template slot="items" slot-scope="props">
                <td>{{ props.item.QualityCategoryId }}</td>
                <td class="text-xs-left">{{ props.item.Description }}</td>
                <td class="text-xs-left">{{ props.item.Score }}</td>
                <td class="text-xs-left">{{ props.item.Impact }}</td>
                <td class="text-xs-left">{{ props.item.Active == true ? 'Yes' : 'No' }}</td>
                <td class="justify-center layout px-0">
                  <v-btn
                    v-if="rights.Modify"
                    color="primary"
                    fab
                    small
                    dark
                    style="height:22px;width:22px;font-size:13px;"
                    @click="editItem(props.item)"
                  >
                    <v-icon style="font-size:13px">edit</v-icon>
                  </v-btn>
                  <v-btn
                    v-if="rights.Delete"
                    color="red"
                    fab
                    small
                    dark
                    style="height:22px;width:22px;font-size:13px;"
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
    <snack-bar :isSnackbar="IsSnackBar" />
  </v-layout>
</template>

<script>
import { mixins } from "../../../mixins/CustomMixins";
import Application from "../../../services/application-service";
import MonthPicker from "../../../components/control/MonthPicker";
import SnackBar from "../../../components/control/SnackBar";
import axios from "axios";
export default {
  mixins: [mixins],
  components: {
    MonthPicker,
    SnackBar
  },
  data: () => ({
    dialog: false,
    search: "",
    headers: [
      { text: "ID", value: "QualityCategoryId" },
      { text: "Name", value: "Description" },
      { text: "Score", value: "Score" },
      { text: "Impact", value: "Impact" },
      { text: "Active", value: "Active" },
      { text: "Actions", value: "", sortable: false, align: "center" }
    ],
    isLoading: true,
    isValidate: true,
    IsSnackBar :false,
    listOfRecords: [],
    editedIndex: -1,
    editedItem: {
      QualityCategoryId: 0,
      Description: "",
      Score: 0,
      Impact: "Low",
      Active: true
    },
    defaultItem: {
      QualityCategoryId: 0,
      Description: "",
      Score: 0,
      Impact: "Low",
      Active: true
    },
    rights: {
      View: false,
      Modify: false,
      Delete: false
    }
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "New Quality Control Category"
        : "Edit Quality Control Category";
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
      this.getUserRights([641, 642, 643]).then(result => {
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
      this.tableLoad();
    },
    async tableLoad() {
      const res = await axios
        .get(this.$urlApplication + "QualityCategory/Gets")
        .then(res => {
          this.listOfRecords = res.data;
        })
        .catch(error => {});
    },

    post() {
      var obj = this.editedItem;
      this.IsSnackBar = true;
      axios({
        method: "post",
        url: this.$urlApplication + "QualityCategory/Post",
        data: obj
      })
        .then(res => {
          this.tableLoad();
          this.close();
        })
        .catch(error => {});
    },

    put() {
      var obj = this.editedItem;
      this.IsSnackBar = true;
      axios({
        method: "put",
        url:
          this.$urlApplication +
          "QualityCategory/Put?id=" +
          obj.QualityCategoryId,
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
        url: this.$urlApplication + "QualityCategory/Delete?id=" + pId
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
      this.editedItem.QualityCategoryId = "";
      this.editedItem.Description = "";
      this.editedItem.Score = "";
      this.editedItem.Impact = "";
      this.editedItem.Active = true;
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
        this.delete(item.QualityCategoryId);
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