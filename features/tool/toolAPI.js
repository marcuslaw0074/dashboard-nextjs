import axios from "axios";

export function fetchData() {
  return new axios.get("https://localhost:7043/api/ModeTable").then(function (
    response
  ) {
    console.log(response.data);
    return response.data;
  });
}
