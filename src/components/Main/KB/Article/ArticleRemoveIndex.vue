<template>
  <layout-one :title="'Define Article'">
    <!-- {{this.$store.getters.loginEmployeeId}} -->
    <!-- RoleUserId : {{this.$store.getters.roleUserId}} -->
    <span
      v-show="false"
    >{{draftCnt}} -{{reviewCnt}} -{{publishCnt}} {{publishedCnt}} - {{getNexRequestTypeId}}</span>
    {{this.tabItemsFilterd}}
    <br>
    {{this.active_tab}}
    <v-tabs color="colorDark" align-with-title v-model="active_tab">
      <v-tabs-slider color="yellow"></v-tabs-slider>
      <v-tab
        v-for="item in tabItemsFilterd"
        class="white--text"
        :key="item.id"
        @click="changeTab(item)"
      >
        <v-btn flat>
          <h4 class="font-weight-light white--text">{{item.name}}</h4>&nbsp;
          <v-badge color="red">
            <span slot="badge">{{item.requestCnt}}</span>
          </v-badge>
        </v-btn>
      </v-tab>
    </v-tabs>

    <v-tabs-items class="pt-0">
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
          color="colorLight"
        ></v-text-field>

        <v-btn color="colorLight" dark class="mb-2" v-if="tabs.Draft" v-on:click="dialog = true">Add</v-btn>
        <v-dialog
          v-model="dialog"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
          scrollable
          @keydown.esc="model = true"
        >
          <v-card>
            <v-toolbar card dark color="colorLight">
              <v-btn icon dark @click="dialog = false">
                <v-icon>close</v-icon>
              </v-btn>
              <v-toolbar-title>{{ articleformTitle }}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn flat @click="putPushback" v-if="!tabs.Draft">pushback</v-btn>
                <v-btn
                  flat
                  @click="postForm"
                  v-show="this.editedIndex === -1 ? true : false"
                  v-if="this.tabs.Draft"
                >Save</v-btn>

                <!-- <v-btn
                  flat
                  @click="putForm"
                  v-if="(this.editedIndex === -1 ? false : true) && !tabs.Published && getCurrentRquestType == 21"
                >update</v-btn>-->

                <v-btn
                  flat
                  @click="putForm"
                  v-if="(this.editedIndex === -1 ? false : true) && ( getCurrentRquestType == 21 || tabs.Published)"
                >update</v-btn>

                <v-btn
                  flat
                  @click="putForwardRequest"
                  v-if="(this.editedIndex === -1 ? false : true) && !tabs.Published"
                >Submit</v-btn>
                <v-btn flat @click="clear">clear</v-btn>
                <v-btn flat @click="dialogClose">cancel</v-btn>
              </v-toolbar-items>
            </v-toolbar>

            <v-card-text>
              <v-container grid-list-md>
                <form>
                  <v-layout wrap>
                    <v-flex lg6>
                      <v-text-field
                        v-show="true"
                        v-model="editedItem.ArticleId"
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
                        v-model="selectKBTreeOption"
                        :items="itemsKBTreeOption"
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

                    <!-- v-if="!tabs.Draft" -->
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
                      <ckeditor
                        :editor="editor"
                        v-model="editedItem.Article"
                        :config="editorConfig"
                        class="txtEditor"
                      ></ckeditor>
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
                      >
                        <template slot="items" slot-scope="props">
                          <td class="text-xs-left">{{ props.item.Comment }}</td>
                          <td class="text-xs-left">{{ props.item.CreatedBy }}</td>
                          <td class="text-xs-left">{{ props.item.Created }}</td>
                        </template>
                      </v-data-table>
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
        :items="filterd"
        class="elevation-3"
        :search="search"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.ArticleId }}</td>
          <td class="text-xs-left">{{ props.item.Name }}</td>
          <td class="text-xs-left">{{ props.item.Request }}</td>
          <td class="text-xs-left">{{ (props.item.Active == 1 ? 'Yes' : 'No') }}</td>
          <td class="text-xs-left">{{ props.item.CreatedBy }}</td>
          <td class="text-xs-left">{{ props.item.ArticleCreator }}</td>
          <td class="justify-center layout px-0">
            <v-btn
              color="colorLight"
              fab
              small
              dark
              style="height:22px;width:22px;font-size:13px;"
              @click="editItem(props.item)"
            >
              <v-icon style="font-size:13px">edit</v-icon>
            </v-btn>
            <v-btn
              color="red"
              fab
              small
              dark
              style="height:22px;width:22px;font-size:13px;"
              v-if="(tabs.Draft || (tabs.Published && rights.Delete) ) "
            >
              <v-icon style="font-size:13px" @click="deleteItem(props.item)">delete</v-icon>
            </v-btn>
          </td>
        </template>
      </v-data-table>
    </v-tabs-items>
    <snack-bar :isSnackbar="articleisSnackBar" />
  </layout-one>
