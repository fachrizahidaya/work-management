import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user_menu: {},
};

const userMenuReducer = createSlice({
  name: "user_menu",
  initialState,
  reducers: {
    push: (state, action) => {
      state.user_menu = action.payload;
    },
    remove: (state, action) => {
      return initialState;
    },
  },
});

export const { push, remove } = userMenuReducer.actions;

export default userMenuReducer.reducer;
