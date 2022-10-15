import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  menuOpenNames: [],
  menuActiveName: "",
  // page component list
  components: [],
  // edit component
  component: {},
  // page config
  pageConfig: {
    pageId: "",
    pageTitle: "",
    pageCreatorUserId: "",
    pageCreatorName: "",
    pageCreatorTime: "",
  },
  pageJson: {},
  pageId: -1,
  pageName: "",
  token: "",
  userInfo: {},
  isIframe: false,
  // web theme
  theme: "",
  // query data type
  queryDataURL: "",
  queryData: null,
  queryConfig: null,
  chartOption: {},
};

export const pageSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    setComponents: (state, action) => {
      console.log(action);
      let components = state.components;
      if (action.payload && action.payload.length) {
        action.payload.map((item) => {
          components.push(item);
        });
      }
    },
    setQueryData: (state, action) => {
      console.log(action);
      if (action.payload) {
        state.queryData = action.payload;
      }
    },
    setQueryConfig: (state, action) => {
      console.log(action);
      if (action.payload) {
        state.queryConfig = action.payload;
      }
    },
  },
});

export const { setComponents, setQueryData, setQueryConfig } =
  pageSlice.actions;

export const selectPage = (state) => state.page;

export const selectPartialState = (partial) => (state) => state.page[partial];

export default pageSlice.reducer;
