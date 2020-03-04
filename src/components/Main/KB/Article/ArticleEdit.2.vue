<template>
  <v-layout row wrap class="pa-2">
    <v-flex lg12>
      <!-- {{ getLiveUrl()}} -->
      <v-card class="black--text elevation-5">
        <v-layout>
          <v-flex lg12 class="pa-0">
            <v-card-title class="headline grey lighten-3 pa-1 ma-0" primary-title>
              Define Article ({{getCurrentTab()}})
              <v-layout wrap>
                <v-flex lg12 text-xs-right>
                  <v-btn
                    small
                    @click="dialogPushback = true"
                    v-if="getCurrentTab() != 'Draft' && 
                    getCurrentTab() != 'New'
                    && !this.$route.query.edit "
                    color="colorLight"
                    dark
                  >pushback</v-btn>
                  <v-btn
                    small
                    color="colorLight"
                    dark
                    @click="postForm"
                    v-if="this.editedIndex === -1 ? true : false"
                  >Save</v-btn>
                  <v-btn
                    small
                    color="colorLight"
                    dark
                    @click="putForm"
                    v-if=" ( (getCurrentTab() != 'Published') && (this.editedIndex === -1 ? false : true) || this.$route.query.edit)"
                  >update</v-btn>
                  <v-btn
                    small
                    color="colorLight"
                    dark
                    @click="putSubmitRequest"
                    v-if="getCurrentTab() != 'Published'"
                  >Submit</v-btn>
                  <v-btn small color="colorLight" dark @click="clear">clear</v-btn>
                  <v-btn
                    small
                    color="colorLight"
                    dark
                    :to="'/KB/Article?tabIndex='+this.tabIndex"
                  >cancel</v-btn>
                </v-flex>
              </v-layout>
            </v-card-title>
            <v-card>
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex lg6>
                      <v-btn v-on:click="addFiles()">
                        <v-icon>attach_file</v-icon>attachment
                      </v-btn>
                      <input
                        type="file"
                        id="files"
                        ref="files"
                        multiple
                        v-on:change="handleFilesUpload()"
                        style="display:none"
                      />
                    </v-flex>
                    <v-flex lg6></v-flex>
                  </v-layout>

                  <v-layout row>
                    <v-flex>
                      <div v-if="!isFileUploadError">
                        <div v-if="isFileUpload">
                          <v-progress-linear :indeterminate="true"></v-progress-linear>
                        </div>
                        <ul v-else>
                          <li v-for="(input, index) in this.tempfiles" :key>
                            <a
                              target="_blank"
                              v-bind:href="urlDomain+'//Documents/Article/'+input.FileNamePhysical+input.Extension"
                            >{{input.FileNameUser}}</a>
                            <v-icon color="red" @click="deleteAttachment(index)">close</v-icon>
                          </li>
                        </ul>
                      </div>
                      <v-alert
                        style="height:36px"
                        :value="true"
                        type="error"
                        v-else
                      >No file uploaded or invalid file type!</v-alert>
                    </v-flex>
                  </v-layout>

                  <v-layout wrap>
                    <v-flex lg6>
                      <v-text-field
                        v-show="true"
                        v-model="editedItem.ArticleCode"
                        label="Article Id"
                        disabled
                        color="colorLight"
                      ></v-text-field>
                    </v-flex>
                    <v-flex lg6 v-show="tabs.Published">
                      <v-checkbox color="colorLight" v-model="editedItem.Active" label="Active"></v-checkbox>
                    </v-flex>
                  </v-layout>

                  <v-layout wrap>
                    <v-flex lg6>
                      <v-combobox
                        v-model="selectCategory"
                        :items="itemsCategory"
                        label="Select a category"
                        item-text="text"
                        item-value="value"
                        color="colorLight"
                      ></v-combobox>
                    </v-flex>
                    <v-flex lg6>
                      <v-text-field
                        v-model="editedItem.Name"
                        label="Article Name"
                        color="colorLight"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>

                  <v-layout>
                    <v-flex lg6>
                      <v-text-field
                        v-model="editedItem.Description"
                        label="Description"
                        color="colorLight"
                      ></v-text-field>
                    </v-flex>

                    <v-flex lg6>
                      <v-textarea
                        v-model="editedItem.comments"
                        color="colorLight"
                        label="Comments"
                        value
                        hint="Comments Supervisor"
                      ></v-textarea>
                    </v-flex>
                  </v-layout>

                  <v-layout>
                    <v-flex lg6>
                      <v-autocomplete
                        v-model="selectKBRoleCategoryRight"
                        :items="itemsKBRoleCategoryRight"
                        color="colorLight"
                        persistent-hint
                        item-text="name"
                        return-object
                        prepend-icon="person"
                        multiple
                      ></v-autocomplete>
                    </v-flex>
                  </v-layout>

                  <v-layout>
                    <v-flex lg12 v-show="true">
                      <div class="document-editor">
                        <div class="document-editor__toolbar"></div>
                        <div class="document-editor__editable-container">
                          <div class="document-editor__editable">
                            <ckeditor
                              :editor="editor"
                              v-model="editedItem.Article"
                              @ready="onReady"
                              :config="editorConfig"
                            ></ckeditor>
                          </div>
                        </div>
                      </div>
                      <!-- <ckeditor
                        :editor="editor"
                        v-model="editedItem.Article"
                        :config="editorConfig"
                        @ready="onReady"
                      ></ckeditor>-->
                    </v-flex>
                  </v-layout>
                  <v-layout>
                    <v-flex>
                      <v-data-table
                        must-sort
                        :headers="headerComments"
                        :items="filterdComments"
                        class="elevation-3"
                        :search="searchComments"
                        :pagination.sync="pagination"
                      >
                        <template slot="items" slot-scope="props">
                          <td class="text-xs-left">{{ props.item.Comment }}</td>
                          <td class="text-xs-left">{{ props.item.CreatedBy }}</td>
                          <td class="text-xs-left">{{ props.item.Created | momentDateDash }}</td>
                        </template>
                      </v-data-table>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>
    <v-dialog v-model="dialog" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Please stand by
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogPushback" max-width="500px" scrollable persistent>
      <v-btn slot="activator" color="primary" dark class="mb-2">Add</v-btn>
      <v-card>
        <v-card-title>
          <span class="headline">Pushback</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex lg12>
                <v-combobox
                  v-model="selectRoleUserId"
                  :items="itemsRoleUserId"
                  label="Select an agent"
                  item-text="text"
                  item-value="value"
                ></v-combobox>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn flat @click="putPushback">Pushback</v-btn>
          <v-btn flat @click="dialogPushback = false">cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import axios from "axios";
