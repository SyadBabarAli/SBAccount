<template>
  <v-layout row wrap class="pa-2">
    <v-flex lg12>
      <v-card class="black--text elevation-5">
        <v-layout>
          <v-flex lg12 class="pa-0">
            <v-breadcrumbs :items="breadcrumbsItems" divider=">" style="padding: 0px 12px" ></v-breadcrumbs>
            <v-card-title class="headline grey lighten-3 pa-1 ma-0" primary-title>
              {{title}}
            </v-card-title>
            <slot></slot>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>

export default {
  props: ["title","breadcrumbsItems"],
  // data() {
  //   return {
  //     items: [
  //       {
  //         text: "Dashboard",
  //         disabled: false,
  //         href: "/"
  //       },
  //       {
  //         text: "Analyst KPI",
  //         disabled: false,
  //         href: "#/AnalystKPI"
  //       },
  //       {
  //         text: "Quality Indicator",
  //         disabled: true,
  //         href: "breadcrumbs_link_2"
  //       }
  //     ]
  //   };
  // }
};
</script>