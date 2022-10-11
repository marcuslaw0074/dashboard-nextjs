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
  initalHeatmapDataAsync,
} from "../features/tool/toolSlice";

const data = require("../assets/DemoHeatmapData.json");

const Plot = createPlotComponent(plotly);

const layout = {
  width: 1600,
  height: 800,
  title: "heatmap",
};

function trans(dict) {
  var ls = [];
  for (var key in dict) {
    if (typeof dict[key] === "number") {
      ls.push(dict[key]);
    }
  }
  return ls;
}

function Trans(data) {
  var ls = [];
  var keys = [];
  var time = [];
  var sam = data[0];
  for (let key in sam) {
    if (key !== "Time") {
      ls.push(data.map((ele) => ele[key]));
      keys.push(key);
    } else {
      time = data.map((ele) => ele[key]);
    }
  }
  return {
    x: time,
    y: keys,
    z: ls,
    type: "heatmap",
    // colorscale: 'YlGnBu',
    colorscale: [
      ["0.0", "rgb(49,54,149)"],
      ["0.111111111111", "rgb(69,117,180)"],
      ["0.222222222222", "rgb(116,173,209)"],
      ["0.333333333333", "rgb(171,217,233)"],
      ["0.444444444444", "rgb(224,243,248)"],
      ["0.555555555556", "rgb(254,224,144)"],
      ["0.666666666667", "rgb(253,174,97)"],
      ["0.777777777778", "rgb(244,109,67)"],
      ["0.888888888889", "rgb(215,48,39)"],
      ["1.0", "rgb(165,0,38)"],
    ],
  };
}

const HeatMapPlot = () => {
  console.log(Trans(data));

  const dataa = useSelector(selectPartialState("data"));
  const dispatch = useDispatch();
  const status = useSelector(selectPartialState("status"));
  console.log(dataa);
  React.useEffect(() => {
    if (!dataa.length) {
      console.log("fetching data...");
      dispatch(
        initalHeatmapDataAsync({
          database: "hkdl",
          host: "18.163.30.4",
          port: 8086,
          query: `SELECT * FROM hkdl WHERE \"FunctionType\"='Chiller_Chilled_Water_Supply_Temperature_Sensor'
                    AND \"id\"=~/CCP1/ GROUP BY id LIMIT 10`,
        })
      );
    }
  }, []);
  // data = [
  //   {
  //     z: [[1, null, 30, 50, 1], [20, 1, 60, 80, 30], [30, 60, 1, -10, 20]],
  //     x: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  //     y: ['Morning', 'Afternoon', 'Evening'],
  //     type: 'heatmap',
  //     hoverongaps: false
  //   }
  // ];
  return (
    <div>
      <Plot
        // data={data}
        data={[Trans(data)]}
        layout={layout}
      ></Plot>
    </div>
  );
};

export default () => {
  return (
    <Provider store={store}>
      <HeatMapPlot></HeatMapPlot>
    </Provider>
  );
};
