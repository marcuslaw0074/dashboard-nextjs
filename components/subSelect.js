import React from "react";
import axios from "axios";
import Select from "react-select";

export default class SubQueries extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      equipmentList: [],
      equipmentNameList: [],
      functionTypeList: [],
      parameterList: [],

      valuesEquipment: [],
      valuesequipmentName: [],
      valuesFunctionType: [],
      valuesParameter: [],
      valuesIds: [],
    };
  }

  initialization = () => {
    var graphql = "allequiptypewatersys";
    axios
      .post(
        "http://localhost:8080/query",
        {
          query: `query($database:String!, $measurement:String!, $host: String!, $port: Int!){
          ${graphql}(database: $database, measurement: $measurement, host:$host, port:$port){
            value
            label
          }
        }`,
          variables: {
            database: "Disney",
            measurement: "hkdl",
            host: "18.163.30.4",
            port: 7691,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        return response.data.data[graphql];
      })
      .then((res) => {
        this.setState(
          (state, props) => {
            state.equipmentList = res;
            return state;
          },
          () => {
            console.log(this.state);
          }
        );
      });
    var graphqll = "allidbywatersys";
    axios
      .post(
        "http://localhost:8080/query",
        {
          query: `query($database:String!, $measurement:String!, $host: String!, $port: Int!){
          ${graphqll}(database: $database, measurement: $measurement, host:$host, port:$port){
            value
            label
          }
        }`,
          variables: {
            database: "Disney",
            measurement: "hkdl",
            host: "18.163.30.4",
            port: 7691,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        return response.data.data[graphqll];
      })
      .then((res) => {
        this.setState(
          (state, props) => {
            state.parameterList = res;
            return state;
          },
          () => {
            console.log(this.state);
          }
        );
      });
    var graphqlll = "allfunctypebywatersys";
    axios
      .post(
        "http://localhost:8080/query",
        {
          query: `query($database:String!, $measurement:String!, $host: String!, $port: Int!){
            ${graphqlll}(database: $database, measurement: $measurement, host:$host, port:$port){
              value
              label
            }
          }`,
          variables: {
            database: "Disney",
            measurement: "hkdl",
            host: "18.163.30.4",
            port: 7691,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        return response.data.data[graphqlll];
      })
      .then((res) => {
        this.setState(
          (state, props) => {
            state.functionTypeList = res;
            return state;
          },
          () => {
            console.log(this.state);
          }
        );
      });
  };

  componentDidMount = () => {
    this.initialization();
  };

  handleClearAllList = () => {
    this.setState(
      {
        equipmentList: [],
        equipmentNameList: [],
        functionTypeList: [],
        parameterList: [],

        valuesEquipment: [],
        valuesequipmentName: [],
        valuesFunctionType: [],
        valuesParameter: [],
      },
      () => {
        this.initialization();
      }
    );
  };

  handleUpdateFuncTypeList = (funcType) => {
    this.setState((state, props) => {
      state.functionTypeList = funcType;
      console.log(state, "state");
      return state;
    });
  };

  handleUpdateParameterList = (parameter) => {
    this.setState((state, props) => {
      state.parameterList = parameter;
      console.log(state, "state");
      return state;
    });
  };

  handleUpdateEquipNameList = (equipName) => {
    this.setState((state, props) => {
      state.equipmentNameList = equipName;
      return state;
    });
  };

  handleChosenParameter = (parameter) => {
    this.setState((state, props) => {
      state.valuesParameter = parameter;
      for (let val of parameter) {
        if (!state.valuesIds.map((ele) => ele.value).includes(val.value)) {
          state.valuesIds.push(val);
        }
      }
      return state;
    });
  };

  handleChosenId = (id) => {
    this.setState((state, props) => {
      state.valuesIds = id;
      return state;
    });
  };

  handleChosenFuncType = (functype) => {
    this.setState(
      (state, props) => {
        state.valuesFunctionType = functype;
        return state;
      },
      () => {
        var graphql = "allidbyfunctype";
        var functype = this.state.valuesFunctionType.map((ele) => ele.label);
        if (functype.length === 0) {
          return;
        }
        axios
          .post(
            "http://localhost:8080/query",
            {
              query: `query($database:String!, $measurement:String!, $host: String!, $port: Int!){
                ${graphql}(database: $database, measurement: $measurement, host:$host, port:$port, functype:${JSON.stringify(
                functype
              )}){
                  value
                  label
                }
              }`,
              variables: {
                database: "Disney",
                measurement: "hkdl",
                host: "18.163.30.4",
                port: 7691,
              },
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((response) => {
            console.log(response.data.data[graphql]);
            this.handleUpdateParameterList(response.data.data[graphql]);
          });
      }
    );
  };

  handleChosenEquipName = (equipName) => {
    this.setState((state, props) => {
      state.valuesequipmentName = equipName;
      return state;
    });
  };

  handleChosenEquipType = (equipType) => {
    this.setState(
      (state, props) => {
        state.valuesEquipment = equipType;
        return state;
      },
      () => {
        var graphql = "allfunctypebyequip";
        var equip = this.state.valuesEquipment.map((ele) => ele.label);
        if (equip.length === 0) {
          return;
        }
        axios
          .post(
            "http://localhost:8080/query",
            {
              query: `query($database:String!, $measurement:String!, $host: String!, $port: Int!){
                ${graphql}(database: $database, measurement: $measurement, host:$host, port:$port, equip:${JSON.stringify(
                equip
              )}){
                  value
                  label
                }
              }`,
              variables: {
                database: "Disney",
                measurement: "hkdl",
                host: "18.163.30.4",
                port: 7691,
              },
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((response) => {
            console.log(response.data.data[graphql]);
            this.handleUpdateFuncTypeList(response.data.data[graphql]);
          });
        var graphqll = "allequipnamebyequip";
        axios
          .post(
            "http://localhost:8080/query",
            {
              query: `query($database:String!, $measurement:String!, $host: String!, $port: Int!){
                ${graphqll}(database: $database, measurement: $measurement, host:$host, port:$port, equip:${JSON.stringify(
                equip
              )}){
                  value
                  label
                }
              }`,
              variables: {
                database: "Disney",
                measurement: "hkdl",
                host: "18.163.30.4",
                port: 7691,
              },
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((response) => {
            this.handleUpdateEquipNameList(response.data.data[graphqll]);
          });
      }
    );
  };

  render() {
    return (
      <>
        <Select
          className="selectoo"
          name="filters"
          placeholder="Equipments"
          value={this.state.valuesEquipment}
          options={this.state.equipmentList}
          onChange={(option) => {
            this.handleChosenEquipType(option);
          }}
          isMulti
          closeMenuOnSelect={false}
        />
        <Select
          className="selectoo"
          name="filters"
          placeholder="EquipmentNames"
          value={this.state.valuesequipmentName}
          options={this.state.equipmentNameList}
          onChange={(option) => {
            this.handleChosenEquipName(option);
          }}
          isMulti
          closeMenuOnSelect={false}
        />
        <Select
          className="selectoo"
          name="filters"
          placeholder="FunctionTypes"
          value={this.state.valuesFunctionType}
          options={this.state.functionTypeList}
          onChange={(option) => {
            this.handleChosenFuncType(option);
          }}
          isMulti
          closeMenuOnSelect={false}
        />
        <Select
          className="selectoo"
          name="filters"
          placeholder="Parameters"
          value={this.state.valuesParameter}
          options={this.state.parameterList}
          onChange={(option) => {
            this.handleChosenParameter(option);
          }}
          isMulti
          closeMenuOnSelect={false}
        />
        <Select
          className="selectoo"
          name="filters"
          placeholder="Ids"
          value={this.state.valuesIds}
          options={[]}
          onChange={(option) => {
            this.handleChosenId(option);
          }}
          isMulti
          closeMenuOnSelect={false}
        />
        <button onClick={() => this.handleClearAllList()}>Clear</button>
      </>
    );
  }
}
