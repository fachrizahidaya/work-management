import { useEffect } from "react";
import "react-native-gesture-handler";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import { NativeBaseProvider } from "native-base";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClientProvider, QueryClient } from "react-query";
import messaging from "@react-native-firebase/messaging";

import { customTheme } from "./src/theme";
import { Navigations } from "./src/navigation";
import UserModuleVerificationGuard from "./src/HOC/UserModuleVerificationGuard";
import { WebsocketContextProvider } from "./src/HOC/WebsocketContextProvider";

import { Alert } from "react-native";

const queryClient = new QueryClient();

export default function App() {
  const requestPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      Alert.alert(
        "You haven't given permission for Nest to send notification. \n Go to Settigs > Apps & permissions > App manager > Nest > Notifications > Allow notifications"
      );
    }
  };

  useEffect(() => {
    requestPermission();
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <NativeBaseProvider theme={customTheme}>
          <WebsocketContextProvider>
            <NavigationContainer>
              <SafeAreaProvider>
                <UserModuleVerificationGuard>
                  <Navigations />
                </UserModuleVerificationGuard>
              </SafeAreaProvider>
            </NavigationContainer>
          </WebsocketContextProvider>
        </NativeBaseProvider>
      </QueryClientProvider>
    </Provider>
  );
}
