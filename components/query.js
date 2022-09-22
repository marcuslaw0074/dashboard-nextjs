import React from "react";
import Select from "react-select";
import axios from "axios";
import { connect } from "react-redux";
import SelectQuery from "../components/select";
import { Provider } from "react-redux";
import { store } from "../app/store";

const QueryGenerator = () => {
  return (
    <div>
      <Select></Select>
      <Provider store={store}>
        <SelectQuery></SelectQuery>
      </Provider>
    </div>
  );
};

export default QueryGenerator;
