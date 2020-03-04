<template>
  <v-layout row wrap class="pa-2">
    <v-flex lg12 class="mt-12">
      <v-card class="black--text elevation-5">
        <v-card-title class="headline grey lighten-3 pa-1 ma-0" primary-title>F-Tag</v-card-title>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex lg6 class="pa-2" >
            <v-text-field v-model="filterInput" label="F-Tag"></v-text-field>
          </v-flex>
          <v-flex lg4>
            <div class="pt-3">
              <button-normal @Click="fetchResolvedTicketWithFeedback" :description="'Get Results'"/>
            </div>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex lg12>
            <v-card>
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
                ></v-text-field>
              </v-card-title>
              <v-data-table
                :headers="headers"
                :items="filteredFeedbacks"
                :search="search"
                :loading="isLoading"
              >
                <template slot="items" slot-scope="props">
                  <td class="text-xs-left">{{ props.item.CreatedDate | momentDate }}</td>
                  <td class="text-xs-left">{{ props.item.IR }}</td>
                  <td class="text-xs-left">{{ props.item.User }}</td>
                  <td class="text-xs-left">{{ props.item.Ftag }}</td>
                  <td class="text-xs-left">{{ props.item.Location }}</td>
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
</template>

<script>
import FeedbackService from "../../services/feedback-service";
import ButtonNormal from "../../components/Control/ButtonNormal";
export default {
  components: {
    ButtonNormal
  },
  data() {
    return {
      search: "",
      headers: [
        { text: "Date", value: "CreatedDate", width: "20%" },
        { text: "IR", value: "IR", width: "10%" },
        { text: "User", value: "User", width: "20%" },
        { text: "F-Tag", value: "Ftag", width: "10%" },
        { text: "Location", value: "Location", width: "20%" }
      ],
      listOfRecords: [],
      isLoading: false,
      filterInput: ""
    };
  },
  computed: {
    filteredFeedbacks() {
      let query = this.$route.query.display;
      return this.listOfRecords;
    }
  },
  methods: {
    fetchResolvedTicketWithFeedback() {
      this.isLoading = true;
      FeedbackService.getFinanceGetTicketByFtag({
        ftag: this.filterInput
      })
        .then(res => {
          this.listOfRecords = res.data;
          this.isLoading = false;
        })
        .catch(error => {
          console.log(error);
          this.isLoading = false;
        });
    }
  },
  beforeMount() {
    this.fetchResolvedTicketWithFeedback();
  }
};
</script>
