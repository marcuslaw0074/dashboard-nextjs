import React from "react";
import axios from "axios";
import Select from "react-select";
import { connect } from "react-redux";
import QueryApi from "../services/query/queryApi";

import {
  setOptionsSystem,
  setOptionsLocation,
  setOptionsEquipment,
  setOptionsParameter,
  setValuesSystem,
  setValuesLocation,
  setValuesEquipment,
  setValuesParameter,
  setGraphSystem,
  setGraphLocation,
} from "../features/query/querySlice";

const mapStateToProps = (state) => {
  return {
    optionsSystem: state.query.optionsSystem,
    optionsLocation: state.query.optionsLocation,
    optionsEquipment: state.query.optionsEquipment,
    optionsParameter: state.query.optionsParameter,

    valuesSystem: state.query.valuesSystem,
    valuesLocation: state.query.valuesLocation,
    valuesEquipment: state.query.valuesEquipment,
    valuesParameter: state.query.valuesParameter,

    graphSystem: state.query.graphSystem,
    graphLocation: state.query.graphLocation,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setOptionsSystem: (options) => {
      dispatch(setOptionsSystem(options));
    },
    setOptionsLocation: (options) => {
      dispatch(setOptionsLocation(options));
    },
    setOptionsEquipment: (options) => {
      dispatch(setOptionsEquipment(options));
    },
    setOptionsParameter: (options) => {
      dispatch(setOptionsParameter(options));
    },
    setValuesSystem: (options) => {
      dispatch(setValuesSystem(options));
    },
    setValuesLocation: (options) => {
      dispatch(setValuesLocation(options));
    },
    setValuesEquipment: (options) => {
      dispatch(setValuesEquipment(options));
    },
    setValuesParameter: (options) => {
      dispatch(setValuesParameter(options));
    },
    setGraphSystem: (options) => {
      dispatch(setGraphSystem(options));
    },
    setGraphLocation: (options) => {
      dispatch(setGraphLocation(options));
    },
  };
};

class Queries extends React.Component {
  state = {
    show_loc: false,
    show_equip: false,
    show_param: false,
  };

