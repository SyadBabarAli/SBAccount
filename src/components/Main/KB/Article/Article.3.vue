<template>
  <layout-one :title="'Define Article'">
    <!-- <v-btn @click="gatCurrentTab">BTN</v-btn> -->
    <!-- {{this.links()}}-->
    <!-- {{this.tabActiveIndex}} -->
    <!-- {{ this.getCurrentTabName()}} -->
    <!-- {{this.tabItems}} -->
    <!-- {{this.filterd}} -->
    <v-tabs color="colorDark" align-with-title @change="changeTab" v-model="tabActiveIndex">
      <v-tabs-slider color="yellow"></v-tabs-slider>
      <v-tab v-for="item in tabItemsFilterd" class="white--text" :key="item.id">
        <v-btn flat>
          <h4 class="font-weight-light white--text">{{item.name}}</h4>&nbsp;
          <v-badge color="red">
            <span slot="badge">{{item.requestCnt}}</span>
          </v-badge>
        </v-btn>
      </v-tab>
    </v-tabs>
    <v-tabs-items class="pt-0">
      <v-card-title>
        <v-toolbar-title>Details</v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Search"
          single-line
          hide-details
          color="colorLight"
        ></v-text-field>
        <v-btn
          color="colorLight"
          dark
          class="mb-2"
          v-if="tabs.Draft   "
          v-on:click="addNewArticle()"
        >Add</v-btn>
      </v-card-title>
      <v-data-table
        must-sort
        :headers="headers"
        :items="filterd"
        class="elevation-3"
        :search="search"
        :pagination.sync="paginationMainTable"
      >
        <template slot="no-data" v-if="isLoading">
          <v-progress-linear slot="progress" indeterminate></v-progress-linear>
        </template>

        <template slot="items" slot-scope="props">
          <td>{{ 'KA'+props.item.ArticleId }}</td>
          <td class="text-xs-left">{{ props.item.Name }}</td>
          <td class="text-xs-left">{{ (props.item.Active == 1 ? 'Yes' : 'No') }}</td>
          <td class="text-xs-left">{{ props.item.CreatedBy }}</td>
          <td class="text-xs-left">{{ props.item.ArticleCreator }}</td>
          <td class="justify-center layout px-0">
            <v-btn
              color="colorLight"
              fab
              small
              dark
              style="height:22px;width:22px;font-size:13px;"
              @click="editItem(props.item)"
            >
              <v-icon style="font-size:13px">edit</v-icon>
            </v-btn>
            <v-btn
              color="red"
              fab
              small
              dark
              style="height:22px;width:22px;font-size:13px;"
              v-if="(tabs.Draft || (tabs.Published && rights.Delete)  ) "
            >
              <v-icon style="font-size:13px" @click="deleteItem(props.item)">delete</v-icon>
            </v-btn>
          </td>
        </template>
        <v-alert
          slot="no-results"
          :value="true"
          color="error"
          icon="warning"
        >Your search for "{{ search }}" found no results.</v-alert>
      </v-data-table>
    </v-tabs-items>
  </layout-one>
</template>

<script>
import axios from "axios";
import ProgressLinear from "../../../../components/control/ProgressLinear";
import { mixins } from "../../../../mixins/CustomMixins";
import LayoutOne from "../../../../components/control/layout/LayoutOne";

