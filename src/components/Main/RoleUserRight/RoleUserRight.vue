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
                    <v-card color="primary1">
                      <v-card-text class="px-0">
                        <div class="pl-4">Select support group</div>
                        <v-autocomplete
                          v-model="modelRoleUserGroup"
                          :items="arrayRoleUserGroup"
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
                  <v-flex lg4 class="mt-4">
                    <v-card class="black--text elevation-5">
                      <v-layout>
                        <v-flex lg12 class="pt-0">
                          <v-card-title class="headline grey lighten-3 pa-1 ma-0" primary-title>Menu</v-card-title>
                          <div class="csmheadline">
                            <v-treeview
                              v-model="filterTreeRoleUserRule"
                              :load-children="fetchRoleUserRule"
                              :items="itemsRoleUserRule"
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

                  <v-flex lg4 class="mt-4">
                    <v-card class="black--text elevation-5">
                      <v-layout>
                        <v-flex lg12 class="pt-0">
                          <v-card-title
                            class="headline grey lighten-3 pa-1 ma-0"
                            primary-title
                          >Location</v-card-title>
                          <div class="csmheadline">
                            <v-treeview
                              v-model="filterTreeLocationTicket"
                              :load-children="fetchTreeLocationTicket"
                              :items="itemsTreeLocationTicket"
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

                  <v-flex lg4 class="mt-4">
                    <v-card class="black--text elevation-5">
                      <v-layout>
                        <v-flex lg12 class="pt-0">
                          <v-card-title
                            class="headline grey lighten-3 pa-1 ma-0"
                            primary-title
                          >Support Group</v-card-title>
                          <div class="csmheadline">
                            <v-treeview
                              v-model="filterTreeSupportGroup"
                              :load-children="fetchTreeSupportGroup"
                              :items="itemsTreeSupportGroup"
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
            <v-btn @click="SaveRoleUserRight" color="primary">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <dialog-loader :isSnackbar="IsSnackBar"/>
  </div>
</template>
<script>
import VJstree from "vue-jstree";
import DialogLoader from "../../../components/control/DialogLoader";
import AuthorizationService from "../../../services/authorization-service";
import _ from "lodash";
import axios from "axios";
import JsTreeList from "js-tree-list";

