import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import messaging from "@react-native-firebase/messaging";

import { useSelector } from "react-redux";

import AuthStack from "./AuthStack";
import HomeStack from "./HomeStack";

export const Navigations = () => {
  const navigation = useNavigation();
  const userSelector = useSelector((state) => state.auth);

  // Redirects user to chat room if app opens after pressing the push notification
  useEffect(() => {
    messaging().onNotificationOpenedApp((message) => {
      if (message.data.type === "Chat") {
        navigation.navigate("Chat Room", {
          name: message.data.name,
          userId: message.data.user_id,
          roomId: message.data.chat_id,
          image: message.data.image,
        });
      }
    });
  }, []);

  return <>{userSelector.id === 0 ? <AuthStack /> : <HomeStack />}</>;
};
