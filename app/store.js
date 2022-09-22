import { configureStore } from "@reduxjs/toolkit";
import initalDataReducer from "../features/tool/toolSlice";
import queryReducer from "../features/query/querySlice";

export const store = configureStore({
  reducer: {
    tool: initalDataReducer,
    query:queryReducer,
  },
});
