import React from "react";
// import Plot from 'react-plotly.js';
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

const Plot = createPlotComponent(plotly);


const Chart = ({ data, layout }) => {
  return (
    <div>
      <Plot data={data} layout={layout}></Plot>
    </div>
  );
};

export default Chart;

