import { configureStore } from "@reduxjs/toolkit";
import initalDataReducer from "../features/tool/toolSlice";
import queryReducer from "../features/query/querySlice";
import pageReducer from "../features/dashboard/dashboardSlice"

export const store = configureStore({
  reducer: {
    tool: initalDataReducer,
    query:queryReducer,
    page:pageReducer,
  },
});
