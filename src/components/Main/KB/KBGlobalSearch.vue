<template>
  <v-layout row wrap class="pa-2">
    <v-flex lg12>
      <v-card class="black--text elevation-5">
        <v-layout v-bind:style=" 'height : '+ (this.$vuetify.breakpoint.height - 100) + 'px' ">
          <v-flex lg12 class="pa-0">
            <v-card-title class="headline grey lighten-3 pa-1 ma-0" colorLight-title>Home &nbsp;</v-card-title>

            <v-container fluid grid-list-sm d-flex style="height:100%" class="pl-1 pb-5">
              <v-layout row wrap>
                <!-- Category-->
                <v-flex d-flex xs12 sm12 lg2 child-flex>
                  <v-layout row wrap>
                    <v-flex d-flex xs12 sm12 child-flex style="height:18%">
                      <v-card tile flat>
                        <v-card-text color="colorLight">
                          <v-treeview :items="userItems" open-all activatable>
                            <template slot="label" slot-scope="{ item }">
                              <a @click="getArticleByType(item)" class="black--text">{{ item.name }}</a>
                            </template>
                          </v-treeview>
                        </v-card-text>
                      </v-card>
                    </v-flex>

                    <v-divider class="mx-5"></v-divider>

                    <v-flex d-flex xs12 sm12 child-flex color="green" style="height:82%">
                      <v-card style="position: relative; overflow-y: auto;" tile flat>
                        <v-card-text style="position: absolute">
                          <br />
                          <v-treeview :items="filterMenu" item-key="name" activatable>
                            <template slot="label" slot-scope="{ item }">
                              <a
                                @click="getArticleByCategoryId(item)"
                                class="black--text"
                              >{{ item.name }}</a>
                            </template>
                          </v-treeview>
                        </v-card-text>
                      </v-card>
                    </v-flex>
                  </v-layout>
                </v-flex>

                <v-divider class="mx-2" inset vertical v-if="this.$vuetify.breakpoint.name == 'lg'"></v-divider>

                <!-- Global Search-->
                <v-flex d-flex xs12 sm12 lg3 child-flex>
                  <v-card style=" position: relative; overflow-y: auto;" tile flat>
                    <v-card-text style="position: absolute">
                      <v-text-field
                        v-model="search"
                        append-icon="search"
                        label="Search"
                        color="colorLight"
                        v-on:keyup.enter="searchClick(search)"
                      ></v-text-field>
                      <v-data-table
                        :headers="headers"
                        :items="listOfRecords"
                        class="mytable"
                        hide-headers
                        :pagination.sync="pagination"
                      >
                        <template slot="no-data" v-if="isLoading">
                          <v-progress-linear color="colorLight" height="2" value="15" indeterminate></v-progress-linear>
                        </template>

                        <template slot="items" slot-scope="props">
                          <td class="pb-4">
                            <v-layout class="pb-1">
                              <v-flex>
                                <h3 style="cursor: pointer;">
                                  <a
                                    style="color:#1a0dab; cursor: pointer;"
                                    @click="openArticle(props.item)"
                                  >{{ props.item.ArticleName }}</a>
                                </h3>
                              </v-flex>
                            </v-layout>
                            <v-layout v-if="search.length">
                              <div v-html="highlight(props.item)" style="color:#545454"></div>
                            </v-layout>
                            <v-layout>
                              <v-flex>
                                <h5 style="color:#6a6a6a">{{props.item.CategoryHierarchy}}</h5>
                              </v-flex>
                            </v-layout>
                          </td>
                        </template>
                      </v-data-table>
                    </v-card-text>
                  </v-card>
                </v-flex>

                <v-divider class="mx-2" inset vertical v-if="this.$vuetify.breakpoint.name == 'lg'"></v-divider>

                <!-- Article -->
                <v-flex d-flex xs12 sm12 lg6 child-flex>
                  <v-card tile flat>
                    <v-card-text style="position: absolute">
                      <v-layout row wrap v-show="(this.articleName.length > 0)">
                        <v-flex d-flex xs8 sm8 child-flex>
                          <!-- <h4 class="display-1 pb-1">{{this.articleName}}</h4> -->
                          <h5 class="headline pb-1">{{this.articleName}}</h5>
                        </v-flex>
                        <v-flex d-flex xs2 sm2 child-flex>
                          <v-btn
                            small
                            flat
                            color="colorLight"
                            dark
                            v-on:click="editArticle()"
                            v-if="this.rights.Modify"
                          >Edit</v-btn>
                        </v-flex>

                        <v-flex d-flex xs2 sm2 child-flex>
                          <v-icon
                            :color="(this.isFavorite ? '#ffb138' : 'black')"
                            v-on:click="addFavorite()"
                          >star</v-icon>
                        </v-flex>
                        <!-- <v-divider inset v-show="(this.articleName.length > 0)"></v-divider> -->
                        <v-flex xs12 sm12>
                          <ul>
                            <li v-for="(input, index) in this.tempfiles" :key>
                              <a
                                style="color:#0366d6; cursor: pointer;"
                                target="_blank"
                                v-bind:href="urlDomain+'//Documents/Article/'+input.FileNamePhysical+input.Extension"
                              >{{input.FileNameUser}}</a>
                            </li>
                          </ul>

                          <div class="document-editor">
                            <div class="document-editor__toolbar"></div>
                            <div class="document-editor__editable-container">
                              <div class="document-editor__editable">
                                <ckeditor
                                  :editor="editor"
                                  v-model="editorData"
                                  @ready="onReady"
                                  :config="editorConfig"
                                  :disabled="true"
                                ></ckeditor>
                              </div>
                            </div>
                          </div>
                          <!-- <vue-ckeditor
                            type="classic"
                            v-model="editorData"
                            :editors="editors"
                            :readonly="true"
                          ></vue-ckeditor>-->
                        </v-flex>
                      </v-layout>
                    </v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>
    <v-snackbar
      v-model="IsSnackBarFavorite"
      :timeout="1000"
      :horizantal="true"
      :right="true"
      :top="true"
    >
      {{(this.isFavorite ? "Added to favorite": "Removed to favorite" )}}
      <v-btn color="pink" flat @click="this.isFavorite = true">Close</v-btn>
    </v-snackbar>
  </v-layout>
