import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  module_name: "BAND",
};

const moduleReducer = createSlice({
  name: "module",
  initialState,
  reducers: {
    setModule: (state, action) => {
      state.module_name = action.payload;
    },
  },
});

export const { setModule } = moduleReducer.actions;

export default moduleReducer.reducer;
