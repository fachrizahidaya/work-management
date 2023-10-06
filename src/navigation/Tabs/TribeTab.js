import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Box, Icon, Image } from "native-base";
import { TouchableOpacity } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FeedScreen from "../../screens/Tribe/Feed/FeedScreen";
import InformationScreen from "../../screens/Tribe/InformationScreen";
import SettingScreen from "../../screens/Setting/SettingScreen";
import TribeScreenSlider from "../../components/layout/ScreensSlider/TribeScreenSlider";
import AddNewTribeSlider from "../../components/layout/AddNewSlider/AddNewTribeSlider";
import ModuleSelectSlider from "../../components/layout/ModuleSelectSlider";
import PayslipScreen from "../../screens/Tribe/PayslipScreen";
import ContactScreen from "../../screens/Tribe/ContactScreen";
import LeaveScreen from "../../screens/Tribe/Leave/LeaveScreen";
import CalendarScreen from "../../screens/Tribe/CalendarScreen";
import AttendanceScreen from "../../screens/Tribe/AttendanceScreen";
import { useDisclosure } from "../../hooks/useDisclosure";
import TeamLeaveScreen from "../../screens/Tribe/TeamLeaveScreen";

const Tab = createBottomTabNavigator();

function EmptyScreen() {
  return null; // Empty component
}

const TribeTab = ({ setSelectedModule }) => {
  const { isOpen: addSliderIsOpen, close: closeAddSlider, toggle: toggleAddSlider } = useDisclosure(false);
  const { isOpen: moduleSliderIsOpen, close: closeModuleSlider, toggle: toggleModuleSlider } = useDisclosure(false);
  const { isOpen: searchSliderIsOpen, close: closeSearchSlider, toggle: toggleSearchSlider } = useDisclosure(false);
  const {
    isOpen: menuScreenSliderIsOpen,
    close: closeMenuScreenSlider,
    toggle: toggleMenuScreenSlider,
  } = useDisclosure(false);

  /**
   * Toggles the specified state and resets other states to false.
   * @param {string} stateToToggle - The state key to toggle.
   */
  const handleStateToggle = (stateToToggle) => {
    if (stateToToggle === "moduleSelectIsOpen") {
      toggleModuleSlider();
      closeSearchSlider();
      closeAddSlider();
      closeMenuScreenSlider();
    } else if (stateToToggle === "searchIsOpen") {
      closeModuleSlider();
      toggleSearchSlider();
      closeAddSlider();
      closeMenuScreenSlider();
    } else if (stateToToggle === "addIsOpen") {
      closeModuleSlider();
      closeSearchSlider();
      toggleAddSlider();
      closeMenuScreenSlider();
    } else if (stateToToggle === "screenSelectIsOpen") {
      closeModuleSlider();
      closeSearchSlider();
      closeAddSlider();
      toggleMenuScreenSlider();
    }
  };

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
            "Attendance History",
            "Leave Request",
            "Team Leave Request",
            "Reimbursement",
            "My Payslip",
            "My KPI",
            "Calendar",
            "Contact",
          ].includes(route.name)
            ? () => {
                return null;
              }
            : undefined,
        })}
      >
        <Tab.Screen
          name="Feed"
          component={FeedScreen}
          options={{
            tabBarIcon: ({ size, color }) => (
              <Box bg="FBFBFB" borderRadius="full" padding={2}>
                <Icon as={<MaterialCommunityIcons name="menu" />} size={size} color="#186688" />
              </Box>
            ),
            tabBarButton: (props) => (
              <TouchableOpacity {...props} onPress={() => handleStateToggle("screenSelectIsOpen")}>
                {props.children}
              </TouchableOpacity>
            ),
          }}
        />
        <Tab.Screen
          name="Search"
          component={EmptyScreen}
          options={{
            tabBarIcon: ({ size, color }) => (
              <Box bg="#fbfbfb" borderRadius="full" padding={2}>
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
        />
        <Tab.Screen
          name="Add"
          component={EmptyScreen}
          options={{
            tabBarIcon: ({ size, color }) => (
              <Box bg="#fbfbfb" borderRadius="full" padding={2}>
                <Icon as={<MaterialCommunityIcons name="plus" />} size={size} color="#186688" />
              </Box>
            ),
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                onPress={() => {
                  handleStateToggle("addIsOpen");
                }}
              >
                {props.children}
              </TouchableOpacity>
            ),
          }}
        />
        <Tab.Screen
          name="Setting"
          component={SettingScreen}
          options={{
            tabBarIcon: ({ size, color }) => (
              <Box bg="#fbfbfb" borderRadius="full" padding={2} position="fixed">
                <Icon as={<MaterialCommunityIcons name="cog-outline" />} size={size} color="#186688" />
              </Box>
            ),
          }}
        />
        <Tab.Screen
          name="Module Selection"
          component={EmptyScreen}
          options={{
            tabBarIcon: () => (
              <Image source={require("../../assets/icons/tribe_logo.png")} size={35} alt="tribe logo" />
            ),
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                onPress={() => {
                  handleStateToggle("moduleSelectIsOpen");
                }}
              >
                {props.children}
              </TouchableOpacity>
            ),
          }}
        />
        <Tab.Screen name="My Information" component={InformationScreen} />
        <Tab.Screen name="Attendance History" component={AttendanceScreen} />
        <Tab.Screen name="Leave Request" component={LeaveScreen} />
        <Tab.Screen name="Team Leave Request" component={TeamLeaveScreen} />
        <Tab.Screen name="Reimbursement" component={EmptyScreen} />
        <Tab.Screen name="My Payslip" component={PayslipScreen} />
        <Tab.Screen name="My KPI" component={EmptyScreen} />
        <Tab.Screen name="Calendar" component={CalendarScreen} />
        <Tab.Screen name="Contact" component={ContactScreen} />
      </Tab.Navigator>

      {/* Sliders */}
      {<TribeScreenSlider toggle={toggleMenuScreenSlider} isOpen={menuScreenSliderIsOpen} />}

      {<AddNewTribeSlider toggle={toggleAddSlider} isOpen={addSliderIsOpen} />}

      {
        <ModuleSelectSlider
          toggle={toggleModuleSlider}
          isOpen={moduleSliderIsOpen}
          setSelectedModule={setSelectedModule}
        />
      }
    </>
  );
};

export default TribeTab;
