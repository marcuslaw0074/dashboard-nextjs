import React from "react";
import plotly from "plotly.js/dist/plotly";
import createPlotComponent from "react-plotly.js/factory";
import Head from 'next/head';
import Script from 'next/script';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';

var dataJson = require("./DemoData.json");
// var dataJson = require("./modeTableData.json");

// dataJson = demoJson

const replaceDemo = (demoJson, newJson) => {
  return demoJson.map((ele, index) => newJson.map((ele2, index) => ele2))
}

const Plot = createPlotComponent(plotly);

const layout2 = {
  width: 1200,
  height: 800,
  title: "Mode Table",
};

const alertFunction = (data) => {
  console.log(data)
  console.log("Cooling Load: ", data.points[0].x, "\n",
              "Wet Bulb Temp:", data.points[0].y, "\n", 
              "CoP :", data.points[0]["marker.color"], "\n", 
              )
  Router.push(`/analytics/test?coolingload=${data.points[0].x}&wetbulb=${data.points[0].y}`)
  // alert('data:\n\n'+data[0]);
}

var trace1 = {
  // xaxis: [...new Set(dataJson.map((ele) => ele["CL_bin"]))].reverse(),
  x: dataJson.map((ele) => ele["CL_bin"]),
  y: dataJson.map((ele) => ele["WB_bin"]),
  mode: "markers",
  type: "scatter",
  name: "Team A",
  text: dataJson.map((ele) => ele["Text"]),
  marker: {
    color: dataJson.map((ele) => ele["CoP_mean"]),
    size: dataJson.map((ele) =>
    ele["Count"]===0?0:(ele["Count"] + 20)/2
    ),
    colorbar: { title: "CoP", titleside: "Top" },
  },
};

var data = [trace1];

export default () => <Plot data={data} layout={layout2} onClick={alertFunction}/>;
