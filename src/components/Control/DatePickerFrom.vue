<template>
  <v-dialog ref="dialog" v-model="modalDateFrom" persistent lazy full-width width="290px">
    <v-text-field
      slot="activator"
      v-model="dateFrom"
      label="Date From"
      prepend-icon="event"
      readonly
    ></v-text-field>
    <v-date-picker v-model="dateFrom" color="colorLight" scrollable>
      <v-spacer></v-spacer>
      <v-btn flat color="primary" @click="modalDateFrom = false">Cancel</v-btn>
      <v-btn flat color="primary" @click="$refs.dialog.save(dateFrom)">OK</v-btn>
    </v-date-picker>
  </v-dialog>
</template>
<script>
export default {
  name: "DatePickerSingle",
  data() {
    return {
      modalDateFrom: false,
      dateFrom: ""
    };
  },
  mounted() {
    this.dateFrom = this.$store.getters.dateFrom;
  },
  watch: {
    dateFrom(dateFrom) {
      this.$store.dispatch("storeDateFrom", dateFrom);
    }
  },
  methods: {
    fetchDateFrom() {
      this.$emit("getDateFrom");
    }
  }
};
</script>