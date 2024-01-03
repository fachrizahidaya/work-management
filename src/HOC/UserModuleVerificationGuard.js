import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import Toast from "react-native-toast-message";

import axiosInstance from "../config/api";
import { login } from "../redux/reducer/auth";
import { push } from "../redux/reducer/user_menu";

const UserModuleVerificationGuard = ({ children }) => {
  const dispatch = useDispatch();
  const moduleSelector = useSelector((state) => state.module);
  const userSelector = useSelector((state) => state.auth);

  const getAllUserData = async () => {
    try {
      const res = await axiosInstance.post("/auth/module-access", {
        module_name: moduleSelector.module_name.toLowerCase(),
      });
      const userResponse = res.data.data;

      // Dispatch a login action with the newly provided user data
      dispatch(login(userResponse));
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Something went wrong",
        text2: error?.response?.data?.message,
        position: "bottom",
      });
    }
  };

  /**
   * Function to parse the user role menu and dispatch it to the Redux store.
   */
  const parseUserRoleMenu = () => {
    const userRoleMenu = JSON.parse(userSelector.user_role_menu);

    // Dispatch the user role menu to the Redux store
    dispatch(push(userRoleMenu));
  };

  useEffect(() => {
    if (moduleSelector.module_name) {
      getAllUserData();
    }
  }, [moduleSelector.module_name]);

  useEffect(() => {
    if (userSelector.user_role_menu) {
      parseUserRoleMenu();
    }
  }, [userSelector.user_role_menu]);

  return (
    <>
      {children}
      <Toast />
    </>
  );
};

export default UserModuleVerificationGuard;
