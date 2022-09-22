import axios from "axios";
import dateFormat from "dateformat";
import QueryApi from "../../services/query/queryApi";

const querySliceApi = {
  systemApi: () => {
    let query = {
      url: "http://192.168.100.214:9000/brickapi/v1/graphql/async",
      method: "post",
      params: {
        query: `query($database:String!, $measurement:String!){ allsys(database: $database, measurement: $measurement) }`,
        variables: { database: "ArupDemo", measurement: "OTP" },
      },
      headers: {
        "Content-Type": "application/json",
      },
    };

    return QueryApi.asyncApi(function (res, mes) {
      console.log(res);
      return res.data.allsys;
    }, query);
  },
};

export default querySliceApi;
