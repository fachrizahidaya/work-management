import { useEffect } from "react";
import "react-native-gesture-handler";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClientProvider, QueryClient } from "react-query";
import messaging from "@react-native-firebase/messaging";

import { Alert, PermissionsAndroid, Platform } from "react-native";

import { Navigations } from "./src/navigation";
import UserModuleVerificationGuard from "./src/HOC/UserModuleVerificationGuard";
import { WebsocketContextProvider } from "./src/HOC/WebsocketContextProvider";

import { SheetProvider } from "react-native-actions-sheet";
import "./src/components/shared/ActionSheet/sheets";
import { RootSiblingParent } from "react-native-root-siblings";

const queryClient = new QueryClient();

export default function App() {
  const requestPermission = async () => {
    // Ask permission for ios
    if (Platform.OS === "ios") {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        Alert.alert(
          "You haven't given permission for Nest to send notification \n \n Please enable notifications to enhance your app experience"
        );
      }
    } else {
      // Ask permission for android
      const granted = await PermissionsAndroid.check("android.permission.POST_NOTIFICATIONS");

      if (!granted) {
        PermissionsAndroid.request("android.permission.POST_NOTIFICATIONS");
      }
    }
  };

  useEffect(() => {
    requestPermission();
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <SheetProvider>
          <RootSiblingParent>
            <WebsocketContextProvider>
              <NavigationContainer>
                <SafeAreaProvider>
                  <UserModuleVerificationGuard>
                    <Navigations />
                  </UserModuleVerificationGuard>
                </SafeAreaProvider>
              </NavigationContainer>
            </WebsocketContextProvider>
          </RootSiblingParent>
        </SheetProvider>
      </QueryClientProvider>
    </Provider>
  );
}
