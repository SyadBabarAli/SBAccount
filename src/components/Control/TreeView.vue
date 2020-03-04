<template>
  <div>
    <v-treeview
      v-model="filterTree"
      :load-children="fetch"
      :items="items"
      activatable
      active-class="grey lighten-4"
      selected-color="colorLight"
      selectable
      open-all
    ></v-treeview>

    <v-flex csmHide>
      <!-- <v-card-text> -->
      <!-- <div
          v-if="selections.length === 0"
          key="title"
          class="title font-weight-light grey--text pa-3 text-xs-center"
      >Select your favorite breweries</div>-->
      <!-- <v-scroll-x-transition group hide-on-leave> -->
      <v-chip v-for="(selection, i) in selections" :key="i" color="grey" dark small>
        <v-icon left small>mdi-beer</v-icon>
        {{ selection.TeamAssigned }}
      </v-chip>
      <!-- </v-scroll-x-transition> -->
      <!-- </v-card-text> -->
    </v-flex>

    <!-- <v-card>
      <v-layout>
        <v-flex>
          <v-card-text>
            <v-treeview
              v-model="filterTree"
              :load-children="fetch"
              :items="items"
              activatable
              active-class="grey lighten-4"
              selected-color="colorLight"
              selectable
              open-all
            ></v-treeview>
          </v-card-text>
        </v-flex>
        <v-flex csmHide>
          <v-card-text>
            <div
              v-if="selections.length === 0"
              key="title"
              class="title font-weight-light grey--text pa-3 text-xs-center"
            >Select your favorite breweries</div>
            <v-scroll-x-transition group hide-on-leave>
              <v-chip v-for="(selection, i) in selections" :key="i" color="grey" dark small>
                <v-icon left small>mdi-beer</v-icon>
                {{ selection.TeamAssigned }}
              </v-chip>
            </v-scroll-x-transition>
          </v-card-text>
        </v-flex>
      </v-layout>
    </v-card>-->
  </div>
</template>
<script>
import AuthorizationService from "../../services/authorization-service";
import _ from "lodash";

export default {
  data: () => ({
    breweries: [],
    isLoading: false,
    filterTree: [],
    types: []
  }),
  computed: {
    items() {
      const children = this.types.map(type => ({
        id: type,
        name: this.getName(type),
        children: this.getChildren(type)
      }));
      return [
        {
          id: 0,
          name: "Select All",
          children
        }
      ];
    },
    selections() {
      const selections = [];
      for (const leaf of this.filterTree) {
        const brewery = this.breweries.find(brewery => brewery.id === leaf);
        if (!brewery) continue;
        selections.push(brewery);
      }
      var arrayTeam = [];
      for (var i = 0; i < selections.length; i++) {
        arrayTeam.push(selections[i].TeamAssigned);
      }
      this.$store.dispatch("storeFilterTree", arrayTeam);
      return selections;
    },
    shouldShowTree() {
      return this.breweries.length > 0 && !this.isLoading;
    }
  },

  watch: {
    breweries(val) {
      this.types = val
        .reduce((acc, cur) => {
          //const type = "Level-" + cur.Tier;
          var  type = "Level-1"; //cur.Tier == 4 ? "Vendor" : "Level-" + cur.Tier;

          if (cur.Tier == 4) {
            type = "Vendor / ISP";
          } else if (cur.Tier == 5) {
            type = "Other (Non-IT)";
          } else {
            type = "Level-" + cur.Tier;
          }

          if (!acc.includes(type)) acc.push(type);
          return acc;
        }, [])
        .sort();
    }
  },

  methods: {
    fetch() {
      if (this.breweries.length) return;
      var obj = null;
      AuthorizationService.getTeams()
        .then(obj => {
          this.breweries = this.reloadTree(obj);
          this.filterTree.push(0);
        })
        .catch(error => console.log(err));
    },
    getChildren(type) {
      const breweries = [];

      for (const brewery of this.breweries) {
        var typeNew = "Level-1"; //brewery.Tier == 4 ? "Vendor" : "Level-" + brewery.Tier;

        if (brewery.Tier == 4) {
          typeNew = "Vendor / ISP";
        } else if (brewery.Tier == 5) {
          typeNew = "Other (Non-IT)";
        } else {
          typeNew = "Level-" + brewery.Tier;
        }

        if (typeNew !== type) continue;

        breweries.push({
          ...brewery,
          name: this.getName(brewery.TeamAssigned)
        });
      }
      return breweries.sort((a, b) => {
        return a.TeamAssigned > b.TeamAssigned ? 1 : -1;
      });
    },
    getName(TeamAssigned) {
      var obj = TeamAssigned; //`${TeamAssigned.charAt(0).toUpperCase()}${TeamAssigned.slice(1)}`;
      // debugger
      return obj;
    },
    reloadTree(pObj) {
      var obj = pObj.data;
      var arrayResult = [];
      if (obj.length != 0) {
        var i = 1;
        _.forEach(_.groupBy(obj, "TeamAssigned"), (val, key) => {
          arrayResult.push({
            id: i,
            TeamAssigned: key,
            Tier: val[0].Tier
          });
          i++;
        });
      }
      return arrayResult;
    }
  }
};
</script>