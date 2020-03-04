<template>
  <v-card>
    <v-toolbar color="teal" dark dense>
      <v-icon>category</v-icon>&nbsp;
      <h1 class="font-weight-light">Catagories</h1>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-list>
      <!-- <v-treeview :items="filterMenu">        
      </v-treeview>-->

      <v-treeview :items="filterMenu" item-key="name" activatable>
        <template slot="label" slot-scope="{ item }">
          <v-icon :color="item.id == selectedId ? 'primary' : ''">font_download</v-icon>
          <a @click="openDialog(item)" class="black--text">{{ item.name }}</a>
        </template>
      </v-treeview>
    </v-list>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      selectedId: 10,
      filterMenu: []
    };
  },
  created() {
    this.fetchMenu();
    //this.$store.dispatch("storeKBArticle", "Article-1");
  },
  methods: {
    openDialog(obj) {
      this.selectedId = obj.id;
      this.$store.dispatch("storeKBArticle", obj.id + " - " + obj.name);
    },
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
      //debugger;
      return roots;
    },

    fetchMenu() {
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
          this.filterMenu = v1;
        })
        .catch(err => console.log(err));
    }
  }
};
</script>