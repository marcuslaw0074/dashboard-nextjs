import React from "react";
import plotly from "plotly.js/dist/plotly";
import createPlotComponent from "react-plotly.js/factory";
import { useSelector, useDispatch } from "react-redux";
import Head from "next/head";
import Script from "next/script";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { Provider } from "react-redux";
import { store } from "../app/store";

import {
  incrementByAmount,
  selectPartialState,
  initalDataAsync,
} from "../features/tool/toolSlice";

var dataJson = require("../assets/DemoData.json");

const replaceDemo = (demoJson, newJson) => {
  return demoJson.map((ele, index) => newJson.map((ele2, index) => ele2));
};

const Plot = createPlotComponent(plotly);

const layout = {
  width: 1200,
  height: 800,
  title: "Mode Table",
};

const toAnalytics = (data) => {
  console.log(data);
  console.log(
    "Cooling Load: ",
    data.points[0].x,
    "\n",
    "Wet Bulb Temp:",
    data.points[0].y,
    "\n",
    "CoP :",
    data.points[0]["marker.color"],
    "\n"
  );
  Router.push(
    `/analytics?CL_bin=${data.points[0].x}&WB_bin=${data.points[0].y}`
  );
  // alert('data:\n\n'+data[0]);
};

var trace = {
  x: dataJson.map((ele) => ele["CL_bin"]),
  y: dataJson.map((ele) => ele["WB_bin"]),
  mode: "markers",
  type: "scatter",
  name: "Team A",
  text: dataJson.map((ele) => ele["Text"]),
  marker: {
    color: dataJson.map((ele) => ele["CoP_mean"]),
    size: dataJson.map((ele) =>
      ele["Count"] === 0 ? 0 : (ele["Count"] + 20) / 2
    ),
    colorbar: { title: "CoP", titleside: "Top" },
    colorscale: "YlGnBu",
  },
};

var data = [trace];

const toJsonData = (dataJson) => {
  dataJson = JSON.stringify(dataJson)
    .replaceAll("texts", "text")
    .replaceAll("counts", "count");
  return JSON.parse(dataJson);
};

const toPlotData = (dataJson) => {
  console.log(1341,dataJson)
  var trace = {
    x: dataJson.map((ele) => ele["cL_Bin"]),
    y: dataJson.map((ele) => ele["wB_Bin"]),
    mode: "markers",
    type: "scatter",
    name: "Team A",
    text: dataJson.map((ele) => ele["text"]),
    marker: {
      color: dataJson.map((ele) => ele["coP_mean"]),
      size: dataJson.map((ele) =>
        ele["count"] === 0 ? 0 : (ele["count"] + 20) / 2
      ),
      colorbar: { title: "CoP", titleside: "Top" },
      colorscale: "YlGnBu",
    },
  };
  console.log(trace)
  return [trace];
};

const PlotGraph = () => {
  const data = useSelector(selectPartialState("data"));
  const dispatch = useDispatch();

  React.useEffect(() => {
    console.log("fetching data...");
    dispatch(initalDataAsync());
  }, []);

  return (
    <div>
      {data.length ? (
        <Plot data={toPlotData(toJsonData(data))} layout={layout} onClick={toAnalytics} />
      ) : null}
    </div>
  );
};

export default () => {
  return (
    <Provider store={store}>
      <PlotGraph></PlotGraph>
    </Provider>
  )
}