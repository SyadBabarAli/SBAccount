<template>
  <div>
    <v-card class="colorLight white--text elevation-5 pb-1">
      <v-layout class="pl-2 pr-2 pt-2">
        <v-flex lg5 text-xs-left class="pa-0">
          <v-icon dark style="font-size: 66px;">{{this.icon}}</v-icon>
        </v-flex>
        <v-flex lg7 text-xs-right>
          <v-layout class="pt-2">
            <v-flex>
              <div class="csmheadline">
                <slot name="content1"></slot>
              </div>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-layout >
        <v-flex lg12 class=" pa-0 pr-2 text-xs-right">
          <h4 class="font-weight-light">{{this.descName}}</h4>
        </v-flex>
      </v-layout>
    </v-card>
  </div>
</template>
<script>
export default {
  props: ["descName", "icon"]
};
</script>