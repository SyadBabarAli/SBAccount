
import axios from "axios";
export const mixins = {

  // data: function () {
  //   return {
  //     //componentName: "empty"
  //   }
  // },
  watch: {
    search() {
      this.currentPage = 1;
      this.tableLoad();
    },
    selectTableRowNo(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.tableLoad();
    }
  },
  mounted: function () {
    var id = this.$route.query.id;
    if (id == undefined) {
      this.tableLoad();
    }
    else {
      this.editItem(id);
    }
  },
  methods: {
    async editItem(id) {

      if (id != null) {
        let response = await axios.get(
          this.$urlApplication + this.componentName + "/" + id
        );
        if (id == 0) {
          this.getProposedNumber();
        }

        var serverObj = response.data;
        var clientObj = this.editedItem;

        /////////////////////////////////Client///////////////////////////////////////////////////////////////////////////////////////////
        for (var propCL in clientObj) {
          var propNameCL = propCL;
          var valCL = clientObj[propNameCL];
          var propNameLcCL = propNameCL.toLocaleLowerCase();
          var keyOriginalCL = propNameCL.replace("items", "");
          var keyIdCL = propNameCL.replace("items", "") + "Id";
          var selectCL = propNameCL.replace("items", "select");

          ///////////////////////Server/////////////////////////////////////////////////
          for (var propSV in serverObj) {
            var propNameSV = propSV;
            var valSV = serverObj[propNameSV];
            var propNameLcSV = propNameSV.toLocaleLowerCase();

            if (typeof valCL == "number") {
              if (
                propNameCL.toLowerCase().indexOf(propNameSV.toLowerCase()) > -1
              ) {
                clientObj[propNameCL] = valSV;
                break;
              }
            } else if (typeof valCL == "string") {
              if (
                propNameCL.toLowerCase().indexOf(propNameSV.toLowerCase()) > -1
              ) {
                clientObj[propNameCL] = valSV;
                break;
              }
            } else if (typeof valCL == "boolean") {
              if (
                propNameCL.toLowerCase().indexOf(propNameSV.toLowerCase()) > -1
              ) {
                clientObj[propNameCL] = valSV;
                break;
              }
            } else if (typeof valCL == "object" && valCL != null) {
              if (propNameLcCL.indexOf("date") > -1) {
              } else {
                if (
                  propNameLcCL.indexOf("item") > -1 ||
                  propNameLcCL.indexOf("detail") > -1
                ) {
                  if (valSV != null && typeof valSV == "object") {
                    //////////////////////Detail/////////////////////////////
                    var keyOriginalSV = propNameSV.replace("items", "");
                    //debugger
                    if (
                      propNameLcSV.indexOf("detail") > -1 &&
                      propNameLcCL.indexOf("detail") > -1
                    ) {
                      clientObj[propNameCL] = id == 0 ? [] : valSV;
                      break;
                    }
                    //////////////////////Detail/////////////////////////////
                    ////////////////////////Select////////////////////////

                    else if (
                      propNameLcCL.indexOf("item") > -1 &&
                      propNameLcSV.indexOf("detail") == -1 &&
                      keyOriginalCL
                        .toLowerCase()
                        .indexOf(keyOriginalSV.toLowerCase()) > -1
                    ) {
                      clientObj[propNameCL] = valSV;

                      var keyIdVal = serverObj[keyIdCL];

                      keyOriginalSV = this.getMatProp(keyOriginalSV, valSV[0]);
                      clientObj[selectCL] = this.refillSelect2(
                        keyIdVal,
                        valSV,
                        keyOriginalSV
                        //keyOriginalSV + "Id"
                      );
                      break;
                    }
                    ////////////////////////Select////////////////////////
                  }
                }
              }
            }
          } //End/////////////////Server///////////////////////////////////////////////////////////////
        } /////End/////////////////////////////Client//////////////////////////////////////////////////
      }
    },
    //////////////////////////////////Main Table////////////////////////////////////////////////////////
    async tableLoad() {
      this.isLoading = true;
      var pagedResult = {
        CurrentPage: this.currentPage,
        PageSize: this.selectTableRowNo,
        SortColumn: this.sortColumn,
        IsAsc: this.ascending,
        Searchable: this.searchable,
        Search: this.search
      };
      axios({
        method: "put",
        url: this.$urlApplication + this.componentName + "/Get",
        data: pagedResult
      })
        .then(res => {
          this.pageSize = res.data.PageSize;
          this.totalPages = res.data.PageCount;
          this.rows = res.data.Results;
          this.isLoading = false;
        })
        .catch(error => {
          this.isLoading = false;
        });
    },
    sortTable(col, obj) {
      obj =
        obj.toElement.lastElementChild == null
          ? obj.srcElement
          : obj.toElement.lastElementChild;
      if (obj.innerText == "keyboard_arrow_down") {
        obj.innerText = "keyboard_arrow_up";
      } else if (obj.innerText == "keyboard_arrow_up") {
        obj.innerText = "keyboard_arrow_down";
      }
      this.sortColumn = col;
      this.ascending = !this.ascending;
      this.asc = this.ascending;
      this.tableLoad();
    },
    changePage(page) {
      this.currentPage = page;
      this.tableLoad();
    },
    searchTxt() {
      clearTimeout(this.timeout);
      var self = this;
      this.timeout = setTimeout(function () {
        self.search = self.value;
      }, 500);
    },
    deleted(obj) {
      if (confirm("Are you sure you want to delete this item?")) {
        var pId = obj[this.getMatProp(this.componentName, obj)];
        this.isLoading = true;
        axios({
          method: "delete",
          url:
            this.$urlApplication + this.componentName + "/Delete?companyId=1&id=" + pId
        })
          .then(res => {
            this.isLoading = false;
            this.tableLoad();
          })
          .catch(error => {
            this.isLoading = false;
          });
      }
    },
    //////////////////////////////////Main Table////////////////////////////////////////////////////////
    ////////////////////////////////////////////Component/////////////////////////////////
    post() {
      this.reloadComponentObject();

      this.isLoading = true;
      axios({
        method: "post",
        url: this.$urlApplication +
          this.componentName + "/Post",
        data: this.editedItem
      })
        .then(res => {
          this.$router.push(this.urlRoute);
          this.isLoading = false;
        })
        .catch(error => {
          this.isLoading = false;
        });
    },
    put() {
      var pId = this.editedItem[this.getMatProp(this.componentName, this.editedItem)];
      this.reloadComponentObject();
      this.isLoading = true;
      axios({
        method: "put",
        url:
          this.$urlApplication +
          this.componentName + "/Put?id=" +
          pId,
        data: this.editedItem
      })
        .then(res => {
          this.$router.push(this.urlRoute);
          this.isLoading = false;
        })
        .catch(error => {
          this.isLoading = false;
        });
    },
    ////////////////////////////////////////////Component/////////////////////////////////
    async getProposedNumber() {
      const res = await axios
        .get(this.$urlApplication + this.componentName + "/GetProposedNumber")
        .then(res => {
          this.editedItem.Number = res.data;
        })
        .catch(error => { });
    },
    reloadComponentObject() {
      var clientObj = this.editedItem;
      /////////////////////////////////Client///////////////////////////////////////////////////////////////////////////
      for (var prop in clientObj) {
        var propOg = prop;
        var propName = propOg.replace("select", "");
        var propNameWithId = propName + "Id";

        if (
          propOg.toLocaleLowerCase().indexOf("select") > -1
        ) {
          var selectId = this.getMatProp(propNameWithId, clientObj[propOg]);
          clientObj[propNameWithId] = clientObj[propOg][selectId];
        }
      } /////End/////////////////////////////Client////////////////////////////////////////////////////////////////////
    },
    getMatProp(key, obj) {
      var result = "";
      var pKey = key;
      var pObj = obj;
      var matchKeyOg = pKey;
      var matchKeyLc = matchKeyOg.toLocaleLowerCase();
      for (var property in pObj) {
        var propertyOg = property;
        var propertyName = propertyOg.replace("Id", "").replace("id", "").replace("ID", "").replace("iD", "");
        if (matchKeyLc.indexOf(propertyName.toLocaleLowerCase()) > -1) {
          result = propertyOg;
          break;
        }
      }
      return result;
    },
    clear(objData) {
      var data = objData;
      Object.keys(data).forEach(function (key) {
        var id = key;
        var val = data[key];

        if (typeof val == "number") {
          data[key] = "0";
        } else if (typeof val == "string") {
          data[key] = "";
        } else if (typeof val == "boolean") {
          data[key] = true;
        } else if (typeof val == "object" && val != null) {
          var propertyName = id.toLocaleLowerCase();
          if (
            propertyName.indexOf("detail") > 0 ||
            propertyName.indexOf("item") > 0
          ) {
            data[key] = [];
          }
        }
      });
    },
    refillSelect2(id, items, clmId) {
      var pId = id,
        pItems = items,
        result = null;

      if (pItems != null && pItems != undefined) {

        for (var items of pItems) {
          var value = items[clmId];

          //Set Default-Start
          if (pId == null || pId == undefined || pId == 0) {
            result = items;
            break;
          }
          //Set Default-End

          if (pId == value) {
            result = items;
            break;
          }
        }
      }
      return result;
    },
    refillSelect(id, items) {
      var pId = id,
        pItems = items,
        result = null;
      for (var items of pItems) {
        if (pId == items.value) {
          result = {
            value: items.value,
            text: items.text
          };
          break;
        }
      }
      return result;
    },
    async refillSelectOption(url) {
      var pUrl = url;
      var result = {
        selected: null,
        option: []
      };
      const res = await axios
        .get(url)
        .then(res => {
          result.option = [];
          var isTrue = true;
          for (let items of res.data) {
            var objSingleSelect = {
              value: items.value,
              text: items.text
            };
            if (isTrue) {
              result.selected = objSingleSelect;
              isTrue = false;
            }
            result.option.push(objSingleSelect);
          }
        })
        .catch(error => { });
      return result;
    },
    //Inlin Grid
    isRequiredField(pObj, pRequired) {
      var obj = pObj;
      var required = pRequired;
      var result = false;
      if (obj == undefined || obj.length == 0) {
        result = false;
      } else {
        result = true;
      }
      return result;
    },
    convertTwoDecimal(pVal) {
      var obj = pVal;
      var result = 0.00;
      if (obj > 0) {
        result = parseFloat(Math.round(obj * 100) / 100).toFixed(2);
      }
      return result;
    },
    async getUserRights(ids) {
      var ruleIds = ids;
      var result = null;
      await
        axios
          .get(this.$urlApplication + "GetRoleUserRuleMenu")
          .then(response => {

            if (response != null && response.data != null) {
              var objData = response.data;
              result = objData.filter(w => _.includes(ruleIds, w.id));
            }
          })
          .catch(error => {
            console.log(error);
          })
          .finally(() => { });

      return result;
    },
    getDate: function () {
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth() + 1; //January is 0!
      var yyyy = today.getFullYear();

      if (dd < 10) {
        dd = "0" + dd;
      }

      if (mm < 10) {
        mm = "0" + mm;
      }

      today = mm + "/" + dd + "/" + yyyy;

      return today;
    },
    convInt: function (obj) {
      var pObj = obj;
      var result = 0;
      if (pObj != null && pObj != undefined) {
        result = parseInt(totalDebit) == NaN ? 0 : parseInt(totalDebit)
      }
      return result;
    }
  }
};