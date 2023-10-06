import { useState } from "react";
import "react-native-gesture-handler";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import { NativeBaseProvider } from "native-base";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClientProvider, QueryClient } from "react-query";

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
            <SafeAreaProvider>
              {isLoading ? <LaunchScreen setIsLoading={setIsLoading} /> : <Navigations />}
            </SafeAreaProvider>
          </NavigationContainer>
        </NativeBaseProvider>
      </QueryClientProvider>
    </Provider>
  );
}
