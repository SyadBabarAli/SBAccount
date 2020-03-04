
import axios from "axios";
export const mixins = {

  // created: function() {
  //  alert("Test Call");
  // },
  data: function () {
    return {
      get globalReadOnlyProperty() {
        return "Can't change me!";
      }
    }
  },

  methods: {
    convertTwoDecimal(pVal) {
      var obj = pVal;
      var result = 0.00;
      if (obj > 0) {
        result = parseFloat(Math.round(obj * 100) / 100).toFixed(2);
      }
      return result;
    },
    // //Check Route Access But not using
    // isRoute(to) {
    //   axios
    //     .get(Vue.prototype.$urlApplication + "GetRoleUserRuleMenu")
    //     .then(response => {
    //       var objData = response.data;
    //       var isTrue = false;
    //       for (var i = 0; i < objData.length; i++) {
    //         var obj = objData[i];
    //         var OptionName = obj.name;
    //         if (OptionName == to.name) {
    //           isTrue = true;
    //           break;
    //         }
    //       }
    //       if (isTrue) {
    //         next();
    //       } else {
    //         next(false);
    //       }
    //     })
    //     .catch(error => {
    //       console.log(error);
    //     })
    //     .finally(() => { });
    // },
    // //End

    async getUserRights(ids) {
      var ruleIds = ids;
      var result = null;
      await
        axios
          .get(this.$urlApplication + "GetRoleUserRuleMenu")
          .then(response => {

            if (response != null && response.data != null) {
              var objData = response.data;
              result = objData.filter(w => _.includes(ruleIds, w.id));
            }
          })
          .catch(error => {
            console.log(error);
          })
          .finally(() => { });

      return result;
    },

    isAllowRoute() {
      alert("Allow Route");
      // axios
      // .get("http://localhost:60868/api/GetRoleUserRuleMenu")
      // .then(response => {
      //   var objData = response.data;
      //   var isTrue = false;
      //   for (var i = 0; i < objData.length; i++) {
      //     var OptionName = objData[i].name;
      //     if (OptionName == to.name) {
      //       isTrue = true;
      //       debugger;
      //       break;
      //     }
      //   }
      //   if (isTrue) {
      //     next();
      //   } else {
      //     next(false);
      //   }
      // })
      // .catch(error => {
      //   console.log(error);
      // })
      // .finally(() => (this.loading = false));
    },
    //Home///////////////////////////////////////////////////////////////////////////////////////
    themeChange(obj) {
      if (obj == "Red") {
        this.$vuetify.theme.colorDark = "#d32f2f";
        this.$vuetify.theme.colorLight = "#f44336";
      } else if (obj == "Pink") {
        this.$vuetify.theme.colorDark = "#c2185b";
        this.$vuetify.theme.colorLight = "#e91e63";
      } else if (obj == "Purpel") {
        this.$vuetify.theme.colorDark = "#9c27b0";
        this.$vuetify.theme.colorLight = "#9c27b0";
      } else if (obj == "Deep Purpel") {
        this.$vuetify.theme.colorDark = "#673ab7";
        this.$vuetify.theme.colorLight = "#673ab7";
      } else if (obj == "Indigo") {
        this.$vuetify.theme.colorDark = "#303f9f";
        this.$vuetify.theme.colorLight = "#3f51b5";
      } else if (obj == "Blue") {
        this.$vuetify.theme.colorDark = "#1976d2";
        this.$vuetify.theme.colorLight = "#2196f3";
      } else if (obj == "Light Blue") {
        this.$vuetify.theme.colorDark = "#0288d1";
        this.$vuetify.theme.colorDark = "#03a9f4";
      } else if (obj == "Cyan") {
        this.$vuetify.theme.colorDark = "#0097a7";
        this.$vuetify.theme.colorLight = "#00bcd4";
      } else if (obj == "Teal") {
        this.$vuetify.theme.colorDark = "#00796b";
        this.$vuetify.theme.colorLight = "#009688";
      } else if (obj == "Green") {
        this.$vuetify.theme.colorDark = "#388e3c";
        this.$vuetify.theme.colorLight = "#4caf50";
      } else if (obj == "Light Green") {
        this.$vuetify.theme.colorDark = "#689f38";
        this.$vuetify.theme.colorLight = "#8bc34a";
      } else if (obj == "Lime") {
        this.$vuetify.theme.colorDark = "#afb42b";
        this.$vuetify.theme.colorLight = "#cddc39";
      } else if (obj == "Yellow") {
        this.$vuetify.theme.colorDark = "#fbc02d";
        this.$vuetify.theme.colorLight = "#ffeb3b";
      } else if (obj == "Amber") {
        this.$vuetify.theme.colorDark = "#ffa000";
        this.$vuetify.theme.colorLight = "#ffc107";
      } else if (obj == "Orange") {
        this.$vuetify.theme.colorDark = "#f57c00";
        this.$vuetify.theme.colorLight = "#ff9800";
      } else if (obj == "Deep Orange") {
        this.$vuetify.theme.colorDark = "#e64a19";
        this.$vuetify.theme.colorLight = "#ff5722";
      } else if (obj == "Brown") {
        this.$vuetify.theme.colorDark = "#5d4037";
        this.$vuetify.theme.colorLight = "#795548";
      } else if (obj == "Blue Gray") {
        this.$vuetify.theme.colorDark = "#455a64";
        this.$vuetify.theme.colorLight = "#607d8b";
      } else if (obj == "Dashboard-Old") {
        this.$vuetify.theme.colorDark = "#009688";
        this.$vuetify.theme.colorLight = "#009688";
        this.$vuetify.theme.primary = "#009688";
      }
    },
    testf1: function () {
      alert(1);
    },
    f2: function () {
      alert("hello from mixin!");
    },
    getDate: function () {
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth() + 1; //January is 0!
      var yyyy = today.getFullYear();

      if (dd < 10) {
        dd = "0" + dd;
      }

      if (mm < 10) {
        mm = "0" + mm;
      }

      today = mm + "/" + dd + "/" + yyyy;

      return today;
    }
  }
};

// //import Vue from "vue";
// export default {
//   install (Vue, options) {
//     Vue.mixin(mixins)
//   }
// }
