<template>
  <v-layout row wrap class="pa-2">
    <v-flex lg12 class="mt-12">
      <v-card class="black--text elevation-5">
        <v-layout>
          <v-flex lg12>
            <v-card-title class="headline grey lighten-3 pa-1 ma-0" primary-title>
              Sales Person- {{this.editedItem.SaleGeographyRegionId}}
              <v-toolbar-items>
                <v-btn flat color="colorLight" @click="post" v-if="this.$route.query.id == 0">save</v-btn>
                <v-btn flat color="colorLight" @click="put" v-if="this.$route.query.id > 0">update</v-btn>
                <v-btn flat color="colorLight" @click="clear(editedItem)">clear</v-btn>
                <v-btn flat color="colorLight" :to="urlRoute">close</v-btn>
              </v-toolbar-items>
            </v-card-title>
            <v-card>
              <v-layout>
                 <v-flex class="pa-1">
                  <v-text-field label="Name" placeholder="Placeholder" v-model="editedItem.Name"></v-text-field>
                </v-flex>

                <v-flex class="pa-1">
                  <v-text-field label="Name" placeholder="Placeholder" v-model="editedItem.Name"></v-text-field>
                </v-flex>

              </v-layout>
            </v-card>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script> 
import axios from "axios";
import { mixins } from "../../../../../mixins/CustomMixins";
import ButtonSmall from "../../../../../components/control/ButtonSmall";
import AutoComplete from "../../../../../components/control/AutoCompelete/AutoCompeleteHtml";

export default {
  mixins: [mixins],
  components: {
    ButtonSmall,
    AutoComplete
  },
  data() {
    return {
      CreatedDate: new Date(),
      editedItem: {
        SaleGeographyRegionId: 0,
        Name: "",
        IsOrderBooker: true,
        IsDeliveryPerson: true,
        IsSalesman: true,
        IsDeleted: true
      },
      componentName: "SaleGeographyRegion",
      urlRoute: "/Regions",
      isLoading: true,
      IsSnackBar: false
    };
  }
};
</script>