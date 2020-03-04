import moment from 'moment'

export default {
    toLocaleString(number) {
        return number.toLocaleString()
    },
    momentDate(date) {
        //var result = date.split('T')[0]; //
        //debugger
        //return result;
        return moment(date).format('YYYY-MM-DD hh:mm A')
    },
    momentConvertDate(date) {
        return moment(date).format('YYYY-MM-DD')
    },
    momentConvertDateTime(date) {
        return moment(date).format('YYYY-MM-DD hh:mm A')
    },
    momentDateDash(date) {
        var result = date;
        if (result == undefined) {
            result = "---------------------------------";
        }
        else {
            result = moment(date).format('YYYY-MM-DD hh:mm A')
        }
        return result
    },
    momentDateOnly(date) {
        var pObj = date;
        var result = pObj;


        if (result == undefined) {
            result = "------------------";
        }
        else {
            //result = moment(date).format('YYYY-MM-DD hh:mm A')
            result = moment(date).format("YYYY-MM-DD");
        }


        //if (pObj.length > 0) {
       
        //}
        return result;
    },
    momentTime(date) {
        var obj = moment(date).format("LT");
        obj = obj.split(' ')[0]
        //debugger
        return obj;
      },
}