import { configureStore } from "@reduxjs/toolkit";
import initalDataReducer from "../features/tool/toolSlice";

export const store = configureStore({
  reducer: {
    tool: initalDataReducer,
  },
});
