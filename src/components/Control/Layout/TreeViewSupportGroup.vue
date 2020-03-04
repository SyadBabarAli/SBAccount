<template>
  <v-card>
    <v-layout>
      <v-flex>
        <v-card-text>
          <!-- <v-treeview
            v-model="filterTree"
            :load-children="fetchTree"
            :items="itemsTree"
            active-class="grey lighten-4"
            selected-color="colorLight"
            selectable
            activatable
            open-all
          ></v-treeview> -->
        </v-card-text>
      </v-flex>
    </v-layout>
  </v-card>
</template>
<script>
import _ from "lodash";
export default {
  data: () => ({
    arrayTree: [],
    filterTree: [],
    typeTree: []
  }),
  computed: {
    itemsTree() {
      const children = this.arrayTree;
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
    arrayTree(val) {
      if (val != undefined) {
        this.typeTree = val
          .reduce((acc, cur) => {
            const type = cur.ParentId;
            //const nameSupportGroup = cur.name;
            if (!acc.includes(type)) {
              acc.push(type);
            }
            return acc;
          }, [])
          .sort();
      }
    },
    filterTree(obj) {
      var arrySelectedIds = obj;
      var arrayAllIds = this.$store.getters.tree;
      this.$store.dispatch("storeFilterTree", []);

      var arrySelectedIdsNew = [];
      var arrayIncidentTierQueuesIds = [];
      for (let id of arrySelectedIds) {
        for (var i = 0; i < arrayAllIds.length; i++) {
          var idNew = arrayAllIds[i].id;
          var name = arrayAllIds[i].name;
          var IncidentTierQueuesId = arrayAllIds[i].IncidentTierQueuesId == undefined ? 0 :  arrayAllIds[i].IncidentTierQueuesId ;

          if (id == idNew) {
            arrySelectedIdsNew.push(name);
            arrayIncidentTierQueuesIds.push(IncidentTierQueuesId);
            break;
          }
        }
      }

      this.$store.dispatch("storeFilterTree", arrySelectedIdsNew);
      this.$store.dispatch("storeIncidentTierQueuesIds", arrayIncidentTierQueuesIds);
    }
  },

  methods: {
    onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    },
    list_to_tree(list) {
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
    fetchTree() {
      if (this.arrayTree.length) return;
      //var LTT = require("list-to-tree");
      return fetch(this.$urlApplication + "GetSupportGroup")
        .then(res => res.json())
        .then(data => {
          var objData = data;

          this.$store.dispatch("storeTree", objData);
          // var ltt = new LTT(objData, {
          //   key_id: "id",
          //   key_parent: "ParentId"
          // });
          // var convertedTree = ltt.GetTree();

          //Added below line for for ascending by name of support group.
          objData = _.orderBy(objData.filter(w => true), "name", "asc");
          var convertedTree = this.list_to_tree(objData);
          this.arrayTree = convertedTree;

          var arrayLocation = [];
          objData.forEach(function(obj, index) {
            arrayLocation.push(obj.id);
          });
          this.filterTree = arrayLocation;
        })
        .catch(err => console.log(err));
    },

    getChildren(type) {
      const arrayTree = [];

      for (const arrayLocation of this.arrayTree) {
        if (arrayLocation.ParentId !== type) {
          continue;
        } else {
          arrayTree.push({
            ...arrayLocation,
            name: arrayLocation.name
          });
        }
      }

      return arrayTree.sort((a, b) => {
        return a.name > b.name ? 1 : -1;
      });
    }
  }
};
</script>
<style scoped>
.v-card__text {
  /* height: 500px; */
  overflow-y: auto;
}
</style>