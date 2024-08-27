// var moment = require('moment');

var moment = require("moment-timezone");

var FMT = "MM/DD/YYYY HH:mm:ss";
const GMT_TIME_ZONE = "UTC";

exports.defaultTimezone = "Asia/Kolkata";
exports.highlight_format = "DD MMM YYYY";
exports.date_format = "YYYY-MM-DD";
exports.day_format = "dddd";

exports.isEmpty = function (value) {
    return (typeof value == "string" && !value.trim()) || typeof value == "undefined" || value === null;
};

exports.dateFormat = function (value, format) {
    if (!isEmpty(value)) {
        if (isEmpty(format)) {
            format = "YYYY-MM-DD";
        }
        value = new Date(value);
        return moment(value).format(format);
    }
    return value;
};

exports.addDays = function (strDate, days, format) {
    if (!isEmpty(strDate)) {
        if (isEmpty(format)) {
            format = "YYYY-MM-DD";
        }
        strDate = new Date(strDate);
        strDate = strDate.setDate(strDate.getDate() + days);
        return moment(strDate).format(format);
    }
    return strDate;
};

exports.modifyDateFormat = function (value, format, timezone) {
    if (!isEmpty(value)) {
        if (isEmpty(format)) {
            format = FMT;
        }
        if (isEmpty(timezone)) {
            timezone = GMT_TIME_ZONE;
        }
        return moment.tz(new Date(value), format, timezone).format(format); // Production
    }
    return value;
};
exports.getCurrentTimeDiffBetweenUserTimezonesAndUTCInSec = function (userTimeZone) {
    console.log("userTimeZone: ", userTimeZone);
    return getOffsetBetweenTimezonesForDate("UTC", userTimeZone) / 1000;
};
function convertDateToAnotherTimeZone(date, timezone) {
    const dateString = date.toLocaleString("en-US", {
        timeZone: timezone,
    });
    return new Date(dateString);
}

function getOffsetBetweenTimezonesForDate(timezone1, timezone2) {
    var timezone1Date = convertDateToAnotherTimeZone(moment.utc().endOf("day"), timezone1);
    var timezone2Date = convertDateToAnotherTimeZone(new Date(), timezone2);
    var diff = timezone1Date.getTime() - timezone2Date.getTime();
    // console.log("timezone1Date: ", timezone1Date);
    // console.log("timezone2Date: ", timezone2Date);
    // console.log("diff: ", diff);
    if (diff < 0) {
        timezone1Date = timezone1Date.setTime(timezone1Date.getTime() + 1 * 86400000);
        // console.log("After add 1 day timezone1Date: ", timezone1Date);
        diff = timezone1Date - timezone2Date.getTime();
        // console.log("After diff: ", diff);
    }
    return diff;
}

// exports.modifyDateFormat(new Date(), "YYYY-MM-DD HH:mm:ss")

function isEmpty(value) {
    return (typeof value == "string" && !value.trim()) || typeof value == "undefined" || value === null;
}
