import React from "react";
import CalculationEngine from "../../components/calculations";
import { Provider } from "react-redux";
import { store } from "../../app/store";

export default () => {
  return (
    <Provider store={store}>
      <CalculationEngine></CalculationEngine>
    </Provider>
  );
};
