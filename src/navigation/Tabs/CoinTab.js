import { useRef } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import CoinDashboard from "../../screens/Coin/Dashboard/CoinDashboard";
import ModuleSelectSheet from "../../components/shared/ActionSheet/ModuleSelectSheet";
import CoinScreenSheet from "../../components/shared/ActionSheet/CoinScreenSheet";
import CoinAddNewSheet from "../../components/shared/ActionSheet/CoinAddNewSheet";

const Tab = createBottomTabNavigator();

function EmptyScreen() {
  return null; // Empty component
}

const CoinTab = () => {
  const moduleSelectSheetRef = useRef(null);
  const coinScreenSheetRef = useRef(null);
  const coinAddNewSheetRef = useRef(null);

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: { height: 80 },
          tabBarHideOnKeyboard: false,
          // Hide these certain screens from bottom tab navigation
          tabBarButton: [
            // "Purchase Order",
            // "Receipt Purchase Order",
            // "Sales Order",
            // "Delivery Order",
            // "Customer",
            // "Invoice",
          ].includes(route.name)
            ? () => {
                return null;
              }
            : undefined,
        })}
      >
        <Tab.Screen
          name="Dashboard"
          component={CoinDashboard}
          options={{
            tabBarIcon: ({ size, color }) => (
              <View style={styles.menuIcon}>
                <MaterialCommunityIcons name="home-outline" size={20} color="#3F434A" />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Search"
          component={EmptyScreen}
          options={{
            tabBarIcon: ({ size, color }) => (
              <View style={styles.menuIcon}>
                <MaterialCommunityIcons name="magnify" size={20} color="#3F434A" />
              </View>
            ),
          }}
          // listeners={({ navigation }) => ({
          //   tabPress: (e) => {
          //     e.preventDefault();
          //     navigation.navigate(null);
          //   },
          // })}
        />
        {/* <Tab.Screen
          name="Add"
          component={EmptyScreen}
          options={{
            tabBarIcon: ({ size, color }) => (
              <View style={styles.menuIcon}>
                <MaterialCommunityIcons name="plus" size={20} color="#3F434A" />
              </View>
            ),
            tabBarButton: (props) => (
              <TouchableOpacity {...props} onPress={() => coinAddNewSheetRef.current?.show()}>
                {props.children}
              </TouchableOpacity>
            ),
          }}
        /> */}
        <Tab.Screen
          name="Screen List"
          component={EmptyScreen}
          options={{
            tabBarIcon: ({ size, color }) => (
              <View style={styles.menuIcon}>
                <MaterialCommunityIcons name="menu" size={20} color="#3F434A" />
              </View>
            ),
            tabBarButton: (props) => (
              <TouchableOpacity {...props} onPress={() => coinScreenSheetRef.current?.show()}>
                {props.children}
              </TouchableOpacity>
            ),
          }}
        />

        <Tab.Screen
          name="Module Selection"
          component={EmptyScreen}
          options={{
            tabBarIcon: () => (
              <Image source={require("../../assets/icons/coin_logo.png")} style={styles.moduleImage} alt="tribe logo" />
            ),
            tabBarButton: (props) => (
              <TouchableOpacity {...props} onPress={() => moduleSelectSheetRef.current?.show()}>
                {props.children}
              </TouchableOpacity>
            ),
          }}
        />
      </Tab.Navigator>

      {/* Sheets */}
      <CoinScreenSheet reference={coinScreenSheetRef} />

      <CoinAddNewSheet reference={coinAddNewSheetRef} />

      <ModuleSelectSheet reference={moduleSelectSheetRef} />
    </>
  );
};

export default CoinTab;

const styles = StyleSheet.create({
  menuIcon: {
    backgroundColor: "#fbfbfb",
    borderRadius: 50,
    padding: 2,
  },
  moduleImage: {
    resizeMode: "contain",
    height: 35,
    width: 35,
  },
});
