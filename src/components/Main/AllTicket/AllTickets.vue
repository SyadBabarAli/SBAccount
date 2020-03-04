<template>
  <div id="allTicket">
    <v-layout row wrap class="pa-2">
      <v-flex lg12 class="mt-12">
        <v-card class="black--text elevation-5">
          <v-layout>
            <v-flex lg12 class="pt-0">
              <v-card-title
                class="headline grey lighten-3 pa-1 ma-0"
                primary-title
                id="AllTicket"
              >All Tickets</v-card-title>

              <v-layout row wrap>
                <v-flex lg12 class="pa-1">
                  <date-picker @getResults="fetchResolvedTicketWithFeedback" />
                </v-flex>
              </v-layout>

              <v-layout row wrap>
                <v-flex lg4 class="text-xs-left">
                  <download-excel
                    type="xls"
                    :fields="json_fields"
                    :data="excelExport(filteredFeedbacks, filterInput)"
                  >
                    <v-btn
                      small
                      :loading="loading3"
                      :disabled="loading3"
                      color="colorLight"
                      class="colorDark white--text font-weight-light"
                      @click="loader = 'loading3'"
                    >
                      Export Excel
                      <v-icon right dark>cloud_download</v-icon>
                    </v-btn>
                  </download-excel>
                </v-flex>
                <v-flex lg4 class="text-xs-center">
                  <v-btn
                    small
                    round
                    id="btn1"
                    :depressed="btn1StatusDepressed"
                    v-bind:class="[btn1StatusDepressed ? '':'colorLight white--text' ]"
                    v-on:click="toggleButton"
                    :to="{ path: '/allTickets', query: { display: 'all' }}"
                  >All</v-btn>
                  <v-btn
                    small
                    round
                    id="btn2"
                    :depressed="btn2StatusDepressed"
                    v-bind:class="[btn2StatusDepressed ? '':'colorLight white--text' ]"
                    v-on:click="toggleButton"
                    :to="{ path: '/allTickets', query: { display: 'active' }}"
                  >Active</v-btn>
                  <v-btn
                    small
                    round
                    id="btn3"
                    :depressed="btn3StatusDepressed"
                    v-bind:class="[btn3StatusDepressed ? '':'colorLight white--text' ]"
                    v-on:click="toggleButton"
                    :to="{ path: '/allTickets', query: { display: 'resolved' }}"
                  >Resolved</v-btn>
                </v-flex>

                <v-flex lg4 class="text-xs-right pr-1">
                  <v-text-field
                    solo
                    label="Search"
                    prepend-icon="search"
                    v-model="filterInput"
                    id="slcSearchField"
                  ></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row wrap>
                <v-flex lg12>
                  <v-data-table
                    must-sort
                    :headers="headers"
                    :items="filterBy(filteredFeedbacks, filterInput)"
                    class="elevation-3"
                    :loading="isLoading"
                    :pagination.sync="pagination"
                    fix-header
                  >
                    <template slot="items" slot-scope="props">
                      <!-- <tr :class="{ 'animate-danger': isDanger(props.item) }"> -->
                      <td
                        class="text-xs-left"
                        v-bind:class="[isCreatedDate ? '' : 'csmHide']"
                      >{{ props.item.CreatedDate | momentDateDash }}</td>
                      <td
                        class="text-xs-left"
                        v-bind:class="[isStatus ? '' : 'csmHide']"
                      >{{ props.item.Status }}</td>
                      <td
                        class="text-xs-left"
                        v-bind:class="[isIR ? '' : 'csmHide']"
                      >{{ props.item.IR }}</td>
                      <td
                        class="text-xs-left"
                        v-bind:class="[isSupportGroup ? '' : 'csmHide']"
                      >{{ props.item.SupportGroup }}</td>
                      <!-- <td
                        class="text-xs-left"
                        v-bind:class="[isRating ? '' : 'csmHide']"
                      >{{ props.item.Rating }}</td>-->
                      <td
                        class="text-xs-left"
                        v-bind:class="[isAffectedUser ? '' : 'csmHide']"
                      >{{ props.item.User }}</td>
                      <td
                        class="text-xs-left"
                        v-bind:class="[isCreatedBy ? '' : 'csmHide']"
                      >{{ props.item.CreatedBy }}</td>
                      <td
                        class="text-xs-left"
                        v-bind:class="[isResolvedBy ? '' : 'csmHide']"
                      >{{ props.item.ResolvedBy }}</td>
                      <td
                        class="text-xs-left"
                        v-bind:class="[isTitle ? '' : 'csmHide']"
                      >{{ props.item.Title }}</td>
                      <td
                        class="text-xs-left"
                        v-bind:class="[isResolvedDate ? '' : 'csmHide']"
                      >{{ props.item.ResolvedDate | momentDateDash}}</td>
                      <td
                        class="text-xs-left"
                        v-bind:class="[isResolution ? '' : 'csmHide']"
                      >{{ props.item.ResolutionDescription }}</td>
                      <td
                        class="text-xs-left"
                        v-bind:class="[isFtag ? '' : 'csmHide']"
                      >{{ props.item.Ftag }}</td>
                      <td
                        class="text-xs-left"
                        v-bind:class="[isSource ? '' : 'csmHide']"
                      >{{ props.item.Source }}</td>
                      <td
                        class="text-xs-left"
                        v-bind:class="[isLocation ? '' : 'csmHide']"
                      >{{ props.item.Location }}</td>
                      <td
                        class="text-xs-left"
                        v-bind:class="[isAlternetContactMethod ? '' : 'csmHide']"
                      >{{ props.item.AlternetContactMethod }}</td>
                      <td
                        class="text-xs-left"
                        v-bind:class="[isAssignedTo ? '' : 'csmHide']"
                      >{{ props.item.AssignedTo }}</td>
                      <td
                        class="text-xs-left"
                        v-bind:class="[isFirstResponseDate ? '' : 'csmHide']"
                      >{{ props.item.FirstResponseDate | momentDateDash }}</td>
                      <td
                        class="text-xs-left"
                        v-bind:class="[isClassificationCategory ? '' : 'csmHide']"
                      >{{ props.item.ClassificationCategory }}</td>

                      <td class="text-xs-left">{{ props.item.Followup }}</td>

                      <!-- </tr> -->
                    </template>
                  </v-data-table>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
          <!-- <v-divider light></v-divider>
          <v-card-actions class="pa-0 ma-0 ml-1"></v-card-actions>-->
        </v-card>
      </v-flex>
      <!-- <v-btn
        fab
        bottom
        left
        class="white--text colorLight"
        @click="$vuetify.goTo('#AllTicket','{duration: 300,: this.offset,-100}')"
      >
        <v-icon dark>keyboard_arrow_up</v-icon>
      </v-btn>-->
    </v-layout>
  </div>