</template>

<script>
import { mixins } from "../../../mixins/CustomMixins";
import Application from "../../../services/application-service";
import axios from "axios";
import LayoutOne from "../../../components/control/layout/LayoutOne";
import ProgressLinear from "../../../components/control/ProgressLinear";
import ProgressCircular from "../../../components/control/ProgressCircular";
import { defineLocale } from "moment";
import _ from "lodash";

import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";

// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import VueCkeditor from "vue-ckeditor5";

export default {
  mixins: [mixins],
  components: {
    ProgressLinear,
    ProgressCircular,
    LayoutOne
    //"vue-ckeditor": VueCkeditor.component
  },
  data: () => ({
    editors: {
      //classic: ClassicEditor
    },

    //Edit Article-Start
    editedItem: {
      comments: "",
      Active: true,
      Article: "",
      Ids: [],
      UserGroupIds: [],
      KBRoleUserGroupId: []
    },
    defaultItem: {
      comments: "",
      Active: true,
      Article: "",
      Ids: [],
      UserGroupIds: [],
      KBRoleUserGroupId: []
    },

    //AutoCompelete
    modelKBRoleUserGroup: null,
    arrayRoleUserGroup: [],

    tempfiles: [],

    rights: {
      Modify: false
    },

    //Edit Article-End

    isFavorite: false,
    IsSnackBarFavorite: false,
    pagination: {
      rowsPerPage: 5,
      descending: true,
      sortBy: "ArticleId"
    },

    isLoading: true,
    userItems: [{ id: 1, name: "My Favorites" }, { id: 2, name: "Recent" }],

    iconColor: "",
    isIconFavorite: true,
    //Category-Start
    selectedId: 0,
    filterMenu: [],

    //Category-End

    //Text Editor-Start
    //editor: ClassicEditor,
    editor: DecoupledEditor,

    editorData: "",
    editorConfig: {
      readOnly: true,
      isReadOnly: true,
      editorDisabled: true
    },

    editorSettings: {
      modules: {
        toolbar: false
      }
    },

    //Text Editor-End
    articleName: "",
    selectKBTreeOption: null,
    itemsKBTreeOption: [],
    dialog: false,
    search: "",
    search: "",
    headers: [
      { text: "Article Name", value: "ArticleName" },
      { text: "Article Short", value: "ArticleShort" },
      { text: "Article", value: "ArticleCompelete" }
    ],
    listOfRecords: [],
    editedIndex: -1,

    editedItem: {
      Active: true,
      ArticleId: 0
    }
  }),

  created() {
    this.initialize();
  },
  watch: {
    dialog(val) {
      var isTrue = val;
      if (isTrue) {
        this.dialogOpen();
      } else {
        this.dialogClose();
      }
    },
    selectUserGroup(obj) {
      var pObj = obj;
      var arrayValues = [];
      for (var i = 0; i < pObj.length; i++) {
        arrayValues.push(pObj[i].UserGroupId);
      }
      this.editedItem.KBRoleUserGroupId = arrayValues;
    },

    modelKBRoleUserGroup(obj) {
      var pObj = obj;
      var arrayValues = [];
      for (var i = 0; i < pObj.length; i++) {
        arrayValues.push(pObj[i].id);
      }
      this.editedItem.KBRoleUserGroupId = arrayValues;
    }
  },
  computed: {
    urlDomain() {
      return this.$urlDomain;
    }
  },
  updated: function() {
    this.$nextTick(function() {
      // Code that will run only after the
      // entire view has been re-rendered
      var obj = document.querySelector(".ck-toolbar");
      if (obj != null) {
        obj.style.display = "none";
      }
    });
  },

  methods: {
    onReady(editor) {
      // Insert the toolbar before the editable area.
      editor.ui
        .getEditableElement()
        .parentElement.insertBefore(
          editor.ui.view.toolbar.element,
          editor.ui.getEditableElement()
        );
    },
    initialize() {
      this.getUserRights([2013]).then(result => {
        result.forEach(element => {
          if (element.name == "Modify") {
            this.rights.Modify = true;
          }
        });
      });

      //this.getKBTreeViewOption();
      this.getCategoryArticle();
      this.getSearchArticle();

      //Edit Article--Start
      this.getKBTreeViewOption();
      this.getKBRoleUserGroup();
      //Edit Article--END
    },

    //---------------------------------------------------------Categories----------------------------------------------Start
    list_to_treeNew(list) {
      var map = {},
        node,
        roots = [],
        i;
      for (i = 0; i < list.length; i += 1) {
        map[list[i].id] = i; // initialize the map
        list[i].children = []; // initialize the children
      }
      for (i = 0; i < list.length; i += 1) {
        node = list[i];
        //if (node.parentId !== "0") {
        if (node.parentId != 0) {
          // if you have dangling branches check that map[node.parentId] exists
          list[map[node.parentId]].children.push(node);
        } else {
          roots.push(node);
        }
      }
      return roots;
    },

    clearArticle() {
      this.editorData = "";
      this.articleName = "";
      this.search = "";
      this.isFavorite = false;
    },
    getArticleByCategoryId(obj) {
      this.listOfRecords = [];
      this.isLoading = true;
      this.clearArticle();
      var pId = obj.id;

      if (pId == 1000) {
        this.getSearchArticle();
      } else {
        this.selectedId = obj.id;
        axios({
          method: "get",
          url: this.$urlApplication + "KBTree/GetArticleByCategoryId?id=" + pId
        })
          .then(res => {
            this.listOfRecords = res.data;
            this.isLoading = false;
          })
          .catch(error => {
            this.listOfRecords = [];
            this.isLoading = false;
          });
      }
    },
    getCategoryArticle() {
      return fetch(this.$urlApplication + "KBTree/GetRoleMenu")
        .then(res => res.json())
        .then(data => {
          var objData = data;
          var result = [];

          for (var i = 0; i < objData.length; i++) {
            var obj = objData[i];
            var iD = obj.Id;
            var optionName = obj.Name;
            var parentId = obj.ParentId;

            result.push({
              id: iD,
              parentId: parentId,
              name: optionName
            });
          } //End Loop

          result = _.orderBy(result.filter(data => true), "OrderBy", "asc");
          var v1 = this.list_to_treeNew(result);
          this.filterMenu = v1;
        })
        .catch(err => console.log(err));
    },

    //---------------------------------------------------------Categories----------------------------------------------End

    //---------------------------------------------------------GlobalSearch----------------------------------------------Start

    searchClick(txt) {
      //
      this.isLoading = true;
      this.listOfRecords = [];
      var searchText = txt == "" ? "%" : txt;
      axios({
        method: "get",
        url:
          this.$urlApplication + "KBTree/GetSearchArticle?search=" + searchText
      })
        .then(res => {
          this.listOfRecords = res.data;
          this.isLoading = false;
        })
        .catch(error => {
          this.listOfRecords = [];
          this.isLoading = false;
        });
    },
    openArticle(obj) {
      var id = obj.ArticleId;
      this.getDocuments(id);
      this.isLoading = true;
      axios({
        method: "get",
        url: this.$urlApplication + "KBTree/GetArticleById?id=" + id
      })
        .then(res => {
          this.editorData = res.data[0].ArticleCompelete;
          this.articleName = res.data[0].ArticleName;
          this.selectedArticleId = res.data[0].ArticleId;
          var isFavorite = res.data[0].IsFavorite;
          this.isFavorite = isFavorite == undefined ? false : isFavorite;

          if (isFavorite) {
            this.iconColor = "#ffb138";
          } else {
            this.iconColor = "black";
          }
        })
        .catch(error => {
          res.data[0].Article;
        });
    },
    highlight(obj) {
      var result = "";
      var editorData = obj.ArticleShort;
      editorData = editorData.replace(/(<([^>]+)>)/gi, "");

      if (!this.search) {
        result = editorData;
      } else {
        result = editorData.replace(new RegExp(this.search, "gi"), match => {
          return '<span class="highlightText">' + match + "</span>";
        });
      }
      return result;
    },
    getDocuments(id) {
      axios({
        method: "get",
        url: this.$urlApplication + "KBArticle/GetDocuments?id=" + id
      })
        .then(res => {
          this.tempfiles = [];
          res.data.forEach(element => {
            this.tempfiles.push({
              FileNameUser: element.FileNameUser,
              FileNamePhysical: element.FileNamePhysical,
              Extension: element.Extension
            });
          });
        })
        .catch(error => {});
    },
    getKBTreeViewOption() {
      axios({
        method: "get",
        url: this.$urlApplication + "KBTree/GetKBTree"
      })
        .then(res => {
          this.itemsKBTreeOption = [];

          for (let value of res.data) {
            var result = {
              text: value.TREE,
              value: value.ID
            };
            this.itemsKBTreeOption.push(result);
          }
        })
        .catch(error => {});
    },

    getArticleOption() {
      axios({
        method: "get",
        url: this.$urlApplication + "GetArticleOption"
      }).then(res => {
        this.itemsKBTreeOption = [];
        var result2 = {
          text: "Top-Level",
          value: "0"
        };
        this.itemsKBTreeOption.push(result2);
        for (let value of res.data) {
          var result = {
            text: value.Name,
            value: value.Article
          };
          this.itemsKBTreeOption.push(result);
        }
      });
    },
    //---------------------------------------------------------GlobalSearch----------------------------------------------End

    addFavorite(obj) {
      this.IsSnackBarFavorite = true;
      this.isFavorite = !this.isFavorite;
      this.editedItem.ArticleId = this.selectedArticleId;
      this.editedItem.Active = this.isFavorite;

      //Update
      axios({
        method: "put",
        url:
          this.$urlApplication +
          "PutKBFavoriteArticle?id=" +
          this.selectedArticleId,
        data: this.editedItem
      })
        .then(res => {})
        .catch(error => {});
    },

    getSearchArticle() {
      this.isLoading = true;
      axios({
        method: "get",
        url: this.$urlApplication + "KBTree/GetSearchArticle?search=%"
      })
        .then(res => {
          this.listOfRecords = res.data;
          this.isLoading = false;
        })
        .catch(error => {
          this.isLoading = false;
        });
    },

    getArticleByType(obj) {
      this.clearArticle();

      var id = obj.id;
      var pUrl = null;
      this.isLoading = true;
      this.listOfRecords = [];

      if (id == 1) {
        pUrl = this.$urlApplication + "KBTree/GetFavoriteArticleByUser";
      } else if (id == 2) {
        pUrl = this.$urlApplication + "KBTree/GetRecentArticle";
      }
      axios({
        method: "get",
        url: pUrl
      })
        .then(res => {
          this.listOfRecords = res.data;
          this.isLoading = false;
        })
        .catch(error => {
          this.listOfRecords = [];
          this.isLoading = false;
        });
    },

    //Edit Article-START
    putEdit() {
      var obj = this.editedItem;
      var selectKBTreeOption = this.selectKBTreeOption;
      var name = obj.Name;
      obj.RequestTypeId = 21;
      if (selectKBTreeOption == null || selectKBTreeOption < 0) {
        alert("Please select main group");
      } else if (name == undefined) {
        alert("Please insert name");
      } else {
        obj.OrderBy = 1;
        obj.KBTreeViewIdFK = this.selectKBTreeOption.value;

        if (typeof this.selectUserGroup == "string") {
          for (var items of this.itemsUserGroup) {
            if (this.selectUserGroup == items.name) {
              obj.UserGroupIds.push(items);
              break;
            }
          }
        } else if (typeof this.selectUserGroup == "object") {
          obj.UserGroupIds = this.selectUserGroup;
        }

        obj.KBRoleUserGroupIds = obj.KBRoleUserGroupId;

        //Update
        axios({
          method: "put",
          url: this.$urlApplication + "PutEditArticle?id=" + obj.ArticleId,
          data: obj
        })
          .then(res => {
            this.getSearchArticle();
            this.dialogClose();
            this.snackbar.isTrue = !this.snackbar.isTrue;
          })
          .catch(error => {});
      }
    },

    clear() {
      this.editedItem.Article = "";
      this.editedItem.Name = "";
      this.editedItem.Description = "";
      this.modelKBRoleUserGroup = "";
      this.selectKBTreeOption = "";
    },
    dialogClose() {
      if (!this.dialog) {
        this.clear();
      }

      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    dialogOpen() {
      //Add New Entry
      if (this.editedIndex === -1) {
      }
      //Edit
      else {
      }
    },

    getKBRoleUserGroup() {
      axios({
        method: "get",
        url: this.$urlApplication + "KBRoleUserGroup/GetKBRoleUserGroups"
      })
        .then(res => {
          this.arrayRoleUserGroup = [];
          for (let value of res.data) {
            var result = {
              id: value.KBRoleUserGroupId,
              name: value.UserGroupName
            };
            this.arrayRoleUserGroup.push(result);
          }
        })
        .catch(error => {});
    },

    getKBRoleCategoryRights(id) {
      axios({
        method: "get",
        url: this.$urlApplication + "GetKBRoleCategoryRights?id=" + id
      })
        .then(res => {
          this.modelKBRoleUserGroup = [];
          var userGroup = this.arrayRoleUserGroup;

          for (let v1 of res.data) {
            for (let v2 of userGroup) {
              if (v1.KBRoleUserGroupId == v2.id) {
                var id = v2.id;
                var value = v2.name;
                var result = {
                  id: id,
                  name: value
                };
                this.modelKBRoleUserGroup.push(result);
                break;
              }
            }
          }
        })
        .catch(error => {});
    },

    getEditKBArticle(id) {
      axios({
        method: "get",
        url: this.$urlApplication + "GetEditKBArticle?id=" + id
      })
        .then(res => {
          var obj = res.data;

          //Combobox--Start-1
          for (var items of this.itemsKBTreeOption) {
            if (obj.KBTreeViewIdFK == items.value) {
              this.selectKBTreeOption = {
                value: items.value,
                text: items.text
              };
              break;
            }
          }
          //Combobox-End-1
          this.getKBRoleCategoryRights(obj.ArticleId);
          this.editedItem.ArticleId = this.selectedArticleId;
          this.editedItem.Name = obj.Name;
          this.editedItem.Description = obj.Description;
          this.editedItem.Article = obj.Article;
          this.dialog = true;
        })
        .catch(error => {});
    },

    editArticle() {
      var articleId = this.selectedArticleId;
      this.$router.push({
        path: "/KB/ArticleEdit",
        query: { id: articleId, edit: true }
      });
      // this.dialog = true;
      // this.getEditKBArticle(this.selectedArticleId);
    }
    //Edit Article-END
  }
};
</script>
<style scoped>
/* .txtEditor >>> .ck-toolbar
{
  display: none;
} */

/* .ck .ck-sticky-panel__content
{
  display: none;
} */

.mytable >>> .v-table tbody tr:not(:last-child) {
  border-bottom: none;
}
/* .mytable .v-table tbody tr:not(:last-child) {
  border-bottom: none;
} */

.mytable
  >>> .theme--light.v-table
  tbody
  tr:hover:not(.v-datatable__expand-row) {
  background: none;
}
.highlightText {
  background: yellow;
}
.pointer {
  cursor: pointer;
}

a:link {
  text-decoration: none;
}

a:visited {
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

a:active {
  text-decoration: underline;
}

.scroll-here {
  height: 740px;
}
/* .txtEditor >>> .ck-toolbar {
  display: none !important;
} */

.sticky {
  position: fixed;
  /* top: 0;
  width: 100%; */
}
/* CKEditor Style */
/* 1-Border Show */
.document-editor {
  border: 1px solid var(--ck-color-base-border);
  border-radius: var(--ck-border-radius);

  /* Set vertical boundaries for the document editor. */
  max-height: 620px;

  /* This element is a flex container for easier rendering. */
  display: flex;
  flex-flow: column nowrap;
}

/* 2-Scrollbar */
/* Make the editable container look like the inside of a native word processor application. */
.document-editor__editable-container {
  /* padding: calc(2 * var(--ck-spacing-large)); */
  background: var(--ck-color-base-foreground);

  /* Make it possible to scroll the "page" of the edited content. */
  overflow-y: scroll;
}

.document-editor__editable-container .ck-editor__editable {
  /* Set the dimensions of the "page". */
  width: 15.8cm;
  min-height: 21cm;

  /* Keep the "page" off the boundaries of the container. */
  padding: 1cm 2cm 2cm;

  border: 1px hsl(0, 0%, 82.7%) solid;
  border-radius: var(--ck-border-radius);
  background: white;

  /* The "page" should cast a slight shadow (3D illusion). */
  box-shadow: 0 0 5px hsla(0, 0%, 0%, 0.1);

  /* Center the "page". */
  margin: 0 auto;
}

.document-editor .ck-content a {
  color: red !important;
}
</style>