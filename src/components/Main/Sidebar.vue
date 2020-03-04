<template>
  <div>
    <mu-drawer :open="sidebarMini" :width="48" :zDepth="0" class="sidebar-mini mt-50 d-lg">
      <mu-list-item disableRipple>
        <mu-icon value="chevron_right" slot="left" @click="toggleSidebar"></mu-icon>
      </mu-list-item>

      <div class="title">Support Groups</div>
    </mu-drawer>

    <mu-icon-button icon="chevron_right" class="d-md" @click="toggleSidebar"></mu-icon-button>

    <mu-drawer :open="sidebar" :width="256" :zDepth="0" class="sidebar mt-50">
      <mu-list-item title="Support Group" disableRipple>
        <mu-icon value="chevron_left" slot="left" @click="toggleSidebar"></mu-icon>
        <!-- <mu-switch slot="right" v-model="multiSelection"></mu-switch> -->
      </mu-list-item>
      <ctrl-Tree/>
      <!-- 

      <mu-list-item title="Level 1" toggleNested v-if="hasLvl1.length">
        <div slot="nested">
          <div class="prl-16">
            <div v-for="(team, index) in teams" :key="index" v-if="team.Tier == 1">
              <mu-checkbox
                :label="team.TeamAssigned"
                :nativeValue="team.TeamAssigned"
                v-model="filterTeams"
                @change="checkTeam(team.TeamAssigned)"
              ></mu-checkbox>
            </div>
          </div>
        </div>
      </mu-list-item>

      <mu-list-item title="Level 2" toggleNested v-if="hasLvl2.length">
        <div slot="nested">
          <mu-content-block>
            <div v-for="(team, index) in teams" :key="index" v-if="team.Tier == 2">
              <mu-checkbox
                :label="team.TeamAssigned"
                :nativeValue="team.TeamAssigned"
                v-model="filterTeams"
                @change="checkTeam(team.TeamAssigned)"
              ></mu-checkbox>
            </div>
          </mu-content-block>
        </div>
      </mu-list-item>

      <mu-list-item title="Level 3" toggleNested v-if="hasLvl3.length">
        <div slot="nested">
          <mu-content-block>
            <div v-for="(team, index) in teams" :key="index" v-if="team.Tier == 3">
              <mu-checkbox
                :label="team.TeamAssigned"
                :nativeValue="team.TeamAssigned"
                v-model="filterTeams"
                @change="checkTeam(team.TeamAssigned)"
              ></mu-checkbox>
            </div>
          </mu-content-block>
        </div>
      </mu-list-item>

      <mu-list-item title="Vendor" toggleNested :open="false" v-if="hasLvl4.length">
        <div slot="nested">
          <mu-content-block>
            <div v-for="(team, index) in teams" :key="index" v-if="team.Tier == 4">
              <mu-checkbox
                :label="team.TeamAssigned"
                :nativeValue="team.TeamAssigned"
                v-model="filterTeams"
                @change="checkTeam(team.TeamAssigned)"
              ></mu-checkbox>
            </div>
          </mu-content-block>
        </div>
      </mu-list-item>-->
    </mu-drawer>
  </div>
</template>

<script>
import Tree from "../Control/Tree";

import _ from "lodash";

export default {
  data() {
    return {
      sidebar: true,
      sidebarMini: false,
      multiSelection: false,
      filterTeams: []
    };
  },
  components: {
    "ctrl-Tree": Tree
  },
  created() {
    this.fetchTeams();
  },
  watch: {
    teams: {
      immediate: true,
      handler() {
        this.setTeams();
      }
    },
    multiSelection(x) {
      if (!x) {
        return this.setTeams();
      }

      this.filterTeams = [];
      this.$store.dispatch("storeFilterTeams", this.filterTeams);
    }
  },
  computed: {
    teams() {
      return this.$store.getters.teams;
    },
    hasLvl1() {
      return this.teams.filter(team => team.Tier == 1);
    },
    hasLvl2() {
      return this.teams.filter(team => team.Tier == 2);
    },
    hasLvl3() {
      return this.teams.filter(team => team.Tier == 3);
    },
    hasLvl4() {
      return this.teams.filter(team => team.Tier == 4);
    }
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
    checkTeam(val) {
      if (!this.multiSelection) {
        this.filterTeams = [];
        this.filterTeams.push(val);
      }

      setTimeout(() => {
        this.$store.dispatch("storeFilterTeams", this.filterTeams);
      }, 100);
    },
    fetchTeams() {
      this.$store.dispatch("fetchTeams");
    },
    setTeams() {
      _.forEach(_.groupBy(this.teams, "TeamAssigned"), (val, key) => {
        this.filterTeams.push(key);
      });
      this.$store.dispatch("storeFilterTeams", this.filterTeams);
    }
  }
};
</script>

<style scoped>
.sidebar,
.sidebar-mini {
  z-index: 2;
  /* overflow: hidden; */
}

.sidebar-mini {
  overflow: hidden;
}

.sidebar-mini .title,
.panel .panel-header {
  font-size: 15px;
}

.sidebar-mini .title {
  writing-mode: vertical-rl;
  margin: auto;
  position: relative;
  top: 32%;
}

@media (max-width: 768px) {
  .sidebar {
    display: none;
  }
}
</style>