import { useSelector } from "react-redux";
import { Platform } from "react-native";

import AuthStack from "./AuthStack";
import HomeStack from "./HomeStack";
import { KeyboardAvoidingView } from "native-base";

export const Navigations = () => {
  const userSelector = useSelector((state) => state.auth);

  return (
    <KeyboardAvoidingView flex={1} behavior={Platform.select({ android: undefined, ios: "padding" })}>
      {/* Redirects user to login screen if user not logged in yet */}
      {userSelector.id === 0 ? <AuthStack /> : <HomeStack />}
      {/* But then redirects user to dashboard screen if user log in */}
    </KeyboardAvoidingView>
  );
};
