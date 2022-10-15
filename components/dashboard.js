import React from "react";
import RGL, { WidthProvider, Responsive } from "react-grid-layout";
import { useSelector, useDispatch } from "react-redux";
import {
  setComponents,
  selectPage,
  setQueryData,
  setQueryConfig,
} from "../features/dashboard/dashboardSlice";
import { connect } from "react-redux";
import * as echarts from "echarts/core";
import { BarChart, LineChart } from "echarts/charts";
import "react-resizable/css/styles.css";
// import { Navigate } from "react-router-dom";
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
} from "echarts/components";
import ReactEChartsCore from "echarts-for-react/lib/core";
import { CanvasRenderer } from "echarts/renderers";
import QueryApi from "../services/query/queryApi";
import AutoRefresh from "./autoRefresh";
import DefaultChartOption from "./options"

const ReactGridLayout = WidthProvider(RGL);
const ResponsiveReactGridLayout = WidthProvider(Responsive);

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  BarChart,
  CanvasRenderer,
  LineChart,
]);

const mapStateToProps = (state) => {
  // console.log(state.page);
  return {
    components: state.page.components,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setComponents: (components) => {
      dispatch(setComponents(components));
    },
  };
};

const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
const cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };

const reSize = (width, height) => {
  if (width > breakpoints.lg) {
    return Math.floor(width / cols.lg);
  } else if (width > breakpoints.md) {
    return Math.floor(width / cols.md);
  } else if (width > breakpoints.sm) {
    return Math.floor(width / cols.sm);
  } else if (width > breakpoints.xs) {
    return Math.floor(width / cols.xs);
  } else if (width > breakpoints.xxs) {
    return Math.floor(width / cols.xxs);
  }
};

function autoAddZero(num) {
  let digit = FOMATNUMBER(num);
  if (digit >= 0 && digit < 10) {
    return "0" + digit;
  }
  return digit;
}
function FOMATNUMBER(num) {
  var numb = Number(num);
  if (isNaN(numb)) {
    return 0;
  } else {
    return numb;
  }
}

export const CHART_TIME_FORMAT =
  (ticks, max, min, n = 0) =>
  (value, index) => {
    if (min && max && ticks) {
      const range = max - min;
      const secPerTick = range / ticks / 1000;
      const oneDay = 86400010;
      const oneYear = 31536000000;
      var date = new Date(value);

      let year = date.getFullYear();
      let month = date.getMonth();
      let day = date.getDate();
      let h = date.getHours();
      let m = date.getMinutes();
      let s = date.getSeconds();
      let repeatSp = ` `.repeat(n);
      if (secPerTick <= 45) {
        return (
          repeatSp +
          `${autoAddZero(h)}:${autoAddZero(m)}:${autoAddZero(s)}` +
          repeatSp
        ); // 'HH:mm:ss'
      }
      if (range <= oneDay) {
        return repeatSp + `${autoAddZero(h)}:${autoAddZero(m)}` + repeatSp; // 'HH:mm'
      }
      if (secPerTick <= 80000) {
        return (
          repeatSp +
          `${autoAddZero(month + 1)}/${autoAddZero(day)} ${autoAddZero(
            h
          )}:${autoAddZero(m)}` +
          repeatSp
        ); // 'MM/DD HH:mm'
      }
      if (range <= oneYear) {
        return (
          repeatSp + `${autoAddZero(month + 1)}/${autoAddZero(day)}` + repeatSp
        ); // 'MM/DD'
      }
      if (secPerTick <= 31536000) {
        return (
          repeatSp + `${year.toString()}-${autoAddZero(month + 1)}` + repeatSp
        ); // 'YYYY-MM'
      }
      return repeatSp + year.toString() + repeatSp; // 'YYYY'
    }
  };

class EchartGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queryURL: "http://192.168.100.214:9000/brickapi/v1/graphql/async",
      timeseriesData: {},
      option: {},
      editChart: false,
      queryConfig: {},
    };
  }

  componentDidMount = () => {
    this.initChartData();
  };

  initChartData = () => {
    let query = {
      url: this.state.queryURL,
      method: "post",
      params: {
        query: `query ($limit: Int!, $database: String!, $measurement: String!) {
            point1: timeseriesbyprefername(limit: $limit, database: $database, measurement: $measurement, pointName: "AHU-05-01.Water Supply Temperature.Value") {
              prefername
              time
              value
            }
            point2: timeseriesbyprefername(limit: $limit, database: $database, measurement: $measurement, pointName: "AHU-05-01.Water Return Temperature.Value") {
              prefername
              time
              value
            }
          }
          `,
        variables: { limit: 10, database: "ArupDemo", measurement: "OTP" },
      },
    };
    const graphqlJson = require("../assets/graphqlData.json");
    query = graphqlJson.data[Number(this.props.index)].query;
    this.setState({ queryConfig: query });
    QueryApi.axiosApi((res, message) => {
      console.log(res);
      res = res.data;
      this.setState({ timeseriesData: res }, () => {
        console.log(this.state.timeseriesData);
        this.setState((prevState, props) => {
          let seriesData = Object.values(this.state.timeseriesData).map(
            (ele) => {
              return {
                data: ele.map((el) => el.value),
                type: "line",
                smooth: true,
              };
            }
          );
          let width = window.innerWidth;
          let ticks = width / 100;
          let timeList = Object.values(this.state.timeseriesData)[0]
            .map((el) => el.time)
            .map((ele) => new Date(ele));
          var timeMin = timeList[0];
          var timeMax = timeList[timeList.length - 1];
          timeList = timeList.map((ele) => ele.toISOString());
          // console.log(timeList)
          return {
            ...prevState,
            option: {
              // ...DefaultChartOption,
              tooltip: {
                trigger: "axis",
                axisPointer: {
                  type: "cross",
                  label: {
                    backgroundColor: "#6a7985",
                  },
                },
              },
              xAxis: {
                type: "category",
                data: timeList,
                axisLabel: {
                  interval: "auto",
                  formatter: ticks
                    ? CHART_TIME_FORMAT(ticks, timeMax, timeMin)
                    : function (value, index) {
                        return value;
                      },
                },
              },
              yAxis: {
                type: "value",
              },
              series: seriesData,
            },
          };
        });
      });
    }, query);
  };

  generateOptions = () => {
    var option = {
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: "line",
          smooth: true,
        },
      ],
    };
  };

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if (
      this.props.ele.w !== prevProps.ele.w ||
      this.props.ele.h !== prevProps.ele.h ||
      this.props.autoRefresh !== prevProps.autoRefresh
    ) {
      this.initChartData();
    }
  };

  handleEditChart = () => {
    sessionStorage.setItem(
      this.props.index,
      JSON.stringify(this.state.queryConfig)
    );
    this.props.setQueryData(this.state.timeseriesData);
    this.props.setQueryConfig(this.state.queryConfig);
    this.setState((prevState, props) => {
      return {
        ...prevState,
        editChart: !prevState.editChart,
      };
    });
  };

  render() {
    console.log(this.props);
    return (
      <div>
        {/* <button
          onClick={this.handleEditChart}
          style={{ float: "right", marginRight: "2%", marginTop: "2%" }}
        >
          Edit
        </button> */}
        <ReactEChartsCore
          style={{
            width:
              reSize(window.innerWidth, window.innerHeight) * this.props.ele.w -
              this.props.padding.width * 2,
            height:
              this.props.rowHeight * this.props.ele.h +
              2 * this.props.padding.height * (this.props.ele.h - 1),
            display: "flex",
          }}
          echarts={echarts}
          option={this.state.option}
          notMerge={true}
          lazyUpdate={true}
          theme={"theme_name"}
        />
      </div>
    );
  }
}

const mapStateToPropsEchartGrid = (state) => {
  return {
    queryData: state.page.queryData,
  };
};

const mapDispatchToPropsEchartGrid = (dispatch, ownProps) => {
  return {
    setQueryData: (data) => {
      console.log(data);
      dispatch(setQueryData(data));
    },
    setQueryConfig: (config) => {
      console.log(config);
      dispatch(setQueryConfig(config));
    },
  };
};

EchartGrid = connect(
  mapStateToPropsEchartGrid,
  mapDispatchToPropsEchartGrid
)(EchartGrid);

class ReactLayout extends React.Component {
  state = {
    layout: [
      {
        x: 1,
        y: 0,
        w: 2,
        h: 2,
        draggableHandle: ".react-grid-dragHandleExample",
      },
      {
        x: 1,
        y: 0,
        w: 2,
        h: 2,
        draggableHandle: ".react-grid-dragHandleExample",
      },
      {
        x: 1,
        y: 0,
        w: 2,
        h: 2,
        draggableHandle: ".react-grid-dragHandleExample",
      },
    ],
    padding: { width: 5, height: 5 },
    rowHeight: 100,
  };

  onLayoutChange = (layout) => {
    // console.log(layout);
    this.setState({ layout });
  };

  componentDidMount = () => {
    // console.log(this.props);
    this.initPageData();
  };

  initPageData = () => {
    var json = require("../assets/getPageCompConfigList.json");
    const pageConfig = json.data;
    let components = [];
    // console.log(pageConfig);

    for (let i = 0; i < pageConfig.length; i++) {
      let item = JSON.parse(pageConfig[i].componentJson);
      if (JSON.stringify(item) == "{}" || typeof item === "string") {
        return;
      }

      item.x = item.styles.x;
      item.y = item.styles.y;
      item.w = item.styles.w;
      item.h = item.styles.h;
      item.i = i;

      let row = pageConfig[i];
      item.pageCompConfigId = row.pageCompConfigId;
      item.componentId = row.componentId;

      components.push(item);
    }
    // console.log(components);
    this.props.setComponents(components);
  };

  handleOnResize = (e, comp) => {
    console.log(e, comp);
    const result = e.find((ele) => ele.i === comp.i);
    this.setState((prev) => {
      return {
        ...prev,
        width:
          reSize(window.innerWidth, window.innerHeight) * result.w -
          this.state.padding.width * 2,
        height:
          this.state.rowHeight * result.h +
          2 * this.state.padding.height * (result.h - 1),
      };
    });
    return;
  };

  render() {
    // console.log(this.state.width, this.state.height);
    console.log(this.props);
    return (
      <>
        <ResponsiveReactGridLayout
          className="layout"
          onLayoutChange={this.onLayoutChange}
          layout={this.state.layout}
          // layouts={this.state.layout}
          onResize={this.handleOnResize}
          containerPadding={[
            this.state.padding.width,
            this.state.padding.height,
          ]}
          breakpoints={breakpoints}
          cols={cols}
          rowHeight={this.state.rowHeight}
          isResizable={true}
          // style={{width:"80%", height:800}}
        >
          {this.state.layout.map((ele, index) => {
            return (
              <div
                key={`key_${index}`}
                style={{ backgroundColor: "rgb(220, 238, 245)" }}
                data-grid={ele}
              >
                <AutoRefresh name={ele} onclick={() => {}} noautorefresh>
                  <EchartGrid
                    ele={ele}
                    index={index}
                    padding={this.state.padding}
                    rowHeight={this.state.rowHeight}
                  ></EchartGrid>
                </AutoRefresh>
              </div>
            );
          })}
        </ResponsiveReactGridLayout>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReactLayout);
