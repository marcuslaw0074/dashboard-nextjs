import axios from "axios";

export function fetchData() {
  return new axios.get("https://localhost:7137/api/ModeTable").then(function (
    response
  ) {
    // console.log(response.data);
    return response.data;
  });
}

export function fetchCoPData({ measurement }) {
    // console.log(measurement)
    // console.log(`https://localhost:7137/api/CoP/byMeasurement?measurement=${measurement.measurement}`)
  return new axios.get(
    `https://localhost:7137/api/CoP/byMeasurement?measurement=${measurement.measurement}`
  ).then(function (response) {
    // console.log(response.data);
    return response.data;
  });
}
