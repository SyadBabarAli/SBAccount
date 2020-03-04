<template>
  <v-combobox
    v-model="selectLocationCustom"
    :items="itemsLocationCustom"
    label="Location"
    item-text="text"
    item-value="value"
  ></v-combobox>
</template>
<script>
export default {
  data() {
    return {
      selectLocationCustom: [],
      itemsLocationCustom: []
    };
  },
  created: function() {
    this.getLocationCustoms();
  },
  methods: {
    getLocationCustoms: function() {
      axios({
        method: "get",
        url: this.$urlApplication + "/Inventory/GetLocationCustoms"
      })
        .then(res => {
          this.itemsLocationCustom = [];
          for (let items of res.data) {
            var result = {
              value: items.Property_Location,
              text: items.Name
            };

            if (items.Property_Location != 100) {
              this.itemsLocationCustom.push({
                value: items.Property_Location,
                text: items.Name
              });
            }
          }
        })
        .catch(error => {});
    }
  }
};
</script>