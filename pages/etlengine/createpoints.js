import React from "react";
import Select from "react-select";
import Link from "next/link";
import { Provider } from "react-redux";
import { store } from "../../app/store";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Button from "@mui/material/Button";

import EditRuleDialog from "../../components/dialog";
import axios from "axios";

const DemoRuleTable = require("../../assets/DemoRuleTable.json");

const AddExpressionRow = (props) => {
  return (
    <>
      <EditRuleDialog
        name={"Add Rows"}
        key={props.data.length + 1}
        data={props.data}
        title={"Edit New Rule"}
        handleUpdatetableRow={props.handleUpdatetableRow}
      ></EditRuleDialog>
    </>
  );
};

const DemoTable = (props) => {
  const handleDemoData = () => {
    props.handleDemoData(DemoRuleTable);
  };
  return (
    <>
      <Button onClick={() => handleDemoData()}>Demo Rule Table</Button>
    </>
  );
};

const SaveTable = (props) => {
  const handleSaveData = () => {
    axios
      .post(
        "http://localhost:8080/api/v1/redis/set",
        {
          host: "192.168.100.214",
          key: "ruleTable",
          port: 36379,
          value: JSON.stringify(props.data),
        },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((res) => {
        return res.data;
      });
  };

  return (
    <>
      <Button onClick={() => handleSaveData()}>Save Rule Table</Button>
    </>
  );
};

function GenerateNewId(data) {
  var idList = data.map((ele) => ele.id);
  return Math.floor(Math.max(...idList) + 1);
}

class BasicTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allData: [],
    };
  }

  handleUpdateAllData = (data) => {
    this.setState((state, props) => {
      state.allData = data;
      return state;
    });
  };

  handleDemoData = (data) => {
    this.setState((state, props) => {
      state.allData = data;
      return state;
    });
  };

  componentDidMount = () => {
    if (this.state.allData.length == 0) {
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
    } else {
    }
  };

  handleDeleteTableRow = (index) => {
    this.setState((state, props) => {
      state.allData = state.allData.filter((ele, ind) => ind !== index);
      return state;
    });
  };

  handleDeleteRowVariable = (index) => (ind) => {
    this.setState((state, props) => {
      state.allData[index].expressions = state.allData[
        index
      ].expressions.filter((ele, indd) => indd !== ind);
      return state;
    });
  };

  handleUpdatetableRow = (index) => (data) => {
    this.setState((state, props) => {
      // for (let da of state.allData) {
      //   if (da.expression === data.expression) {
      //     return state
      //   }
      // }
      if (index < state.allData.length) {
        state.allData[index] = data;
      } else {
        state.allData.push(data);
      }
      return state;
    });
  };

  render() {
    return (
      <>
        <Link href="/etlengine/dashboards">Dashboard</Link>
        <AddExpressionRow
          data={{
            expressions: [],
            expression: "",
            name: "",
            id: GenerateNewId(this.state.allData),
            show: true,
          }}
          handleUpdatetableRow={this.handleUpdatetableRow(
            this.state.allData.length
          )}
        ></AddExpressionRow>
        <SaveTable data={this.state.allData}></SaveTable>
        <DemoTable handleDemoData={this.handleDemoData}></DemoTable>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell align="right">Name</TableCell>
                <TableCell align="right">Expression</TableCell>
                <TableCell align="right">Variables</TableCell>
                <TableCell align="right">Update</TableCell>
                <TableCell align="right">Show</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.allData.map((row, index) => {
                return (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="right">{row.name}</TableCell>
                    <TableCell align="right">{row.expression}</TableCell>
                    <TableCell align="right">
                      {
                        <>
                          {row.expressions.map((ele, index) => {
                            return (
                              <div key={index}>
                                {ele.rhs + "=" + ele.lhs}
                                <br></br>
                              </div>
                            );
                          })}
                        </>
                      }
                    </TableCell>
                    <TableCell align="right">
                      {
                        <>
                          <EditRuleDialog
                            name={"Edit"}
                            key={index}
                            index={index}
                            data={row}
                            handleUpdatetableRow={this.handleUpdatetableRow(
                              index
                            )}
                          ></EditRuleDialog>
                          <Button
                            variant="outlined"
                            onClick={() => this.handleDeleteTableRow(index)}
                          >
                            Delete
                          </Button>
                        </>
                      }
                    </TableCell>
                    <TableCell align="right">
                      <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label"></FormLabel>
                        <RadioGroup
                          aria-labelledby="demo-radio-buttons-group-label"
                          defaultValue="female"
                          name="radio-buttons-group"
                          value={row.show}
                          onChange={(event) => {
                            this.setState((state, props) => {
                              state.allData[index].show = event.target.value;
                              return state;
                            });
                          }}
                        >
                          <FormControlLabel
                            value={true}
                            control={<Radio />}
                            label="show"
                          />
                          <FormControlLabel
                            value={false}
                            control={<Radio />}
                            label="hide"
                          />
                        </RadioGroup>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  }
}

export default () => {
  return (
    <Provider store={store}>
      <BasicTable></BasicTable>
    </Provider>
  );
};