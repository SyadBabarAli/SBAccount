<template>
  <div>
    <v-jsTree
      :data="filterTeams"
      show-checkbox
      multiple
      allow-batch
      whole-row
      @item-click="checkTeams"
    ></v-jsTree>
  </div>
</template>
<script>
import AuthorizationService from "../../services/authorization-service";
import VJsTree from "vue-jsTree";
import _ from "lodash";
export default {
  data() {
    return {
      filterTeams: []
    };
  },
  created: function() {
    this.setTeams();
  },
  methods: {
    toggleSidebar() {
      this.sidebar = !this.sidebar;
      this.sidebarMini = !this.sidebarMini;

      if (this.sidebar) {
        document.getElementById("main-content").style.marginLeft = "256px";
        this.$store.dispatch("setSidebar", true);
      } else {
        document.getElementById("main-content").style.marginLeft = "48px";
        this.$store.dispatch("setSidebar", false);
      }

      document.querySelector(".sidebar").style.display = "block";
    },
    fetchTeams() {
      this.$store.dispatch("fetchTeams");
    },
    checkTeams(val) {
      var arrayTeams = this.getOnlyTeams(this.filterTeams);
      setTimeout(() => {
        this.$store.dispatch("storeFilterTeams", arrayTeams);
      }, 100);
    },
    setTeams() {
      AuthorizationService.getTeams()
        .then(obj => {
          this.reloadTeams(obj);
        })
        .catch(error => {});
    },
    getOnlyTeams(pObj) {
      var obj = pObj;
      var arrayTeams = [];
      var level1 = obj[0].children;
      for (var i = 0; i < level1.length; i++) {
        var level2 = level1[i].children;
        for (var j = 0; j < level2.length; j++) {
          if (level2[j].selected) {
            var item = level2[j].text;
            arrayTeams.push(item);
          }
        }
      }
      return arrayTeams;
    },
    reloadTeams(pObj) {
      var obj = pObj.data;
      var arrayTeams = [];
      if (obj.length != 0) {
        var arrayLevel11 = [];
        var arrayLevel22 = [];
        var arrayLevel33 = [];
        var arrayLevel44 = [];
        var arrayResult = [];
        _.forEach(_.groupBy(obj, "TeamAssigned"), (val, key) => {
          if (val[0].Tier == 1) {
            arrayLevel11.push({
              text: key,
              opened: false,
              selected: true,
              disabled: false,
              loading: false
            });
          } else if (val[0].Tier == 2) {
            arrayLevel22.push({
              text: key,
              opened: false,
              selected: true,
              disabled: false,
              loading: false
            });
          } else if (val[0].Tier == 3) {
            arrayLevel33.push({
              text: key,
              opened: false,
              selected: true,
              disabled: false,
              loading: false
            });
          } else if (val[0].Tier == 4) {
            arrayLevel44.push({
              text: key,
              opened: false,
              selected: true,
              disabled: false,
              loading: false
            });
          }
          arrayTeams.push(key);
        });

        var arrayResult = [
          {
            text: "Select All",
            opened: true,
            selected: true,
            disabled: false,
            loading: false,
            children: [
              {
                text: "Level-1",
                children: arrayLevel11,
                opened: true,
                selected: true,
                disabled: false,
                loading: false
              },
              {
                text: "Level-2",
                children: arrayLevel22,
                opened: true,
                selected: true,
                disabled: false,
                loading: false
              },
              {
                text: "Level-3",
                children: arrayLevel33,
                opened: true,
                selected: true,
                disabled: false,
                loading: false
              },
              {
                text: "Level-4",
                children: arrayLevel44,
                opened: true,
                selected: true,
                disabled: false,
                loading: false
              }
            ]
          }
        ];

        this.filterTeams = arrayResult;
        this.$store.dispatch("storeFilterTeams", arrayTeams);
      }
    }
  },
  components: {
    VJsTree
  }
};
</script>