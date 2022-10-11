import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchQueryTimeseries } from "./ruleEngineAPI";

const initialState = {
  expression: "",
  status: "idle",
  data: [],
};

export const initalQueryAsync = createAsyncThunk(
  "ruleEngine/query",
  async (request) => {
    const response = await fetchQueryTimeseries(request);
    return response;
  }
);



export const initalRuleEngineSlice = createSlice({
  name: "ruleEngine",
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
    .addCase(initalQueryAsync.pending, (state) => {
      state.status = "loading";
    })
    .addCase(initalQueryAsync.fulfilled, (state, action) => {
      state.status = "loading";
      state.expression = action.payload
    })
  }
})