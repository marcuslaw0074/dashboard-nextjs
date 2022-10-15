import React from "react";
import axios from "axios";
import { Provider } from "react-redux";
import { store } from "../../app/store";
import dynamic from "next/dynamic";
// import ReactDashboard from "../../components/dashboard"

const ReactDashboard = dynamic(import("../../components/dashboard"), {
  ssr: false,
});

export default () => {
  return (
    <Provider store={store}>
      <ReactDashboard></ReactDashboard>
    </Provider>
  );
};
