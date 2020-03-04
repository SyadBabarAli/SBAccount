<template>
  <v-layout row wrap class="pa-2">
    <v-flex lg12 class="mt-12">
      <v-card class="black--text elevation-5">
        <v-layout>
          <v-flex lg12>
            <v-card-title class="headline grey lighten-3 pa-1 ma-0" primary-title>User Group</v-card-title>
            <v-card-title>
              <v-toolbar-title>Details</v-toolbar-title>
              <v-divider class="mx-2" inset vertical></v-divider>
              <v-spacer></v-spacer>
            </v-card-title>
            <Grid
              :style="{height: '450px'}"
              :data-items="result"
              :pageable="true"
              :skip="currentPage"
              :take="noOfRecord"
              :total="total"
              :columns="columns"
              @pagechange="pageChangeHandler"
            ></Grid>
            currentPage = {{this.currentPage}}
            noOfRecord = {{this.noOfRecord}}
            totalNoOfRecord = {{this.totalNoOfRecord}}
          </v-flex>
        </v-layout>
        <v-divider light></v-divider>
        <v-card-actions class="pa-0 ma-0 ml-1"></v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
//
import Vue from "vue";
import "@progress/kendo-theme-default/dist/all.css";
import { Grid } from "@progress/kendo-vue-grid";
Vue.component("Grid", Grid);
//
import Application from "../../../services/application-service";
import axios from "axios";
export default {
  data() {
    return {
      dataItems: [],
      currentPage: 0,
      noOfRecord: 10,
      totalNoOfRecord: 0,

      columns: [
        { field: "RoleUserGroupId", title: "ID" },
        { field: "UserGroupName", title: "User Group Name" }
      ]
    };
  },
  computed: {
    result: {
      get: function() {
        return this.dataItems;
      }
    },
    total() {
      return this.totalNoOfRecord;
    }
  },
  mounted() {
    const res = axios
      .get(
        this.$urlApplication +
          "RoleUserGroup/GetRoleUserGroupsNew?currentPage=" +
          this.currentPage +
          "&noOfRecord=" +
          this.noOfRecord
      )
      .then(res => {
        this.dataItems = res.data.data;
        this.totalNoOfRecord = res.data.totalNoOfRecord;
      })
      .catch(error => {});
  },
  methods: {
    pageChangeHandler: function(event) {
      this.currentPage = event.page.skip;
      this.noOfRecord = event.page.take;
      var currentPage = this.currentPage;

      if (this.noOfRecord == 0) {
        currentPage = 1;
      } else {
        currentPage = this.currentPage / this.noOfRecord;
      }

      const res = axios
        .get(
          this.$urlApplication +
            "RoleUserGroup/GetRoleUserGroupsNew?currentPage=" +
            currentPage +
            "&noOfRecord=" +
            this.noOfRecord
        )
        .then(res => {
          this.dataItems = res.data.data;
          this.totalNoOfRecord = res.data.totalNoOfRecord;
        })
        .catch(error => {});
    }
  }
};
</script>