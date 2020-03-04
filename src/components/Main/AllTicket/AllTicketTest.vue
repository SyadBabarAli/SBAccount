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
              >All Ticket Test</v-card-title>
              <v-layout>
                <v-flex lg3>
                  <v-combobox
                    v-model="selectCreatedBy"
                    :items="itemsCreatedBy"
                    label="Created by"
                    item-text="text"
                    item-value="value"
                  ></v-combobox>
                </v-flex>
                <v-flex lg3>
                  <v-combobox
                    v-model="selectResolvedBy"
                    :items="itemsResolvedBy"
                    label="Resolved by"
                    item-text="text"
                    item-value="value"
                  ></v-combobox>
                </v-flex>
                <v-flex lg3>
                  <v-combobox
                    v-model="selectAffectedBy"
                    :items="itemsAffectedBy"
                    label="Affected To"
                    item-text="text"
                    item-value="value"
                  ></v-combobox>
                </v-flex>
                <v-flex lg3>
                  <v-text-field v-model="AssignedTo" label="Assigned To"></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout>
                <v-flex lg3>
                  <v-text-field v-model="FTag" label="FTAG"></v-text-field>
                </v-flex>
                <v-flex lg3>
                  <v-combobox
                    v-model="selectSource"
                    :items="itemsSource"
                    label="Source"
                    item-text="text"
                    item-value="value"
                  ></v-combobox>
                </v-flex>
                <v-flex lg3>
                  <v-text-field v-model="Ir" label="IR"></v-text-field>
                </v-flex>
                <v-flex lg3>
                  <v-combobox
                    v-model="selectClassificationCategory"
                    :items="itemsClassificationCategory"
                    label="Classification Category"
                    item-text="text"
                    item-value="value"
                  ></v-combobox>
                </v-flex>
              </v-layout>

              <v-layout>
                <v-flex lg3>
                  <v-combobox
                    v-model="selectFollowup"
                    :items="itemsFollowup"
                    label="Followup"
                    item-text="text"
                    item-value="value"
                  ></v-combobox>
                </v-flex>
                <v-flex lg3>
                  <v-text-field v-model="Title" label="Title"></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row wrap>
                <v-flex lg3 >
                  <v-combobox
                    v-model="selectIsCreated"
                    :items="itemsIsCreated"
                    label="Finding By Date"
                    item-text="text"
                    item-value="value"
                  ></v-combobox>
                </v-flex>
                <!-- <v-flex lg9 class="pa-1">
                  <v-btn
                    small
                    :loading="loading3"
                    :disabled="loading3"
                    color="colorLight"
                    class="colorDark white--text font-weight-light"
                    @click="generateExcel"
                  >
                    Export Excel
                    <v-icon right dark>cloud_download</v-icon>
                  </v-btn>
                </v-flex>-->
              </v-layout>

              <v-layout>
                <v-flex lg3>
                  <v-btn
                    small
                    :loading="loading3"
                    :disabled="loading3"
                    color="colorLight"
                    class="colorDark white--text font-weight-light"
                    @click="generateExcel"
                  >
                    Export Excel
                    <v-icon right dark>cloud_download</v-icon>
                  </v-btn>
                </v-flex>
                <v-flex lg9>
                  <date-picker @getResults="fetchResolvedTicketWithFeedback" />
                </v-flex>
              </v-layout>
              <v-layout row wrap>
                <v-flex lg12>
                  <v-data-table
                    must-sort
                    :headers="headers"
                    :items="filterBy(filtered, filterInput)"
                    class="elevation-3"
                    :loading="isLoading"
                    :pagination.sync="pagination"
                    fix-header
                  >
                    <template slot="items" slot-scope="props">
                      <td class="text-xs-left">{{ props.item.CreatedDate | momentDateDash }}</td>
                      <td class="text-xs-left">{{ props.item.Status }}</td>
                      <td class="text-xs-left">{{ props.item.IR }}</td>
                      <td class="text-xs-left">{{ props.item.SupportGroup }}</td>
                      <td class="text-xs-center">{{ props.item.Rating }}</td>
                      <td class="text-xs-left">{{ props.item.AffectedUser }}</td>
                      <td class="text-xs-left">{{ props.item.CreatedBy }}</td>
                      <td class="text-xs-left">{{ props.item.ResolvedBy }}</td>
                      <td class="text-xs-left">{{ props.item.ResolvedDate | momentDateDash}}</td>
                      <td class="text-xs-left">{{ props.item.Ftag }}</td>
                      <td class="text-xs-left">{{ props.item.IncidentSourceId }}</td>
                      <td class="text-xs-left">{{ props.item.Location }}</td>
                      <td class="text-xs-left">{{ props.item.AlternetContactMethod }}</td>
                      <td class="text-xs-left">{{ props.item.AssignedTo }}</td>
                      <td class="text-xs-left">{{ props.item.FirstResponseDate | momentDateDash }}</td>
                      <td class="text-xs-left">{{ props.item.IncidentClassificationId }}</td>
                      <td class="text-xs-left">{{ props.item.Followup }}</td>
                      <td class="text-xs-left">{{ props.item.Title }}</td>
                      <td class="text-xs-left">{{ props.item.ResolutionDescription }}</td>
                    </template>
                  </v-data-table>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import DatePicker from "../../../components/control/DatePicker";
