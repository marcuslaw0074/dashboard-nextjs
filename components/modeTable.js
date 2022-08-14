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
import axios from "axios";

import {
  incrementByAmount,
  selectPartialState,
  initalDataAsync,
  copDataAsync,
  energyDataAsync,
} from "../features/tool/toolSlice";

import styles from "./modeTable.module.css";

const replaceDemo = (demoJson, newJson) => {
  return demoJson.map((ele, index) => newJson.map((ele2, index) => ele2));
};

const Plot = createPlotComponent(plotly);

const layout = {
  width: 1200,
  height: 800,
  title: "Mode Table",
};

const colorbar = [
  // ["0.0", "rgb(165,0,38)"],
  // ["0.111111111111", "rgb(215,48,39)"],
  // ["0.222222222222", "rgb(244,109,67)"],
  // ["0.333333333333", "rgb(253,174,97)"],
  // ["0.444444444444", "rgb(254,224,144)"],
  // ["0.555555555556", "rgb(234,243,238)"],
  // ["0.555555555556", "rgb(224,243,248)"],
  ["0.666666666667", "rgb(171,217,233)"],
  ["0.777777777778", "rgb(116,173,209)"],
  ["0.888888888889", "rgb(69,117,180)"],
  ["1.0", "rgb(49,54,149)"],
];

const toAnalytics = (data) => {
  // console.log(data);
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
    `/analytics?cL_Bin=${data.points[0].x}&wB_Bin=${data.points[0].y}`
  );
};

const toCHillerCoP = (measurement) => {
  // console.log(measurement);
  Router.push(`/chillercop?measurement=${measurement}`);
};

const toCHillerEn = (chillerNo) => {
  // console.log(measurement);
  Router.push(`/energy?chillerNo=${chillerNo}`);
};

const toJsonData = (dataJson) => {
  dataJson = JSON.stringify(dataJson)
    .replaceAll("texts", "text")
    .replaceAll("counts", "count");
  return JSON.parse(dataJson);
};

const toPlotData = (dataJson) => {
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
  // console.log(trace);
  return [trace];
};

const measurementList = [
  // "WCC_1",
  // "WCC_2",
  // "WCC_3",
  // "WCC_4",
  // "WCC_5",
  // "WCC_6",
  // "WCC_7",
  // "WCC_8",
  "WCC_9",
  "WCC_11",
  "WCC_13",
];

const energyList = measurementList.map(ele => `${ele.replace("_", "")}_Chiller_Energy`);

const PlotGraph = () => {
  const data = useSelector(selectPartialState("data"));
  const dispatch = useDispatch();
  const status = useSelector(selectPartialState("status"));

  React.useEffect(() => {
    console.log(status);
  }, [status]);

  React.useEffect(() => {
    // let data = { databaseName: "Sands", queryString: "select * from sid_chiller limit 1" }
    // data = Object.entries(data);
    // data = data.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
    // let query = data.join('&');
    // console.log(query)
    // axios.post()
    if (!data.length) {
      console.log("fetching data...");
      dispatch(initalDataAsync());
      dispatch(energyDataAsync({databaseName:"Sands", queryString:"select * from energy_chiller limit 100"}))
    }
  }, []);

  return (
    <div>
      {status === "loading" ? (
        <div>LOADING...</div>
      ) : data.length ? (
        <div className={styles.divClass}>
          <Plot
            data={toPlotData(toJsonData(data))}
            layout={layout}
            onClick={toAnalytics}
          />
          <div>
            <ul>
              Chiller CoP Curve
              {measurementList.map((ele, index) => (
                <li key={ele}>
                  <button
                    onClick={() => toCHillerCoP(ele)}
                    style={{ backgroundColor: colorbar[index][1], color: "#ffffff" }}
                  >
                    {ele}
                  </button>
                </li>
              ))}
            </ul>
            <ul>
              Energy Plot
              {energyList.map((ele, index) => (
                <li key={ele}>
                  <button
                    onClick={() => toCHillerEn(ele)}
                    style={{ backgroundColor: colorbar[index][1], color: "#ffffff" }}
                  >
                    {ele}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default () => {
  return (
    <Provider store={store}>
      <PlotGraph></PlotGraph>
    </Provider>
  );
};
