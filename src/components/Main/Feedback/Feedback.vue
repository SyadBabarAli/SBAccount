<template>
  <div id="feedback">
    <v-layout row wrap class="pa-2">
      <v-flex lg12 class="mt-12">
        <v-card class="black--text elevation-5">
          <v-layout>
            <v-flex lg12 class="pt-0">
              <v-card-title class="headline grey lighten-3 pa-1 ma-0" primary-title>User Feedback</v-card-title>

              <v-layout row wrap>
                <v-flex lg12>
                  <v-layout row wrap>
                    <v-flex lg12>
                      <date-picker @getResults="fetchFeedbacks"/>
                    </v-flex>
                  </v-layout>

                  <v-layout row wrap pb-3>
                    <v-flex lg6 v-if="isLoadingFeedbacks" class="text-xs-center">
                      <progress-circular ext-xs-center/>
                    </v-flex>
                    <v-flex lg6 class="text-xs-center" v-else>
                      <v-layout row wrap id="rating1" class="pl-3 pr-3 text-xs-center">
                        <feedback-rating
                          :ratingStar="feedbackStats.ratingPercentage"
                          :avgRating="feedbackStats.avgRating"
                          :total="feedbacks.length"
                          :ratingFive="feedbackStats.rating.five"
                          :ratingFour="feedbackStats.rating.four"
                          :ratingThree="feedbackStats.rating.three"
                          :ratingTwo="feedbackStats.rating.two"
                          :ratingOne="feedbackStats.rating.one"
                        />
                      </v-layout>
                    </v-flex>
                    <v-flex lg6 v-if="isLoadingFeedbacks" class="text-xs-center">
                      <progress-circular ext-xs-center/>
                    </v-flex>
                    <v-flex lg6 class="text-xs-center" v-else>
                      <app-response-rate
                        :feedbackCount="feedbacks.length"
                        :ticketCount="responseTickets.length"
                      ></app-response-rate>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
              <v-layout row wrap>
                <v-flex lg6>
                  <div class="pa-1">
                    <v-card>
                      <h3
                        class="white--text green lighten-1 body-2 pa-1 text-xs-center font-weight-thick"
                      >Individual Ratings</h3>
                      <v-divider></v-divider>
                      <v-card-title class="pa-0 ma-0">
                        <!-- <v-toolbar-title>Details</v-toolbar-title>
                        <v-divider class="mx-2" inset vertical></v-divider> -->
                        <v-spacer></v-spacer>
                        <v-text-field
                          v-model="search1"
                          append-icon="search"
                          label="Search"
                          single-line
                          hide-details
                        ></v-text-field>
                      </v-card-title>
                      <v-data-table
                        must-sort
                        :headers="headers1"
                        :items="individualFeedbacks"
                        :search="search1"
                        :loading="isLoadingFeedbacks"
                        :pagination.sync="paginationIndividualRatings"
                      >
                        <template slot="items" slot-scope="props">
                          <td class="text-xs-left">{{ props.item.name }}</td>
                          <td class="text-xs-center">{{ props.item.ratingCount }}</td>
                          <td class="text-xs-center">{{ props.item.avgRating }}</td>
                          <td>
                            <button-grid :description="'View'" @Click="btnMore(props.item)"/>
                          </td>
                        </template>
                        <v-alert
                          slot="no-results"
                          :value="true"
                          color="error"
                          icon="warning"
                        >Your search for "{{ search1 }}" found no results.</v-alert>
                      </v-data-table>
                    </v-card>
                  </div>
                </v-flex>
                <v-flex lg6>
                  <div class="pa-1">
                    <v-card>
                      <h3
                        class="white--text red lighten-2 body-2 text-xs-center pa-1 font-weight-thick"
                      >Dissatisfaction Ratings</h3>
                      <v-card-title class="pa-0 ma-0">
                        <!-- <v-toolbar-title>Details</v-toolbar-title>
                        <v-divider class="mx-2" inset vertical></v-divider> -->
                        <v-spacer></v-spacer>
                        <v-text-field
                          v-model="search2"
                          append-icon="search"
                          label="Search"
                          single-line
                          hide-details
                        ></v-text-field>
                      </v-card-title>
                      <v-data-table
                        must-sort
                        :headers="headers2"
                        :items="feedbacksDisatisfied"
                        :search="search2"
                        :loading="isLoadingFeedbacks"
                        :pagination.sync="paginationDissatisfactionRatings"
                      >
                        <template slot="items" slot-scope="props">
                          <td class="text-xs-left">{{ props.item.Date | momentDate }}</td>
                          <td class="text-xs-left">{{ props.item.AffectedUser }}</td>
                          <td class="text-xs-left">{{ props.item.SupportGroup }}</td>
                          <td class="text-xs-center">{{ props.item.Rating }}</td>
                          <td>
                            <button-grid
                              :description="'View'"
                              @Click="btnView(props.item.IncidentID)"
                            />
                          </td>
                        </template>
                        <v-alert
                          slot="no-results"
                          :value="true"
                          color="error"
                          icon="warning"
                        >Your search for "{{ search2 }}" found no results.</v-alert>
                      </v-data-table>
                    </v-card>
                  </div>
                </v-flex>
              </v-layout>

              <v-layout>
                <v-flex lg12>
                  <div class="pa-1">
                    <v-card>
                      <h3
                        class="grey lighten-2 body-2 text-xs-center font-weight-thick pa-1"
                      >Feedback</h3>
                      <v-card-title class="pa-0 ma-0">
                        <!-- <v-toolbar-title>Details</v-toolbar-title>
                        <v-divider class="mx-2" inset vertical></v-divider> -->
                        <v-spacer></v-spacer>
                        <v-text-field
                          v-model="search3"
                          append-icon="search"
                          label="Search"
                          single-line
                          hide-details
                        ></v-text-field>
                      </v-card-title>
                      <v-data-table
                        must-sort
                        :headers="headers3"
                        :items="feedbacks"
                        :search="search3"
                        :loading="isLoadingFeedbacks"
                        :pagination.sync="paginationFeedback"
                      >
                        <template slot="items" slot-scope="props">
                          <tr :class="{ 'animate-danger': isDanger(props.item) }">
                            <td class="text-xs-left">{{ props.item.Date | momentDate }}</td>
                            <td class="text-xs-left">{{ props.item.IncidentID }}</td>
                            <td class="text-xs-left">{{ props.item.AffectedUser }}</td>
                            <td class="text-xs-left">{{ props.item.ResolvedBy }}</td>
                            <td class="text-xs-left">{{ props.item.SupportGroup }}</td>
                            <td class="text-xs-center">{{ props.item.Rating }}</td>
                            <td>
                              <button-grid
                                :description="'View'"
                                @Click="btnView(props.item.IncidentID)"
                              />
                            </td>
                          </tr>
                        </template>
                        <v-alert
                          slot="no-results"
                          :value="true"
                          color="error"
                          icon="warning"
                        >Your search for "{{ search3 }}" found no results.</v-alert>
                      </v-data-table>
                    </v-card>
                  </div>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-divider light></v-divider>
          <v-card-actions class="pa-0 ma-0 ml-1"></v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  
    <v-dialog v-model="viewDialog" width="700" scrollable>
      <app-feedback-details :incidentId="incidentId"  @Click="closeViewDialog"></app-feedback-details>
    </v-dialog>

    <v-dialog v-model="moreDialog" width="1000" scrollable >
      <app-individual-details :individualName="individualName" :isOpenDailog ="moreDialog" @Click="closeMoreDialog"></app-individual-details>
    </v-dialog>
  </div>