import moment from "moment";

//import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";

//import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
//import Highlight from '@ckeditor/ckeditor5-highlight/src/highlight';

//import VueCkeditor from "vue-ckeditor5";

class UploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }
  upload() {
    return this.loader.file.then(uploadedFile => {
      return new Promise((resolve, reject) => {
        const data = new FormData();

        data.append("upload", uploadedFile);
        axios({
          //server
          url: "/api/KBArticle/PostFile",
          method: "post",
          data,
          headers: {
            "Content-Type": "multipart/form-data;"
          },
          withCredentials: false
        })
          .then(response => {
            if (response.data.FileNamePhysicals[0].length > 0) {
              //server
              var url1 =
                "/Documents/Article/" +
                response.data.FileNamePhysicals[0] +
                response.data.Extensions[0];

              resolve({
                default: url1
              });
            } else {
              reject(response.data.message);
            }
          })
          .catch(response => {
            reject("Upload failed");
          });
      });
    });
  }
  abort() {}
}

export default {
  data() {
    return {
      editor: DecoupledEditor,
      editorConfig: {
        extraPlugins: [this.MyCustomUploadAdapterPlugin]
      },
      loader: {
        isTrue: false
      },
      tabIndex: 0,

      selectRoleUserId: null,
      itemsRoleUserId: [],

      //Document
      isFileUpload: false,
      isFileUploadError: false,
      isFileUploadClient: false,
      tempfiles: [],
      FileNamePhysicals: [],
      FileNameUsers: [],
      files: [],

      selectKBRoleCategoryRight: null,
      itemsKBRoleCategoryRight: [],

      tabeName: "Draft",
      selectUserGroup: null,
      itemsUserGroup: [],
      selectedRequestTypeId: 21,

      selectCategory: [],
      itemsCategory: [],
      tabs: {
        Draft: false,
        Review: false,
        Approval: false,
        Publish: false,
        Published: false
      },
      rights: {
        View: true,
        Modify: true,
        Delete: false,

        Draft: false,
        Review: false,
        Approval: false,
        Publish: false,
        Published: false
      },
      dialogPushback: false,
      dialog: false,
      search: "",
      headers: [
        {
          text: " Article Id",
          value: "ArticleId",
          align: "left"
        },
        { text: "Name", value: "Name" },
        { text: "Request", value: "Request" },
        { text: "Active", value: "Active" },
        { text: "Created By", value: "CreatedBy" },
        { text: "Modified By", value: "ArticleCreator" },
        { text: "Actions", value: "", sortable: false, align: "Center" }
      ],
      listOfRecords: [],
      searchComments: "",
      headerComments: [
        { text: "Comments", value: "Comment" },
        { text: "Created By", value: "CreatedBy" },
        { text: "Created", value: "Created" }
      ],
      pagination: {
        descending: true,
        sortBy: "Created",
        rowsPerPage: 10
      },

      paginationMainTable: {
        descending: true,
        sortBy: "ArticleId",
        rowsPerPage: 10
      },

      listOfRecordComments: [],
      editedIndex: -1,

      editedItem: {
        isFileUpload: false,
        isFileUploadError: false,
        isFileUploadClient: false,
        tempfiles: [],
        FileNamePhysicals: [],
        FileNameUsers: [],
        files: [],
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
      }
    };
  },
  computed: {
    urlDomain() {
      return this.$urlDomain;
    },
    IsLoader() {
      return this.loader.isTrue;
    },
    getCurrentRquestType() {
      return this.selectedRequestTypeId;
    },
    getNexRequestTypeId() {
      var requestTypeId = this.editedItem.RequestTypeId;
      //Save
      if (requestTypeId == 21) {
        //Draft
        requestTypeId = 8;
        this.tabeName = "Draft";
      } else if (requestTypeId == 8) {
        //Review
        requestTypeId = 3;
        this.tabeName = "Review";
      } else if (requestTypeId == 3) {
        //Publish
        requestTypeId = 10;
        this.tabeName = "Publish";
      } else if (requestTypeId == 10) {
        //Published
        requestTypeId = 11;
        this.tabeName = "Approval";
      }

      requestTypeId = requestTypeId == undefined ? 8 : requestTypeId;
      return requestTypeId;
    },
    getBackRequestTypeId() {
      var requestTypeId = this.editedItem.RequestTypeId;

      if (requestTypeId == 8) {
        //Draft
        requestTypeId = 21;
      } else if (requestTypeId == 3) {
        //Approval
        requestTypeId = 8;
      } else if (requestTypeId == 10) {
        //Approval
        requestTypeId = 3;
      } else if (requestTypeId == 11) {
        //Publish
        requestTypeId = 10;
      }

      return requestTypeId;
    },
    articleformTitle() {
      return this.editedIndex === -1 ? "New Article" : "Edit Article";
    },
    filterdComments() {
      var result = this.listOfRecordComments;
      return result;
    }
  },
  watch: {
    dialog(val) {
      if (!val) return;
      setTimeout(() => (this.dialog = false), 4000);
    },

    selectUserGroup(obj) {
      var pObj = obj;
      var arrayValues = [];
      for (var i = 0; i < pObj.length; i++) {
        arrayValues.push(pObj[i].UserGroupId);
      }
      this.editedItem.KBRoleUserGroupId = arrayValues;
    },

    selectKBRoleCategoryRight(obj) {
      var pObj = obj;
      var arrayValues = [];
      for (var i = 0; i < pObj.length; i++) {
        arrayValues.push(pObj[i].id);
      }
      this.editedItem.KBRoleUserGroupId = arrayValues;
    }
  },
  created() {
    this.initialize();
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

    getCurrentTab() {
      var result = "New";
      var requestTypeId = this.editedItem.RequestTypeId;
      if (requestTypeId == 21) {
        result = "Draft";
      } else if (requestTypeId == 8) {
        result = "Review";
      } else if (requestTypeId == 3) {
        result = "Publish";
      } else if (requestTypeId == 10) {
        result = "Published";
      }
      return result;
    },
    MyCustomUploadAdapterPlugin(editor) {
      editor.plugins.get("FileRepository").createUploadAdapter = loader => {
        return new UploadAdapter(loader);
      };
    },
    async getEditKBArticle(id) {
      this.dialog = id == 0 ? false : true;

      this.loader.isTrue = true;
      await this.getKBTreeViewOption();
      await this.getKBRoleUserGroup();
      await this.getKBRoleCategoryRights(id);
      axios({
        method: "get",
        url: this.$urlApplication + "KBArticle/GetEditKBArticle?id=" + id
      })
        .then(res => {
          var obj = res.data;
          var KBTreeViewIdFK = obj.KBTreeViewIdFK;

          this.selectCategory = [];
          for (var items of this.itemsCategory) {
            if (obj.KBTreeViewIdFK == items.value) {
              this.selectCategory = {
                value: items.value,
                text: items.text
              };

              break;
            }
          }
          this.editedItem.ArticleId = id;
          this.editedItem.ArticleCode = "KA" + id;
          this.editedItem.Name = obj.Name;
          this.editedItem.Description = obj.Description;
          this.editedItem.Article = obj.Article;
          this.editedItem.RequestTypeId = obj.RequestTypeId;
          this.getKBArticleComment(id);
          this.getDocuments(id);
          this.loader.isTrue = false;
          this.dialog = false;
        })
        .catch(error => {});
    },

    getRoleUsersAgents() {
      axios({
        method: "get",
        url: this.$urlApplication + "general/GetRoleUserBySupportGroup?id=85"
        //url: this.$urlApplication + "general/GetRoleUserBySupportGroup"
      })
        .then(res => {
          this.itemsRoleUserId = [];
          for (let value of res.data) {
            var result = {
              value: value.value,
              text: value.text
            };
            this.itemsRoleUserId.push(result);
          }
        })
        .catch(error => {});
    },

    initialize() {
      var pArticleId = this.$route.query.id;
      var pTabIndex =
        this.$route.query.tabIndex == undefined
          ? 0
          : this.$route.query.tabIndex;
      this.tabIndex = pTabIndex;
      if (pArticleId == 0) {
        this.editedIndex = -1;
      } else {
        this.editedIndex = 1;
      }

      this.getEditKBArticle(pArticleId);
      this.getRoleUsersAgents();
    },
    async getKBRoleUserGroup() {
      await axios({
        method: "get",
        url: this.$urlApplication + "KBRoleUserGroup/GetKBRoleUserGroups"
      })
        .then(res => {
          this.itemsKBRoleCategoryRight = [];
          for (let value of res.data) {
            var result = {
              id: value.KBRoleUserGroupId,
              name: value.UserGroupName
            };
            this.itemsKBRoleCategoryRight.push(result);
          }
        })
        .catch(error => {});
    },

    async getKBRoleCategoryRights(id) {
      await axios({
        method: "get",
        url: this.$urlApplication + "KBArticle/GetKBRoleCategoryRights?id=" + id
      })
        .then(res => {
          this.selectKBRoleCategoryRight = [];
          var listStatic = this.itemsKBRoleCategoryRight;
          var listServer = res.data;

          for (let items1 of listServer) {
            for (let items2 of listStatic) {
              if (items1.KBRoleUserGroupId == items2.id) {
                var result = {
                  id: items2.id,
                  name: items2.name
                };
                this.selectKBRoleCategoryRight.push(result);
              }
            }
          }
        })
        .catch(error => {});
    },

    getRoleUserGroup() {
      axios({
        method: "get",
        url: this.$urlApplication + "RoleUserGroup/GetRoleUserGroups"
      }).then(res => {
        this.itemsUserGroup = [];
        for (let value of res.data) {
          var result = {
            UserGroupId: value.RoleUserGroupId,
            name: value.UserGroupName
          };
          this.itemsUserGroup.push(result);
        }
      });
    },
    async getKBTreeViewOption() {
      await axios({
        method: "get",
        url: this.$urlApplication + "KBTree/GetKBTree"
      })
        .then(res => {
          this.itemsCategory = [];

          for (let value of res.data) {
            var result = {
              text: value.TREE,
              value: value.ID
            };
            this.itemsCategory.push(result);
          }
        })
        .catch(error => {});
    },

    getKBArticleComment(id) {
      var pId = id;
      axios({
        method: "get",
        url: this.$urlApplication + "KBArticle/GetKBArticleComment?id=" + pId
      })
        .then(res => {
          this.listOfRecordComments = res.data;
        })
        .catch(error => {});
    },
    async postForm() {
      var obj = this.editedItem;
      var selectCategory = this.selectCategory;
      var name = obj.Name;

      obj.KBRoleUserGroupIds = obj.KBRoleUserGroupId;
      obj.CommentDraft = obj.comments;

      if (selectCategory == null || selectCategory < 0) {
        alert("Please select main group");
      } else if (name == undefined) {
        alert("Please insert name");
      } else {
        this.dialog = true;
        obj.OrderBy = 1;
        obj.KBTreeViewIdFK = selectCategory.value;
        obj.RequestTypeId = 21;

        //Document
        if (this.isFileUploadClient) {
          var objFileUpload = await this.fileUpload();
          if (objFileUpload != undefined) {
            obj.FileNameUsers = objFileUpload.FileNameUsers;
            obj.FileNamePhysicals = objFileUpload.FileNamePhysicals;
            obj.Extensions = objFileUpload.Extensions;
          }
        }
        //Save
        axios({
          method: "post",
          url: this.$urlApplication + "KBArticle/PostKBArticle",
          data: obj
        })
          .then(res => {
            this.$router.push({
              path: "/KB/Article?tabIndex=" + this.tabIndex
            });
            this.dialog = false;
          })
          .catch(error => {});
      }
    },

    async putSubmitRequest() {
      var obj = this.editedItem;
      var selectCategory = this.selectCategory;
      var name = obj.Name;

      obj.KBRoleUserGroupIds = obj.KBRoleUserGroupId;
      obj.CommentDraft = obj.comments;

      if (selectCategory == null || selectCategory < 0) {
        alert("Please select main group");
      } else if (name == undefined) {
        alert("Please insert name");
      } else {
        this.dialog = true;
        obj.OrderBy = 1;
        obj.KBTreeViewIdFK = selectCategory.value;
        obj.RequestTypeId = this.getNexRequestTypeId; //== undefined ? 8 : this.getNexRequestTypeId;
        obj.ArticleId = obj.ArticleId == undefined ? 0 : obj.ArticleId;

        //Document
        if (this.isFileUploadClient) {
          var objFileUpload = await this.fileUpload();
          if (objFileUpload != undefined) {
            obj.FileNameUsers = objFileUpload.FileNameUsers;
            obj.FileNamePhysicals = objFileUpload.FileNamePhysicals;
            obj.Extensions = objFileUpload.Extensions;
          }
        }

        //ForwardRequest
        axios({
          method: "put",
          url:
            this.$urlApplication +
            "KBArticle/PutForwardRequest?id=" +
            obj.ArticleId,
          data: obj
        })
          .then(res => {
            this.$router.push({
              path: "/KB/Article?tabIndex=" + this.tabIndex
            });
            this.dialog = false;
          })
          .catch(error => {
            this.dialog = false;
          });
      }
    },
    async putForm() {
      if (this.$route.query.edit) {
        this.putEdit();
      }

      this.dialog = true;
      var obj = this.editedItem;

      //Upload Start
      var arrayOldFile = this.tempfiles;

      obj.FileNameUsers = [];
      obj.FileNamePhysicals = [];
      obj.Extensions = [];

      var objFileUpload = [];
      if (this.isFileUploadClient) {
        var objFileUpload = await this.fileUpload();
        if (objFileUpload != undefined) {
          obj.FileNameUsers = objFileUpload.FileNameUsers;
          obj.FileNamePhysicals = objFileUpload.FileNamePhysicals;
          obj.Extensions = objFileUpload.Extensions;
        }
      }

      var fileNameUsersTemp = [];
      var fileNamePhysicalsTemp = [];
      var extensionsTemp = [];

      for (var j = 0; j < arrayOldFile.length; j++) {
        //Prevent Dupliation Between Old and New Files
        var isNotExist = true;
        for (var k = 0; k < obj.FileNameUsers; k++) {
          var nameOld = arrayOldFile[i]["FileNameUser"];
          var nameNew = obj.FileNameUsers[k];
          if (nameOld == nameNew) {
            isNotExist = false;
            break;
          }
        }

        if (isNotExist) {
          var FileNameUser =
            arrayOldFile[j].FileNameUser == undefined
              ? null
              : arrayOldFile[j].FileNameUser;
          var FileNamePhysical =
            arrayOldFile[j].FileNamePhysical == undefined
              ? null
              : arrayOldFile[j].FileNamePhysical;
          var Extension =
            arrayOldFile[j].Extension == undefined
              ? null
              : arrayOldFile[j].Extension;

          //Get New UploadFile Physical Name--Start
          var isNewUpload = false;
          if (
            objFileUpload.FileNameUsers != undefined &&
            objFileUpload.FileNameUsers.length > 0
          ) {
            for (var l = 0; l < objFileUpload.FileNameUsers.length; l++) {
              var newFile = objFileUpload.FileNameUsers[l];
              if (FileNameUser == newFile) {
                isNewUpload = true;
                FileNamePhysical = objFileUpload.FileNamePhysicals[l];
                Extension = objFileUpload.Extensions[l];
                break;
              }
            }
          }
          //Get New UploadFile Physical Name--End
          fileNameUsersTemp.push(FileNameUser);
          fileNamePhysicalsTemp.push(FileNamePhysical);
          extensionsTemp.push(Extension);
        }
      }

      obj.FileNameUsers = fileNameUsersTemp;
      obj.FileNamePhysicals = fileNamePhysicalsTemp;
      obj.Extensions = extensionsTemp;

      //Upload End
      var selectCategory = this.selectCategory;
      var name = obj.Name;
      obj.CommentDraft = obj.comments;

      if (selectCategory == null || selectCategory < 0) {
        alert("Please select main group");
      } else if (name == undefined) {
        alert("Please insert name");
      } else {
        obj.OrderBy = 1;
        obj.KBTreeViewIdFK = this.selectCategory.value;

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
          url:
            this.$urlApplication + "KBArticle/PutKBArticle?id=" + obj.ArticleId,
          data: obj
        })
          .then(res => {
            this.$router.push({
              //path: "/KB/Article",
              path: "/KB/Article?tabIndex=" + this.tabIndex
            });
            this.dialog = false;
          })
          .catch(error => {
            this.dialog = false;
          });
      }
    },
    //Edit Article-START
    putEdit() {
      var obj = this.editedItem;
      var selectCategory = this.selectCategory;
      var name = obj.Name;
      obj.RequestTypeId = 21;
      if (selectCategory == null || selectCategory < 0) {
        alert("Please select main group");
      } else if (name == undefined) {
        alert("Please insert name");
      } else {
        obj.OrderBy = 1;
        obj.KBTreeViewIdFK = this.selectCategory.value;

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
          url:
            this.$urlApplication +
            "KBArticle/PutEditArticle?id=" +
            obj.ArticleId,
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

    // pushbackDialog() {
    //   this.dialogPushback = true;
    // },

    putPushback(id) {
      if (this.selectRoleUserId != null && this.selectRoleUserId.value > 0) {
        this.dialog = true;
        var pId = id;
        var obj = this.editedItem;
        obj.RequestTypeId = this.getBackRequestTypeId;
        obj.CommentDraft = obj.comments;
        obj.RoleUserId = this.selectRoleUserId.value;

        //ForwardRequest
        axios({
          method: "put",
          url:
            this.$urlApplication +
            "KBArticle/PutPushBackRequest?id=" +
            obj.ArticleId,
          data: obj
        })
          .then(res => {
            this.$router.push({
              path: "/KB/Article?tabIndex=" + this.tabIndex
            });
            this.dialog = false;
            this.dialogPushback = true;
          })
          .catch(error => {
            this.dialog = false;
            this.dialogPushback = true;
          });
      } else {
        alert("Please select agent id for send email");
      }
    },
    clear() {
      this.editedItem.Article = "";
      this.editedItem.Name = "";
      this.editedItem.Description = "";
      this.selectKBRoleCategoryRight = [];
      this.selectCategory = [];
      this.files = [];
      this.tempfiles = [];
      this.isFileUpload = false;
      this.isFileUploadError = false;
      this.isFileUploadClient = false;
    },

    //Document
    addFiles() {
      this.$refs.files.click();
    },
    handleFilesUpload() {
      this.isFileUpload = true;
      this.isFileUploadError = false;

      let uploadedFiles = this.$refs.files.files;
      for (var i = 0; i < uploadedFiles.length; i++) {
        this.files.push(uploadedFiles[i]);
        //Get User File Name
        this.tempfiles.push({ FileNameUser: uploadedFiles[i].name });
      }
      this.isFileUpload = false;
      this.isFileUploadClient = uploadedFiles.length > 0 ? true : false;
    },

    UploadAdapter: function(loader) {
      this.loader = loader;

      this.upload = () => {
        const body = new FormData();
        body.append("file", this.loader.file);
        var v1 = this.loader._reader._reader.result;
        return {
          default: v1
        };
      };
    },

    async fileUpload() {
      let formData = new FormData();
      for (var i = 0; i < this.files.length; i++) {
        let file = this.files[i];
        formData.append("files[" + i + "]", file);
      }

      return axios
        .post(this.$urlApplication + "KBArticle/PostFile", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(res => {
          this.isFileUpload = false;
          return res.data;
        })
        .catch(error => {
          this.isFileUpload = true;
          this.isFileUploadError = true;
        });
    },

    getGenerate(obj) {
      if (obj.FileNamePhysical == undefined) {
        alert("File does not exist");
      } else {
        var fileNamePhysical = obj.FileNamePhysical + obj.Extension;
        axios({
          method: "get",
          url:
            this.$urlApplication +
            "KBArticle/Generate?fileName=" +
            fileNamePhysical,
          responseType: "arraybuffer"
        })
          .then(response => {
            this.forceFileDownload(fileNamePhysical, response);
          })
          .catch(ex => {
            alert(ex.response.statusText);
          });
      }
    },
    deleteAttachment(index) {
      this.tempfiles.splice(index, 1);
    },

    forceFileDownload(fileName, response) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName); //or any other extension
      document.body.appendChild(link);
      link.click();
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
    }
  }
};
</script>

<style scoped>
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

/* Set the styles for "Paragraph". */
/* .document-editor .ck-content p {
  font-size: 11em !important;
  line-height: 11.63em !important;
  padding-top: 10.5em !important;
  margin-bottom: 11.13em !important;
} */

/* .document-editor .ck-content a {
  color: red !important;
} */
</style>