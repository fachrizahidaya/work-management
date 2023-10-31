import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  nest_users: [],
};

const userReducer = createSlice({
  name: "nest_users",
  initialState,
  reducers: {
    pushItemTax: (state, action) => {
      state.nest_users = action.payload;
    },
    addItemTax: (state, action) => {
      state.nest_users.push(action.payload);
    },
    deleteItemTax: (state, action) => {
      state.nest_users.splice(action.payload, 1);
    },
    resetItemTax: (state) => {
      return initialState;
    },
  },
});

export const { pushItemTax, addItemTax, deleteItemTax, resetItemTax } = userReducer.actions;

export default userReducer.reducer;
