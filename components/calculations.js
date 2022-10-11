import axios from "axios";
import React from "react";
import dynamic from "next/dynamic";
import { connect } from "react-redux";
import SubQueries from "./subSelect";

const Chart = dynamic(() => import("./chart"), {
  ssr: false,
});

const initialVariableState = {
  rhs: "",
  lhs: "",
};

const VariableTable = (props) => {
  return (
    <div className="App" style={{ display: "flex" }}>
      <table style={{ backgroundColor: "purple" }}>
        <tbody>
          <tr style={{ overflow: "hidden", display: "flex" }}>
            <th style={{ width: "150px", color: "white" }}>Name</th>
            <th style={{ width: "300px", color: "white" }}>Expression</th>
            <th style={{ width: "300px", color: "white" }}>Variables</th>
          </tr>
        </tbody>
        <tbody>{props.children}</tbody>
      </table>
    </div>
  );
};

const initialExpressionState = "(b-a)*c*d";

const Variable = ({ handleAddExpression }) => {
  const [expression, setExpression] = React.useState(initialVariableState);
  return (
    <div>
      <input
        type="text"
        id="message"
        name="message"
        onChange={(e) =>
          setExpression((state) => {
            return { ...state, rhs: e.target.value.trim() };
          })
        }
        value={expression.rhs}
      />
      =
      <input
        type="text"
        id="message"
        name="message"
        onChange={(e) =>
          setExpression((state) => {
            if (e.target.value[e.target.value.length - 1] === ".") {
              return { ...state, lhs: e.target.value };
            } else {
              let val = parseFloat(e.target.value);
              if (!isNaN(val)) {
                return { ...state, lhs: val };
              } else {
                return { ...state, lhs: e.target.value };
              }
            }
          })
        }
        value={expression.lhs}
      />
      <button
        onClick={() => {
          if (expression.lhs !== "" && expression.rhs !== "") {
            handleAddExpression(expression);
            setExpression(initialVariableState);
          } else {
            alert("incomplete");
          }
        }}
      >
        Add
      </button>
    </div>
  );
};

const VariableList = ({ expressions, handleDeleteExpression }) => {
  return (
    <div style={{ display: "inline-block" }}>
      {expressions.map((ele, index) => (
        <div key={index}>
          <span style={{ display: "inline-block", width: "300px" }}>
            {ele.rhs + "=" + ele.lhs}
          </span>
          <button onClick={() => handleDeleteExpression(index)}>X</button>
        </div>
      ))}
    </div>
  );
};

class NameRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name || "",
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    if (event.target.value !== this.state.name) {
      this.setState({ name: event.target.value }, () => {
        setTimeout(
          function clear(func, event, name) {
            try {
              func(event, name);
              console.log(`updating name: ${name}`);
            } catch (e) {
              console.log(e);
            }
            clearTimeout(this);
            return clear;
          },
          500,
          this.props.handleSubmitName,
          event,
          this.state.name
        );
      });
    }
  }

  render() {
    return (
      <input
        value={this.state.name}
        onChange={this.handleChange}
        style={{
          background:
            "linear-gradient(45deg, rgb(155, 148, 230) 30%, rgba(76, 149, 182, 0.2) 90%)",
          border: 0,
          borderRadius: 0,
          boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
          display: "flex",
          padding: "0 10px",
          width: "200px",
          fontSize: "20px",
          color: "white",
        }}
      />
    );
  }
}

const VariableRow = ({
  name,
  expressions,
  handleDeleteExpression,
  handleAddExpression,
  handleSubmitExpression,
  handleSubmitName,
}) => {
  return (
    <tr style={{ overflow: "hidden", display: "flex" }}>
      <th style={{ display: "flex" }}>
        <>
          <NameRow handleSubmitName={handleSubmitName} name={name}></NameRow>
        </>
      </th>
      <th style={{ display: "flex" }}>
        <Expression
          handleSubmitExpression={handleSubmitExpression}
        ></Expression>
      </th>
      <th>
        <>
          <div
            style={{
              background:
                "linear-gradient(45deg, rgb(155, 148, 230) 30%, rgba(76, 149, 182, 0.2) 90%)",
              border: 0,
              borderRadius: 3,
              boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
              padding: "0 30px",
              fontSize: "15px",
              color: "white",
            }}
          >
            <Variable handleAddExpression={handleAddExpression}></Variable>
            <VariableList
              handleDeleteExpression={handleDeleteExpression}
              expressions={expressions}
            ></VariableList>
          </div>
        </>
      </th>
    </tr>
  );
};

