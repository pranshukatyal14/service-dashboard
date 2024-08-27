var moment = require("moment");

var FMT = "MM/DD/YYYY HH:mm:ss";
const GMT_TIME_ZONE = "Asia/Kolkata";

exports.isEmpty = function (value) {
    return typeof value == "undefined" || value === null;
};

exports.dynamicsort = function (property, order) {
    var sort_order = 1;
    if (order === "desc") {
        sort_order = -1;
    }
    return function (a, b) {
        // a should come before b in the sorted order
        if (a[property] < b[property]) {
            return -1 * sort_order;
            // a should come after b in the sorted order
        } else if (a[property] > b[property]) {
            return 1 * sort_order;
            // a and b are the same
        } else {
            return 0 * sort_order;
        }
    };
};

exports.enumerateDaysBetweenDates = function (startDate, endDate) {
    let dates = [];

    let currDate = moment(startDate).utcOffset("+05:30").startOf("day");
    let lastDate = moment(endDate).add(1, "days").utcOffset("+05:30").startOf("day");

    for (let m = moment(currDate); m.isBefore(lastDate); m.add(1, "days")) {
        dates.push(m.format("YYYY-MM-DD"));
    }
    return dates;
};

exports.gmtDate = function (value, format) {
    if (!isEmpty(value)) {
        if (isEmpty(format)) {
            format = FMT;
        }
        return moment.tz(new Date(value), format, GMT_TIME_ZONE).format(format); // Production
    }
    return value;
};

function isEmpty(value) {
    return (typeof value == "string" && !value.trim()) || typeof value == "undefined" || value === null;
}

exports.convertRubyToJson = function (str) {
    var newstr = "";
    let result = [];
    for (var i = 0; i < str.length; i++) {
        if (!(str[i] == "\n")) {
            newstr += str[i];
        }
    }
    let splitStr = newstr.split("!ruby/hash:ActiveSupport::HashWithIndifferentAccess");
    for (let j = 1; j < splitStr.length; j++) {
        splitStr[j] = splitStr[j].trim();
        if (splitStr[j].charAt(splitStr[j].length - 1) == "-") {
            splitStr[j] = splitStr[j].substr(0, splitStr[j].length - 1);
        }
        let subStr = splitStr[j].split("  ");
        let obj = {
            steps: 0,
            calories: 0,
            distance: 0,
            hour_of_the_day: 0,
            date: "",
            active_time: 0,
        };
        for (let k = 0; k < subStr.length; k++) {
            let resString = subStr[k].split(":");
            switch (resString[0]) {
                case "steps":
                    obj.steps = Number(resString[1].trim());
                    break;
                case "calories":
                    obj.calories = Number(resString[1].trim());
                    break;
                case "distance":
                    obj.distance = Number(resString[1].trim());
                    break;
                case "hour_of_the_day":
                    obj.hour_of_the_day = Number(resString[1].trim());
                    break;
                case "active_time":
                    obj.active_time = Number(resString[1].trim());
                    break;
                case "date":
                    obj.date = resString[1].trim();
                    break;
                default:
                    null;
            }
        }
        result.push(obj);
    }
    return result;
};

exports.better_then_x = function (value = 0) {
    let better = 0;
    better = Math.floor(value / 100);

    let min = 2;
    let max = 9;
    let random = Math.floor(Math.random() * (max - min + 1) + min);

    if (better > 10 && better <= 90) {
        better = better + random;
    }

    if (better > 90) {
        better = 90 + random;
    }

    return better;
};
