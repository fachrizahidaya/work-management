import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/auth";
import projectReducer from "./reducer/project";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    project: projectReducer,
  },
});
