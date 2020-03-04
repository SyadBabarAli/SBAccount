<template>
  <div class="pa-5">
    <v-layout row wrap>
      <v-flex lg9>
        <div class="document-editor">
          <div class="document-editor__toolbar"></div>
          <div class="document-editor__editable-container">
            <div class="document-editor__editable">
              <ckeditor :editor="editor" @ready="onReady" :config="editorConfig"></ckeditor>
            </div>
          </div>
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
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
          url: "http://localhost:60868/api/KBArticle/PostFile",
          //server
          //url: "/api/KBArticle/PostFile",
          method: "post",
          data,
          headers: {
            "Content-Type": "multipart/form-data;"
          },
          withCredentials: false
        })
          .then(response => {
            if (response.data.FileNamePhysicals[0].length > 0) {
              var url1 =
                "http://localhost:60868//Documents/Article/" +
                response.data.FileNamePhysicals[0] +
                response.data.Extensions[0];
              // //server
              // var url1 =
              //   "/Documents/Article/" +
              //   response.data.FileNamePhysicals[0] +
              //   response.data.Extensions[0];

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
  //mixins: [mixins],
  components: {
    //"vue-ckeditor": VueCkeditor.component
  },

  data() {
    return {
      //1
      editor: DecoupledEditor,
      editorConfig: {
        extraPlugins: [this.MyCustomUploadAdapterPlugin]
        // fontSize: {
        //   options: [9, 11, 13, "default", 17, 19, 21]
        // }
      },
      //1

      loader: {
        isTrue: false
      },
      tabIndex: 0,

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
    // getLiveUrl() {
    //   var v2 = this.$router;

    //   debugger;
    // //  var v1 = "/KB/Article?tabIndex" + this.tabIndex;
    //   return v2;
    // },
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
    //this.initialize();
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

    //   onReady(editor) {
    //   // Insert the toolbar before the editable area.
    //   editor.ui.getEditableElement().parentElement.insertBefore(
    //       editor.ui.view.toolbar.element,
    //       editor.ui.getEditableElement()
    //     );
    // },

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
    initialize() {
      var pArticleId = this.$route.query.id;
      var pTabIndex = this.$route.query.tabIndex;
      this.tabIndex = pTabIndex;
      if (pArticleId == 0) {
        this.editedIndex = -1;
      } else {
        this.editedIndex = 1;
      }

      this.getEditKBArticle(pArticleId);
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
              //path: "/KB/Article",
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
              //path: "/KB/Article",
              path: "/KB/Article?tabIndex=" + this.tabIndex
            });

            //this.snackbar.isTrue = !this.snackbar.isTrue;
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

    putPushback(id) {
      this.dialog = true;
      var pId = id;
      var obj = this.editedItem;
      obj.RequestTypeId = this.getBackRequestTypeId;
      obj.CommentDraft = obj.comments;

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
          this.$router.push({ path: "/KB/Article?tabIndex=" + this.tabIndex });
          //this.snackbar.isTrue = !this.snackbar.isTrue;
          this.dialog = false;
        })
        .catch(error => {
          this.dialog = false;
        });
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

// import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";

// export default {
//   name: "app",
//   data() {
//     return {
//       editor: DecoupledEditor
//       // ...
//     };
//   },
//   methods: {
//     onReady(editor) {
//       //  const toolbarContainer = document.querySelector( '.document-editor__toolbar' );
//       //   toolbarContainer.appendChild( editor.ui.view.toolbar.element );
//       window.editor = editor;
//       // Insert the toolbar before the editable area.
//       editor.ui
//         .getEditableElement()
//         .parentElement.insertBefore(
//           editor.ui.view.toolbar.element,
//           editor.ui.getEditableElement()
//         );
//     }
//   }
// };
</script>
<style  scoped>
/* 1-Border Show */
.document-editor {
  border: 1px solid var(--ck-color-base-border);
  border-radius: var(--ck-border-radius);

  /* Set vertical boundaries for the document editor. */
  max-height: 700px;

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

</style>