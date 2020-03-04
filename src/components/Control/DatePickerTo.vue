<template>
  <v-dialog ref="dialog" v-model="modalDateTo" persistent lazy full-width width="290px">
    <v-text-field slot="activator" v-model="dateTo" label="Date To" prepend-icon="event" readonly></v-text-field>
    <v-date-picker v-model="dateTo" color="colorLight" scrollable>
      <v-spacer></v-spacer>
      <v-btn flat color="primary" @click="modalDateTo = false">Cancel</v-btn>
      <v-btn flat color="primary" @click="$refs.dialog.save(dateTo)">OK</v-btn>
    </v-date-picker>
  </v-dialog>
</template>
<script>
export default {
  name: "DatePickerSingle",
  data() {
    return {
      modalDateTo: false,
      dateTo: ""
    };
  },
  mounted() {
    this.dateTo = this.$store.getters.dateTo;
  },
  watch: {
    dateTo(dateTo) {
      this.$store.dispatch("storeDateTo", dateTo);
    }
  },
  methods: {
    fetchDateTo() {
      this.$emit("getDateTo");
    }
  }
};
</script>