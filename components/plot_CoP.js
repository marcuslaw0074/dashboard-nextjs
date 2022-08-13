import React from "react";
import plotly from "plotly.js/dist/plotly";
import createPlotComponent from "react-plotly.js/factory";
import Head from "next/head";
import Script from "next/script";
import Link from "next/link";
import Router, { useRouter } from "next/router";

var dataJson = require("../assets/DemoData.json");
const Plot = createPlotComponent(plotly);

const layout = {
  width: 600,
  height: 400,
  title: "CoP vs CDWET",
};

const splitTuple = (data) => {
    data = data.replaceAll("(", "").replaceAll(")", "");
    data = data.split(",").map(ele => parseFloat(ele)).reduce((partialSum, a) => partialSum + a, 0);
    return data
};

export default ({ data }) => {
  const [chartType, setChartType] = React.useState();
  console.log(data);
  let res = dataJson.filter(
    (ele) =>
      ele["CL_bin"] === data["CL_bin"] && ele["WB_bin"] === data["WB_bin"]
  )[0];
  console.log(res);
  res = res.Text.replaceAll("<b>", "")
    .replaceAll("</b>", "")
    .split("Strategy:")
    .filter((ele) => ele.length)
    .map((ele) =>
      ele.split(
        "<br><br>  _CoP|______________CT_Seq|___________CH_CoP|Cdwt|Ct|<br>"
      )
    );
  let keys = ["Strategy", "AP", "CoP", "Count"];
  let key2 = ["CoP", "CT_Seq", "CH_CoP", "CDWT", "Count"];
  let pattern = / [0-9.]*/g;
  var res1 = res
    .map((ele) =>
      ele[0]
        .split("<br>")
        .map((ele) =>
          ele
            .match(pattern)
            .map((ele) => ele.replaceAll(" ", ""))
            .filter((ele) => ele.length)
        )
        .filter((ele) => ele.length === 1)
        .map((ele) => ele[0])
    )
    .map((ele) => Object.fromEntries(keys.map((k, i) => [k, ele[i]])));
  console.log(res1);
  var res2 = res
    .map((ele) => ele[1])
    .map((ele) =>
      ele
        .split("<br>")
        .map((ele) => ele.replaceAll(" ", ""))
        .filter((ele) => ele.length)
        .map((ele) =>
          Object.fromEntries(key2.map((k, i) => [k, ele.split("|")[i]]))
        )
    );
  console.log(res2);
  let res3 = [];
  res1.map((ele, index) => res3.push({ ...ele, ...{ result: res2[index] } }));
  console.log(res3);
  return (
    <div>
      {res3.map((ele, index) => (
        <div key={index}>
          <p>
            Strategy: {ele.Strategy}, AP_mean: {ele.AP}, CoP: {ele.CoP}, Count:{" "}
            {ele.Count}
          </p>
          <Plot
            key={index}
            data={[
              {
                x: ele.result.map((el) => parseFloat(el["CDWT"])),
                y: ele.result.map((el) => parseFloat(el["CoP"])),
                text: ele.result.map((el) => `Count: ${el["Count"]}<br>CT_Total: ${splitTuple(el["CT_Seq"])}`),
                // type: "bar",
                marker: {
                    size: ele.result.map((el) => ((parseFloat(el["Count"])+2)*3)),
                    color: ele.result.map(el => splitTuple(el["CT_Seq"])),
                    colorbar: { title: "CT_Total", titleside: "Top" },
                },
                mode: "markers",
              },
            ]}
            layout={layout}
          ></Plot>
        </div>
      ))}
    </div>
  );
};
