import React from "react";

const API_CONFIG = {
  DASHBOARD_DATABASE: "ArupDemo",
  DASHBOARD_DATABASE_TABLE: "OTP"
}

const SET_QUERY_TIME_SERIES_DATA_AGGR = (
  params,
  aggrinter,
  aggrtype,
  aggrnum
) => {};

const SET_QUERY_TIME_SERIES_DATA = (
  params,
  startTime,
  endTime,
  limit = 100
) => {
  if (!params || !params.length) {
    return "";
  }
  var startStr = "";
  if (typeof startTime === 'string') {
    startStr = `, startTime: "${startTime}"`;
  }
  var endStr = "";
  if (typeof endTime === 'string') {
    endStr = `, endTime: "${endTime}"`;
  }
  let queryStr = "query { \n";
  params.map((item, index) => {
    let num = index + 1;
    let rowStr = `point${num}:timeseriesbyprefername(limit:${limit}, 
      pointName:"${item}"${startStr}${endStr}, database:"${API_CONFIG.DASHBOARD_DATABASE}"
      , measurement:"${API_CONFIG.DASHBOARD_DATABASE_TABLE}"){
        prefername
        time
        value
      }`;
    queryStr = queryStr + "\n" + rowStr;
  });
  queryStr = queryStr + "}";
  return queryStr;
};

function FOMATNUMBER(num) {
  var numb = Number(num);
  if (isNaN(numb)) {
    return 0;
  } else {
    return numb;
  }
}

function autoAddZero(num) {
  let digit = FOMATNUMBER(num);
  if (digit >= 0 && digit < 10) {
    return "0" + digit;
  }
  return digit;
}

const CHART_TIME_FORMAT = (ticks, max, min, space) => (value, index) => {
  if (min && max && ticks && space) {
    const range = max - min;
    const secPerTick = range / ticks / 1000;
    const oneDay = 86400010;
    const oneYear = 31536000000;
    var date = new Date(value);

    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    // console.log(secPerTick, range)
    // console.log(secPerTick <= 45,
    //   range <= oneDay,
    //   secPerTick <= 80000,
    //   range <= oneYear,
    //   secPerTick <= 31536000)
    if (index === 0) {
      // return ""
    };
    if (secPerTick <= 45) {
      var timeStr = `${autoAddZero(h)}:${autoAddZero(m)}:${autoAddZero(s)}`; 
      return " ".repeat(space) + timeStr + " ".repeat(space); // 'HH:mm:ss'
    }
    if (range <= oneDay) {
      var timeStr = `${autoAddZero(h)}:${autoAddZero(m)}`;
      return " ".repeat(space) + timeStr + " ".repeat(space); // 'HH:mm'
    }
    if (secPerTick <= 80000) {
      var timeStr = `${autoAddZero(month + 1)}/${autoAddZero(day)} ${autoAddZero(h)}:${autoAddZero(m)}`;
      return " ".repeat(space) + timeStr + " ".repeat(space); // 'MM/DD HH:mm'
    }
    if (range <= oneYear) {
      var timeStr = `${autoAddZero(month + 1)}/${autoAddZero(day)}`;
      return " ".repeat(space) + timeStr + " ".repeat(space); // 'MM/DD'
    }
    if (secPerTick <= 31536000) {
      var timeStr = `${year.toString()}-${autoAddZero(month + 1)}`;
      return " ".repeat(space) + timeStr + " ".repeat(space); // 'YYYY-MM'
    }
    return year.toString(); // 'YYYY'
  } else if (min && max && ticks) {
    const range = max - min;
    const secPerTick = range / ticks / 1000;
    const oneDay = 86400010;
    const oneYear = 31536000000;
    var date = new Date(value);

    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    // console.log(secPerTick, range)
    // console.log(secPerTick <= 45,
    //   range <= oneDay,
    //   secPerTick <= 80000,
    //   range <= oneYear,
    //   secPerTick <= 31536000)
    if (secPerTick <= 45) {
      return `${autoAddZero(h)}:${autoAddZero(m)}:${autoAddZero(s)}`; // 'HH:mm:ss'
    }
    if (range <= oneDay) {
      return `${autoAddZero(h)}:${autoAddZero(m)}`; // 'HH:mm'
    }
    if (secPerTick <= 80000) {
      return `${autoAddZero(month + 1)}/${autoAddZero(day)} ${autoAddZero(h)}:${autoAddZero(m)}`; // 'MM/DD HH:mm'
    }
    if (range <= oneYear) {
      return `${autoAddZero(month + 1)}/${autoAddZero(day)}`; // 'MM/DD'
    }
    if (secPerTick <= 31536000) {
      return `${year.toString()}-${autoAddZero(month + 1)}`; // 'YYYY-MM'
    }
    return year.toString(); // 'YYYY'
  }
};
