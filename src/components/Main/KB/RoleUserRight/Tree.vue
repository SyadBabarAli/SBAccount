<template>
  <v-card>
    <v-toolbar card color="grey lighten-3">
      <v-icon>mdi-silverware</v-icon>
      <v-toolbar-title>Tree View</v-toolbar-title>
    </v-toolbar>

    <v-layout>
      <v-flex>
        <v-card-text>
          
          <v-treeview
            v-model="filterTree"
            :load-children="fetchTree"
            :items="itemsTree"
            selected-color="colorLight"
            selectable
            activatable
            open-all
          ></v-treeview>
        </v-card-text>
      </v-flex>

      <v-divider vertical></v-divider>

      <v-flex xs12 md6>
        <v-card-text>{{this.filterTree}}</v-card-text>
        {{this.arrayTree}}
      </v-flex>
    </v-layout>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn flat @click="filterTree = []">Reset</v-btn>

      <v-spacer></v-spacer>

      <v-btn class="white--text" color="green darken-1" depressed>
        Save
        <v-icon right>mdi-content-save</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    arrayTree: [],
    filterTree: [],
  }),

  computed: {
    itemsTree() {
      const children = this.arrayTree;
      return [
        {
          id: 1,
          name: "Global Users",
          children
        }
      ];
    }
  },

  // watch: {
  //   filterTree(val) {
  //     var v1 = this.arrayTree;
  //     debugger;

  //     // this.types = val
  //     //   .reduce((acc, cur) => {
  //     //     const type = cur.ParentId;
  //     //     if (!acc.includes(type)) acc.push(type);
  //     //     return acc;
  //     //   }, [])
  //     //   .sort();
  //   }
  // },

  methods: {
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

      return fetch(this.$urlApplication + "GetTreeOptionAll")
        .then(res => res.json())
        .then(data => {
          var convertedTree = this.list_to_treeLocattion(data);
          this.arrayTree = convertedTree;
        })
        .catch(err => console.log(err));
    },
  }
};
</script>