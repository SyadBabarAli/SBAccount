<template>
  <div class="pa-2">
    <v-layout row wrap class="justify-center">
      <v-flex lg2 xs6>
        <v-dialog
          ref="dialogstartDate"
          v-model="modalstartDate"
          :return-value.sync="startDate"
          lazy
          full-width
          width="290px"
        >
          <v-text-field
            id="dateFrom"
            slot="activator"
            v-model="startDate"
            label="From"
            prepend-icon="event"
            readonly
          ></v-text-field>
          <v-date-picker v-model="startDate" scrollable color="colorDark">
            <v-spacer></v-spacer>
            <v-btn flat @click="modalstartDate = false">Cancel</v-btn>
            <v-btn flat @click="$refs.dialogstartDate.save(startDate)">OK</v-btn>
          </v-date-picker>
        </v-dialog>
      </v-flex>
      <v-flex lg2 xs6>
        <v-dialog
          ref="dialogendDate"
          v-model="modalendDate"
          :return-value.sync="endDate"
          :close-click="true"
          lazy
          full-width
          width="290px"
        >
          <v-text-field
            id="dateTo"
            slot="activator"
            v-model="endDate"
            label="To"
            prepend-icon="event"
            readonly
          ></v-text-field>
          <v-date-picker v-model="endDate" scrollable color="colorDark">
            <v-spacer></v-spacer>
            <v-btn flat @click="modalendDate = false">Cancel</v-btn>
            <v-btn flat @click="$refs.dialogendDate.save(endDate)">OK</v-btn>
          </v-date-picker>
        </v-dialog>
      </v-flex>
      <v-flex lg2 xs12>
        <div class="pt-1 pl-1">
          <!-- <v-btn @click="fetchResults" class="colorLight white--text pa-0 pl-5 pr-5">Get Result</v-btn> -->
          <button-normal @Click="fetchResults" :description="'Get Results'"/>
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>
<script>
import ButtonNormal from "../../components/Control/ButtonNormal";
export default {
  components: {
    ButtonNormal
  },
  data() {
    return {
      modalstartDate: false,
      modalendDate: false,
      startDate: "",
      endDate: ""
    };
  },
  mounted() {
    this.startDate = this.$store.getters.startDate;
    this.endDate = this.$store.getters.endDate;
  },
  watch: {
    startDate(newDate) {
      this.$store.dispatch("storeStartDate", newDate);
    },
    endDate(newDate) {
      this.$store.dispatch("storeEndDate", newDate);
    }
  },
  methods: {
    fetchResults() {
      this.$emit("getResults");
    }
  }
};
</script>