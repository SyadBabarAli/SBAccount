<template>
  <div>
    <v-card>
      <v-list three-line>
        <template v-for="(item, index) in itemsFavorite">
          <v-subheader v-if="item.header" :key="item.header">Favorite</v-subheader>
          <v-list-tile v-else :key="item.title" @click>
            <v-list-tile-content>
              <v-list-tile>{{item.subtitle}}</v-list-tile>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-card>

    <v-divider></v-divider>

    <v-card>
      <v-list three-line>
        <v-subheader>Recent</v-subheader>
        <v-data-table
          must-sort
          :headers="headers"
          :items="listOfRecords"
          :search="search"
          hide-headers
        >
          <template slot="items" slot-scope="props">
            <tr @click="rowClick(props)">
              <td class="text-xs-left">{{ props.item.Name }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-list>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      search: "",
      headers: [{ text: "KB Tree View", value: "Name" }],
      listOfRecords: [],
      itemsFavorite: [
        { header: "Favorite" },
        {
          subtitle: "Account Management"
        },
        {
          subtitle: "Restoration PC"
        },
        {
          subtitle: "New Connection"
        },
        {
          subtitle: "Discard PC"
        },
        {
          subtitle: "Account Management"
        }
      ]
    };
  },
  created() {
    this.tableLoad();
  },
  methods: {
    rowClick(obj) {
      alert(1);
      //debugger

      // if (event.target.classList.contains("btn__content")) {
      //   return;
      // }
      //alert('Alert! \n' + a.name);
      //alert(1);
    },
    tableLoad() {
      axios({
        method: "get",
        url: this.$urlApplication + "GetKBTreeViews"
      })
        .then(res => {
          this.listOfRecords = res.data;
        })
        .catch(error => {});
    }
  }
};
</script>