export default {
  components: {
    VJstree,
    DialogLoader
  },
  data: () => ({
    snackbar: {
      isTrue: false
    },
    IsTree: false,
    treeMy: [],
    filterTeams: [],

    arrayTreeRoleUserRule: [],
    filterTreeRoleUserRule: [],
    typeRoleUserRule: [],

    arrayTreeLocationTicket: [],
    filterTreeLocationTicket: [],
    typeLocationTicket: [],

    arrayTreeSupportGroup: [],
    filterTreeSupportGroup: [],
    typeSupportGroup: [],

    //AutoCompelete
    modelRoleUserGroup: null,
    arrayRoleUserGroup: [],
    loader: null,
    loading: false,

    arrayRoleLocationTicketRight: []
  }),
  created: function() {
    this.getRoleUserGroup();
  },
  computed: {
    IsSnackBar() {
      return this.snackbar.isTrue;
    },
    itemsRoleUserRule() {
      const children = this.arrayTreeRoleUserRule;
      return [
        {
          id: -1,
          name: "All",
          children
        }
      ];
    },
    itemsTreeLocationTicket() {
      const children = this.arrayTreeLocationTicket;
      return [
        {
          id: -1,
          name: "All",
          children
        }
      ];
    },
    itemsTreeSupportGroup() {
      const children = this.arrayTreeSupportGroup;
      return [
        {
          id: -1,
          name: "All",
          children
        }
      ];
    }
  },
  watch: {
    arrayTreeRoleUserRule(val) {
      this.typeRoleUserRule = val
        .reduce((acc, cur) => {
          const type = cur.ParentId;
          if (!acc.includes(type)) {
            acc.push(type);
          }
          return acc;
        }, [])
        .sort();
    },
    arrayTreeLocationTicket(val) {
      this.typeLocationTicket = val
        .reduce((acc, cur) => {
          const type = cur.ParentId;
          if (!acc.includes(type)) acc.push(type);
          return acc;
        }, [])
        .sort();
    },
    arrayTreeSupportGroup(val) {
      this.typeSupportGroup = val
        .reduce((acc, cur) => {
          const type = cur.ParentId;
          if (!acc.includes(type)) acc.push(type);
          return acc;
        }, [])
        .sort();
    },
    loader() {
      const l = this.loader;
      this[l] = !this[l];
      setTimeout(() => (this[l] = false), 500);
      this.loader = null;
    }
  },
  methods: {
    list_to_treeMenu(list) {
      //debugger
      var map = {},
        node,
        roots = [],
        i;
      for (i = 0; i < list.length; i += 1) {
        map[list[i].id] = i; // initialize the map
        if (list[i].IsChild == false) {
          list[i].children = []; // initialize the children
        }
      }

      for (i = 0; i < list.length; i += 1) {
        node = list[i];
        if (node.ParentId != "0") {
          // if you have dangling branches check that map[node.ParentId] exists
          var objList = list[map[node.ParentId]];
          if (objList == undefined) {
          } else {
            objList.children.push(node);
          }
        } else {
          roots.push(node);
        }
      }

      return roots;
    },

    getRoleUserGroup() {
      axios({
        method: "get",
        url: this.$urlApplication + "RoleUserGroup/GetRoleUserGroups"
      })
        .then(res => {
          this.arrayRoleUserGroup = [];
          for (let value of res.data) {
            var result = {
              id: value.RoleUserGroupId,
              name: value.UserGroupName
            };
            this.arrayRoleUserGroup.push(result);
          }
        })
        .catch(error => {});
    },
    async getRoleUserRightById(obj) {
      this.getRoleLocationTicketRight(obj);
      this.getRoleSupportGroupRight(obj);
      var pId = obj.id;
      this.filterTreeRoleUserRule = [];
      const res = await axios
        .get(this.$urlApplication + "GetRoleUserRight?id=" + pId)
        .then(res => {
          for (const obj of res.data) {
            this.filterTreeRoleUserRule.push(obj.RoleUserRuleId);
          }
        })
        .catch(error => {});
    },
    async getRoleLocationTicketRight(obj) {
      var pId = obj.id;
      this.filterTreeLocationTicket = [];
      const res = await axios
        .get(this.$urlApplication + "GetRoleLocationTicketRight?id=" + pId)
        .then(res => {
          for (const itmes of res.data) {
            this.filterTreeLocationTicket.push(itmes.LocationId);
          }
        })
        .catch(error => {});
    },
    async getRoleSupportGroupRight(obj) {
      var pId = obj.id;
      this.filterTreeSupportGroup = [];
      const res = await axios
        .get(this.$urlApplication + "GetRoleSupportGroupRight?id=" + pId)
        .then(res => {
          for (const itmes of res.data) {
            this.filterTreeSupportGroup.push(itmes.IncidentTierQueuesId);
          }
        })
        .catch(error => {});
    },
    SaveRoleUserRight() {
      
      if (this.modelRoleUserGroup == null) {
        alert("Please select support group");
      } 
      else 
      {
        this.snackbar.isTrue = true;
        var result = this.filterTreeRoleUserRule;
        var arrayValues = [];
        for (var i = 0; i < result.length; i++) {
          if (Number.isInteger(result[i]) && result[i] != 0) {
            arrayValues.push({
              RoleUserGroupId: this.modelRoleUserGroup.id,
              RoleUserRuleId: result[i],
              AccessRightsId: 1
            });
          }
        }
        //////////////////////////////////////////////////////////////////////////////////LocationTicket//////////////////////////////////////////////////////////////////
        var locationTicket = this.filterTreeLocationTicket;
        var arrayLocation = [];

        for (var i = 0; i < locationTicket.length; i++) {
          if (Number.isInteger(locationTicket[i]) && locationTicket[i] != 0) {
            arrayLocation.push({
              RoleUserGroupId: this.modelRoleUserGroup.id,
              LocationId: locationTicket[i]
            });
          }
        }
        //////////////////////////////////////////////////////////////////////////////////LocationTicket//////////////////////////////////////////////////////////////////
        ////////////////////Save METHOD//////////////////////////////////////////////////////////////SupportGroup//////////////////////////////////////////////////////////////////
        var supportGroup = this.filterTreeSupportGroup;
        var arraySupportGroup = [];
        for (var i = 0; i < supportGroup.length; i++) {
          if (Number.isInteger(supportGroup[i]) && supportGroup[i] != 0) {
            arraySupportGroup.push({
              RoleUserGroupId: this.modelRoleUserGroup.id,
              IncidentTierQueuesId: supportGroup[i]
            });
          }
        }
        //////////////////////////////////////////////////////////////////////////////////SupportGroup//////////////////////////////////////////////////////////////////
        if (arrayValues.length > 0) {
          var array = {
            roleUserRight: arrayValues,
            roleLocationTicketRight: arrayLocation,
            roleSupportGroupRight: arraySupportGroup
          };
          axios({
            method: "put",
            url:
              this.$urlApplication +
              "PutRoleUserRight?id=" +
              this.modelRoleUserGroup.id,
            data: array
          })
            .then(res => {
              this.loader = "loading";
              this.snackbar.isTrue = false;
            })
            .catch(error => {
              alert(error.response.data);
            });
        }
      }
    },
    fetchRoleUserRule() {
      if (this.arrayTreeRoleUserRule.length) return;
      return fetch(this.$urlApplication + "GetRoleUserRules")
        .then(res => res.json())
        .then(data => {
          data = _.orderBy(data.filter(w => true), "OrderBy", "asc");
          var convertedTree = this.list_to_treeMenu(data);
          this.arrayTreeRoleUserRule = convertedTree;
        })
        .catch(err => console.log(err));
    },

    list_to_treeLocattion(list) {
      var map = {},
        node,
        roots = [],
        i;
      for (i = 0; i < list.length; i += 1) {
        map[list[i].id] = i; // initialize the map
        if (list[i].IsChild == false) {
          list[i].children = []; // initialize the children
        }
      }
      for (i = 0; i < list.length; i += 1) {
        node = list[i];
        if (node.ParentId != "0") {
          // if you have dangling branches check that map[node.ParentId] exists
          var objList = list[map[node.ParentId]];
          if (objList == undefined) {
          } else {
            objList.children.push(node);
          }
        } else {
          roots.push(node);
        }
      }
      return roots;
    },

    fetchTreeLocationTicket() {
      if (this.arrayTreeLocationTicket.length) return;
      return fetch(this.$urlApplication + "GetLocationAll")
        .then(res => res.json())
        .then(data => {
          var objData = data;
          var convertedTree = this.list_to_treeLocattion(objData);
          this.arrayTreeLocationTicket = convertedTree;
        })
        .catch(err => console.log(err));
    },

    // fetchTreeLocationTicket() {
    //   debugger;
    //   if (this.arrayTreeLocationTicket.length) return;
    //   //var LTT = require("list-to-tree");
    //   return fetch(this.$urlApplication + "GetLocationAll")
    //     .then(res => res.json())
    //     .then(data => {
    //       // var ltt = new LTT(data, {
    //       //   key_id: "id",
    //       //   key_parent: "ParentId"
    //       // });
    //       // ltt.sort(this.compareById(true));
    //       // var v1 = ltt.GetTree();
    //       debugger;
    //       var convertedTree = this.list_to_treeLocattion(data);

    //       this.arrayTreeLocationTicket = convertedTree;
    //     })
    //     .catch(err => {
    //       debugger;
    //       console.log(err);
    //     });
    // },

    list_to_treeSupportGroup(list) {
      var map = {},
        node,
        roots = [],
        i;
      for (i = 0; i < list.length; i += 1) {
        map[list[i].id] = i; // initialize the map
        if (list[i].IsChild == false) {
          list[i].children = []; // initialize the children
        }
      }
      for (i = 0; i < list.length; i += 1) {
        node = list[i];
        if (node.ParentId != "0") {
          // if you have dangling branches check that map[node.ParentId] exists
          var objList = list[map[node.ParentId]];
          if (objList == undefined) {
          } else {
            objList.children.push(node);
          }
        } else {
          roots.push(node);
        }
      }
      return roots;
    },

    fetchTreeSupportGroup() {
      if (this.arrayTreeSupportGroup.length) return;
      //var LTT = require("list-to-tree");
      return fetch(this.$urlApplication + "GetSupportGroupAll")
        .then(res => res.json())
        .then(data => {
          var objData = data;

          //this.$store.dispatch("storeTree", objData);
          // var ltt = new LTT(objData, {
          //   key_id: "id",
          //   key_parent: "ParentId"
          // });
          // var convertedTree = ltt.GetTree();
          objData = _.orderBy(objData.filter(w => true), "name", "asc");
          var convertedTree = this.list_to_treeSupportGroup(objData);
          this.arrayTreeSupportGroup = convertedTree;

          var arrayLocation = [];
          objData.forEach(function(obj, index) {
            arrayLocation.push(obj.id);
          });
          this.filterTree = arrayLocation;
        })
        .catch(err => console.log(err));
    },
    // fetchTreeSupportGroup() {
    //   if (this.arrayTreeSupportGroup.length) return;
    //   //var LTT = require("list-to-tree");
    //   return fetch(this.$urlApplication + "GetSupportGroupAll")
    //     .then(res => res.json())
    //     .then(data => {
    //       // var ltt = new LTT(data, {
    //       //   key_id: "id",
    //       //   key_parent: "ParentId"
    //       // });
    //       var convertedTree = this.list_to_tree(data);
    //       this.arrayTreeSupportGroup = convertedTree;
    //     })
    //     .catch(err => console.log(err));
    // },
    compareById(vector) {
      return (a, b) => {
        const aid = Number(a.get("OrderBy"));
        const bid = Number(b.get("OrderBy"));
        if (aid > bid) {
          return vector ? 1 : -1;
        } else if (aid < bid) {
          return vector ? -1 : 1;
        } else {
          return 0;
        }
      };
    }
  }
};
</script>