import ProgressLinear from "../../../components/control/ProgressLinear";
import FeedbackService from "../../../services/feedback-service";
import _ from "lodash";
import moment from "moment";
import axios from "axios";
export default {
  name: "pageOne",
  data() {
    return {
      selectIsCreated: {
        value: true,
        text: "Created"
      },
      itemsIsCreated: [
        {
          value: true,
          text: "Created"
        },
        {
          value: false,
          text: "Resolved"
        }
      ],

      selectCreatedBy: [],
      itemsCreatedBy: [],

      selectResolvedBy: [],
      itemsResolvedBy: [],

      selectAssignTo: [],
      itemsAssignTo: [],

      selectAffectedBy: [],
      itemsAffectedBy: [],

      selectSource: [],
      itemsSource: [],

      selectClassificationCategory: [],
      itemsClassificationCategory: [],

      selectFollowup: [],
      itemsFollowup: [],

      FTag: "",
      Ir: "",
      Title: "",
      AssignedTo: "",
      editedItem: {
        isCreated: "",
        start_date: "",
        end_date: "",
        userCreated: "",
        userResolved: "",
        userAffected: "",
        assignedTo: "",
        fTag: "",
        incidentSourceId: "",
        ir: "",
        incidentClassificationId: "",
        followup: "",
        title: "",
        supportGroup: [],
        property_Location: []
      },
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
        { text: "User Rating", value: "Rating", class: "" },
        { text: "Affected User", value: "User", class: "" },
        { text: "Created By", value: "CreatedBy", class: "" },
        { text: "Resolved By", value: "ResolvedBy", class: "" },

        { text: "Resolved Date", value: "ResolvedDate", class: "" },

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
          value: "Followup"
        },
        { text: "Title", value: "Title", class: "" },
        {
          text: "Resolution Description",
          value: "ResolutionDescription",
          class: ""
        }
      ],
      isLoading: false,
      filterInput: "",
      loader: null,
      loading: false,
      loading2: false,
      loading3: false,
      loading4: false,
      listOfRecords: [],
      date: new Date().toISOString().substr(0, 10),
      selectedSupportGroup: [],
      selectedLocation: []
    };
  },
  created() {
    this.$store.commit("setCurrentScreenName", "AllTicketTest");
    this.startDate = this.$store.getters.startDate;
    this.endDate = this.$store.getters.endDate;
    this.listOfRecords = this.$store.getters.listOfRecords;
    this.GetUser();
    this.GetSource();
    this.GetIncidentClassification();
    this.GetFollowup();
  },
  computed: {
    filtered: function() {
      //Location
      var cntLoc = 0;
      for (let item of this.$store.getters.filterLocation) {
        if (cntLoc == 0) {
          this.selectedLocation.push("'" + item + "'");
        } else {
          this.selectedLocation.push(",'" + item + "'");
        }
        cntLoc++;
      }

      //SupportGroup
      var cntSup = 0;
      for (let item of this.$store.getters.filterTree) {
        if (cntSup == 0) {
          this.selectedSupportGroup.push("'" + item + "'");
        } else {
          this.selectedSupportGroup.push(",'" + item + "'");
        }
        cntSup++;
      }

      var obj = this.listOfRecords;
      obj = this.listOfRecords.filter(
        w =>
          _.includes(this.$store.getters.filterTree, w.SupportGroup) &&
          _.includes(this.$store.getters.filterLocation, w.Property_Location)
      );
      return obj;
    }
  },
  methods: {
    generateExcel() {
      var dateFrom = new Date(`${this.$store.getters.startDate}T00:00:00`);
      var dateTo = new Date(`${this.$store.getters.endDate}T23:59:59`);
      var difference = dateTo - dateFrom;
      if (difference < 0) {
        alert("Please select date end should be greater than start date");
      } else {
        var isCreated = this.selectIsCreated.value;
        var start_date = `${this.$store.getters.startDate}T00:00:00`;
        var end_date = `${this.$store.getters.endDate}T23:59:59`;
        var CreatedBy =
          this.selectCreatedBy.length == 0 ? "A" : this.selectCreatedBy.text;
        var ResolvedBy =
          this.selectResolvedBy.length == 0 ? "A" : this.selectResolvedBy.text;
        var AffectedBy =
          this.selectAffectedBy.length == 0 ? "A" : this.selectAffectedBy.text;

        var Source = this.selectSource.length == 0 ? 1 : this.selectSource;
        var ClassificationCategory =
          this.selectClassificationCategory.length == 0
            ? 1
            : this.selectClassificationCategory.value;
        var Followup =
          this.selectFollowup.length == 0
            ? "00000000-0000-0000-0000-000000000000"
            : this.selectFollowup.value;

        var AssignedTo =
          this.AssignedTo.length == 0 ? "A" : this.AssignedTo.text;
        var Ftag = this.FTag == 0 ? "A" : this.FTag;
        var ir = this.Ir.length == 0 ? "A" : this.Ir;
        var title = this.Title.length == 0 ? "A" : this.Title;

        this.editedItem.isCreated = isCreated;
        this.editedItem.start_date = start_date;
        this.editedItem.end_date = end_date;
        this.editedItem.userCreated = CreatedBy;
        this.editedItem.userResolved = ResolvedBy;
        this.editedItem.userAffected = AffectedBy;
        this.editedItem.userAssignedTo = AssignedTo;

        this.editedItem.fTag = Ftag;
        this.editedItem.incidentSourceId = Source;
        this.editedItem.ir = ir;
        this.editedItem.incidentClassificationId = ClassificationCategory;
        this.editedItem.followup = Followup;
        this.editedItem.title = title;
        this.editedItem.property_Location = this.selectedLocation;
        this.editedItem.supportGroup = this.selectedSupportGroup;

        axios({
          method: "post",
          url: this.$urlApplication + "/AllTicket/GenerateExcel",
          data: this.editedItem,
          responseType: "blob" // important
        }).then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "AllTicket.xlsx");
          document.body.appendChild(link);
          link.click();
        });
      }
    },
    filterBy(list, val) {
      debugger;
      return list;
    },
    fetchResolvedTicketWithFeedback() {
      var dateFrom = new Date(`${this.$store.getters.startDate}T00:00:00`);
      var dateTo = new Date(`${this.$store.getters.endDate}T23:59:59`);
      var difference = dateTo - dateFrom;
      if (difference < 0) {
        alert("Please select date end should be greater than start date");
      } else {
        var isCreated = this.selectIsCreated.value;
        var start_date = `${this.$store.getters.startDate}T00:00:00`;
        var end_date = `${this.$store.getters.endDate}T23:59:59`;
        var CreatedBy =
          this.selectCreatedBy.length == 0 ? "A" : this.selectCreatedBy.text;
        var ResolvedBy =
          this.selectResolvedBy.length == 0 ? "A" : this.selectResolvedBy.text;
        var AffectedBy =
          this.selectAffectedBy.length == 0 ? "A" : this.selectAffectedBy.text;

        var Source = this.selectSource.length == 0 ? 1 : this.selectSource;
        var ClassificationCategory =
          this.selectClassificationCategory.length == 0
            ? 1
            : this.selectClassificationCategory.value;
        var Followup =
          this.selectFollowup.length == 0
            ? "00000000-0000-0000-0000-000000000000"
            : this.selectFollowup.value;

        var AssignedTo =
          this.AssignedTo.length == 0 ? "A" : this.AssignedTo.text;
        var Ftag = this.FTag == 0 ? "A" : this.FTag;
        var ir = this.Ir.length == 0 ? "A" : this.Ir;
        var title = this.Title.length == 0 ? "A" : this.Title;

        this.editedItem.isCreated = isCreated;
        this.editedItem.start_date = start_date;
        this.editedItem.end_date = end_date;
        this.editedItem.userCreated = CreatedBy;
        this.editedItem.userResolved = ResolvedBy;
        this.editedItem.userAffected = AffectedBy;
        this.editedItem.userAssignedTo = AssignedTo;

        this.editedItem.fTag = Ftag;
        this.editedItem.incidentSourceId = Source;
        this.editedItem.ir = ir;
        this.editedItem.incidentClassificationId = ClassificationCategory;
        this.editedItem.followup = Followup;
        this.editedItem.title = title;

        this.editedItem.property_Location = this.selectedLocation;
        this.editedItem.supportGroup = this.selectedSupportGroup;
        var v1 = this.selectedSupportGroup;
        this.listOfRecords = [];
        this.isLoading = true;

        const res = axios({
          method: "post",
          url: this.$urlApplication + "AllTicket/PostAllTicket",
          data: this.editedItem
        })
          .then(res => {
            this.listOfRecords = res.data;
            this.isLoading = false;
          })
          .catch(error => {
            this.isLoading = false;
          });
      }
    },
    GetUser() {
      axios({
        method: "get",
        url: this.$urlApplication + "/AllTicket/GetUser"
      })
        .then(res => {
          this.itemsCreatedBy = [];
          for (let items of res.data) {
            var result = {
              value: items.value,
              text: items.text
            };
            this.itemsCreatedBy.push(result);
            this.itemsResolvedBy.push(result);
            this.itemsAffectedBy.push(result);
            this.itemsAssignTo.push(result);
          }
        })
        .catch(error => {});
    },
    GetSource() {
      axios({
        method: "get",
        url: this.$urlApplication + "/AllTicket/GetSource"
      })
        .then(res => {
          this.itemsSource = [];
          for (let items of res.data) {
            var result = {
              value: items.value,
              text: items.text
            };
            this.itemsSource.push(result);
          }
        })
        .catch(error => {});
    },
    GetIncidentClassification() {
      axios({
        method: "get",
        url: this.$urlApplication + "/AllTicket/GetIncidentClassification"
      })
        .then(res => {
          this.itemsClassificationCategory = [];
          for (let items of res.data) {
            var result = {
              value: items.value,
              text: items.text
            };
            this.itemsClassificationCategory.push(result);
          }
        })
        .catch(error => {});
    },
    GetFollowup() {
      axios({
        method: "get",
        url: this.$urlApplication + "/AllTicket/GetFollowup"
      })
        .then(res => {
          this.itemsFollowup = [];
          for (let items of res.data) {
            var result = {
              value: items.value,
              text: items.text
            };
            this.itemsFollowup.push(result);
          }
        })
        .catch(error => {});
    },

    isDanger(feedback) {
      return feedback.Rating < 3;
    },

    filterBy(list, val) {
      return list;
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