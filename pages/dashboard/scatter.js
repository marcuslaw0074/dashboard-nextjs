import React from "react";
import { Provider } from "react-redux";
import dynamic from "next/dynamic";
import { store } from "../../app/store";

const DemoScatterCoP = require("../../assets/DemoScatterCoP.json");

const ScatterCoP = dynamic(() => import("../../components/scatterCoP"), {
  ssr: false,
});

export default () => {
  return (
    <Provider store={store}>
      <ScatterCoP data={DemoScatterCoP}></ScatterCoP>
    </Provider>
  );
};
