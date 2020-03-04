<template>
  <div>
    <v-layout row wrap>
      <v-flex lg4>
        <v-dialog
          ref="dialog"
          v-model="modalstartDate"
          :return-value.sync="startDate"
          lazy
          full-width
          width="290px"
        >
          <v-text-field
            slot="activator"
            v-model="startDate"
            label="Picker in dialog"
            prepend-icon="event"
            readonly
          ></v-text-field>
          <v-date-picker v-model="startDate" type="month" scrollable color="colorLight">
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="modalstartDate = false">Cancel</v-btn>
            <v-btn flat color="primary" @click="$refs.dialog.save(startDate)">OK</v-btn>
          </v-date-picker>
        </v-dialog>
      </v-flex>
    </v-layout>
  </div>
</template>
<script>
const dayAbbreviation = ["S", "M", "T", "W", "T", "F", "S"];
const dayList = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthList = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];
const monthLongList = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const enDateFormat = {
  formatDisplay(date) {
    return `${dayList[date.getDay()]}, ${
      monthList[date.getMonth()]
    } ${date.getDate()}`;
  },
  formatMonth(date) {
    return `${monthLongList[date.getMonth()]} ${date.getFullYear()}`;
  },
  getWeekDayArray(firstDayOfWeek) {
    let beforeArray = [];
    let afterArray = [];
    for (let i = 0; i < dayAbbreviation.length; i++) {
      if (i < firstDayOfWeek) {
        afterArray.push(dayAbbreviation[i]);
      } else {
        beforeArray.push(dayAbbreviation[i]);
      }
    }
    return beforeArray.concat(afterArray);
  }
};

export default {
  data() {
    return {
      // startDate: new Date().toISOString().substr(0, 10),
      // endDate: new Date().toISOString().substr(0, 10),
      //menu: false,
      modalstartDate: false,
      modalendDate: false,
      //menu2: false,

      enDateFormat,
      startDate: "",
      endDate: ""
    };
  },
  created: function() {
    setTimeout(function() {
      var objElement = document.getElementsByClassName("v-text-field__details");
      //objElement[1].className = "csmHide";
      objElement[0].className = "csmHide";
    }, 100);
  },
  mounted() {
    this.startDate = this.$store.getters.startDate;
    this.endDate = this.$store.getters.endDate;
  },
  watch: {
    startDate(newDate) {
      this.$store.dispatch("storeStartDate", newDate);
    },
  },
  methods: {
    fetchResults() {
      this.$emit("getResults");
    }
  }
};
</script>