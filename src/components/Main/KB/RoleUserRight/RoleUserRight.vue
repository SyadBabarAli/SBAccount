<template>
  <div style="background-color:#fafafa">
    <v-layout row wrap class="pa-2">
      <v-flex lg12 class="mt-12">
        <v-card class="black--text elevation-5">
          <v-layout>
            <v-flex lg12 class="pt-0">
              <v-card-title class="headline grey lighten-3 pa-1 ma-0" primary-title>User Roles</v-card-title>
              <v-container grid-list-lg class="pt-0">
                <v-layout row wrap>
                  <v-flex lg12>
                    <v-card>
                      <v-card-text class="px-0">
                        <div class="pl-4">Select support group</div>
                        <v-autocomplete
                          v-model="modelKBRoleUserGroup"
                          :items="arrayRoleUserGroup"
                          color="colorLight"
                          persistent-hint
                          item-text="name"
                          return-object
                          prepend-icon="person"
                          @change="getRoleUserRightById"
                        ></v-autocomplete>
                      </v-card-text>
                    </v-card>
                  </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex lg12 class="mt-4">
                    <v-card class="black--text elevation-5">
                      <v-layout>
                        <v-flex lg12 class="pt-0">
                          <v-card-title
                            class="headline grey lighten-3 pa-1 ma-0"
                            primary-title
                          >Category</v-card-title>
                          <div class="csmheadline">
                            <!-- <v-treeview :items="itemsCategory" item-key="name" activatable>
                              <template slot="label" slot-scope="{ item }">
                                <v-icon
                                  :color="item.id == selectedId ? 'colorLight' : ''"
                                >font_download</v-icon>
                                <a class="black--text">{{ item.name }}</a>
                              </template>
                            </v-treeview>-->
                            <!-- {{filterTreeCategory}} -->
                            <v-treeview
                              v-model="filterTreeCategory"
                              :items="itemsCategory"
                              selected-color="colorLight"
                              selectable
                              activatable
                              open-all
                            ></v-treeview>
                          </div>
                        </v-flex>
                      </v-layout>
                    </v-card>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-flex>
          </v-layout>
          <v-divider light></v-divider>
          <v-card-actions class="pa-0 ma-0 ml-1">
            <v-btn @click="SaveRoleUserRight" color="colorLight" class="white--text">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <dialog-loader :isSnackbar="IsSnackBar" color="colorLight" />
    </v-layout>
  </div>
</template>
<script>
import VJstree from "vue-jstree";
import DialogLoader from "../../../../components/control/DialogLoader";
import AuthorizationService from "../../../../services/authorization-service";
import _ from "lodash";
import axios from "axios";
import JsTreeList from "js-tree-list";

export default {
  components: {
    VJstree,
    DialogLoader
  },
  data: () => ({
    filterTreeCategory: [],
    itemsCategory: [],

    snackbar: {
      isTrue: false
    },

    typeCategory: [],

    //AutoCompelete
    modelKBRoleUserGroup: null,
    arrayRoleUserGroup: [],

    arrayRoleLocationTicketRight: []
  }),
  created: function() {
    this.getKBRoleUserGroup();
    this.fetchCategories();
  },
  computed: {
    IsSnackBar() {
      return this.snackbar.isTrue;
    }
  },
  watch: {
    itemsCategory(val) {
      this.typeCategory = val
        .reduce((acc, cur) => {
          const type = cur.ParentId;
          if (!acc.includes(type)) acc.push(type);
          return acc;
        }, [])
        .sort();
    }
  },
  methods: {
    getKBRoleUserGroup() {
      axios({
        method: "get",
        url: this.$urlApplication + "GetKBRoleUserGroups"
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

    async getRoleUserRightById(obj) {
      this.getKBRoleCategoryRight(obj);
    },

    async getKBRoleCategoryRight(obj) {
      var pId = obj.id;
      this.filterTreeCategory = [];
      const res = await axios
        .get(this.$urlApplication + "GetKBRoleCategoryRight?id=" + pId)
        .then(res => {
          for (const itmes of res.data) {
            this.filterTreeCategory.push(itmes.ArticleId);
          }
        })
        .catch(error => {});
    },

    SaveRoleUserRight() {
      if (this.modelKBRoleUserGroup == null) {
        alert("Please select a support group");
      } else {
        this.snackbar.isTrue = true;
        var result = this.filterTreeCategory;
        var arrayValues = [];
        for (var i = 0; i < result.length; i++) {
          if (Number.isInteger(result[i]) && result[i] != 0) {
            arrayValues.push({
              KBRoleUserGroupId: this.modelKBRoleUserGroup.id,
              ArticleId: result[i]
            });
          }
        }

        if (arrayValues.length > 0) {
          var array = {
            kbRoleCategoryRight: arrayValues
          };
          axios({
            method: "put",
            url:
              this.$urlApplication +
              "PutKBRoleCategoryRight?id=" +
              this.modelKBRoleUserGroup.id,
            data: array
          })
            .then(res => {
              this.snackbar.isTrue = false;
            })
            .catch(error => {
              alert(error.response.data);
            });
        }
      }
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
    fetchCategories() {
      return fetch(this.$urlApplication + "GetRoleMenu")
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
          this.itemsCategory = v1;
        })
        .catch(err => console.log(err));
    }

    //---------------------------------------------------------Categories----------------------------------------------End
  }
};
</script>