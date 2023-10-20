import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  module_name: "",
};

const moduleReducer = createSlice({
  name: "module",
  initialState,
  reducers: {
    setModule: (state, action) => {
      state.module_name = action.payload;
    },
    resetModule: (state, action) => {
      return initialState;
    },
  },
});

export const { setModule, resetModule } = moduleReducer.actions;

export default moduleReducer.reducer;