</template>

<script>
import DatePicker from "../../../components/control/DatePicker";
import ProgressLinear from "../../../components/control/ProgressLinear";
import FeedbackService from "../../../services/feedback-service";
import _ from "lodash";
import moment from "moment";

export default {
  name: "pageOne",
  data() {
    return {
      btn1StatusDepressed: false,
      btn2StatusDepressed: true,
      btn3StatusDepressed: true,
      pagination: {
        descending: true,
        sortBy: "CreatedDate",
        rowsPerPage: 50
      },
      headers: [
        { text: "Created Date", value: "CreatedDate", class: "" },
        { text: "Status", value: "Status", class: "" },
        { text: "IR", value: "IR", class: "" },
        { text: "Support Group", value: "SupportGroup", class: "" },
        // { text: "User Rating", value: "Rating", class: "" },
        { text: "Affected User", value: "User", class: "" },
        { text: "Created By", value: "CreatedBy", class: "" },
        { text: "Resolved By", value: "ResolvedBy", class: "" },
        { text: "Title", value: "Title", class: "" },
        { text: "Resolved Date", value: "ResolvedDate", class: "" },
        {
          text: "Resolution Description",
          value: "ResolutionDescription",
          class: ""
        },
        { text: "F-Tag", value: "Ftag", class: "" },
        { text: "Source", value: "Source", class: "" },
        { text: "Location", value: "Location", class: "" },
        {
          text: "Alternet Contact Method",
          value: "AlternetContactMethod",
          class: ""
        },
        { text: "Assigned To", value: "AssignedTo", class: "" },
        {
          text: "First Response Date",
          value: "FirstResponseDate",
          class: ""
        },
        {
          text: "Classification Category",
          value: "ClassificationCategory",
          class: ""
        },
        {
          text: "Followup",
          value: "Followup",
        }
      ],
      ///excelExportData: [],
      json_fields: {
        "Created Date": {
          field: "CreatedDate",
          callback: value => {
            var result =
              value != null && value != undefined
                ? value.replace("T", " ")
                : value;
            return result;
          }
        },
        Status: "Status",
        IR: "IR",
        "Support Group": "SupportGroup",
        //"User Rating": "Rating",
        "Affected User": "User",
        "Created By": "CreatedBy",
        "Resolved By": "ResolvedBy",
        Title: "Title",
        "Resolved Date": {
          field: "ResolvedDate",
          callback: value => {
            var result =
              value != null && value != undefined
                ? value.replace("T", " ")
                : value;
            return result;
          }
        },

        //"ResolvedDate",
        "Resolution Description": "ResolutionDescription",
        "F-Tag": "Ftag",
        Source: "Source",
        Location: "Location",
        "Alternet Contact Method": "AlternetContactMethod",
        "Assigned To": "AssignedTo",
        "First Response Date": {
          field: "FirstResponseDate",
          callback: value => {
            var result =
              value != null && value != undefined
                ? value.replace("T", " ")
                : value;
            return result;
          }
        },
        //"FirstResponseDate",
        "Classification Category": "ClassificationCategory",
        Followup: "Followup"
      },
      text: [0],
      toggle_multiple: [0],
      checkbox: false,
      startDate: "",
      endDate: "",
      listOfRecords: [],
      page: 1,
      perPage: 100,
      total: 100,
      showingOffset: 1,
      showingEntries: 100,
      orderBy: "CreatedDate",
      order: "desc",
      incidentId: "",
      isLoading: false,
      filterInput: "",
      entries: 100,
      checkedTitle: true,
      checkedResolutionDescription: true,
      checked: true,
      SearchField: "All",

      isCreatedDate: true,
      isStatus: true,
      isIR: true,
      isSupportGroup: true,
      isRating: true,
      isAffectedUser: true,
      isCreatedBy: true,
      isResolvedBy: true,
      isTitle: true,
      isResolvedDate: true,
      isResolutionDescription: true,
      isFtag: true,
      isSource: true,
      isLocation: true,
      isAlternetContactMethod: true,
      isAssignedTo: true,
      isFirstResponseDate: true,
      isClassificationCategory: true,

      isResolution: true,
      expanded: false,
      cmbSelectColumn: ["All"],
      cmbSelectItems: [
        "All",
        "Affected User",
        "Alternet Contact Method",
        "Assigned To",
        "Classification Category",
        "Created By",
        "Created Date",
        "First Response Date",
        "Ftag",
        "IR",
        "Location",
        "Rating",
        "Resolution Description",
        "Resolved By",
        "Resolved Date",
        "Status",
        "Source",
        "Support Group",
        "Title"
      ],
      cmbSearchColumn: ["All"],
      cmbSearchColumnItems: [
        "All",
        "Affected User",
        "Alternet Contact Method",
        "Assigned To",
        "Classification Category",
        "Created By",
        "Created Date",
        "First Response Date",
        "Ftag",
        "IR",
        "Location",
        "Rating",
        "Resolution Description",
        "Resolved By",
        "Resolved Date",
        "Status",
        "Source",
        "Support Group",
        "Title"
      ],

      loader: null,
      loading: false,
      loading2: false,
      loading3: false,
      loading4: false,

      date: new Date().toISOString().substr(0, 10)
    };
  },
  watch: {
    loader() {
      const l = this.loader;
      this[l] = !this[l];
      setTimeout(() => (this[l] = false), 3000);
      this.loader = null;
    },

    "$store.getters.sync": {
      immediate: true,
      handler() {
        if (this.$store.getters.sync) {
          this.timer = setInterval(
            this.fetchResolvedTicketWithFeedback,
            this.$store.getters.syncTime
          );
        } else {
          this.cancelAutoUpdate();
        }
      }
    },
    checkbox: function(obj) {
      if (obj) {
        this.headers[0].class = "csmHide";
        this.isCreatedDate = false;
      } else {
        this.headers[0].class = "";
        this.isCreatedDate = true;
      }
    },
    cmbSelectColumn: function(obj) {
      var arrayColumn = obj;
      var arrayColumnHeader = this.headers;

      for (var i = 0; i < arrayColumnHeader.length; i++) {
        if (arrayColumnHeader[i].value == arrayColumn[j].replace(" ", "")) {
          debugger;
          this.headers[i].class = "";
          this.isCreatedBy = true;
          break;
        }
      }
    }
  },
  created() {
    this.$store.commit("setCurrentScreenName", "AllTickets");
    this.startDate = this.$store.getters.startDate;
    this.endDate = this.$store.getters.endDate;
    this.listOfRecords = this.$store.getters.listOfRecords;

    //debugger;
    setTimeout(() => {
      this.setBars();
    }, 100);
  },
  updated() {
    this.setBars();
  },
  computed: {
    filteredFeedbacks() {
      var obj = this.listOfRecords;
      if (obj != undefined) {
        let query = this.$route.query.display;
        if (query === "active") {
          obj = this.listOfRecords.filter(
            ticket =>
              _.includes(this.$store.getters.filterTree, ticket.SupportGroup) &&
              _.includes(
                this.$store.getters.filterLocation,
                ticket.Property_Location
              ) &&
              (ticket.Status == "Active" ||
                ticket.Status == "User Pending" ||
                ticket.Status == "Vendor Pending")
          );
        } else if (query === "resolved") {
          obj = this.listOfRecords.filter(
            ticket =>
              _.includes(this.$store.getters.filterTree, ticket.SupportGroup) &&
              _.includes(
                this.$store.getters.filterLocation,
                ticket.Property_Location
              ) &&
              ticket.Status == "Resolved"
          );
        } else {
          obj = this.listOfRecords.filter(
            ticket =>
              _.includes(this.$store.getters.filterTree, ticket.SupportGroup) &&
              _.includes(
                this.$store.getters.filterLocation,
                ticket.Property_Location
              )
          );
        }
      }
      return obj;
    }
  },
  mounted: function() {},
  methods: {
    isDanger(feedback) {
      return feedback.Rating < 3;
    },
    checkAll() {
      if (!this.isAll) {
        this.isStatus = true;
        this.isIR = true;
        this.isRating = true;
        this.isResolvedBy = true;
        this.isTitle = true;
        this.isResolutionDescription = true;
        this.isFtag = true;
        this.isSource = true;
        this.isCreatedDate = true;
        this.isResolvedDate = true;
        this.isUser = true;
        this.isSupportGroup = true;
        this.isLocation = true;
        this.isAlternetContactMethod = true;
        this.isAssignedTo = true;
        this.isCreatedBy = true;
        this.isFirstResponseDate = true;
        this.isClassificationCategory = true;
      } else {
        this.isStatus = false;
        this.isIR = false;
        this.isRating = false;
        this.isResolvedBy = false;
        this.isTitle = false;
        this.isResolutionDescription = false;
        this.isFtag = false;
        this.isSource = false;
        this.isCreatedDate = false;
        this.isResolvedDate = false;
        this.isUser = false;
        this.isSupportGroup = false;
        this.isLocation = false;
        this.isAlternetContactMethod = false;
        this.isAssignedTo = false;
        this.isCreatedBy = false;
        this.isFirstResponseDate = false;
        this.isClassificationCategory = false;
      }
      //alert(this.isAll);
    },
    showCheckboxes() {
      var checkboxes = document.getElementById("checkboxes");
      if (!this.expanded) {
        checkboxes.style.display = "block";
        this.expanded = true;
      } else {
        checkboxes.style.display = "none";
        this.expanded = false;
      }
    },
    fetchResolvedTicketWithFeedback() {
      //Validate Date From And To
      var strCurrentDate = new Date(
        `${this.$store.getters.startDate}T00:00:00`
      );
      var strNewEndDate = new Date(`${this.$store.getters.endDate}T23:59:59`);
      var difference = strNewEndDate - strCurrentDate;
      if (difference < 0) {
        alert("Please select date end should be greater than start date");
      } else {
        this.listOfRecords = [];
        //End Validate Date From And To
        this.isLoading = true;
        FeedbackService.getResolvedTicketWithFeedback({
          start_date: `${this.$store.getters.startDate}T00:00:00`,
          end_date: `${this.$store.getters.endDate}T23:59:59`
        })
          .then(res => {
            this.listOfRecords = res.data;
            this.isLoading = false;
            //debugger;
          })
          .catch(error => {
            // this.isLoading = false
            document.getElementById("loading").style.display = "none";
            document.getElementById("noRecord").style.display = "block";
            console.log(error);
          });
      }
    },

    filterBy(list, val) {
      if (val) {
        val = val.trim().toLowerCase();
        let searchData = list.filter(feedback => {
          var Rating = feedback.Rating == undefined ? "" : feedback.Rating;
          var CreatedDate =
            feedback.CreatedDate == undefined ? "" : feedback.CreatedDate;
          var ResolvedDate =
            feedback.ResolvedDate == undefined ? "" : feedback.ResolvedDate;
          var IR = feedback.IR == undefined ? "" : feedback.IR;
          var User = feedback.User == undefined ? "" : feedback.User;
          var Title = feedback.Title == undefined ? "" : feedback.Title;
          var ResolutionDescription =
            feedback.ResolutionDescription == undefined
              ? ""
              : feedback.ResolutionDescription;
          var SupportGroup =
            feedback.SupportGroup == undefined ? "" : feedback.SupportGroup;
          var ResolvedBy =
            feedback.ResolvedBy == undefined ? "" : feedback.ResolvedBy;
          var Location =
            feedback.Location == undefined ? "" : feedback.Location;
          var AlternetContactMethod =
            feedback.AlternetContactMethod == undefined
              ? ""
              : feedback.AlternetContactMethod;
          var Ftag = feedback.Ftag == undefined ? "" : feedback.Ftag;
          var AssignedTo =
            feedback.AssignedTo == undefined ? "" : feedback.AssignedTo;
          var CreatedBy =
            feedback.CreatedBy == undefined ? "" : feedback.CreatedBy;
          var FirstResponseDate =
            feedback.FirstResponseDate == undefined
              ? ""
              : feedback.FirstResponseDate;
          var ClassificationCategory =
            feedback.ClassificationCategory == undefined
              ? ""
              : feedback.ClassificationCategory;
          var Status = feedback.Status == undefined ? "" : feedback.Status;
          var Source = feedback.Source == undefined ? "" : feedback.Source;

          var searchField = this.filterInput;

          if (searchField == "Rating") {
            return (
              Rating.toString()
                .toLowerCase()
                .indexOf(val) > -1
            );
          } else if (searchField == "CreatedDate") {
            return CreatedDate.toLowerCase().indexOf(val) > -1;
          } else if (searchField == "ResolvedDate") {
            return ResolvedDate.toLowerCase().indexOf(val) > -1;
          } else if (searchField == "IR") {
            return (
              IR.toString()
                .toLowerCase()
                .indexOf(val) > -1
            );
          } else if (searchField == "User") {
            return User.toLowerCase().indexOf(val) > -1;
          } else if (searchField == "Title") {
            return Title.toLowerCase().indexOf(val) > -1;
          } else if (searchField == "ResolutionDescription") {
            return (
              ResolutionDescription.toString()
                .toLowerCase()
                .indexOf(val) > -1
            );
          } else if (searchField == "SupportGroup") {
            return (
              SupportGroup.toString()
                .toLowerCase()
                .indexOf(val) > -1
            );
          } else if (searchField == "ResolvedBy") {
            return ResolvedBy.toLowerCase().indexOf(val) > -1;
          } else if (searchField == "Location") {
            return Location.toLowerCase().indexOf(val) > -1;
          } else if (searchField == "AlternetContactMethod") {
            return AlternetContactMethod.toLowerCase().indexOf(val) > -1;
          } else if (searchField == "Ftag") {
            return Ftag.toLowerCase().indexOf(val) > -1;
          } else if (searchField == "AssignedTo") {
            return AssignedTo.toLowerCase().indexOf(val) > -1;
          } else if (searchField == "CreatedBy") {
            return CreatedBy.toLowerCase().indexOf(val) > -1;
          } else if (searchField == "FirstResponseDate") {
            return FirstResponseDate.toLowerCase().indexOf(val) > -1;
          } else if (searchField == "ClassificationCategory") {
            return ClassificationCategory.toLowerCase().indexOf(val) > -1;
          } else if (searchField == "Status") {
            return Status.toLowerCase().indexOf(val) > -1;
          } else if (searchField == "Source") {
            return Source.toLowerCase().indexOf(val) > -1;
          } else {
            return (
              Rating.toString()
                .toLowerCase()
                .indexOf(val) > -1 ||
              CreatedDate.toLowerCase().indexOf(val) > -1 ||
              ResolvedDate.toLowerCase().indexOf(val) > -1 ||
              IR.toLowerCase().indexOf(val) > -1 ||
              User.toLowerCase().indexOf(val) > -1 ||
              Title.toLowerCase().indexOf(val) > -1 ||
              ResolutionDescription.toString()
                .toLowerCase()
                .indexOf(val) > -1 ||
              SupportGroup.toString()
                .toLowerCase()
                .indexOf(val) > -1 ||
              ResolvedBy.toLowerCase().indexOf(val) > -1 ||
              Location.toLowerCase().indexOf(val) > -1 ||
              AlternetContactMethod.toLowerCase().indexOf(val) > -1 ||
              Ftag.toLowerCase().indexOf(val) > -1 ||
              AssignedTo.toLowerCase().indexOf(val) > -1 ||
              CreatedBy.toLowerCase().indexOf(val) > -1 ||
              FirstResponseDate.toLowerCase().indexOf(val) > -1 ||
              ClassificationCategory.toLowerCase().indexOf(val) > -1 ||
              Status.toLowerCase().indexOf(val) > -1 ||
              Source.toLowerCase().indexOf(val) > -1
            );
          }
        });

        //debugger
        return searchData;
      }
      return list;
    },
    excelExport(data, input) {
      var result = [];
      result = this.filterBy(data, input);
      //this.excelExportData = result;
      //debugger
      return result;
    },
    pageChange(i) {
      this.page = i;
    },
    sortBy(val) {
      this.orderBy = val;

      if (this.order == "desc") {
        this.order = "asc";
      } else {
        this.order = "desc";
      }
    },
    isDanger(feedback) {
      return feedback.Rating < 3;
    },
    setBars() {
      let bars = document.querySelectorAll(
          ".IndividualDetails .rating-box.individual .bar"
        ),
        max = 0;
      for (let i of bars) {
        max = Math.max(max, i.dataset.individual);
      }
      for (let i of bars) {
        i.style.width = (i.dataset.individual * 100) / max + "%";
      }
    },
    isActive(val) {
      let query = this.$route.query.display;
      return query == val;
    },
    itPending() {
      return this.filteredFeedbacks.filter(
        ticket => ticket.Status === "Active"
      );
    },
    vendorPending() {
      return this.filteredFeedbacks.filter(
        ticket => ticket.Status === "Vendor Pending"
      );
    },
    userPending() {
      return this.filteredFeedbacks.filter(
        ticket => ticket.Status === "User Pending"
      );
    },
    cancelAutoUpdate() {
      clearInterval(this.timer);
    },
    toggleButton: function(event) {
      var id = event.currentTarget.id;
      if (id == "btn1") {
        this.btn1StatusDepressed = false;
        this.btn2StatusDepressed = true;
        this.btn3StatusDepressed = true;
      } else if (id == "btn2") {
        this.btn1StatusDepressed = true;
        this.btn2StatusDepressed = false;
        this.btn3StatusDepressed = true;
      } else if (id == "btn3") {
        this.btn1StatusDepressed = true;
        this.btn2StatusDepressed = true;
        this.btn3StatusDepressed = false;
      }
    }
  },
  beforeMount() {
    this.fetchResolvedTicketWithFeedback();
  },
  beforeDestroy() {
    this.cancelAutoUpdate();
  },
  components: {
    DatePicker,
    ProgressLinear
  }
};
</script>
<style scoped>
.bgColorH4 {
  background-color: #eee;
}

/* Table Self Style*/
table.v-table tbody td:first-child,
table.v-table tbody td:not(:first-child),
table.v-table tbody th:first-child,
table.v-table tbody th:not(:first-child),
table.v-table thead td:first-child,
table.v-table thead td:not(:first-child),
table.v-table thead th:first-child,
table.v-table thead th:not(:first-child) {
  padding: 10 10px;
  width: inherit;
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 32px;
}
table.v-table tbody td,
table.v-table tbody th {
  height: 30px;
}
</style>