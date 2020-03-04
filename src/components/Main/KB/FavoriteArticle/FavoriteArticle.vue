<template>
  <layout-one :title="'Define Favorite Article'">
    <!-- <v-card-title>
      <v-toolbar-title>Details</v-toolbar-title>
      <v-divider class="mx-2" inset vertical></v-divider>
      <v-spacer></v-spacer>
      <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details color="kbPrimary"></v-text-field>
      <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        scrollable
      >
        <v-btn slot="activator" color="kbPrimary" dark class="mb-2">Add</v-btn>
        <v-card>
          <v-toolbar card dark color="kbPrimary">
            <v-btn icon dark @click="dialog = false">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>{{ articleformTitle }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn flat @click="postForm" v-show="this.editedIndex === -1 ? true : false">save</v-btn>
              <v-btn flat @click="putForm" v-show="this.editedIndex === -1 ? false : true">update</v-btn>
              <v-btn flat @click="clear">clear</v-btn>
              <v-btn flat @click="close">cancel</v-btn>
            </v-toolbar-items>
          </v-toolbar>

          <v-card-text>
            <v-container grid-list-md>
              <form>
                <v-layout wrap>
                  <v-flex lg6>
                    <v-text-field
                      v-show="true"
                      v-model="editedItem.KBFavoriteArticleId"
                      label="KBFavoriteArticle Id"
                      disabled
                      color="kbPrimary"
                    ></v-text-field>
                  </v-flex>
                  <v-flex lg6>
                    <v-checkbox color="kbPrimary" v-model="editedItem.Active" label="Active"></v-checkbox>
                  </v-flex>
                </v-layout>

                <v-layout wrap>
                  <v-flex lg6>
                    <v-combobox
                      v-model="selectKBTreeOption"
                      :items="itemsKBTreeOption"
                      label="Select an option"
                      item-text="text"
                      item-value="value"
                      color="kbPrimary"
                    ></v-combobox>
                  </v-flex>
                </v-layout>

                <v-layout>
                  <v-flex lg6>
                    <v-text-field v-model="editedItem.Name" label="Name" color="kbPrimary"></v-text-field>
                  </v-flex>
                  <v-flex lg6 v-show="true">
                    <v-text-field
                      v-model="editedItem.Description"
                      label="Description"
                      color="kbPrimary"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout>
                  <v-flex lg12 v-show="true">
                    <ckeditor
                      :editor="editor"
                      v-model="editedItem.KBFavoriteArticle"
                      :config="editorConfig"
                      :upload-adapter="UploadAdapter"
                    ></ckeditor>
                  </v-flex>
                </v-layout>
              </form>
            </v-container>
          </v-card-text>
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
        <td>{{ props.item.KBFavoriteArticleId }}</td>
        <td class="text-xs-left">{{ props.item.Name }}</td>
        <td class="text-xs-left">{{ (props.item.Active == 1 ? 'Yes' : 'No') }}</td>
        <td class="justify-center layout px-0">
          <v-btn color="kbPrimary" fab small dark style="height:22px;width:22px;font-size:13px;">
            <v-icon style="font-size:13px" @click="editItem(props.item)">edit</v-icon>
          </v-btn>
          <v-btn color="red" fab small dark style="height:22px;width:22px;font-size:13px;">
            <v-icon style="font-size:13px" @click="deleteItem(props.item)">delete</v-icon>
          </v-btn>
        </td>
      </template>
    </v-data-table>
    <snack-bar :isSnackbar="articleisSnackBar"/> -->
  </layout-one>
</template>

<script>
// import { mixins } from "../../../../mixins/CustomMixins";
// import Application from "../../../../services/application-service";
// import SnackBar from "../../../../components/control/SnackBar";
// import axios from "axios";
// import LayoutOne from "../../../../components/control/layout/LayoutOne";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// export default {
//   mixins: [mixins],
//   components: {
//     SnackBar,
//     LayoutOne
//   },
//   data: () => ({
//     selectKBTreeOption: null,
//     itemsKBTreeOption: [],

//     rating: 3,
//     //Text Editor-Start
//     editor: ClassicEditor,
//     editorData: "<p>Content of the editor.</p>",
//     editorConfig: {
//       // The configuration of the editor.
//     },
//     //Text Editor-End

//     rights: {
//       View: true,
//       Modify: true,
//       Delete: true,
//       Class: "csmHide"
//     },
//     snackbar: {
//       isTrue: true
//     },

//     dialog: false,
//     search: "",
//     headers: [
//       {
//         text: " KBFavoriteArticle Id",
//         value: "KBFavoriteArticleId",
//         align: "left"
//       },
//       { text: "Name", value: "Name" },
//       { text: "Active", value: "Active" },
//       { text: "Actions", value: "", sortable: false, align: "Center" }
//     ],
//     listOfRecords: [],
//     editedIndex: -1,

//     editedItem: {
//       Active: true,
//       KBFavoriteArticle: "",
//       Ids: []
//     },
//     defaultItem: {
//       Active: true,
//       KBFavoriteArticle: "0",
//       Ids: []
//     }
//   }),
//   computed: {
//     articleisSnackBar() {
//       return this.snackbar.isTrue;
//     },
//     articleformTitle() {
//       return this.editedIndex === -1 ? "New KBFavoriteArticle" : "Edit KBFavoriteArticle";
//     }
//   },
//   watch: {
//     dialog(val) {
//       var isTrue = val;

//       if (isTrue) {
//         this.dialogOpen();
//       } else {
//         this.close();
//       }
//     }
//   },
//   created() {
//     this.initialize();
//   },
//   methods: {
//     initialize() {
//       this.tableLoad();
//       this.getKBTreeViewOption();
//     },
//     UploadAdapter(obj) {
//       debugger;
//     },
//     getKBTreeViewOption() {
//       axios({
//         method: "get",
//         url: this.$urlApplication + "KBTree/GetKBTree"
//       })
//         .then(res => {
//           this.itemsKBTreeOption = [];

//           for (let value of res.data) {
//             var result = {
//               text: value.TREE,
//               value: value.ID
//             };
//             this.itemsKBTreeOption.push(result);
//           }
//         })
//         .catch(error => {});
//     },

//     getKBFavoriteArticleOption() {
//       axios({
//         method: "get",
//         url: this.$urlApplication + "GetKBFavoriteArticleOption"
//       }).then(res => {
//         this.itemsKBTreeOption = [];
//         var result2 = {
//           text: "Top-Level",
//           value: "0"
//         };
//         this.itemsKBTreeOption.push(result2);
//         for (let value of res.data) {
//           var result = {
//             text: value.Name,
//             value: value.KBFavoriteArticle
//           };
//           this.itemsKBTreeOption.push(result);
//         }
//       });
//     },

//     tableLoad() {
//       axios({
//         method: "get",
//         url: this.$urlApplication + "GetKBKBFavoriteArticles"
//       })
//         .then(res => {
//           this.listOfRecords = res.data;
//         })
//         .catch(error => {});
//     },
//     postForm() {
//       var obj = this.editedItem;
//       var selectKBTreeOption = this.selectKBTreeOption;
//       var name = obj.Name;

//       if (selectKBTreeOption == null || selectKBTreeOption < 0) {
//         alert("Please select main group");
//       } else if (name == undefined) {
//         alert("Please insert name");
//       } else {
//         obj.OrderBy = 1;
//         obj.KBTreeViewIdFK = selectKBTreeOption.value;

//         //Save
//         axios({
//           method: "post",
//           url: this.$urlApplication + "PostKBKBFavoriteArticle",
//           data: obj
//         })
//           .then(res => {
//             this.tableLoad();
//             this.close();
//             this.snackbar.isTrue = !this.snackbar.isTrue;
//           })
//           .catch(error => {});
//       }
//     },
//     putForm() {
//       var obj = this.editedItem;
//       var selectKBTreeOption = this.selectKBTreeOption;
//       var name = obj.Name;

//       if (selectKBTreeOption == null || selectKBTreeOption < 0) {
//         alert("Please select main group");
//       } else if (name == undefined) {
//         alert("Please insert name");
//       } else {
//         obj.OrderBy = 1;
//         obj.KBTreeViewIdFK = this.selectKBTreeOption.value;

//         //Update
//         axios({
//           method: "put",
//           url: this.$urlApplication + "PutKBKBFavoriteArticle?id=" + obj.KBFavoriteArticleId,
//           data: obj
//         })
//           .then(res => {
//             this.tableLoad();
//             this.close();
//             this.snackbar.isTrue = !this.snackbar.isTrue;
//           })
//           .catch(error => {});
//       }
//     },

//     deleteKBFavoriteArticle(id) {
//       var pId = id;
//       axios({
//         method: "delete",
//         url: this.$urlApplication + "DeleteKBKBFavoriteArticle?id=" + pId
//       })
//         .then(res => {
//           this.tableLoad();
//         })
//         .catch(error => {});
//     },
//     clear() {
//       this.editedItem.KBFavoriteArticle = "";
//       this.editedItem.Name = "";
//     },
//     editItem(item) {
//       var obj = item;

//       //Combobox--Start-1
//       for (var items of this.itemsKBTreeOption) {
//         if (obj.KBTreeViewIdFK == items.value) {
//           this.selectKBTreeOption = {
//             value: items.value,
//             text: items.text
//           };
//           break;
//         }
//       }
//       //Combobox-End-1

//       this.editedIndex = this.listOfRecords.indexOf(obj);
//       this.editedItem = Object.assign({}, obj);
//       this.dialog = true;
//     },
//     deleteItem(item) {
//       const index = this.listOfRecords.indexOf(item);
//       confirm("Are you sure you want to delete this item?") &&
//         this.deleteKBFavoriteArticle(item.KBFavoriteArticle);
//     },
//     close() {
//       if (!this.dialog) {
//         this.clear();
//       }

//       this.dialog = false;
//       setTimeout(() => {
//         this.editedItem = Object.assign({}, this.defaultItem);
//         this.editedIndex = -1;
//       }, 300);
//     },
//     dialogOpen() {
//       //Add New Entry
//       if (this.editedIndex === -1) {
//       }
//       //Edit
//       else {
//       }
//     }
//   }
// };
</script>