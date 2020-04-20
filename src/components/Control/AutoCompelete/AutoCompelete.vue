<template>
  <div class="autocomplete" style="width:100%">
    Customer
    <br />
    <!-- v-on:blur="onBlur" -->
    <input
      type="text"
      list="results"
      v-model="search"
      @input="onChange"
      @keyup.down="onArrowDown"
      @keyup.up="onArrowUp"
      @keyup.enter="onEnter"
    />
    <button class="close-icon" type="reset"></button>

    <datalist id="results">
      <option
        v-show="isDL"
        v-for="(result, i) in results"
        :key="i"
        @click="setResult(result)"
      >{{result.text}}</option>
    </datalist>
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
      isDL: true,
      isOpen: false,
      results: [],
      search: "",
      isLoading: false,
      arrowCounter: 0,
      message: ""
    };
  },
  methods: {
    onBlur(obj) {
      debugger;
      //Set autoselection when user type most match value
      var v1 = obj.target._value;
      for (var items of this.results) {
        this.setResult(items);
        break;
      }
      this.isOpen = false;
    },
    fillData(search) {
      axios({
        method: "get",
        url: this.$urlApplication + this.apiUrl + this.search
      })
        .then(res => {
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
      var obj = this.results.filter(w => w.text == this.search);

      if (obj.length == 0) {
        if (this.isAsync) {
          this.isLoading = true;
          this.isOpen = true;
          this.results = [];
          this.fillData();
        } else {
          this.filterResults();
          this.isOpen = true;
        }
      } else {
        this.setResult(obj);
      }
    },

    filterResults() {
      var resutl = "";
      this.results = this.items.filter(item => {
        resutl = item.toLowerCase().indexOf(this.search.toLowerCase()) > -1;
      });
      return resutl;
    },
    setResult(obj) {
      this.isDL = false;
      this.search = obj[0].text.trim();
      var id = obj[0].value;
      this.isOpen = false;
      var result = this.search + "~" + id;

      this.$emit("input", result);
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
      debugger;
      if (!this.$el.contains(evt.target)) {
        this.isOpen = false;
        this.arrowCounter = -1;
      }
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
  // mounted() {
  //   document.addEventListener("click", this.handleClickOutside);
  //   this.search = this.Name;
  // },
  // destroyed() {
  //   document.removeEventListener("click", this.handleClickOutside);
  // }
};
</script> 
<style scoped>
/* .autocomplete {
  position: relative;
  width: 130px;
} */
/* 
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
} */

/* .autocomplete-result {
  list-style: none;
  text-align: left;
  padding: 4px 2px;
  cursor: pointer;
} */
/* 
.autocomplete-result:hover {
  background-color: #4aae9b;
  color: white;
} */

/* input {
  padding: 0.75rem;
  color: #2a2a2a;
  background-color: #fff;
  border: 2px solid #dadfe6;
  font-family: Roboto;
  border-radius: 0.375rem;
  height: 20px;
  width: 100%;
  margin-top: 4px;
}
*/

input::-webkit-calendar-picker-indicator {
  opacity: 100;
}

input {
  position: relative;
  padding: 0.75rem;
  color: #2a2a2a;
  background-color: #fff;
  border: 2px solid #dadfe6;
  font-family: Roboto;
  border-radius: 0.375rem;
  height: 20px;
  width: 100%;
  margin-top: 4px;
}

/*
input:before {
  content: "\f073";
  display: inline-block;
  font: normal normal normal 14px/1 FontAwesome;
  font-size: inherit;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position:absolute;
  right:0;
  top:50%;
  transform:translateY(-50%);
} */
</style>
