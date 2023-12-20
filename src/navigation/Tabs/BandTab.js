import { useRef } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { StyleSheet, TouchableOpacity, View, Image } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import BandDashboard from "../../screens/Band/BandDashboard";
import ProjectList from "../../screens/Band/ProjectList";
import SettingScreen from "../../screens/Setting/SettingScreen";
import AdHocScreen from "../../screens/Band/AdHoc";
import MyTeamScreen from "../../screens/Band/MyTeam";
import NotesScreen from "../../screens/Band/Notes";
import CalendarScreen from "../../screens/Band/Calendar";
import BandScreenSheet from "../../components/shared/ActionSheet/BandScreenSheet";
import BandAddNewSheet from "../../components/shared/ActionSheet/BandAddNewSheet";
import ModuleSelectSheet from "../../components/shared/ActionSheet/ModuleSelectSheet";

const Tab = createBottomTabNavigator();

function EmptyScreen() {
  return null; // Empty component
}

const BandTab = () => {
  const bandScreenSheetRef = useRef(null);
  const bandAddNewSheetRef = useRef(null);
  const moduleSelectSheetRef = useRef(null);

  /**
   * Toggles the specified slider to open or close
   * If one slider is open then the reset of sliders are closed
   * @param {string} stateToToggle - The state key to toggle.
   */

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: { height: 80 },
          tabBarHideOnKeyboard: true,
          // Hide these certain screens from bottom tab navigation
          tabBarButton: ["Projects", "Tasks", "My Team", "Notes", "Calendar Band"].includes(route.name)
            ? () => {
                return null;
              }
            : undefined,
        })}
      >
        <Tab.Screen
          name="Dashboard"
          component={BandDashboard}
          options={{
            tabBarIcon: ({ size, color }) => (
              <View style={styles.menuIcon}>
                <MaterialCommunityIcons name="menu" size={20} />
              </View>
            ),
            tabBarButton: (props) => (
              <TouchableOpacity {...props} onPress={() => bandScreenSheetRef.current?.show()}>
                {props.children}
              </TouchableOpacity>
            ),
          }}
        />
        <Tab.Screen
          name="Add"
          component={EmptyScreen}
          options={{
            tabBarIcon: ({ size, color }) => (
              <View style={styles.menuIcon}>
                <MaterialCommunityIcons name="plus" size={20} />
              </View>
            ),
            tabBarButton: (props) => (
              <TouchableOpacity {...props} onPress={() => bandAddNewSheetRef.current?.show()}>
                {props.children}
              </TouchableOpacity>
            ),
          }}
        />
        <Tab.Screen
          name="Setting Band"
          component={SettingScreen}
          options={{
            tabBarIcon: ({ size, color }) => (
              <View style={styles.menuIcon}>
                <MaterialCommunityIcons name="cog-outline" size={20} />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Module Selection"
          component={EmptyScreen}
          options={{
            tabBarIcon: () => (
              <Image source={require("../../assets/icons/band_logo.png")} alt="band logo" style={styles.moduleImage} />
            ),
            tabBarButton: (props) => (
              <TouchableOpacity {...props} onPress={() => moduleSelectSheetRef.current?.show()}>
                {props.children}
              </TouchableOpacity>
            ),
          }}
        />
        <Tab.Screen name="Projects" component={ProjectList} />

        <Tab.Screen name="Tasks" component={AdHocScreen} />

        <Tab.Screen name="My Team" component={MyTeamScreen} />

        <Tab.Screen name="Notes" component={NotesScreen} />

        <Tab.Screen name="Calendar Band" component={CalendarScreen} />
      </Tab.Navigator>

      {/* Sheets */}
      <BandScreenSheet reference={bandScreenSheetRef} />

      <AddNewBandSlider isOpen={addSliderIsOpen} toggle={toggleAddSlider} />

      <ModuleSelectSlider isOpen={moduleSliderIsOpen} toggle={toggleModuleSlider} />
    </>
  );
};

export default BandTab;

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