</template>

<script>
import { mixins } from "../../../../mixins/CustomMixins";
import Application from "../../../../services/application-service";
import SnackBar from "../../../../components/control/SnackBar";
import axios from "axios";
import LayoutOne from "../../../../components/control/layout/LayoutOne";
import { defineLocale } from "moment";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default {
  mixins: [mixins],
  components: {
    SnackBar,
    LayoutOne
  },
  data: () => ({
    active_tab :false,
    //AutoCompelete
    selectKBRoleCategoryRight: null,
    itemsKBRoleCategoryRight: [],

    tabeName: "Draft",
    selectUserGroup: null,
    itemsUserGroup: [],
    selectedRequestTypeId: 21,
    tabItems: [
      {
        id: 1,
        name: "Draft",
        link: "KBGlobalSearch",
        icon: "drafts",
        requestCnt: 0
      },
      {
        id: 2,
        name: "Review",
        link: "Article",
        icon: "image_search",
        requestCnt: 0
      },
      {
        id: 3,
        name: "Publish",
        link: "KBTree",
        icon: "publish",
        requestCnt: 0
      },
      {
        id: 4,
        name: "Published",
        link: "KBTree",
        icon: "publish",
        requestCnt: 0
      }
    ],

    selectKBTreeOption: [],
    itemsKBTreeOption: [],

    //Text Editor-Start
    editor: ClassicEditor,
    editorData: "<p>Content of the editor.</p>",
    editorConfig: {
      // The configuration of the editor.
    },
    //Text Editor-End
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
    snackbar: {
      isTrue: true
    },
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
      { text: "Comment", value: "Comment" },
      { text: "Created By", value: "CreatedBy" },
      { text: "Created", value: "Created" }
    ],
    listOfRecordComments: [],

    editedIndex: -1,

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
    }
  }),
  computed: {
    getCurrentRquestType() {
      return this.selectedRequestTypeId;
    },
    getNexRequestTypeId() {
      var requestTypeId = this.selectedRequestTypeId;

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
      return requestTypeId;
    },
    getBackRequestTypeId() {
      var requestTypeId = this.selectedRequestTypeId;

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
    articleisSnackBar() {
      return this.snackbar.isTrue;
    },
    articleformTitle() {
      return this.editedIndex === -1 ? "New Article" : "Edit Article";
    },
    tabItemsFilterd() {
      var tabs = [];

      if (this.rights.Draft) {
        tabs.push(1);
      }
      if (this.rights.Review) {
        tabs.push(2);
      }
      if (this.rights.Publish) {
        tabs.push(3);
      }
      if (this.rights.Published) {
        tabs.push(4);
      }
      var obj = this.tabItems.filter(w => _.includes(tabs, w.id));
      return obj;
    },

    filterd() {
      var result = [];

      var obj = this.tabItemsFilterd;
      if (obj.length > 0) {
        var tabActiveName = obj[0].name;

        if (tabActiveName == "Draft") {
          result = this.listOfRecords.filter(
            w =>
              w.RequestTypeId == this.selectedRequestTypeId &&
              w.RoleUserId == this.$store.getters.roleUserId
          );
        } else if (tabActiveName == "Review") {
          result = this.listOfRecords.filter(w => w.RequestTypeId == 8);
        } else if (tabActiveName == "Publish") {
          result = this.listOfRecords.filter(w => w.RequestTypeId == 3);
        } else if (tabActiveName == "Published") {
          result = this.listOfRecords.filter(w => w.RequestTypeId == 10);
        }
      }

      return result;
    },
    filterdComments() {
      var result = this.listOfRecordComments;
      return result;
    },

    draftCnt() {
      var result = this.listOfRecords.filter(
        w =>
          w.RequestTypeId === 21 &&
          w.RoleUserId == this.$store.getters.roleUserId
      );
      //debugger
      this.tabItems[0].requestCnt = result.length;
      return result.length;
    },
    reviewCnt() {
      var result = this.listOfRecords.filter(w => w.RequestTypeId === 8);
      //debugger
      this.tabItems[1].requestCnt = result.length;
      return result.length;
    },
    publishCnt() {
      var result = this.listOfRecords.filter(w => w.RequestTypeId === 3);
      //debugger
      this.tabItems[2].requestCnt = result.length;
      return result.length;
    },
    publishedCnt() {
      var result = this.listOfRecords.filter(w => w.RequestTypeId === 10);
      //debugger
      this.tabItems[3].requestCnt = result.length;
      return result.length;
    }
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
    initialize() {
      this.tableLoad();
      this.getKBTreeViewOption();
      this.getKBRoleUserGroup();

      this.getUserRights([2012, 2013, 2014, 2015, 2016, 2017, 2019, 2018]).then(
        result => {
          result.forEach(element => {
            if (element.name == "View") {
              this.rights.View = true;
              this.rights.Draft = true;
            }
            if (element.name == "Modify") {
              this.rights.Modify = true;
            }
            if (element.name == "Delete") {
              this.rights.Delete = true;
            }
            if (element.name == "Draft") {
              this.rights.Draft = true;
            }
            if (element.name == "Reviewer") {
              this.rights.Review = true;
            }
            if (element.name == "Approver") {
              this.rights.Approval = true;
            }
            if (element.name == "Publisher") {
              this.rights.Publish = true;
            }
            if (element.name == "Published") {
              this.rights.Published = true;
            }
          });
        }
      );

      this.getRoleUserGroup();
    },

    getKBRoleUserGroup() {
      axios({
        method: "get",
        url: this.$urlApplication + "GetKBRoleUserGroups"
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

    getKBRoleCategoryRights(id) {
      axios({
        method: "get",
        url: this.$urlApplication + "GetKBRoleCategoryRights?id=" + id
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
        url: this.$urlApplication + "GetRoleUserGroups"
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

    changeTab(obj) {
      var pObj = obj;
      var tabName = pObj.name;

      if (tabName == "Draft") {
        this.selectedRequestTypeId = 21;
        this.tabItemsFilterd[0].requestCnt = this.draftCnt;
        this.tabs.Draft = true;
        this.tabs.Review = false;
        this.tabs.Approval = false;
        this.tabs.Publish = false;
        this.tabs.Published = false;
      } else if (tabName == "Review") {
        this.selectedRequestTypeId = 8;
        this.tabItemsFilterd[0].requestCnt = this.reviewCnt;
        this.tabs.Draft = false;
        this.tabs.Review = true;
        this.tabs.Approval = false;
        this.tabs.Publish = false;
        this.tabs.Published = false;
      } else if (tabName == "Publish") {
        this.selectedRequestTypeId = 3;
        this.tabItemsFilterd[0].requestCnt = this.publishCnt;
        this.tabs.Draft = false;
        this.tabs.Review = false;
        this.tabs.Approval = false;
        this.tabs.Publish = true;
        this.tabs.Published = false;
      } else if (tabName == "Published") {
        this.selectedRequestTypeId = 10;
        this.tabItemsFilterd[0].requestCnt = this.publishedCnt;
        this.tabs.Draft = false;
        this.tabs.Review = false;
        this.tabs.Approval = false;
        this.tabs.Publish = false;
        this.tabs.Published = true;
      }
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

    tableLoad() {
      axios({
        method: "get",
        url: this.$urlApplication + "GetKBArticles"
      })
        .then(res => {
          this.listOfRecords = res.data;
        })
        .catch(error => {});
    },
    getKBArticleLog(id) {
      var pId = id;
      axios({
        method: "get",
        url: this.$urlApplication + "GetKBArticleLog?id=" + pId
      })
        .then(res => {
          this.listOfRecordComments = res.data;
        })
        .catch(error => {});
    },

    getKBArticleComment(id) {
      var pId = id;
      axios({
        method: "get",
        url: this.$urlApplication + "GetKBArticleComment?id=" + pId
      })
        .then(res => {
          this.listOfRecordComments = res.data;
        })
        .catch(error => {});
    },
    postForm() {
      var obj = this.editedItem;
      var selectKBTreeOption = this.selectKBTreeOption;
      var name = obj.Name;

      obj.KBRoleUserGroupIds = obj.KBRoleUserGroupId;
      obj.CommentDraft = obj.comments;

      if (selectKBTreeOption == null || selectKBTreeOption < 0) {
        alert("Please select main group");
      } else if (name == undefined) {
        alert("Please insert name");
      } else {
        obj.OrderBy = 1;
        obj.KBTreeViewIdFK = selectKBTreeOption.value;
        obj.RequestTypeId = 21;

        //Save
        axios({
          method: "post",
          url: this.$urlApplication + "PostKBArticle",
          data: obj
        })
          .then(res => {
            this.tableLoad();
            this.dialogClose();
            this.snackbar.isTrue = !this.snackbar.isTrue;
          })
          .catch(error => {});
      }
    },
    putForm() {
      var obj = this.editedItem;
      var selectKBTreeOption = this.selectKBTreeOption;
      var name = obj.Name;

      obj.CommentDraft = obj.comments;
      //debugger
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
          url: this.$urlApplication + "PutKBArticle?id=" + obj.ArticleId,
          data: obj
        })
          .then(res => {
            this.tableLoad();
            this.dialogClose();
            this.snackbar.isTrue = !this.snackbar.isTrue;
          })
          .catch(error => {});
      }
    },

    putForwardRequest(id) {
      var pId = id;
      var obj = this.editedItem;
      obj.RequestTypeId = this.getNexRequestTypeId;

      if (this.getCurrentRquestType == 21) {
      } else if (this.getCurrentRquestType == 8) {
        obj.CommentDraft = obj.comments;
      } else if (this.getCurrentRquestType == 3) {
        obj.CommentReview = obj.comments;
      } else if (this.getCurrentRquestType == 9) {
        obj.CommentApproval = obj.comments;
      } else if (this.getCurrentRquestType == 10) {
        obj.CommentPublish = obj.comments;
      }

      //ForwardRequest
      axios({
        method: "put",
        url: this.$urlApplication + "PutForwardRequest?id=" + obj.ArticleId,
        data: obj
      })
        .then(res => {
          this.tableLoad();
          this.dialogClose();
          this.snackbar.isTrue = !this.snackbar.isTrue;
        })
        .catch(error => {});
    },

    putPushback(id) {
      var pId = id;
      var obj = this.editedItem;
      obj.RequestTypeId = this.getBackRequestTypeId; // this.getNexRequestTypeId;

      if (this.getCurrentRquestType == 21) {
      } else if (this.getCurrentRquestType == 8) {
        obj.CommentDraft = obj.comments;
      } else if (this.getCurrentRquestType == 3) {
        obj.CommentReview = obj.comments;
      } else if (this.getCurrentRquestType == 9) {
        obj.CommentApproval = obj.comments;
      } else if (this.getCurrentRquestType == 10) {
        obj.CommentPublish = obj.comments;
      }

      //ForwardRequest
      axios({
        method: "put",
        url: this.$urlApplication + "PutPushBackRequest?id=" + obj.ArticleId,
        data: obj
      })
        .then(res => {
          this.tableLoad();
          this.dialogClose();
          this.snackbar.isTrue = !this.snackbar.isTrue;
        })
        .catch(error => {});
    },
    deleteArticle(id) {
      var pId = id;
      axios({
        method: "delete",
        url: this.$urlApplication + "DeleteKBArticle?id=" + pId
      })
        .then(res => {
          this.tableLoad();
        })
        .catch(error => {});
    },
    clear() {
      this.editedItem.Article = "";
      this.editedItem.Name = "";
      this.editedItem.Description = "";
      this.selectKBRoleCategoryRight = [];
      this.selectKBTreeOption = [];
    },

    editItem(item) {
      var obj = item;

      //Combobox--Start-1
      this.selectKBTreeOption = [];
      for (var items of this.itemsKBTreeOption) {
        //for (let items of this.itemsKBTreeOption) {
        if (obj.KBTreeViewIdFK == items.value) {
          this.selectKBTreeOption = {
            value: items.value,
            text: items.text
          };
          break;
        }
        //debugger;
      }

      //Combobox-End-1
      this.getKBRoleCategoryRights(obj.ArticleId);
      //this.getKBArticleLog(obj.ArticleId);
      this.getKBArticleComment(obj.ArticleId);
      if (this.getCurrentRquestType == 21) {
      } else if (this.getCurrentRquestType == 8) {
        obj.comments = obj.CommentDraft;
      } else if (this.getCurrentRquestType == 3) {
        obj.comments = obj.CommentReview;
      } else if (this.getCurrentRquestType == 9) {
        obj.comments = obj.CommentApproval;
      } else if (this.getCurrentRquestType == 10) {
        obj.comments = obj.CommentPublish;
      }

      this.editedIndex = this.listOfRecords.indexOf(obj);
      this.editedItem = Object.assign({}, obj);
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.listOfRecords.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.deleteArticle(item.ArticleId);
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
        this.getKBArticleComment(0);
      }
      //Edit
      else {
      }
    }
  }
};
</script>