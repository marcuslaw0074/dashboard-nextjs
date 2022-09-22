import axios from "axios";

const QueryApi = {
  axiosApi: (callBack, { url, method, params, headers = null }) => {
    let config = {
      method: method,
      url: url,
      headers: headers === null ? {} : headers,
    };
    // check token
    const token = sessionStorage.getItem("token") || "";
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    let newParams = JSON.parse(JSON.stringify(params));
    if (method === "get") {
      config.params = newParams;
    } else {
      config.data = newParams;
    }
    // console.log(config);
    axios(config)
      .then((res) => {
        // console.log(res)
        if (res.data) {
          const obj = res.data;
          callBack(obj);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  },
  asyncApi: (callBack, { url, method, params, headers = null }) => {
    let config = {
      method: method,
      url: url,
      headers: headers === null ? {} : headers,
    };
    let newParams = JSON.parse(JSON.stringify(params));
    if (method === "get") {
      config.params = newParams;
    } else {
      config.data = newParams;
    }

    return new axios(config)
      .then((res) => callBack(res))
      .catch((e) => {
        console.log(e);
      });
  },
};

export default QueryApi;
