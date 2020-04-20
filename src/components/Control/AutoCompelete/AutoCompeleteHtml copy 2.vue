<template>
  <div class="autocomplete" style="width:100%">
    <!--
      v-on:blur="onBlur"
    -->
    <!-- <div>
      <span>Icon Demonstration:</span>
      <icon name="arrow" width="50" height="50"></icon>
      <svgicon icon="menu" width="22" height="18" color="#0f2"></svgicon>
    </div>-->

    <!-- <div class="v-text-field">
    <div class="v-input__control">
      
    -->

    <div id="container">
      <div id="left">
        <input
          type="text"
          style="outline: none;"
          v-model="search"
          @input="onChange"
          @keyup.down="onArrowDown"
          @keyup.up="onArrowUp"
          @keyup.enter="onEnter"
          maxlength="15"
        />
      </div>
      <div id="secondDiv">
        <v-progress-circular v-show="isLoading" :size="20" :width="2" color="black" indeterminate></v-progress-circular>
      </div>
      <div id="center">
        <i
          class="material-icons cursorCSM"
          style="font-size: 13px;"
          v-on:click="clear"
          v-show="search != null && search.length  > 0 ? true : false"
        >clear</i>
      </div>
      <div id="right">
        <i
          class="material-icons cursorPointerCSM"
          v-on:click="arrowDropDown"
          align="left"
        >arrow_drop_down</i>
      </div>
    </div>

    <!-- <div class="divSL">
      <input
        type="text"
        style="width: 70%;border: 0px none;outline: none;"
        v-model="search"
        @input="onChange"
        @keyup.down="onArrowDown"
        @keyup.up="onArrowUp"
        @keyup.enter="onEnter"
      />
      <i
        class="material-icons cursorCSM"
        v-on:click="clear"
        v-show="search != null && search.length  > 0 ? true : false"
      >clear</i>
      <i
        class="material-icons cursorPointerCSM"
        v-on:click="arrowDropDown"
        align="left"
      >arrow_drop_down</i>
    </div>-->
    <!-- </div>
    </div>-->
    <!-- <input
      class="inputClass"
      type="text"
      v-model="search"
      @input="onChange"
      @keyup.down="onArrowDown"
      @keyup.up="onArrowUp"
      @keyup.enter="onEnter"
    />-->
    <!-- <icon-base icon-name="write">
      <icon-write />
    </icon-base>-->

    <ul v-show="isOpen" class="autocomplete-results">
      <li v-if="isLoading" class="loading">Loading results...</li>
      <li
        v-else
        v-for="(result, i) in results"
        :key="i"
        @click="emitResult(result)"
        class="autocomplete-result"
        :class="{ 'is-active': i === arrowCounter }"
      >{{ result.text }}</li>
    </ul>
  </div>
</template>
<script>
import axios from "axios";

import IconBase from "../../../components/control/IconBase.vue";
// import IconEnvelope from "../../../components/control/icons/IconEnvelope.vue";
// import IconCalendar from "../../../components/control/icons/IconCalendar.vue";
// import IconGarbage from "../../../components/control/icons/IconGarbage.vue";
// import IconImage from "../../../components/control/icons/IconImage.vue";
import IconWrite from "../../../components/control/icons/IconWrite.vue";
// import IconMoon from "../../../components/control/icons/IconMoon.vue";
// import IconBox from "../../../components/control/icons/IconBox.vue";

export default {
  components: {
    IconBase,
    IconWrite
  },
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
  methods: {
    arrowDropDown(obj) {
      this.search = "";
      this.onChange();
    },
    clear(obj) {
      this.search = "";
    },
    fillData() {
      axios({
        method: "get",
        url: this.$urlApplication + this.apiUrl + this.search
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
          //When product was not found
          if (this.results.length == 0) {
            var text = 'Add customer "' + this.search + '"';
            this.results.push({
              value: 0,
              text: text
            });
          }
        });
    },
    onChange() {
      if (this.isAsync) {
        this.isLoading = true;
        this.isOpen = true;
        this.results = [];

        this.fillData();
      } else {
        this.filterResults();
        this.isOpen = true;
      }
    },

    filterResults() {
      var result = this.items.filter(item => {
        item.toLowerCase().indexOf(this.search.toLowerCase()) > -1;

        this.results = result;
        return result;
      });
    },
    emitResult(obj) {
      var value = obj.value;
      var text = obj.text.trim();
      this.search = text;
      this.isOpen = false;
      var result = text + "~" + value;
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
      if (!this.$el.contains(evt.target)) {
        this.isOpen = false;
        this.arrowCounter = -1;
      }
    },
    onBlur(obj) {
      //Set autoselection when user type most match value
      var v1 = obj.target._value;
      debugger;
      for (var items of this.results) {
        this.emitResult(items);
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
<style scoped>
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

  /* margin-top: -18px; */
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

.borderColor {
  border: 2px solid #dadfe6 !important;
  border-radius: 4px;
}

.inputClass {
  /* -webkit-box-flex: 1;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  line-height: 20px;
  padding: 0px 0;
  max-width: 100%;
  min-width: 0;
  width: 100%; */
}

.v-input__slotCSM {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  color: inherit;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  margin-bottom: 8px;
  min-height: inherit;
  position: relative;
  -webkit-transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  width: 100%;
}

.v-input__slotCSM {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  color: inherit;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  margin-bottom: 8px;
  min-height: inherit;
  position: relative;
  -webkit-transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  width: 100%;
}

.input-container {
  display: -ms-flexbox; /* IE10 */
  display: flex;
  width: 100%;
  margin-bottom: 15px;
  line-height: 20px;
}
.icon {
  padding: 10px;
  background: dodgerblue;
  color: white;
  min-width: 50px;
  text-align: center;
}

.divSL {
  border: 2px solid #dadfe6 !important;
  border-radius: 4px;

  width: 100%;
  overflow: hidden;
  white-space: nowrap;
}

.cursorPointerCSM {
  cursor: pointer;
}
.cursorCSM {
  cursor: pointer;
}
.cursorCSM:hover {
  color: red;
}

#container {
  border: 2px solid #dadfe6 !important;
  border-radius: 4px;
  width: 100%;
  text-align: center;
  height: 32px;
  padding-top: 5px;
  padding-left: 5px;
  padding-right: 5px;
}

#left {
  float: left;
  width: 65%;
}

#center {
  display: inline-block;
  margin: 0 auto;
  width: 10%;
}
#secondDiv {
  display: inline-block;
  margin: 0 auto;
  width: 10%;
}

#right {
  float: right;
  width: 10%;
}
/* 
ul{
    list-style:none;
    white-space: nowrap;
}
ul > li{
    display: inline-block;
} */
</style>