function AddExpression(expressions, exp) {
  for (let ex in expressions) {
    if (expressions[ex].rhs === exp.rhs) {
      expressions[ex] = exp;
      return expressions;
    }
  }
  expressions.push(exp);
  return expressions;
}

class Expression extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expression: initialExpressionState,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    if (event.target.value !== this.state.expression) {
      this.setState({ expression: event.target.value }, () => {
        setTimeout(
          function clear(func, event, expression) {
            try {
              func(event, expression);
              console.log(`updating expression: ${expression}`);
            } catch (e) {
              console.log(e);
            }
            clearTimeout(this);
            return clear;
          },
          500,
          this.props.handleSubmitExpression,
          event,
          this.state.expression
        );
      });
    }
  }

  render() {
    return (
      // <form
      // // onSubmit={(event) =>
      // //   this.props.handleSubmitExpression(event, this.state.expression)
      // // }
      // >
      //   <label>
      //     <textarea
      //       value={this.state.expression}
      //       onChange={this.handleChange}
      //       style={{
      //         background:
      //           "linear-gradient(45deg, rgb(155, 148, 230) 30%, rgba(76, 149, 182, 0.2) 90%)",
      //         border: 0,
      //         borderRadius: 3,
      //         boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
      //         height: 50,
      //         width: 400,
      //         padding: "0 30px",
      //         fontSize: "20px",
      //         color: "purple",
      //       }}
      //     />
      //     {/* <button className="btn" type="submit">
      //       Update
      //     </button> */}
      //   </label>
      // </form>
      <input
        value={this.state.expression}
        onChange={this.handleChange}
        style={{
          background:
            "linear-gradient(45deg, rgb(155, 148, 230) 30%, rgba(76, 149, 182, 0.2) 90%)",
          border: 0,
          borderRadius: 3,
          boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
          // height: 50,
          // width: 400,
          width: "200px",
          display: "flex",
          padding: "0 30px",
          fontSize: "20px",
          color: "white",
        }}
      />
    );
  }
}

class QueryDataList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: false,
      data: [],
    };
  }

  handleFetchApiList = () => {
    var len = this.props.allData.length;
    this.props.allData.map((ele, index) => {
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
        .then((response) => {
          this.setState(
            (state, props) => {
              state.data = [...state.data, response.data];
              return state;
            },
            () => {
              if (this.state.data.length === len) {
                this.props.handleDataChartList(this.state.data);
                this.setState((state, props) => {
                  state.data = [];
                  return state;
                });
              }
            }
          );
          return response.data;
        });
    });
  };

  render() {
    return (
      <div>
        <button onClick={() => this.handleFetchApiList()}>Query</button>
      </div>
    );
  }
}

class QueryData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: false,
    };
  }

  handleFetchApi = () => {
    let constmap = {};
    let mapping = {};
    console.log(this.props);
    this.props.expressions.map((ele) => {
      if (typeof ele.lhs == "number") {
        constmap[ele.rhs] = ele.lhs;
      } else {
        mapping[ele.rhs] = ele.lhs;
      }
    });
    axios
      .post("http://localhost:8080/api/v1/influxdb/ruleengine", {
        constmap: JSON.stringify(constmap),
        database: "Disney",
        endTime: "'2018-04-02T15:04:05.000Z'",
        expression: this.props.expression,
        host: "18.163.30.4",
        mapping: JSON.stringify(mapping),
        measurement: "hkdl",
        name: "Rule_1",
        port: 8086,
        startTime: "'2018-04-01T15:04:05.000Z'",
      })
      .then((response) => {
        console.log(response);
        this.props.handleDataChart(response.data);
        return response.data;
      });
  };

  render() {
    return (
      <div>
        <button onClick={() => this.handleFetchApi()}>Query</button>
      </div>
    );
  }
}

const layout = {
  width: 1000,
  height: 600,
  title: "heatmap",
};

class CalculationTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expressions: [
        {
          rhs: "a",
          lhs: "CCP1 CH2 Supply Temp.(Deg C)",
        },
        {
          rhs: "b",
          lhs: "CCP1 CH2 Return Temp.(Deg C)",
        },
        {
          rhs: "c",
          lhs: 4.2,
        },
        {
          rhs: "d",
          lhs: "CCP1 CH2 Water Flow (l/s)",
        },
      ],
      expression: initialExpressionState,
      name: "",
      data: [],
    };
  }

  handleDataChart = (data) => {
    this.setState(
      {
        ...this.state,
        data: [
          ...this.state.data,
          {
            x: data.values.map((ele) => ele[0]),
            y: data.values.map((ele) => ele[1]),
            type: "scatter",
          },
        ],
      },
      () => {
        console.log(this.state.data);
      }
    );
  };

  handleSubmitExpression = (event, state) => {
    this.setState(
      {
        ...this.state,
        expression: state,
      },
      () => {
        console.log(this.state);
      }
    );
    event.preventDefault();
  };

  handleSubmitName = (event, state) => {
    this.setState(
      {
        ...this.state,
        name: state,
      },
      () => {
        console.log(this.state);
      }
    );
    event.preventDefault();
  };

  handleAddExpression = (exp) => {
    this.setState(
      {
        ...this.state,
        expressions: AddExpression(this.state.expressions, exp),
      },
      () => {
        console.log(this.state);
      }
    );
  };

  handleDeleteExpression = (index) => {
    this.setState(
      {
        ...this.state,
        expressions: this.state.expressions.filter((ele, ind) => {
          console.log(ele, ind, index);
          return ind !== index;
        }),
      },
      () => {
        console.log(this.state);
      }
    );
  };

  render() {
    console.log(this.state.expression, this.state.expressions);
    return (
      <div>
        <VariableRow
          handleSubmitName={this.handleSubmitName}
          handleAddExpression={this.handleAddExpression}
          expressions={this.state.expressions}
          handleDeleteExpression={this.handleDeleteExpression}
          handleSubmitExpression={this.handleSubmitExpression}
        ></VariableRow>
      </div>
    );
  }
}

