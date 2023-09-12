import { useState } from "react";
import "react-native-gesture-handler";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import { NativeBaseProvider } from "native-base";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClientProvider, QueryClient } from "react-query";

import { Platform, StatusBar, StyleSheet } from "react-native";
import { customTheme } from "./src/theme";
import { Navigations } from "./src/navigation";

import LaunchScreen from "./src/screens/Setting/LaunchScreen";

const queryClient = new QueryClient();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <NativeBaseProvider theme={customTheme}>
          <NavigationContainer>
            <SafeAreaProvider style={styles.container}>
              {isLoading ? <LaunchScreen setIsLoading={setIsLoading} /> : <Navigations />}
            </SafeAreaProvider>
          </NavigationContainer>
        </NativeBaseProvider>
      </QueryClientProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    // borderWidth: 1,
    // borderColor: "red",
  },
});