</template>

<script>
import DatePicker from "../../../components/control/DatePicker";
import ButtonSmallTwo from "../../control/ButtonSmallTwo";
import ButtonGrid from "../../control/ButtonGrid";
import ProgressLinear from "../../../components/control/ProgressLinear";
import ProgressCircular from "../../../components/control/ProgressCircular";
import FeedbackRating from "../../../components/control/FeedbackRating";
import ResponseRate from "../../../components/Main/Feedback/ResponseRate";
import FeedbackDetails from "../../../components/Main/Feedback/FeedbackDetails";
import IndividualDetails from "../../../components/Main/Feedback/IndividualDetails";
import moment from "moment";
import _ from "lodash";

export default {
  name: "pageOne",
  components: {
    "app-feedback-details": FeedbackDetails,
    "app-individual-details": IndividualDetails,
    "app-response-rate": ResponseRate,
    DatePicker,
    ButtonGrid,
    ProgressLinear,
    ProgressCircular,
    FeedbackRating
  },
  data() {
    return {
      incidentId: "",
      viewDialog: false,
      individualTeam: "",
      individualName: "",
      moreDialog: false,
      timer: "",
      lastSynced: "",

      rating: 5,

      search1: "",
      paginationIndividualRatings: {
        descending: true,
        sortBy: "ratingCount"
      },
      paginationDissatisfactionRatings: {
        descending: true,
        sortBy: "Date"
      },

      paginationFeedback: {
        descending: true,
        sortBy: "Date"
      },
      headers1: [
        { text: "Resolver", value: "name", width: "30%" },
        {
          text: "Responses",
          value: "ratingCount",
          width: "30%",
          align: "center"
        },
        {
          text: "Avg. Rating",
          value: "avgRating",
          width: "30%",
          align: "center"
        },
        { text: "", value: "", width: "10%" }
      ],
      search2: "",
      headers2: [
        { text: "Feedback Date", value: "Date" },
        { text: "User", value: "AffectedUser" },
        { text: "Support Group", value: "SupportGroup" },
        { text: "User Rating", value: "Rating", align: "center" },
        { text: "", value: "", width: "20%" }
      ],
      search3: "",
      headers3: [
        { text: "Feedback Date", value: "Date" },
        { text: "ID", value: "IncidentID" },
        { text: "User", value: "AffectedUser" },
        { text: "Resolver ", value: "ResolvedBy" },
        { text: "Support Group", value: "SupportGroup" },
        { text: "Rating", value: "Rating", align: "center" },
        { text: "", value: "", width: "20%" } 
      ]
    };
  },
  created() {
    this.$store.commit("setCurrentScreenName", "Feedback");
  },
  mounted() {
    this.fetchFeedbacks();
    this.setBars();
  },
  updated() {
    this.setBars();
  },
  watch: {
    "$store.getters.sync": {
      immediate: true,
      handler() {
        if (this.$store.getters.sync) {

          this.timer = setInterval(
            this.fetchFeedbacks,
            this.$store.getters.syncTime
          );
        } else {
          this.cancelAutoUpdate();
        }
      }
    }
  },
  computed: {
    feedbacks() {
      var result = this.$store.getters.feedbacks;
      return result;
    },
    feedbacksDisatisfied() {
      var obj = this.feedbacks.filter(data => data.Rating < 3);
      return obj;
    },
    individualFeedbacks() {
      let groupedData = [];
      _.forEach(_.groupBy(this.feedbacks, "ResolvedBy"), (val, key) => {
        groupedData.push({
          name: val[0].ResolvedBy,
          ratingCount: val.length,
          avgRating: _.round(_.meanBy(val, "Rating"), 2),
          score: _.sumBy(val, "Rating")
        });
      });

      return _.orderBy(
        groupedData,
        ["score", "ratingCount", "avgRating", "name"],
        ["desc", "desc", "desc", "asc"]
      );
    },
    feedbackStats() {
      var ratingFive = this.feedbacks.filter(feedback => feedback.Rating == 5)
        .length;
      var ratingFour = this.feedbacks.filter(feedback => feedback.Rating == 4)
        .length;
      var ratingThree = this.feedbacks.filter(feedback => feedback.Rating == 3)
        .length;
      var ratingTwo = this.feedbacks.filter(feedback => feedback.Rating == 2)
        .length;
      var ratingOne = this.feedbacks.filter(feedback => feedback.Rating == 1)
        .length;

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

      let statsData = {
        avgRating: isNaN(_.round(_.meanBy(this.feedbacks, "Rating"), 2))
          ? 0
          : _.round(_.meanBy(this.feedbacks, "Rating"), 2),
        ratingPercentage: isNaN(
          0.05 * ((_.round(_.meanBy(this.feedbacks, "Rating"), 2) * 100) / 5)
        )
          ? 0
          : 0.05 * ((_.round(_.meanBy(this.feedbacks, "Rating"), 2) * 100) / 5),
        rating: {
          five: ratingFivePercentage,
          four: ratingFourPercentage,
          three: ratingThreePercentage,
          two: ratingTwoPercentage,
          one: ratingOnePercentage
        }
      };
      this.$store.dispatch("storeDissatisfactionCount", ratingOne + ratingTwo);
      setTimeout(function() {
        var obj = document.querySelectorAll(
          "#rating1 .v-progress-linear__bar__determinate"
        );

        if (obj[0] != undefined) {
          if (document.querySelector("#divRating1") != null) {
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

            document.querySelector("#divRating1").textContent = ratingFive;
            document.querySelector("#divRating2").textContent = ratingFour;
            document.querySelector("#divRating3").textContent = ratingThree;
            document.querySelector("#divRating4").textContent = ratingTwo;
            document.querySelector("#divRating5").textContent = ratingOne;
          } else {
            //alert(2);
            var objDiv1 = obj[0].appendChild(document.createElement("div"));
            objDiv1.textContent =
              ratingFive > 0
                ? ratingFive.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : ratingFive;
            objDiv1.style.textAlign = "left";
            objDiv1.id = "divRating1";

            var objDiv2 = obj[1].appendChild(document.createElement("div"));
            objDiv2.textContent =
              ratingFour > 0
                ? ratingFour.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : ratingFour;
            objDiv2.style.textAlign = "left";
            objDiv2.id = "divRating2";

            var objDiv3 = obj[2].appendChild(document.createElement("div"));
            objDiv3.textContent =
              ratingThree > 0
                ? ratingThree.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : ratingThree;
            objDiv3.style.textAlign = "left";
            objDiv3.id = "divRating3";

            var objDiv4 = obj[3].appendChild(document.createElement("div"));
            objDiv4.textContent =
              ratingTwo > 0
                ? ratingTwo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : ratingTwo;
            objDiv4.style.textAlign = "left";
            objDiv4.id = "divRating4";

            var objDiv5 = obj[4].appendChild(document.createElement("div"));
            objDiv5.textContent =
              ratingOne > 0
                ? ratingOne.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : ratingOne;
            objDiv5.style.textAlign = "left";
            objDiv5.id = "divRating5";
          }
        }
      }, 300);

      return statsData;
    },
    isLoadingFeedbacks() {
      return this.$store.getters.isLoadingFeedbacks;
    },
    responseTickets() {
      return this.$store.getters.responseTickets;
    },
    isLoadingResponseTickets() {
      return this.$store.getters.isLoadingResponseTickets;
    },
    error() {
      return this.$store.getters.error;
    }
  },
  methods: {
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
        this.fetchResponseTickets();
        this.$store.dispatch("fetchFeedbacks", {
          start_date: `${this.$store.getters.startDate}T00:00:00`,
          end_date: `${this.$store.getters.endDate}T23:59:59`
        });
      }
    },
    btnView(incidentId) {
      this.incidentId = incidentId;
      this.viewDialog = true;
    },
    closeViewDialog() {
      this.viewDialog = false;
    },
    btnMore(feedback) {
      this.individualName = feedback.name;
      this.moreDialog = true;
    },
    closeMoreDialog() {
      this.moreDialog = false;
    },
    isDanger(feedback) {
      return feedback.Rating < 3;
    },
    setBars() {
      let bars = document.querySelectorAll(".feedback .rating-box .bar"),
        max = 0;
      for (let i of bars) {
        max = Math.max(max, i.dataset.value);
      }
      for (let i of bars) {
        i.style.width = (i.dataset.value * 100) / max + "%";
      }
    },
    cancelAutoUpdate() {
      clearInterval(this.timer);
    },
    fetchResponseTickets() {
      this.$store.dispatch("fetchResponseTickets", {
        start_date: `${this.$store.getters.startDate}T00:00:00`,
        end_date: `${this.$store.getters.endDate}T23:59:59`
      });
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