  componentDidMount = () => {
    axios
      .post(
        "http://192.168.100.214:9000/brickapi/v1/graphql/async",
        {
          query: `query($database:String!, $measurement:String!){ allsys(database: $database, measurement: $measurement) }`,
          variables: {
            database: "ArupDemo",
            measurement: "OTP",
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        return response.data.data.allsys;
      })
      .then((res) => {
        const groupByTarget = JSON.parse(res);
        console.log(groupByTarget);
        this.props.setGraphSystem(groupByTarget);
        this.props.setOptionsSystem(
          groupByTarget.Class.map((currElement, index) => {
            return { label: currElement, value: currElement };
          })
        );
      });
  };

  handleApiPostEquips = async (loc, sys) => {
    loc = loc[loc.length - 1].value;
    sys = sys[sys.length - 1].value;
    const result = await axios
      .post(
        "http://192.168.100.214:9000/brickapi/v1/graphql/async",
        {
          query: `query($database:String!, $measurement: String!, $System:String!, $location:String!) { allequipbysysloc(location:$location, system: $System, database:$database, measurement: $measurement){ value label } }`,
          variables: {
            database: "ArupDemo",
            measurement: "OTP",
            System: sys,
            location: loc,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        console.log(response);
        return response.data.data.allequipbysysloc;
      })
      .then((res) => {
        this.props.setOptionsEquipment(res);
      });

    return result;
  };

  handleMultiChangeSyss = async (option) => {
    option = await option;
    if (option.length > 0) {
      if (
        Object.keys(this.props.graphSystem).includes(
          option[option.length - 1].value
        )
      ) {
        this.props.setValuesSystem(option);
        this.props.setOptionsSystem(option);
      } else {
        this.props.setValuesSystem(option);
        this.props.setOptionsSystem([]);
        this.setState({
          show_loc: true,
        });

        await this.handleApiPostLocs(option[option.length - 1].value);
      }
    } else {
      this.props.setValuesSystem(option);
      this.props.setOptionsSystem([{ label: "System", value: "System" }]);
    }
  };

  handleMultiChangeLocs = async (option) => {
    if (option.length > 0) {
      if (
        Object.keys(this.props.graphLocation).includes(
          option[option.length - 1].value
        )
      ) {
        this.props.setValuesLocation(option);
        this.props.setOptionsLocation(option);
      } else {
        this.props.setValuesLocation(option);
        this.props.setOptionsLocation([]);
        this.setState({
          show_equip: true,
        });

        await this.handleApiPostEquips(option, this.props.valuesSystem);
      }
    } else {
      this.props.setValuesLocation(option);
      this.props.setOptionsLocation(option);
    }
  };

  handleMultiChangeEquips = async (option) => {
    this.props.setValuesEquipment(option);
    this.setState({
      show_param: true,
    });

    await this.handleApiPostParas(option);
  };

  handleMultiChangeParas = async (option) => {
    this.props.setValuesParameter(option);
    await this.handleApiPostTimeseries(option);
  };

  handleApiPostLocs = async (system) => {
    const result = await axios
      .post(
        "http://192.168.100.214:9000/brickapi/v1/graphql/async",
        {
          query: `query($database:String!, $measurement:String!, $System:String!){ alllocbysys(database: $database, measurement: $measurement, system: $System) }`,
          variables: {
            database: "ArupDemo",
            measurement: "OTP",
            System: system,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        return response.data.data.alllocbysys;
      })
      .then((res) => {
        const groupByTarget = JSON.parse(res);
        console.log(groupByTarget);
        this.props.setGraphLocation(groupByTarget);
        this.props.setOptionsLocation(
          groupByTarget.Class.map((currElement, index) => {
            return { label: currElement, value: currElement };
          })
        );
      });

    return result;
  };

  handleApiPostParas = async (equips) => {
    var st = "";
    const ls = equips.map((ele) => {
      return ele.value;
    });
    for (let i = 0; i < ls.length; i++) {
      st = st + `"${ls[i]}",`;
    }
    const result = await axios
      .post(
        "http://192.168.100.214:9000/brickapi/v1/graphql/async",
        {
          query: `query ($database: String!, $measurement: String!) { allparambyequip(database: $database, equips: ${JSON.stringify(
            ls
          )}, measurement: $measurement) { label value } }`,
          variables: {
            database: "ArupDemo",
            measurement: "OTP",
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        return response.data.data.allparambyequip;
      })
      .then((res) => {
        this.props.setOptionsParameter(res);
      });

    return result;
  };

  handleApiPostTimeseries = async (paras) => {
    var st = "";
    const ls = paras.map((ele) => {
      return ele.value;
    });
    for (let i = 0; i < ls.length; i++) {
      st = st + `"${ls[i]}",`;
    }

    return result;
  };

  handleApiPostResult = async (option, start, end) => {
    console.log(option);
    let params = option.map((ele) => ele.value);
    var queryStr = `query ($limit: Int!, $database: String!, $measurement: String!) {`;
    for (const index in params) {
      queryStr =
        queryStr +
        ` point${
          index + 1
        }: timeseriesbyprefername(limit: $limit, database: $database, measurement: $measurement, pointName: "${
          params[index]
        }") { prefername time value }`;
    }
    queryStr = queryStr + `}`;
    let query = {
      url: "http://192.168.100.214:9000/brickapi/v1/graphql/async",
      method: "post",
      params: {
        query: queryStr,
        variables: { limit: 10, database: "ArupDemo", measurement: "OTP" },
      },
    };
    QueryApi.axiosApi((res, message) => {
      console.log(res);
      res = res.data;
      if ((res, this.props.id)) {
        console.log(res);
        sessionStorage.removeItem(this.props.id);
        sessionStorage.setItem(this.props.id, JSON.stringify(query));
        let seriesData = Object.values(res).map((ele) => {
          return {
            data: ele.map((el) => el.value),
            type: "line",
            smooth: true,
          };
        });
        let timeList = Object.values(res)[0].map((ele) =>
          new Date(ele.time).toISOString()
        );
        this.props.setOptions((prev) => {
          return {
            ...prev,
            title: {
              ...prev.title,
            },
            xAxis: {
              ...prev.xAxis,
              data: timeList,
              axisLabel: {
                interval: "auto",
                formatter: function (value, index) {
                  return value.split("T")[1].split(".")[0].replace("Z", "");
                },
              },
            },
            series: seriesData,
          };
        });
      }
    }, query);
  };

  render() {
    console.log(this.props);
    return (
      <div className="container">
        <ul>
          <div>
            <label className="label1">Choose_systems</label>
            <Select
              className="selectt"
              name="filters"
              placeholder="Systems"
              value={this.props.valuesSystem}
              options={this.props.optionsSystem}
              onChange={async (option) => {
                await this.handleMultiChangeSyss(option);
              }}
              isMulti
              closeMenuOnSelect={false}
            />
          </div>
          {(true || this.state.show_loc) && (
            <div>
              <label className="label1">Choose_Locations</label>
              <Select
                className="selectt"
                name="filters"
                placeholder="Locations"
                value={this.props.valuesLocation}
                options={this.props.optionsLocation}
                onChange={async (option) => {
                  await this.handleMultiChangeLocs(option);
                }}
                isMulti
                closeMenuOnSelect={false}
              />
            </div>
          )}
          {(true || this.state.show_equip) && (
            <div>
              <label className="label1">Choose_Equipments</label>
              <Select
                className="selectt"
                name="filters"
                placeholder="Equipments"
                value={this.props.valuesEquipment}
                options={this.props.optionsEquipment}
                onChange={async (option) => {
                  await this.handleMultiChangeEquips(option);
                }}
                isMulti
                closeMenuOnSelect={false}
              />
            </div>
          )}
          {(true || this.state.show_param) && (
            <div>
              <label className="label1">Choose_Equipment_Parameters</label>
              <Select
                className="selectt"
                name="Parameters"
                placeholder="Parameters"
                value={this.props.valuesParameter}
                options={this.props.optionsParameter}
                onChange={async (option) => {
                  await this.handleMultiChangeParas(option);
                }}
                closeMenuOnSelect={false}
                isMulti
              />
            </div>
          )}
          <div>
            {(true || this.state.show_param) && (
              <button
                onClick={() =>
                  this.handleApiPostResult(this.props.valuesParameter)
                }
                className="btn btn-secondary btn-sm"
              >
                Submit
              </button>
            )}
          </div>
        </ul>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Queries);
