// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import 'babel-polyfill'
import "isomorphic-fetch"

import App from "./App";
import router from "./router";

// index.js or main.js
import "material-design-icons-iconfont/dist/material-design-icons.css"; // Ensure you are using css-loader
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/dist/vuetify.min.css"; // Ensure you are using css-loader
import Vuetify from "vuetify";

//import theme from "./theme";

// var colorDark = "";
// var colorLight = "";


var colorScheme = {
  red1: "#d32f2f",
  red2: "#f44336",

  pink1: "#c2185b",
  pink2: "#e91e63",

  purpel1: "#9c27b0",
  purpel2: "#9c27b0",

  deeppurpel1: "#673ab7",
  deeppurpel2: "#673ab7",

  indigo1: "#303f9f",
  indigo2: "#3f51b5",

  blue1: "#1976d2",
  blue2: "#2196f3",

  lightblue1: "#0288d1",
  lightblue2: "#03a9f4",

  cyan1: "#0097a7",
  cyan2: "#00bcd4",

  teal1: "#00796b",
  teal2: "#009688",

  green1: "#388e3c",
  green2: "#4caf50",

  lightgreen1: "#689f38",
  lightgreen2: "#8bc34a",

  lime1: "#afb42b",
  lime2: "#cddc39",

  yellow1: "#fbc02d",
  yellow2: "#ffeb3b",

  amber1: "#ffa000",
  amber2: "#ffc107",

  orange1: "#f57c00",
  orange2: "#ff9800",

  deeporange1: "#e64a19",
  deeporange2: "#ff5722",

  brown1: "#5d4037",
  brown2: "#795548",

  bluegrey1: "#455a64",
  bluegrey2: "#607d8b",

  old1: "#009688",
  old2: "#009688",

  kbColor1: "#a2c617"
};
Vue.use(
  Vuetify,
  {
    theme: {
      primary: colorScheme.old1,
      colorDark: colorScheme.old1,
      colorLight: colorScheme.old2,

      kbPrimary: colorScheme.kbColor1,
      kbcolorDark: colorScheme.kbColor1,
      kbColorLight: colorScheme.kbColor1

    }
    , colorScheme: colorScheme
  }
  //   , {
  //   iconfont: 'mdi' // 'md' || 'mdi' || 'fa' || 'fa4'
  // }
);

// import ECharts from 'vue-echarts/components/ECharts'
// // import ECharts modules manually to reduce bundle size
// import 'echarts/lib/chart/bar'
// import 'echarts/lib/component/tooltip'

import VueECharts from "vue-echarts/components/ECharts";
import "echarts/lib/chart/pie";
import "echarts/lib/chart/bar";
import "echarts/lib/component/legend";
import "echarts/lib/component/tooltip";

// register component to use
Vue.component("chart", VueECharts);

import store from "./store";

Vue.config.productionTip = false;

import filters from "./filters";

//Vue.filter("momentDate", filters.momentDate);
//Vue.filter("momentDateDash", filters.momentDateDash);
//Vue.filter("toLocaleString", filters.toLocaleString);

Vue.filter("momentTime", filters.momentTime);
Vue.filter("momentDateOnly", filters.momentDateOnly);
Vue.filter("momentConvertDate", filters.momentConvertDate);
Vue.filter("momentConvertDateTime", filters.momentConvertDateTime);
Vue.filter("momentDate", filters.momentDate);
Vue.filter("momentDateDash", filters.momentDateDash);
Vue.filter("toLocaleString", filters.toLocaleString);

//import {mixins} from '@/mixins/CustomMixins.js'
//Vue.use(mixins)

//High Chart-Start
import Highcharts from 'highcharts'
import VueHighcharts from 'vue-highcharts'
import highchartsMore from 'highcharts/highcharts-more'


//New  17-03-2019
// load these modules as your need
import loadStock from "highcharts/modules/stock";
//import loadMap from "highcharts/modules/map";
//import loadDrilldown from "highcharts/modules/drilldown";
// some charts like solid gauge require `highcharts-more.js`, you can find it in official demo.
//import loadHighchartsMore from "highcharts/highcharts-more";
//import loadSolidGauge from "highcharts/modules/solid-gauge";
//import exportingInit from 'highcharts/modules/exporting'

loadStock(Highcharts);
//loadMap(Highcharts);
//loadDrilldown(Highcharts);
//loadHighchartsMore(Highcharts);
//loadSolidGauge(Highcharts);
//exportingInit(Highcharts)

//New  17-03-2019


//High Chart-End


//High Chart-Start
highchartsMore(Highcharts)
Vue.use(VueHighcharts, { Highcharts })
//High Chart-End

// import axios from 'axios'
// const base = axios.create({
//   baseURL: 'http://localhost:60868/api/'
// })
// Vue.prototype.$http = base

//Vue.prototype.$urlApplication = 'http://localhost:60868/api/'
//Vue.prototype.$urlApplication = 'https://sddashboard.aku.edu/api/'
//Vue.prototype.$urlDomain = 'http://localhost:60868/'


import JsonExcel from 'vue-json-excel'
Vue.component('downloadExcel', JsonExcel)

export const bus = new Vue()


import CKEditor from '@ckeditor/ckeditor5-vue';
Vue.use(CKEditor);

// //Text Editor Start
// import VueQuill from 'vue-quill'
// Vue.use(VueQuill)

// import VueQuillEditor from 'vue-quill-editor'

// // require styles
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'

// Vue.use(VueQuillEditor, /* { default global options } */)

//Text Editor End


/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>",
  //mixins: [mixins]
});

// Vue.extend({
//   mixins: [mixins]
// })
