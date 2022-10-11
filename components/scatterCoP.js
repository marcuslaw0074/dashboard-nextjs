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

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";

const Plot = createPlotComponent(plotly);

const layout = {
  width: 1600,
  height: 800,
  title: "CoP Curve",
};

const StyledTableCell = withStyles({
  root: {
    color: "orange",
  },
})(TableCell);

function GenerateText(map, excludeList) {
  excludeList = Array.isArray(excludeList) ? excludeList : [];
  var time = "time";
  var st = `<b>${time}: </b>${map[time]}<br>`;
  for (let i in map) {
    if (i !== time && !excludeList.includes(i)) {
      st = st + `<b>${i}: </b>${map[i]}<br>`;
    }
  }
  return st;
}

function GenerateMapFromText(text) {
  var textList = text.split("<br>").filter((ele) => ele.trim() !== "");
  console.log(textList);
  var map = {};
  textList.map((ele) => {
    let str = ele.replace("<b>", "").split(": </b>");
    console.log(str);
    map[str[0]] = str[1];
  });
  console.log(map);
  return map;
}

class ScatterTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scatterPoint: [],
    };
  }

  handleFetchPoints = () => {
    if (JSON.stringify(this.props.point) !== "{}") {
      var st = "(";
      Object.keys(this.props.point).map((ele) => {
        st = st + `\"FunctionType\"='${ele}' or `;
      });
      st = st.substring(0, st.length - 3) + ") ";
      var timee = new Date(this.props.point.time).getTime();
      var startTime = new Date(
        timee - 12 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000
      ).toISOString();
      var endTime = new Date(
        timee + 12 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000
      ).toISOString();
      console.log(startTime, endTime);
      console.log(
        "this.props.point.time",
        this.props.point.time,
        new Date(this.props.point.time)
      );
      axios
        .post("http://localhost:8080/api/v1/influxdb/query", {
          database: "Disney",
          host: "18.163.30.4",
          port: 8086,
          query: `SELECT mean(value) FROM hkdl 
          where ${st} and 
          \"EquipmentName\"='CCP1_CH03' and
          (time<'${endTime}' and time>'${startTime}')
          group by FunctionType, time(15m), EquipmentName`,
        })
        .then((res) => {
          var list = [];
          for (let i = 0; i < res.data[0].values.length; i++) {
            var map = { time: res.data[0].values[i][0] };
            for (let j = 0; j < res.data.length; j++) {
              map[res.data[j].tags.FunctionType] = res.data[j].values[i][1];
            }
            list.push(map);
          }
          console.log(res.data, list);
          this.setState(
            (state, props) => {
              state.scatterPoint = list;
              return state;
            },
            () => {
              console.log(this.state);
            }
          );
        });
    }
  };

  componentDidMount = () => {
    this.handleFetchPoints();
  };

  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps.point) === JSON.stringify(this.props.point))
      return;
    this.handleFetchPoints(this.props.point);
  }

  render() {
    console.log("render", this.state);
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {this.state.scatterPoint.length === 0
                ? Object.keys(this.props.point).map((ele, index) => (
                    <TableCell key={index} align="right">
                      {ele}
                    </TableCell>
                  ))
                : Object.keys(this.state.scatterPoint[0]).map((ele, index) => (
                    <TableCell key={index} align="right">
                      {ele}
                    </TableCell>
                  ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.scatterPoint.map((ele, index) => {
              if (
                ele.time.replace("T", " ").replace("Z", "") ===
                this.props.point.time
              ) {
                return (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    {Object.keys(ele).map((el, ind) => (
                      <StyledTableCell key={ind} align="right">
                        {ele[el]}
                      </StyledTableCell>
                    ))}
                  </TableRow>
                );
              }
              return (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {Object.keys(ele).map((el, ind) => (
                    <TableCell key={ind} align="right">
                      {ele[el]}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}

export default (props) => {
  const max = 500;
  const [point, setPoint] = React.useState({});

  return (
    // { display: "flex" }
    <div style={{}}>
      <div>
        <Plot
          data={[
            {
              x: props.data.map((ele, index) =>
                index < max ? ele.Chiller_Capacity_Sensor : null
              ),
              y: props.data.map((ele, index) =>
                index < max ? ele.Chiller_CoP : null
              ),
              mode: "markers",
              marker: {
                color: props.data.map((ele, index) =>
                  index < max
                    ? ele.Chiller_Supply_Condenser_Water_Temperature_Sensor
                    : null
                ),
                size: props.data.map((ele, index) =>
                  index < max
                    ? (ele.Chiller_Chilled_Water_Supply_Temperature_Sensor -
                        4) *
                      5
                    : null
                ),
                colorscale: [
                  ["0.000000000000", "rgb(49,54,149)"],
                  ["0.111111111111", "rgb(69,117,180)"],
                  ["0.222222222222", "rgb(116,173,209)"],
                  ["0.333333333333", "rgb(171,217,233)"],
                  ["0.444444444444", "rgb(224,243,248)"],
                  ["0.555555555556", "rgb(254,224,144)"],
                  ["0.666666666667", "rgb(253,174,97)"],
                  ["0.777777777778", "rgb(244,109,67)"],
                  ["0.888888888889", "rgb(215,48,39)"],
                  ["1.000000000000", "rgb(165,0,38)"],
                ],
              },
              text: props.data.map((ele) => GenerateText(ele, ["Size"])),
              hovertemplate: "%{text}",
            },
          ]}
          layout={layout}
          onClick={({ points, event }) => {
            setPoint({
              // x: points[0].x,
              // y: points[0].y,
              ...GenerateMapFromText(points[0].text),
            });
            console.log(GenerateMapFromText(points[0].text), event);
          }}
        ></Plot>
      </div>
      <div>
        <ScatterTable point={point}></ScatterTable>
      </div>
    </div>
  );
};
