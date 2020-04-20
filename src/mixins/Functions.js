
export const generalFunctions = {

  methods: {
    convInt: function (obj) {
      var pObj = obj;
      var result = 0;
      if (pObj != null && pObj != undefined) {
        result = isNaN(parseInt(pObj)) ? 0 : parseInt(pObj);
      }
      return result;
    }
  }
};