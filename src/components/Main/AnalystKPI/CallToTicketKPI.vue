<template>
  <layout-one :title="'Call To Ticket'" :breadcrumbsItems="breadcrumbsItems">
    <v-layout class="pa-1">
      <v-flex lg2>
        <v-combobox
          class="pt-3 pl-1"
          v-model="selectTicketResolver"
          :items="itemsTicketResolver"
          label="Select an analyst"
          item-text="text"
          item-value="value"
        ></v-combobox>
      </v-flex>
      <v-flex lg8>
        <date-picker @getResults="fetchCallToTicket"/>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex lg12>
        <v-card>
          <v-layout>
            <v-flex lg12>
              <v-card>
                <v-card-title>
                  <v-toolbar-title>Summary</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-text-field
                    v-model="search"
                    append-icon="search"
                    label="Search"
                    single-line
                    hide-details
                    expand
                  ></v-text-field>
                </v-card-title>

                <v-data-table
                  :headers="headers"
                  :items="filteredRecord"
                  :search="search"
                  :pagination.sync="pagination"
                >
                  <!-- <template slot="no-data">
                    <v-progress-linear slot="progress" indeterminate></v-progress-linear>
                  </template> -->
                   <template slot="no-data" v-if="isLoadinglistOfRecord">
              <v-progress-linear slot="progress" indeterminate></v-progress-linear>
            </template>
                  <template slot="items" slot-scope="props">
                    <tr>
                      <td class="text-xs-left">{{ props.item.TicketCreatedDate | momentDate }}</td>
                      <td class="text-xs-left">{{ props.item.Analyst }}</td>
                      <td class="text-xs-left">{{ props.item.Ticket }}</td>
                      <td class="text-xs-left">{{ props.item.UnrecordedIR }}</td>
                      <td class="text-xs-left">{{ props.item.CallServed }}</td>
                      <td class="text-xs-left">{{ props.item.CallToTicketPercentage }}</td>
                    </tr>
                  </template>

                  <v-alert
                    slot="no-results"
                    :value="true"
                    color="error"
                    icon="warning"
                  >Your search for "{{ search }}" found no results.</v-alert>
                </v-data-table>
              </v-card>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
    <!-- <v-dialog v-model="viewDialog" width="500" scrollable>
      <call-to-ticket-detail :id="employeeId" @Click="closeViewDialog"/>
    </v-dialog>-->
  </layout-one>
</template>
<script>
import LayoutOne from "../../../components/control/layout/LayoutOne";
//import CallToTicketDetail from "../../../components/Main/AnalystKPI/CallToTicketDetail";
import DatePicker from "../../../components/control/DatePicker";
import ProgressLinear from "../../../components/control/ProgressLinear";
import store from "../../../store";
import ButtonGrid from "../../../components/control/ButtonGrid";
import ProgressCircular from "../../../components/control/ProgressCircular";
import ButtonSmall from "../../../components/control/ButtonSmall";
import axios from "axios";

export default {
  components: {
    LayoutOne,
    //CallToTicketDetail,
    DatePicker,
    ProgressLinear,
    ButtonGrid,
    ButtonSmall,
    ProgressCircular
  },
  data() {
    return {
       breadcrumbsItems: [
        {
          text: "Dashboard",
          disabled: false,
          href: "#/Home"
        },
        {
          text: "Analyst KPI",
          disabled: false,
          href: "#/AnalystKPI"
        },
        {
          text: "Call To Ticket",
          disabled: true,
        }
      ],
      isLoadinglistOfRecord: true,
      listOfRecord: [],
      selectTicketResolver: [],
      itemsTicketResolver: [],
      viewDialog: false,

      employeeId: "",
      search: "",
      pagination: {
        rowsPerPage: -1,
        descending: false,
        sortBy: "TicketCreatedDate"
      },
      headers: [
        {
          text: "Ticket Created Date",
          value: "TicketCreatedDate",
          width: "20%"
        },
        { text: "Analyst", value: "Analyst", width: "20%" },
        { text: "Ticket", value: "Ticket", width: "20%" },
        {
          text: "Unrecorded IR",
          value: "UnrecordedIR",
          width: "20%"
        },
        {
          text: "Call Served",
          value: "CallServed",
          width: "20%"
        },
        {
          text: "Call To Ticket (%)",
          value: "CallToTicketPercentage",
          width: "20%"
        }
      ]
    };
  },
  created: function() {
    store.commit("setCurrentScreenName", "CallToTicket");
    this.getTicketResolver();
    this.fetchCallToTicket();
  },

  computed: {
    filteredRecord() {
      var result = [];
      var list = this.listOfRecord;
      var val = this.selectTicketResolver.value;
      if (val) {
        val = val.trim().toLowerCase();
        let searchData = list.filter(obj => {
          var UserName = obj.UserName == undefined ? "" : obj.UserName;
          var searchField = this.search;

          if (searchField == "UserName") {
            return UserName.toLowerCase().indexOf(val) > -1;
          } else {
            return UserName.toLowerCase().indexOf(val) > -1;
          }
        });
        result = searchData;
      }
      return result;
    }
  },
  methods: {
    closeViewDialog() {
      this.viewDialog = false;
    },
    btnView(id) {
      this.employeeId = id;
      this.viewDialog = true;
    },
    getTicketResolver() {
      axios({
        method: "get",
        url: this.$urlApplication + "general/GetAgentUserList"
      })
        .then(res => {
          this.itemsTicketResolver = [];

          for (let items of res.data) {
            var result = {
              value: items.Email,
              text: items.FirstName
            };

            if (items.Email == this.$route.query.id) {
              this.selectTicketResolver = {
                value: items.Email,
                text: items.FirstName
              };
            }

            this.itemsTicketResolver.push(result);
          }
        })
        .catch(error => {});
    },

    fetchCallToTicket() {
      //Validate Date From And To
      var strCurrentDate = new Date(
        `${this.$store.getters.startDate}T00:00:00`
      );
      var strNewEndDate = new Date(`${this.$store.getters.endDate}T23:59:59`);
      var difference = strNewEndDate - strCurrentDate;

      if (difference < 0) {
        alert("Please select date end should be greater than start date");
      } else {
        var strCurrentDate = `${this.$store.getters.startDate}T00:00:00`;
        var strNewEndDate = `${this.$store.getters.endDate} 23:59:59.999`;

        this.isLoadinglistOfRecord = true;
        this.listOfRecord = [];

        axios({
          method: "get",
          url:
            this.$urlApplication +
            "AgentKPI/GetCallToTicket?dateFrom=" +
            strCurrentDate +
            "&dateTo=" +
            strNewEndDate +
            "&userName=A"
          //  +
          // this.selectTicketResolver.value
        })
          .then(res => {
            this.listOfRecord = res.data;
            this.isLoadinglistOfRecord = false;
          })
          .catch(error => {
            this.isLoadinglistOfRecord = false;
          });
      }
    },

    cancelAutoUpdate() {
      clearInterval(this.timer);
    }
  },
  beforeDestroy() {
    this.cancelAutoUpdate();
  }
};
</script>
<style scoped>

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