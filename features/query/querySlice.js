import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import querySliceApi from "./queryAPI";

const initialState = {
  graphSystem: [],
  graphLocation: [],

  optionsSystem: [],
  optionsLocation: [],
  optionsEquipment: [],
  optionsParameter: [],

  valuesSystem: [],
  valuesLocation: [],
  valuesEquipment: [],
  valuesParameter: [],

  optionsFilter: [],
  optionsCalculation: [],
  optionsColumn: [],
  optionsRow: [],
};

export const apiSystemAsync = createAsyncThunk(
  "select/fetchApiSystem",
  async () => {
    const response = await querySliceApi.systemApi();
    // The value we return becomes the `fulfilled` action payload
    return response.links;
  }
);

export const querySlice = createSlice({
  name: "query",
  initialState,
  reducers: {
    setOptionsSystem: (state, action) => {
      if (action.payload.length > 0) {
        let graphSystem = state.graphSystem;
        state.optionsSystem = graphSystem[
          action.payload[action.payload.length - 1].value
        ].map((ele, index) => {
          return { label: ele, value: ele };
        });
      } else {
				state.optionsSystem = [];
			}
    },
    setOptionsLocation: (state, action) => {
			if (action.payload.length > 0) {
        let graphLocation = state.graphLocation;
        state.optionsLocation = graphLocation[
          action.payload[action.payload.length - 1].value
        ].map((ele, index) => {
          return { label: ele, value: ele };
        });
      } else {
				state.optionsLocation = [];
			}
    },
    setOptionsEquipment: (state, action) => {
      state.optionsEquipment = action.payload;
    },
    setOptionsParameter: (state, action) => {
      state.optionsParameter = action.payload;
    },
    setValuesSystem: (state, action) => {
      console.log(action);
      state.valuesSystem = action.payload;
    },
    setValuesLocation: (state, action) => {
      state.valuesLocation = action.payload;
    },
    setValuesEquipment: (state, action) => {
      state.valuesEquipment = action.payload;
    },
    setValuesParameter: (state, action) => {
      state.valuesParameter = action.payload;
    },
    setGraphSystem: (state, action) => {
      state.graphSystem = action.payload;
    },
    setGraphLocation: (state, action) => {
      state.graphLocation = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const {
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
} = querySlice.actions;

export const selectPartialState = (partial) => (state) => state.query[partial];

export default querySlice.reducer;
