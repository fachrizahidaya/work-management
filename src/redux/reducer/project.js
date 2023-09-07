import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: 0,
  title: "",
  priority: "",
  deadline: "",
  description: "",
};

const projectReducer = createSlice({
  name: "project",
  initialState,
  reducers: {
    push: (state, action) => {
      state.id = action.payload.id;
      state.title = action.payload.title;
      state.priority = action.payload.priority;
      state.deadline = action.payload.deadline;
      state.description = action.payload.description;
    },
  },
});

export const { push } = projectReducer.actions;

export default projectReducer.reducer;
