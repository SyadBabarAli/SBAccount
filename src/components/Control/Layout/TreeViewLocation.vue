<template>
  <v-card>
    <v-layout>
      <v-flex>
        <v-card-text>
          <!-- <v-treeview
            v-model="filterTreeLocationTicket"
            :load-children="fetchTreeLocationTicket"
            :items="itemsTreeLocationTicket"
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
    arrayTreeLocationTicket: [],
    filterTreeLocationTicket: [],
    typeLocationTicket: [],
    arrayLocationAll: []
  }),
  computed: {
    itemsTreeLocationTicket() {
      const children = this.arrayTreeLocationTicket;
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
    arrayTreeLocationTicket(val) {
      if (val != undefined) {
        this.typeLocationTicket = val
          .reduce((acc, cur) => {
            const type = cur.ParentId;
            if (!acc.includes(type)) acc.push(type);
            return acc;
          }, [])
          .sort();
      }
    },
    filterTreeLocationTicket(obj) {
      var arrySelectedLocation = obj;
      var arrayLocation = this.$store.getters.location;
      this.$store.dispatch("storeFilterLocation", []);

      var arrySelectedLocationProperty = [];
      for (let id of arrySelectedLocation) {
        for (var i = 0; i < arrayLocation.length; i++) {
          var locationId = arrayLocation[i].id;
          if (locationId == id) {
            var locationKey = arrayLocation[i];
            locationKey = locationKey.Property_Location.toUpperCase();
            arrySelectedLocationProperty.push(locationKey);
            break;
          }
        }
      }
      this.$store.dispatch("storeFilterLocation", arrySelectedLocationProperty);
    }
  },

  methods: {
    onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    },
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
    fetchTreeLocationTicket() {
      if (this.arrayTreeLocationTicket.length) return;
      // var LTT = require("list-to-tree");

      return fetch(this.$urlApplication + "GetLocation")
        .then(res => res.json())
        .then(data => {
          var objData = data;
          this.$store.dispatch("storeLocation", objData);
          
          // var ltt = new LTT(objData, {
          //   key_id: "id",
          //   key_parent: "ParentId"
          // });
          //ltt.sort(this.compareById(true));
          //var convertedTree = ltt.GetTree();
          var convertedTree = this.list_to_tree(objData);
          this.arrayTreeLocationTicket = convertedTree;

          var arrayLocation = [];
          objData.forEach(function(obj, index) {
            arrayLocation.push(obj.id);
          });
          this.filterTreeLocationTicket = arrayLocation;
        })
        .catch(err => console.log(err));
    },

    getChildren(type) {
      const arrayTreeLocationTicket = [];

      for (const arrayLocation of this.arrayTreeLocationTicket) {
        if (arrayLocation.ParentId !== type) {
          continue;
        } else {
          arrayTreeLocationTicket.push({
            ...arrayLocation,
            name: arrayLocation.name
          });
        }
      }

      return arrayTreeLocationTicket.sort((a, b) => {
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