<template>
  <div class="autocomplete" style="width:100%">
    <input
      type="text"
      class="inputClass"
      @input="onChange"
      v-model="search"
      @keyup.down="onArrowDown"
      @keyup.up="onArrowUp"
      @keyup.enter="onEnter"
    />
    <i class="fa fa-circle-o-notch fa-spin" style="font-size:24px"></i>
    <ul v-show="isOpen" class="autocomplete-results">
      <li v-if="isLoading" class="loading">Loading results...</li>
      <!-- <li v-else-if="result.length == 0 && search.length > 0">Clikc to add customer</li> -->
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
// import debounce from "debounce";

export default {
  name: "autocomplete",
  template: "#autocomplete",
  props: {
    // items: {
    //   type: Array,
    //   required: false,
    //   default: () => []
    // },
    apiUrl: "",
    //  {
    //   type: Array,
    //   required: false,
    //   default: () => []
    // },
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

  methods: {
    emitToParent(event) {
      this.$emit("childToParent", this.search);
    },
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
      this.results = this.items.filter(item => {
        return item.toLowerCase().indexOf(this.search.toLowerCase()) > -1;
      });
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
    }
  },
  watch: {
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
