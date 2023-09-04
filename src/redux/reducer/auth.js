import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: 0,
  name: "",
  email: "",
  phone_number: "",
  division_name: "",
  position_name: "",
  image: "",
  supervisor_name: "",
  supervisor_email: "",
  supervisor_phone_number: "",
  available_leave: 0,
  approved_leave: 0,
  pending_leave: 0,
  company_token: "",
  user_role_menu: "",
  user_module: [],
  user_role_id: 0,
  company: "",
  user_type: "",
  active_module: "",
};

const authReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.id = action.payload?.id;
      state.name = action.payload?.name;
      state.email = action.payload?.email;
      state.phone_number = action.payload?.phone_number;
      state.division_name = action.payload?.division_name;
      state.position_name = action.payload?.position_name;
      state.image = action.payload?.image;
      state.supervisor_name = action.payload?.supervisor_name;
      state.supervisor_email = action.payload?.supervisor_email;
      state.supervisor_phone_number = action.payload?.supervisor_phone_number;
      state.available_leave = action.payload?.leave_quota;
      state.approved_leave = action.payload?.approved_leave_request;
      state.pending_leave = action.payload?.pending_leave_request;
      state.company_token = action.payload?.company_token;
      state.user_role_menu = action.payload?.user_role_menu;
      state.user_module = action.payload?.user_module;
      state.user_role_id = action.payload?.user_role_id;
      state.company = action.payload?.company;
      state.user_type = action.payload?.user_type;
      state.active_module = action.payload?.active_module;
    },
    logout: (state, action) => {
      return initialState;
    },
    update_image: (state, action) => {
      state.image = action.payload;
    },
    update_profile: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.user_type = action.payload.user_type;
    },
  },
});

export const { login, logout, update_image, update_profile } =
  authReducer.actions;

export default authReducer.reducer;
