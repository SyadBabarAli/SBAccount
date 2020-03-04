
<template>
  <v-card class="IndividualDetails">
    <v-card-title class="headline grey lighten-2" primary-title>Ticket Details</v-card-title>
    <v-layout>
      <v-flex lg12 text-xs-left>
        <h4 class="font-weight-thick pl-3 pt-2">{{individualName}}</h4>
      </v-flex>
    </v-layout>
    <v-layout row wrap id="rating2" text-xs-center>
      <v-flex lg6>
        <feedback-rating
          :ratingStar="individualStats.ratingPercentage"
          :avgRating="individualStats.avgRating"
          :total="individualStats.rating.count"
          :ratingFive="individualStats.rating.five"
          :ratingFour="individualStats.rating.four"
          :ratingThree="individualStats.rating.three"
          :ratingTwo="individualStats.rating.two"
          :ratingOne="individualStats.rating.one"
        />
      </v-flex>
      <v-flex lg6>
        <div class="response-rate-box">
          <div class="circle-container">
            <div v-if="$store.getters.isLoadingResponseTickets">
              <v-progress-circular :size="50" :width="1" color="purple" indeterminate></v-progress-circular>
            </div>
            <div v-else>
              <app-individual-response-rate
                :isOpenDailog ="isOpenDailog" 
                :feedbackCount="filteredFeedbacks.length"
                :ticketCount="filteredTickets.length"
              ></app-individual-response-rate>
            </div>
          </div>
        </div>
      </v-flex>
    </v-layout>
    <!-- {{filteredFeedbacks.length}}
    {{filteredTickets.length}}
    {{filteredTickets.length /filteredTickets.length}} -->

    <v-card-text>
      <v-layout row wrap>
        <v-flex>
          <v-card-title class="pa-0 ma-0">
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>

          <v-data-table
            :headers="headers"
            :items="filteredFeedbacks"
            :search="search"
            :pagination.sync="pagination"
          >
            <template slot="items" slot-scope="props">
              <tr :class="{ 'animate-danger': isDanger(props.item) }">
                <td class="text-xs-left">{{ props.item.Date | momentDate }}</td>
                <td class="text-xs-left">{{ props.item.IncidentID }}</td>
                <td class="text-xs-left">{{ props.item.AffectedUser }}</td>
                <td class="text-xs-left">{{ props.item.Location }}</td>
                <td class="text-xs-center">{{ props.item.Rating }}</td>
                <td>
                  <button-grid :description="'View'" @Click="btnView(props.item.IncidentID)"></button-grid>
                </td>
              </tr>
            </template>
            <v-alert
              slot="no-results"
              :value="true"
              color="error"
              icon="warning"
            >Your search for "{{ search }}" found no results.</v-alert>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <!-- <v-btn flat @click.stop="show=false">Close</v-btn> -->
      <v-btn flat @click="onClick">Close</v-btn>
    </v-card-actions>
    <v-dialog v-model="viewDialog" width="500" scrollable>
      <app-feedback-details :incidentId="incidentId" @Click="closeViewDialog"></app-feedback-details>
    </v-dialog>
  </v-card>
</template>

<script>
import ProgressLinear from "../../../components/control/ProgressLinear";
import FeedbackService from "../../../services/feedback-service";
import TicketService from "../../../services/ticket-service";
import FeedbackDetails from "../../../components/Main/Feedback/FeedbackDetails";
import DatePicker from "../../../components/control/DatePicker";
import IndividualResponseRate from "../../../components/Chart/ChartJs/IndividualResponseRate";

import FeedbackRating from "../../../components/control/FeedbackRating";
import ButtonGrid from "../../control/ButtonGrid";
//import ButtonNormal from "../../control/ButtonNormal";

import moment from "moment";
import _ from "lodash";

