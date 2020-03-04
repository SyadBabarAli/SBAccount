<template>
  <v-container fluid>
    <v-row>
      <v-col cols="3">
        <v-combobox v-model="select" :items="items" label="Combobox" outlined dense></v-combobox>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      select: ["Vuetify"],
      items: ["Programming", "Design", "Vue", "Vuetify"]
    };
  }
};
</script>