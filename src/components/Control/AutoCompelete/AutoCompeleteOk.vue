<template>
  <div class="autocomplete" style="width:100%">
    <v-text-field
      label="Customer"
      placeholder="Placeholder"
      type="text"
      @input="onChange"
      v-model="search"
      v-on:blur="onBlur"
      @keyup.down="onArrowDown"
      @keyup.up="onArrowUp"
      @keyup.enter="onEnter"
    ></v-text-field>
    <i class="fa fa-circle-o-notch fa-spin" style="font-size:24px"></i>
    <ul v-show="isOpen" class="autocomplete-results">
      <li v-if="isLoading" class="loading">Loading results...</li>
      <li
        v-else
        v-for="(result, i) in results"
        :key="i"
        @click="setResult(result)"
        class="autocomplete-result"
        :class="{ 'is-active': i === arrowCounter }"
      >{{ result.text }}</li>
    </ul>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "autocomplete",
  template: "#autocomplete",
  props: {
    Name: "",
    apiUrl: "",
    isAsync: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data() {
    return {
      isOpen: false,
      results: [],
      search: "",
      isLoading: false,
      arrowCounter: 0,
      message: ""
    };
  },
  // watch: {

  // },
  // mounted: function() {
  //   this.search = this.name;
  //   debugger;
  // },
  methods: {
    // emitToParent(event) {
    //   this.$emit("childToParent", this.search);
    // },
    fillData(search) {
      axios({
        method: "get",
        url: this.$urlApplication + this.apiUrl + this.search
        // this.$urlApplication + "TrendChart/GetUserDim?pSearch=" + this.search
      })
        .then(res => {
          //this.results = [];
          for (let items of res.data) {
            var text = (items.Text = null
              ? "Empty"
              : (items.Text = undefined ? "Empty" : items.Text));
            var result = {
              value: items.Value,
              text: text
            };
            this.results.push(result);

            this.isLoading = false;
          }
        })
        .catch(error => {
          this.isLoading = false;
        });
    },
    onChange() {
      // Let's warn the parent that a change was made
      // this.$emit("input", this.search);
      // Is the data given by an outside ajax request?
      if (this.isAsync) {
        this.isLoading = true;
        this.isOpen = true;
        this.results = [];

        // setTimeout(() => {
        //   this.message =
        this.fillData();

        //}, 1000);
      } else {
        // Let's search our flat array
        this.filterResults();

        this.isOpen = true;
      }
    },

    filterResults() {
      // first uncapitalize all the things
      var resutl = "";
      this.results = this.items.filter(item => {
        resutl = item.toLowerCase().indexOf(this.search.toLowerCase()) > -1;
      });
      return resutl;
    },
    setResult(result) {
      this.search = result.text.trim();
      this.isOpen = false;
      var result2 = this.search + "~" + result.value;
      this.$emit("input", result2);
    },
    onArrowDown(evt) {
      if (this.arrowCounter < this.results.length) {
        this.arrowCounter = this.arrowCounter + 1;
      }
    },
    onArrowUp() {
      if (this.arrowCounter > 0) {
        this.arrowCounter = this.arrowCounter - 1;
      }
    },
    onEnter() {
      this.search = this.results[this.arrowCounter].text;
      this.isOpen = false;
      this.arrowCounter = -1;
    },
    handleClickOutside(evt) {
      if (!this.$el.contains(evt.target)) {
        this.isOpen = false;
        this.arrowCounter = -1;
      }
    },
    onBlur(obj) {
      //Set autoselection when user type most match value
      var v1 = obj.target._value;
      for (var items of this.results) {
        this.setResult(items);
        break;
      }
      this.isOpen = false;
    }
  },
  watch: {
    Name: function() {
      this.search = this.Name;
    },
    items: function(val, oldValue) {
      // actually compare them
      if (val.length !== oldValue.length) {
        this.results = val;
        this.isLoading = false;
      }
    }
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
    this.search = this.Name;
  },
  destroyed() {
    document.removeEventListener("click", this.handleClickOutside);
  }
};
</script> 
<style>
.autocomplete {
  position: relative;
  width: 130px;
}

.autocomplete-results {
  padding: 0;
  margin: 0;
  border: 1px solid #eeeeee;
  height: 120px;
  overflow: auto;
  width: 100%;
  position: absolute;
  background-color: white;
  z-index: 1;

  margin-top: -18px;
  margin-right: 0px;
  margin-bottom: 0px;
  margin-left: 0px;
}

.autocomplete-result {
  list-style: none;
  text-align: left;
  padding: 4px 2px;
  cursor: pointer;
}

.autocomplete-result:hover {
  background-color: #4aae9b;
  color: white;
}

.inputClass {
  border: 1px solid gray;
  border-radius: 4px;
  width: 100%;
  -moz-appearance: none;
  -webkit-appearance: none;
}
</style>