export default {
  props: ["isOpenDailog", "individualName"],
  name: "IndividualDetails",
  components: {
    "app-feedback-details": FeedbackDetails,
    "app-individual-response-rate": IndividualResponseRate,
    "app-datepicker": DatePicker,
    FeedbackRating,
    ButtonGrid
    //ButtonNormal
  },
  data() {
    return {
      search: "",
      pagination: {
        page: 1,
        descending: true,
        sortBy: "CreatedDate"
      },
      headers: [
        { text: "Feedback Date", value: "CreatedDate", width: "20%" },
        { text: "ID", value: "IncidentID", width: "10%" },
        { text: "User", value: "AffectedUser", width: "20%" },
        { text: "Location", value: "Location", width: "10%" },
        { text: "User Rating", value: "Rating", width: "20%", align: "center" },
        { text: "", value: "", width: "5%" }
      ],
      rating: 5,
      startDate: "",
      endDate: "",
      feedbacks: [],
      incidentId: "",
      viewDialog: false,
      isLoading: false,
      tickets: [],
      countFeedback: 0
    };
  },
  created() {
    this.startDate = this.$store.getters.startDate;
    this.endDate = this.$store.getters.endDate;
    this.feedbacks = this.$store.getters.feedbacks;
    setTimeout(() => {
      this.setBars();
    }, 100);
  },
  // updated() {
  //   this.setBars();
  // },
  watch: {
    isOpenDailog: function(obj) {
      var isOpen = obj;
      if (isOpen) {
        this.startDate = this.$store.getters.startDate;
        this.endDate = this.$store.getters.endDate;
        this.feedbacks = this.$store.getters.feedbacks;
        this.pagination.page = 1;
        this.filteredFeedbacks;
        this.setBars();
      } else {
      }
    },
    // individualName: function(obj) {
    //   // if (obj) {
    //   //   //alert("Open");
    //   //   //this.filteredFeedbacks();
    //   // }

    //   this.startDate = this.$store.getters.startDate;
    //   this.endDate = this.$store.getters.endDate;
    //   //this.feedbacks = this.$store.getters.feedbacks;

    //   this.feedbacks = _.orderBy(
    //     this.$store.getters.feedbacks.filter(
    //       feedback =>
    //         _.includes(this.$store.getters.filterTree, feedback.SupportGroup) &&
    //         _.includes(
    //           this.$store.getters.filterLocation,
    //           feedback.Property_Location
    //         )
    //     ),
    //     "Date",
    //     "desc"
    //   );

    //   //alert(this.feedbacks.length);
    // },
    "$store.getters.responseTickets": {
      immediate: true,
      handler(val) {
        this.tickets = val;
      }
    }
  },
  computed: {
    // show: {
    //   get() {
    //     return this.individualName;
    //   },
    //   set(value) {
    //     if (!value) {
    //       this.$emit("Click");
    //       //alert("Close");
    //       //this.search = "";
    //     }
    //   }
    // },
    filteredFeedbacks() {      
      var obj = _.orderBy(
        this.feedbacks.filter(
          feedback => feedback.ResolvedBy == this.individualName
        ),
        "Date",
        "desc"
      );

      return obj;
    },
    individualStats() {
      var ratingFive = this.filteredFeedbacks.filter(
        feedback => feedback.Rating == 5
      ).length;
      var ratingFour = this.filteredFeedbacks.filter(
        feedback => feedback.Rating == 4
      ).length;
      var ratingThree = this.filteredFeedbacks.filter(
        feedback => feedback.Rating == 3
      ).length;
      var ratingTwo = this.filteredFeedbacks.filter(
        feedback => feedback.Rating == 2
      ).length;
      var ratingOne = this.filteredFeedbacks.filter(
        feedback => feedback.Rating == 1
      ).length;

      var ratingMax = Math.max(
        ratingFive,
        ratingFour,
        ratingThree,
        ratingTwo,
        ratingOne
      );
      var ratingMaxIndivisor = ratingMax / 100 / 2;
      var ratingFivePercentage = ratingFive / ratingMaxIndivisor;
      ratingFivePercentage = isNaN(ratingFivePercentage)
        ? 0
        : ratingFivePercentage;
      // ratingFivePercentage =
      //   ratingMax < 100 ? ratingFive : ratingFivePercentage;

      var ratingFourPercentage = ratingFour / ratingMaxIndivisor;
      ratingFourPercentage = isNaN(ratingFourPercentage)
        ? 0
        : ratingFourPercentage;
      // ratingFourPercentage =
      //   ratingMax < 100 ? ratingFour : ratingFourPercentage;

      var ratingThreePercentage = ratingThree / ratingMaxIndivisor;
      ratingThreePercentage = isNaN(ratingThreePercentage)
        ? 0
        : ratingThreePercentage;
      // ratingThreePercentage =
      //   ratingMax < 100 ? ratingThree : ratingThreePercentage;

      var ratingTwoPercentage = ratingTwo / ratingMaxIndivisor;
      ratingTwoPercentage = isNaN(ratingTwoPercentage)
        ? 0
        : ratingTwoPercentage;
      // ratingTwoPercentage = ratingMax < 100 ? ratingTwo : ratingTwoPercentage;

      var ratingOnePercentage = ratingOne / ratingMaxIndivisor;
      ratingOnePercentage = isNaN(ratingOnePercentage)
        ? 0
        : ratingOnePercentage;
      // ratingOnePercentage = ratingMax < 100 ? ratingOne : ratingOnePercentage;

      var countFeedback =
        ratingFive + ratingFour + ratingThree + ratingTwo + ratingOne;

      let statsData = {
        avgRating: isNaN(_.round(_.meanBy(this.filteredFeedbacks, "Rating"), 2))
          ? 0
          : _.round(_.meanBy(this.filteredFeedbacks, "Rating"), 2),
        ratingPercentage: isNaN(
          0.05 *
            ((_.round(_.meanBy(this.filteredFeedbacks, "Rating"), 2) * 100) / 5)
        )
          ? 0
          : 0.05 *
            ((_.round(_.meanBy(this.filteredFeedbacks, "Rating"), 2) * 100) /
              5),
        rating: {
          five: ratingFivePercentage,
          four: ratingFourPercentage,
          three: ratingThreePercentage,
          two: ratingTwoPercentage,
          one: ratingOnePercentage,
          count: countFeedback
        }
      };
      this.$store.dispatch("storeDissatisfactionCount", ratingOne + ratingTwo);
      setTimeout(function() {
        var obj = document.querySelectorAll(
          "#rating2 .v-progress-linear__bar__determinate"
        );

        if (obj[0] != undefined) {
          if (document.querySelector("#divRating11") != null) {
            ratingFive =
              ratingFive > 0
                ? ratingFive.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : ratingFive;

            ratingFour =
              ratingFour > 0
                ? ratingFour.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : ratingFour;

            ratingThree =
              ratingThree > 0
                ? ratingThree.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : ratingThree;

            ratingTwo =
              ratingTwo > 0
                ? ratingTwo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : ratingTwo;

            ratingOne =
              ratingOne > 0
                ? ratingOne.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : ratingOne;

            document.querySelector("#divRating11").textContent = ratingFive;
            document.querySelector("#divRating22").textContent = ratingFour;
            document.querySelector("#divRating33").textContent = ratingThree;
            document.querySelector("#divRating44").textContent = ratingTwo;
            document.querySelector("#divRating55").textContent = ratingOne;
          } else {
            //alert(2);
            var objDiv1 = obj[0].appendChild(document.createElement("div"));
            objDiv1.textContent =
              ratingFive > 0
                ? ratingFive.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : ratingFive;
            objDiv1.style.textAlign = "left";
            objDiv1.id = "divRating11";

            var objDiv2 = obj[1].appendChild(document.createElement("div"));
            objDiv2.textContent =
              ratingFour > 0
                ? ratingFour.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : ratingFour;
            objDiv2.style.textAlign = "left";
            objDiv2.id = "divRating22";

            var objDiv3 = obj[2].appendChild(document.createElement("div"));
            objDiv3.textContent =
              ratingThree > 0
                ? ratingThree.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : ratingThree;
            objDiv3.style.textAlign = "left";
            objDiv3.id = "divRating33";

            var objDiv4 = obj[3].appendChild(document.createElement("div"));
            objDiv4.textContent =
              ratingTwo > 0
                ? ratingTwo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : ratingTwo;
            objDiv4.style.textAlign = "left";
            objDiv4.id = "divRating44";

            var objDiv5 = obj[4].appendChild(document.createElement("div"));
            objDiv5.textContent =
              ratingOne > 0
                ? ratingOne.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : ratingOne;
            objDiv5.style.textAlign = "left";
            objDiv5.id = "divRating55";
          }
        }
      }, 300);
      return statsData;
    },
    filteredTickets() {
      var result = null;
      result = this.tickets.filter(
        ticket => ticket.ResolvedBy == this.individualName
      );
      return result;
    }
  },
  methods: {
    isDanger(feedback) {
      return feedback.Rating < 3;
    },
    onClick() {
      this.$emit("Click");
    },
    fetchFeedbacks() {
      //Validate Date From And To
      var strCurrentDate = new Date(
        `${this.$store.getters.startDate}T00:00:00`
      );
      var strNewEndDate = new Date(`${this.$store.getters.endDate}T23:59:59`);
      var difference = strNewEndDate - strCurrentDate;
      if (difference < 0) {
        alert("Please select date end should be greater than start date");
      } else {
        //End Validate Date From And To
        this.isLoading = true;
        this.fetchTickets();
        FeedbackService.get({
          start_date: `${this.startDate}T00:00:00`,
          end_date: `${this.endDate}T23:59:59`
        }).then(res => {
          this.feedbacks = res.data;
          this.isLoading = false;
        });
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
        var result = (i.dataset.individual * 100) / max + "%";

        alert(result);
        i.style.width = result;
      }
    },
    btnView(incidentId) {
      this.incidentId = incidentId;
      this.viewDialog = true;
    },
    closeViewDialog() {
      this.viewDialog = false;
    },
    fetchTickets() {
      TicketService.getResolved({
        start_date: `${this.startDate}T00:00:00`,
        end_date: `${this.endDate}T23:59:59`
      }).then(res => {
        this.tickets = res.data;
      });
    }
  }
};
</script>
<style>
.animate-danger {
  animation: blinkingText 1s infinite;
}
</style>