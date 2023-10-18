import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/auth";
import projectReducer from "./reducer/project";
import moduleReducer from "./reducer/module";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    project: projectReducer,
    module: moduleReducer,
  },
});
