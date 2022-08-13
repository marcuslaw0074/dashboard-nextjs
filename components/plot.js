import React from "react";
import plotly from "plotly.js/dist/plotly";
import createPlotComponent from "react-plotly.js/factory";

const dataJson = require("./modeTableFinalData.json");

const Plot = createPlotComponent(plotly);

const layout2 = {
  width: 800,
  height: 600,
  title: "Data Labels Hover",
};

var trace1 = {
  xaxis: [...new Set(dataJson.map((ele) => ele["CL_bin"]))].reverse(),
  x: dataJson.map((ele) => ele["CL_bin"]),
  y: dataJson.map((ele) => ele["WB_bin"]),
  mode: "markers",
  type: "scatter",
  name: "Team A",
  text: dataJson.map((ele) => ele["Text"]),
  marker: {
    color: dataJson.map((ele) => ele["CoP_mean"]),
    size: dataJson.map((ele) =>
      ele["Count"] > 40
        ? 40
        : ele["Count"] < 5
        ? 5
        : ele["Count"] === 0
        ? 0
        : ele["Count"]
    ),
    colorbar: { title: "CoP", titleside: "Top" },
  },
};

var data = [trace1];

export default () => <Plot data={data} layout={layout2} />;
