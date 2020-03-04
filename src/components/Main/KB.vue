<template>
  <v-app>
    <v-toolbar color="colorLight" dense dark fixed>
      <v-list-tile to="/">
        <v-list-tile-action class="pl-3">
          <v-icon>dashboard</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>
            <v-toolbar-title style="width:300px">
              Dashboard
              <!-- {{this.tabActiveName}} -->
            </v-toolbar-title>
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-tabs color="colorLight" align-with-title v-model="tabActiveName">
        <v-tabs-slider color="yellow"></v-tabs-slider>
        <v-tab v-for="item in items" class="white--text" :to="'/'+item.link" :key="item.id">
          <v-icon dark>{{item.icon}}</v-icon>&nbsp;
          <b>{{item.name}}</b>
        </v-tab>
      </v-tabs>
      <v-toolbar-title style="width:300px">Knowledge Base</v-toolbar-title>
    </v-toolbar>
    <v-tabs-items class="pt-5">
      <v-content>
        <router-view />
      </v-content>
    </v-tabs-items>
    <v-footer app>
      <span class="px-3">AKU IT Service Desk © {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>
<script>
import axios from "axios";
export default {
  data: () => ({
    tabActiveName: "/KB",
    isNotification: true,
    tab: null,
    items: []
  }),
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      //1
      axios.get(this.$urlApplication + "RoleUser/GetLoginUserName").then(response => {
        this.loginUserName = response.data[0].FirstName;
        this.$store.commit("setLoginEmployeeId", response.data[0].Email);
        this.$store.commit("setRoleUserId", response.data[0].RoleUserId);
      });
      //1
      //2///////////////////////////////////////////////////////////////////////////////
      fetch(this.$urlApplication + "GetRoleUserRuleMenu")
        .then(res => res.json())
        .then(data => {
          var objData = data.filter(w =>
            _.includes([9, 2011, 2022, 2027, 2032,2037], w.id)
          );
          //Home
          for (var i = 0; i < objData.length; i++) {
            var obj = objData[i];
            var optionName = obj.name;
            var id = obj.id;
            if (optionName == "KB") {
              this.items.push({
                id: 1,
                name: "Home",
                link: "KB",
                icon: "home"
              });
            }
          }

          //Article
          for (var i = 0; i < objData.length; i++) {
            var obj = objData[i];
            var optionName = obj.name;
            var id = obj.id;
            if (optionName == "Article") {
              this.items.push({
                id: 2,
                name: "Articles",
                link: "KB/Article",
                icon: "description"
              });
            }
          }

          //Category
          for (var i = 0; i < objData.length; i++) {
            var obj = objData[i];
            var optionName = obj.name;
            var id = obj.id;

            if (
              optionName == "Category" ||
              id == 2023 ||
              id == 2025 ||
              id == 2026
            ) {
              this.items.push({
                id: 3,
                name: "Category",
                link: "KB/Category",
                icon: "device_hub"
              });
            }

            //Group
            if (
              optionName == "Group" ||
              id == 2028 ||
              id == 2030 ||
              id == 2031
            ) {
              this.items.push({
                id: 4,
                name: "Group",
                link: "KB/Group",
                icon: "group"
              });
            }

            //User
            if (optionName == "User") {
              this.items.push({
                id: 5,
                name: "User",
                link: "KB/User",
                icon: "person"
              });
            }


            //KBNotification
            if (optionName == "Article Request Notification") {
              this.items.push({
                id: 6,
                name: "Request Notification",
                link: "KB/ArticleRequestNotification",
                icon: "person"
              });
            }

          }
        });
      //2
    }
  }
};
</script>
