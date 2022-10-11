import axios from "axios";

export function fetchQueryTimeseries(req) {
  console.log(req);
  return new axios.post(`http://localhost:8080/api/v1/influxdb/query`, req
  ).then(function (response) {
    console.log(response.data);
    return response.data;
  });
}

