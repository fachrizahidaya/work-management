import { useRef } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { TouchableOpacity, StyleSheet, View, Image } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FeedScreen from "../../screens/Tribe/Feed/FeedScreen";
import InformationScreen from "../../screens/Tribe/InformationScreen";
import SettingScreen from "../../screens/Setting/SettingScreen";
import PayslipScreen from "../../screens/Tribe/PayslipScreen";
import ContactScreen from "../../screens/Tribe/ContactScreen";
import LeaveScreen from "../../screens/Tribe/Leave/LeaveScreen";
import CalendarScreen from "../../screens/Band/Calendar";
import AttendanceScreen from "../../screens/Tribe/AttendanceScreen";
import ReimbursementScreen from "../../screens/Tribe/Reimbursement/ReimbursementScreen";
import TribeScreenSheet from "../../components/shared/ActionSheet/TribeScreenSheet";
import TribeAddNewSheet from "../../components/shared/ActionSheet/TribeAddNewSheet";
import ModuleSelectSheet from "../../components/shared/ActionSheet/ModuleSelectSheet";

const Tab = createBottomTabNavigator();

function EmptyScreen() {
  return null; // Empty component
}

const TribeTab = ({ setSelectedModule }) => {
  const tribeScreenSheetRef = useRef(null);
  const tribeAddNewSheetRef = useRef(null);
  const moduleSelectSheetRef = useRef(null);

  /**
   * Toggles the specified state and resets other states to false.
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
          tabBarButton: [
            "My Information",
            "Attendance",
            "Leave Requests",
            "Reimbursement",
            "Payslip",
            "My KPI",
            "Calendar Tribe",
            "Contact",
          ].includes(route.name)
            ? () => {
                return null;
              }
            : undefined,
        })}
      >
        <Tab.Screen
          name="Dashboard"
          component={FeedScreen}
          options={{
            tabBarIcon: ({ size, color }) => (
              <View style={styles.menuIcon}>
                <MaterialCommunityIcons name="menu" size={20} color="#186688" />
              </View>
            ),
            tabBarButton: (props) => (
              <TouchableOpacity {...props} onPress={() => tribeScreenSheetRef.current?.show()}>
                {props.children}
              </TouchableOpacity>
            ),
          }}
        />
        {/* <Tab.Screen
          name="Search"
          component={EmptyScreen}
          options={{
            tabBarIcon: ({ size, color }) => (
              <Box bg="#FBFBFB" borderRadius="full" padding={2}>
                <Icon as={<MaterialCommunityIcons name="magnify" />} size={size} color="#186688" />
              </Box>
            ),
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                onPress={() => {
                  // handleStateToggle("searchIsOpen");
                }}
              >
                {props.children}
              </TouchableOpacity>
            ),
          }}
        /> */}
        <Tab.Screen
          name="Add"
          component={EmptyScreen}
          options={{
            tabBarIcon: ({ size, color }) => (
              <View style={styles.menuIcon}>
                <MaterialCommunityIcons name="plus" size={20} color="#186688" />
              </View>
            ),
            tabBarButton: (props) => (
              <TouchableOpacity {...props} onPress={() => tribeAddNewSheetRef.current?.show()}>
                {props.children}
              </TouchableOpacity>
            ),
          }}
        />
        <Tab.Screen
          name="Setting Tribe"
          component={SettingScreen}
          options={{
            tabBarIcon: ({ size, color }) => (
              <View style={styles.menuIcon}>
                <MaterialCommunityIcons name="cog-outline" size={20} color="#186688" />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Module Selection"
          component={EmptyScreen}
          options={{
            tabBarIcon: () => (
              <Image
                source={require("../../assets/icons/tribe_logo.png")}
                style={styles.moduleImage}
                alt="tribe logo"
              />
            ),
            tabBarButton: (props) => (
              <TouchableOpacity {...props} onPress={() => moduleSelectSheetRef.current?.show()}>
                {props.children}
              </TouchableOpacity>
            ),
          }}
        />
        <Tab.Screen name="My Information" component={InformationScreen} />

        <Tab.Screen name="Attendance" component={AttendanceScreen} />

        <Tab.Screen name="Leave Requests" component={LeaveScreen} />

        <Tab.Screen name="Reimbursement" component={ReimbursementScreen} />

        <Tab.Screen name="Payslip" component={PayslipScreen} />

        <Tab.Screen name="My KPI" component={EmptyScreen} />

        <Tab.Screen name="Calendar Tribe" component={CalendarScreen} />

        <Tab.Screen name="Contact" component={ContactScreen} />
      </Tab.Navigator>

      {/* Sheets */}
      <TribeScreenSheet reference={tribeScreenSheetRef} />

      {/* Sliders */}

      {/* {<AddNewTribeSlider toggle={toggleAddSlider} isOpen={addSliderIsOpen} />} */}
      <TribeAddNewSheet reference={tribeAddNewSheetRef} />

      {/* {
        <ModuleSelectSlider
          toggle={toggleModuleSlider}
          isOpen={moduleSliderIsOpen}
          setSelectedModule={setSelectedModule}
        />
      } */}
      <ModuleSelectSheet reference={moduleSelectSheetRef} />
    </>
  );
};

export default TribeTab;

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
