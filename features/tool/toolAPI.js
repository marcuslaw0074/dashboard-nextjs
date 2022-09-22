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
    `https://localhost:7137/api/CoP/byMeasurement/${measurement.measurement}`
  ).then(function (response) {
    // console.log(response.data);
    return response.data;
  });
}

export function fetchEnergyData({ databaseName, queryString }) {
  // console.log(measurement)
  // console.log(`https://localhost:7137/api/CoP/byMeasurement?measurement=${measurement.measurement}`)
  let data = Object.entries({ databaseName, queryString });
  data = data.map(
    ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`
  );
  let query = data.join("&");
  console.log(query);
  return new axios.post(`https://localhost:7137/api/energy?${query}`, {
    databaseName,
    queryString,
  }).then(function (response) {
    // console.log(response.data);
    return response.data;
  });
}