export default class CalculationEngine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expressions: [
        {
          rhs: "a",
          lhs: "CCP1 CH2 Supply Temp.(Deg C)",
        },
        {
          rhs: "b",
          lhs: "CCP1 CH2 Return Temp.(Deg C)",
        },
        {
          rhs: "c",
          lhs: 4.2,
        },
        {
          rhs: "d",
          lhs: "CCP1 CH2 Water Flow (l/s)",
        },
      ],
      expression: initialExpressionState,
      name: "",
      data: [],
      allData: [
        {
          expressions: [
            {
              rhs: "a",
              lhs: "CCP1 CH2 Supply Temp.(Deg C)",
            },
            {
              rhs: "b",
              lhs: "CCP1 CH2 Return Temp.(Deg C)",
            },
            {
              rhs: "c",
              lhs: 4.2,
            },
            {
              rhs: "d",
              lhs: "CCP1 CH2 Water Flow (l/s)",
            },
          ],
          expression: initialExpressionState,
          name: "",
          data: [],
        },
      ],
    };
  }

  handleDataChart = (data) => {
    this.setState(
      {
        ...this.state,
        data: [
          ...this.state.data,
          {
            x: data.values.map((ele) => ele[0]),
            y: data.values.map((ele) => ele[1]),
            type: "scatter",
          },
        ],
      },
      () => {
        console.log(this.state.data);
      }
    );
  };

  handleDataChartList = (data) => {
    this.setState(
      (state, props) => {
        state.data = data.map((ele) => {
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

  handleSubmitExpression = (event, state) => {
    this.setState(
      {
        ...this.state,
        expression: state,
      },
      () => {
        console.log(this.state);
      }
    );
    event.preventDefault();
  };

  handleSubmitExpressionList = (index) => (event, expression) => {
    this.setState((state, props) => {
      state.allData[index].expression = expression;
      return;
    });
    event.preventDefault();
  };

  handleSubmitName = (event, state) => {
    this.setState(
      {
        ...this.state,
        name: state,
      },
      () => {
        console.log(this.state);
      }
    );
    event.preventDefault();
  };

  handleSubmitNameList = (index) => (event, name) => {
    this.setState((state, props) => {
      state.allData[index].name = name;
      return state;
    });
    event.preventDefault();
  };

  handleAddExpressionList = (index) => (exp) => {
    this.setState(
      (state, props) => {
        state.allData[index].expressions = AddExpression(
          state.allData[index].expressions,
          exp
        );
        console.log(
          state,
          "stateee",
          AddExpression(state.allData[index].expressions, exp),
          state.allData[index].expressions,
          exp
        );
        return state;
      },
      () => {
        console.log(this.state);
      }
    );
  };

  handleAddExpression = (exp) => {
    this.setState(
      {
        ...this.state,
        expressions: AddExpression(this.state.expressions, exp),
      },
      () => {
        console.log(this.state);
      }
    );
  };

  handleDeleteExpressionList = (i) => (index) => {
    this.setState((state, props) => {
      state.allData[i].expressions = state.allData[i].expressions.filter(
        (ele, ind) => {
          console.log(ele, ind, index);
          return ind !== index;
        }
      );
      return state;
    });
  };

  handleDeleteExpression = (index) => {
    this.setState(
      {
        ...this.state,
        expressions: this.state.expressions.filter((ele, ind) => {
          console.log(ele, ind, index);
          return ind !== index;
        }),
      },
      () => {
        console.log(this.state);
      }
    );
  };

  handleAddRow = () => {
    this.setState((state, props) => {
      state.allData = [
        ...state.allData,
        {
          expressions: [
            {
              rhs: "a",
              lhs: "CCP1 CH2 Supply Temp.(Deg C)",
            },
            {
              rhs: "b",
              lhs: "CCP1 CH2 Return Temp.(Deg C)",
            },
            {
              rhs: "c",
              lhs: 4.2,
            },
            {
              rhs: "d",
              lhs: "CCP1 CH2 Water Flow (l/s)",
            },
          ],
          expression: initialExpressionState,
          name: "",
          data: [],
        },
      ];
      return state;
    });
  };

  render() {
    console.log(this.state.allData);
    return (
      <div style={{}}>
        {/* <Expression
          handleSubmitExpression={this.handleSubmitExpression}
        ></Expression>
        <Variable handleAddExpression={this.handleAddExpression}></Variable>
        <VariableList
          expressions={this.state.expressions}
          handleDeleteExpression={this.handleDeleteExpression}
        ></VariableList> */}
        {/* <VariableRow
          handleSubmitName={this.handleSubmitName}
          handleAddExpression={this.handleAddExpression}
          expressions={this.state.expressions}
          handleDeleteExpression={this.handleDeleteExpression}
          handleSubmitExpression={this.handleSubmitExpression}
        ></VariableRow> */}

        <div style={{ display: "inline-block" }}>
          <Chart data={this.state.data} layout={layout}></Chart>
          <button onClick={this.handleAddRow}>Add </button>
          <VariableTable>
            <>
              {this.state.allData.map((ele, index) => {
                return (
                  <VariableRow
                    key={index}
                    name={ele.name}
                    handleSubmitName={this.handleSubmitNameList(index)}
                    handleAddExpression={this.handleAddExpressionList(index)}
                    expressions={ele.expressions}
                    handleDeleteExpression={this.handleDeleteExpressionList(
                      index
                    )}
                    handleSubmitExpression={this.handleSubmitExpressionList(
                      index
                    )}
                  ></VariableRow>
                );
              })}
            </>
          </VariableTable>
          <QueryDataList
            allData={this.state.allData}
            handleDataChartList={this.handleDataChartList}
          ></QueryDataList>
        </div>
        <div style={{ display: "inline-block", width: "400px" }}>
          <SubQueries></SubQueries>
        </div>
        {/* <QueryData
          expression={this.state.expression}
          expressions={this.state.expressions}
          handleDataChart={this.handleDataChart}
        ></QueryData> */}
        {/* <Chart data={this.state.data} layout={layout}></Chart> */}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    queryData: state.queryData,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setQueryData: (data) => {
      dispatch(setQueryData(data));
    },
    setQueryConfig: (config) => {
      dispatch(setQueryConfig(config));
    },
  };
};

CalculationEngine = connect(
  mapStateToProps,
  mapDispatchToProps
)(CalculationEngine);
