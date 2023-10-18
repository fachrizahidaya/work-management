import { useSelector } from "react-redux";

import AuthStack from "./AuthStack";
import HomeStack from "./HomeStack";

export const Navigations = () => {
  const userSelector = useSelector((state) => state.auth);

  return <>{userSelector.id === 0 ? <AuthStack /> : <HomeStack />}</>;
};
