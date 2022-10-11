import axios from "axios";
import React from "react";
import dynamic from "next/dynamic";
import { useRouter, withRouter } from "next/router";

import Button from "@mui/material/Button";

const Chart = dynamic(() => import("../../components/chart"), {
  ssr: false,
});

const layout = {
  width: 1200,
  height: 900,
  title: "Example",
};

export default withRouter(
  class Dashboard extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        data: [],
        ruleTable: [],
        chartData: [],
      };
    }

    handleDataChartList = (data) => {
      this.setState(
        (state, props) => {
          state.chartData = data.map((ele) => {
            return {
              x: ele.values.map((el) => el[0]),
              y: ele.values.map((el) => el[1]),
              type: "scatter",
              name: ele.tags.id,
            };
          });
          return state;
        },
        () => {
          console.log(this.state);
        }
      );
    };

    handleFetchTimeseries = () => {
      this.state.ruleTable.map((ele, index) => {
        let constmap = {};
        let mapping = {};
        ele.expressions.map((el) => {
          if (typeof el.lhs == "number") {
            constmap[el.rhs] = el.lhs;
          } else {
            mapping[el.rhs] = el.lhs;
          }
        });
        axios
          .post("http://localhost:8080/api/v1/influxdb/ruleengine", {
            constmap: JSON.stringify(constmap),
            database: "Disney",
            endTime: "'2018-04-02T15:04:05.000Z'",
            expression: ele.expression,
            host: "18.163.30.4",
            mapping: JSON.stringify(mapping),
            measurement: "hkdl",
            name: ele.name,
            port: 8086,
            startTime: "'2018-04-01T15:04:05.000Z'",
          })
          .then((res) => {
            this.setState(
              (state, props) => {
                state.data = [...state.data, res.data];
                return state;
              },
              () => {
                if (this.state.data.length === this.state.ruleTable.length) {
                  this.handleDataChartList(this.state.data);
                }
              }
            );
          });
      });
    };

    handleUpdateAllData = (data) => {
      this.setState(
        (state, props) => {
          state.ruleTable = data;
          return state;
        },
        () => {
          this.handleFetchTimeseries();
          console.log(this.state);
        }
      );
    };

    handleFetchRuleTable = () => {
      axios
        .post(
          "http://localhost:8080/api/v1/redis/get",
          {
            host: "192.168.100.214",
            key: "ruleTable",
            port: 36379,
          },
          { headers: { "Content-Type": "application/json" } }
        )
        .then((res) => {
          return JSON.parse(res.data.result);
        })
        .then((res) => this.handleUpdateAllData(res));
    };

    componentDidMount = () => {
      this.handleFetchRuleTable();
    };

    render() {
      return (
        <>
          <Button
            onClick={() => {
              this.props.router.push("/ruleengine/createRules", undefined, {
                shallow: true,
              });
            }}
          >
            Back{" "}
          </Button>
          <Chart data={this.state.chartData} layout={layout}></Chart>
        </>
      );
    }
  }
);