export default {
  mixins: [mixins],
  components: {
    LayoutOne,
    ProgressLinear
  },
  data: () => ({
    tabActiveIndex: 0,
    isLoading: false,
    tabeName: "Draft",
    selectedRequestTypeId: 21,
    tabItems: [],
    tabs: {
      Draft: false,
      Review: false,
      Approval: false,
      Published: false
    },
    rights: {
      View: true,
      Modify: true,
      Delete: false,

      Draft: false,
      Review: false,
      Approval: false,
      Published: false
    },

    search: "",
    headers: [
      {
        text: " Article Id",
        value: "ArticleId",
        align: "left"
      },
      { text: "Name", value: "Name" },
      { text: "Active", value: "Active" },
      { text: "Created By", value: "CreatedBy" },
      { text: "Modified By", value: "ArticleCreator" },
      { text: "Actions", value: "", sortable: false, align: "Center" }
    ],
    listOfRecords: [],
    searchComments: "",
    headerComments: [
      { text: "Comments", value: "Comment" },
      { text: "Created By", value: "CreatedBy" },
      { text: "Created", value: "Created" }
    ],
    paginationMainTable: {
      descending: true,
      sortBy: "ArticleId",
      rowsPerPage: 10
    }
  }),
  computed: {
    // getCurrentTabName() {
    //   var v1 = this.tabItems;
    //   var result = "";
    //   result = this.tabItems[this.tabActiveIndex];
    //   return result.name;
    // },
    filterd() {
      var result = [];
      var tabName = this.tabItems[this.tabActiveIndex];
      if (tabName != undefined) {
        if (tabName.name == "Draft") {
          result = this.listOfRecords.filter(
            w =>
              w.RequestTypeId == this.selectedRequestTypeId &&
              w.RoleUserId == this.$store.getters.roleUserId
          );
        } else if (tabName.name == "Review") {
          result = this.listOfRecords.filter(w => w.RequestTypeId == 8);
        } else if (tabName.name == "Approval") {
          result = this.listOfRecords.filter(w => w.RequestTypeId == 3);
        } else if (tabName.name == "Published") {
          result = this.listOfRecords.filter(w => w.RequestTypeId == 9);
        }
      }
      return result;
    },
    tabItemsFilterd() {
      var vTabs = [];
      if (this.rights.Draft) {
        vTabs.push(1);
      }
      if (this.rights.Review) {
        vTabs.push(2);
      }
      if (this.rights.Approval) {
        vTabs.push(3);
      }
      if (this.rights.Published) {
        vTabs.push(4);
      }
      var obj = this.tabItems.filter(w => _.includes(vTabs, w.id));
      return obj;
    }
  },
  watch: {
    tabItems(obj) {
      var vObj = obj;
      if (vObj.length > 0) {
        this.gatCurrentTab();
      }
    }
  },
  //created() {
  mounted() {
    this.initialize();
  },
  methods: {
    addNewArticle() {
      this.$router.push({
        path: "/KB/ArticleEdit",
        query: { id: 0, tabIndex: this.tabActiveIndex }
      });
    },
    getRequestCnt(rquestTypeId) {
      // var vCnt = this.listOfRecords.filter(
      //   w => w.RequestTypeId === rquestTypeId
      //   //&& w.RoleUserId == this.$store.getters.roleUserId
      // ).length;
      // return vCnt;

      var result = [];
      if (rquestTypeId == 21) {
        result = this.listOfRecords.filter(
          w =>
            w.RequestTypeId == rquestTypeId &&
            w.RoleUserId == this.$store.getters.roleUserId
        );
      } else {
        result = this.listOfRecords.filter(
          w => w.RequestTypeId == rquestTypeId
        );
      }
      return result.length;
    },

    gatCurrentTab() {
      var index =
        window.location.href.split("=").length == 0
          ? 0
          : window.location.href.split("=")[1];

      index = index == undefined ? 0 : index;
      this.changeTab(index);
      this.tabActiveIndex = parseInt(index);
    },
    initialize() {
      this.gatCurrentTab();
      this.tableLoad();

      this.tabItems = [];
      this.getUserRights([2012, 2013, 2014, 2015, 2016, 2017, 2019, 2018]).then(
        result => {
          result.forEach(element => {
            if (element.name == "View") {
              this.rights.View = true;
              this.rights.Draft = true;
            }
            if (element.name == "Modify") {
              this.rights.Modify = true;
            }
            if (element.name == "Delete") {
              this.rights.Delete = true;
            }
            if (element.name == "Draft") {
              this.rights.Draft = true;
              this.tabItems.push({
                id: 1,
                name: "Draft",
                link: "KBGlobalSearch",
                icon: "drafts",
                requestCnt: this.getRequestCnt(21)
              });
            }
            if (element.name == "Reviewer") {
              this.rights.Review = true;
              this.tabItems.push({
                id: 2,
                name: "Review",
                link: "Article",
                icon: "image_search",
                requestCnt: this.getRequestCnt(8)
              });
            }
            if (element.name == "Approver") {
              this.rights.Approval = true;
              this.tabItems.push({
                id: 3,
                name: "Approval",
                link: "KBTree",
                icon: "Approver",
                requestCnt: this.getRequestCnt(3)
              });
            }
            if (element.name == "Published") {
              this.rights.Published = true;
              this.tabItems.push({
                id: 4,
                name: "Published",
                link: "KBTree",
                icon: "publish",
                requestCnt: this.getRequestCnt(9)
              });
            }
          });
        }
      );
    },

    changeTab(index) {
      var pIndex = index;

      if (this.tabItemsFilterd.length > 0) {
        var vTabName = this.tabItemsFilterd[pIndex];
        if (vTabName.name == "Draft") {
          this.selectedRequestTypeId = 21;
          this.tabs.Draft = true;
          this.tabs.Review = false;
          this.tabs.Approval = false;
          this.tabs.Published = false;
        } else if (vTabName.name == "Review") {
          this.selectedRequestTypeId = 8;
          this.tabs.Draft = false;
          this.tabs.Review = true;
          this.tabs.Approval = false;
          this.tabs.Published = false;
        } else if (vTabName.name == "Approval") {
          this.selectedRequestTypeId = 3;
          this.tabs.Draft = false;
          this.tabs.Review = false;
          this.tabs.Approval = true;
          this.tabs.Published = false;
        } else if (vTabName.name == "Published") {
          this.selectedRequestTypeId = 9;
          this.tabs.Draft = false;
          this.tabs.Review = false;
          this.tabs.Approval = false;
          this.tabs.Published = true;
        }
      }
    },

    tableLoad() {
      this.isLoading = true;
      axios({
        method: "get",
        url: this.$urlApplication + "KBArticle/GetKBArticles"
      })
        .then(res => {
          this.listOfRecords = res.data;
          this.isLoading = false;
        })
        .catch(error => {});
    },
    editItem(item) {
      var obj = item;
      var kbTreeViewIdFK = obj.KBTreeViewIdFK;
      var articleId = obj.ArticleId;
      this.$router.push({
        path: "/KB/ArticleEdit",
        query: { id: articleId, tabIndex: this.tabActiveIndex }
      });
    },
    deleteItem(item) {
      const index = this.listOfRecords.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.deleteArticle(item.ArticleId);
    },
    deleteArticle(id) {
      var pId = id;
      axios({
        method: "delete",
        url: this.$urlApplication + "KBArticle/DeleteKBArticle?id=" + pId
      })
        .then(res => {
          this.tableLoad();
        })
        .catch(error => {});
    }
  }
};
</script>