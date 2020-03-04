<template>
  <v-layout row wrap class="pa-2">
    <v-flex lg12 class="mt-12">
      <v-card class="black--text elevation-5">
        <v-layout>
          <v-flex lg12 class="pa-0">
            <v-card-title class="headline grey lighten-3 pa-1 ma-0" primary-title>Test</v-card-title>
            <button-small :link="'/CrystalReport'" :desciption="'Crystal Report'" />
            <button-small :link="'/CrystalReportEmail'" :desciption="'Crystal Report Email'" />
            <button-small :link="'/CallScoreCard'" :desciption="'Call Score Card'" />
          </v-flex>
        </v-layout>

        <!-- <v-layout>
          <v-flex>
            <v-card-title>
              <download-excel
                name="ZoneReport.xls"
                :fields="json_fieldsZoneReport"
                type="xls"
                :data="this.filteredTickets"
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
              must-sort
              class="elevation-3"
              :headers="headers"
              :items="this.filteredTickets"
              :search="search"
              :loading="isLoading"
              :pagination.sync="pagination"
            >
              <template slot="items" slot-scope="props">
                <td class="text-xs-left">{{ props.item.Name }}</td>
                <td class="text-xs-left">{{ props.item.Central }}</td>
                <td class="text-xs-left">{{ props.item.OnsiteOffpeak }}</td>

                <td class="text-xs-left">{{ props.item.Vendor }}</td>

                <td class="text-xs-left">{{ props.item.Tickets_Created }}</td>
                <td class="text-xs-left">{{ props.item.TicketResolved }}</td>
                <td
                  class="text-xs-left"
                >{{ props.item.FollowupTicket == null ? 0 : props.item.FollowupTicket.toFixed(2) }} %</td>
                <td
                  class="text-xs-left"
                >{{ props.item.CustomerSatisfaction == null ? 0 : props.item.CustomerSatisfaction.toFixed(2) }}</td>
                <td
                  class="text-xs-left"
                >{{ props.item.ResponseRate == null ? 0 : props.item.ResponseRate.toFixed(2) }} %</td>
                <td class="text-xs-left">{{ props.item.DissatisfiedCnt }}</td>
                <td class="text-xs-left">{{ props.item.ITPending }}</td>
                <td class="text-xs-left">{{ props.item.ITPendingAvgDays }}</td>
                <td class="text-xs-left">{{ props.item.UserPending }}</td>
                <td class="text-xs-left">{{ props.item.UserPendingAvgDays }}</td>
                <td class="text-xs-left">{{ props.item.VendorPending }}</td>
                <td class="text-xs-left">{{ props.item.VendorPendingAvgDays }}</td>
              </template>
              <v-alert
                slot="no-results"
                :value="true"
                color="error"
                icon="warning"
              >Your search for "{{ search }}" found no results.</v-alert>
            </v-data-table>
          </v-flex>
        </v-layout> -->
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import { mixins } from "../../../mixins/CustomMixins";
import DatePicker from "../../../components/control/DatePicker";
import ProgressLinear from "../../../components/control/ProgressLinear";
import store from "../../../store";
import ButtonSmall from "../../../components/control/ButtonSmall";
export default {
  mixins: [mixins],
  components: {
    DatePicker,
    ProgressLinear,
    ButtonSmall
  },
  data() {
    return {
      search1: "",
      paginationIndividualRatings: {
        descending: true,
        sortBy: "ratingCount"
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
      ]
    };
  },
  computed: {
    feedbacks() {
      var result = this.$store.getters.feedbacks;
      return result;
    }
  },
  watch: {},
  methods: {
    isLoadingFeedbacks() {
      return this.$store.getters.isLoadingFeedbacks;
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
    }
  }
};
</script>

<style scoped>
.rat1,
rat2 {
  color: #ff8f8f;
}
.rat3 {
  color: #ffe699;
}
.rat4,
rat5 {
  color: #a9d08e;
}
.v-card__text {
  padding: 0px;
  width: 100%;
}
</style>