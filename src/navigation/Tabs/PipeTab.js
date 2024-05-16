import { useRef } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { TouchableOpacity, StyleSheet, View, Image } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import ModuleSelectSheet from "../../components/shared/ActionSheet/ModuleSelectSheet";
import PipeDashboard from "../../screens/Pipe/Dashboard/PipeDashboard";
import PipeScreenSheet from "../../components/shared/ActionSheet/PipeScreenSheet";

const Tab = createBottomTabNavigator();

function EmptyScreen() {
  return null; // Empty component
}

const PipeTab = () => {
  const pipeScreenSheetRef = useRef(null);
  const moduleSelectSheetRef = useRef(null);
  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: { height: 80 },
          tabBarHideOnKeyboard: true,
          // Hide these certain screens from bottom tab navigation
          tabBarButton: [].includes(route.name)
            ? () => {
                return null;
              }
            : undefined,
        })}
      >
        <Tab.Screen
          name="Dashboard"
          component={PipeDashboard}
          options={{
            tabBarIcon: ({ size, color }) => (
              <View style={styles.menuIcon}>
                <MaterialCommunityIcons name="home-outline" size={20} color="#3F434A" />
              </View>
            ),
          }}
        />
        {/* <Tab.Screen
          name="Search"
          component={EmptyScreen}
          options={{
            tabBarIcon: ({ size, color }) => (
              <View style={styles.menuIcon}>
                <MaterialCommunityIcons name="magnify" size={20} color="#3F434A" />
              </View>
            ),
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              navigation.navigate("Global Search Silo");
            },
          })}
        /> */}
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
              <TouchableOpacity {...props} onPress={() => tribeAddNewSheetRef.current?.show()}>
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
              <TouchableOpacity {...props} onPress={() => pipeScreenSheetRef.current?.show()}>
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
              <Image source={require("../../assets/icons/pipe_logo.png")} style={styles.moduleImage} alt="pipe logo" />
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
      <PipeScreenSheet reference={pipeScreenSheetRef} />

      <ModuleSelectSheet reference={moduleSelectSheetRef} />
    </>
  );
};

export default PipeTab;

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
