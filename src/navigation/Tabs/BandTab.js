import { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Box, Icon, Image } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TouchableOpacity } from "react-native";

import BandDashboard from "../../screens/Band/BandDashboard";
import ModuleSelectSlider from "../../components/layout/ModuleSelectSlider";
import AddNewBandSlider from "../../components/layout/AddNewSlider/AddNewBandSlider";
import BandScreensSlider from "../../components/layout/ScreensSlider/BandScreensSlider";
import ProjectList from "../../screens/Band/ProjectList";
import SettingScreen from "../../screens/Setting/SettingScreen";
import ProjectDetailScreen from "../../screens/Band/project/[projectId]";
import ProjectTaskScreen from "../../screens/Band/project/project-task";

const Tab = createBottomTabNavigator();

function EmptyScreen() {
  return null; // Empty component
}

const BandTab = ({ setSelectedModule }) => {
  const [moduleSelectIsOpen, setModuleSelectIsOpen] = useState(false);
  const [searchIsOpen, setSearchIsOpen] = useState(false);
  const [addIsOpen, setAddIsOpen] = useState(false);
  const [screenSelectIsOpen, setScreenSelectIsOpen] = useState(false);

  /**
   * Toggles the specified state and resets other states to false.
   * @param {string} stateToToggle - The state key to toggle.
   */
  const handleStateToggle = (stateToToggle) => {
    if (stateToToggle === "moduleSelectIsOpen") {
      setModuleSelectIsOpen((prevState) => !prevState);
      setSearchIsOpen(false);
      setAddIsOpen(false);
      setScreenSelectIsOpen(false);
    } else if (stateToToggle === "searchIsOpen") {
      setModuleSelectIsOpen(false);
      setSearchIsOpen((prevState) => !prevState);
      setAddIsOpen(false);
      setScreenSelectIsOpen(false);
    } else if (stateToToggle === "addIsOpen") {
      setModuleSelectIsOpen(false);
      setSearchIsOpen(false);
      setAddIsOpen((prevState) => !prevState);
      setScreenSelectIsOpen(false);
    } else if (stateToToggle === "screenSelectIsOpen") {
      setModuleSelectIsOpen(false);
      setSearchIsOpen(false);
      setAddIsOpen(false);
      setScreenSelectIsOpen((prevState) => !prevState);
    }
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: { height: 100 },
          // Hide these certain screens from bottom tab navigation
          tabBarButton: ["Project List", "Project Detail", "Project Task"].includes(route.name)
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
              <Box bg="#fbfbfb" borderRadius="full" padding={2}>
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
                  // handleStateToggle("settingSelectIsOpen");
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
              <Box bg="#fbfbfb" borderRadius="full" padding={2}>
                <Icon as={<MaterialCommunityIcons name="cog-outline" />} size={size} color="#186688" />
              </Box>
            ),
          }}
        />
        <Tab.Screen
          name="Module Selection"
          component={EmptyScreen}
          options={{
            tabBarIcon: () => <Image source={require("../../assets/icons/band_logo.png")} size={35} alt="band logo" />,
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
        <Tab.Screen name="Project List" component={ProjectList} />

        <Tab.Screen name="Project Detail" component={ProjectDetailScreen} />

        <Tab.Screen name="Project Task" component={ProjectTaskScreen} />
      </Tab.Navigator>

      {/* Sliders */}
      <BandScreensSlider isOpen={screenSelectIsOpen} setIsOpen={setScreenSelectIsOpen} />

      <AddNewBandSlider isOpen={addIsOpen} setIsOpen={setAddIsOpen} />

      <ModuleSelectSlider isOpen={moduleSelectIsOpen} setSelectedModule={setSelectedModule} />
    </>
  );
};

export default BandTab;
