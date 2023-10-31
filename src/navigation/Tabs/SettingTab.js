import { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Box, Icon, Image } from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { TouchableOpacity } from "react-native";
import ModuleSelectSlider from "../../components/layout/ModuleSelectSlider";
import MyProfileScreen from "../../screens/Setting/Account/MyProfileScreen";

const Tab = createBottomTabNavigator();

function EmptyScreen() {
  return null; // Empty component
}

const SettingTab = ({ setSelectedModule }) => {
  const [settingSelectIsOpen, setSettingSelectIsOpen] = useState(false);
  const [moduleSelectIsOpen, setModuleSelectIsOpen] = useState(false);
  const [searchIsOpen, setSearchIsOpen] = useState(false);

  /**
   * Toggles the specified state and resets other states to false.
   * @param {string} stateToToggle - The state key to toggle.
   */
  const handleStateToggle = (stateToToggle) => {
    if (stateToToggle === "settingSelectIsOpen") {
      setSettingSelectIsOpen((prevState) => !prevState);
      setModuleSelectIsOpen(false);
      setSearchIsOpen(false);
    } else if (stateToToggle === "moduleSelectIsOpen") {
      setSettingSelectIsOpen(false);
      setModuleSelectIsOpen((prevState) => !prevState);
      setSearchIsOpen(false);
    } else if (stateToToggle === "searchIsOpen") {
      setSettingSelectIsOpen(false);
      setModuleSelectIsOpen(false);
      setSearchIsOpen((prevState) => !prevState);
    }
  };

  return (
    <>
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarShowLabel: false, tabBarStyle: { height: 100 } }}>
        <Tab.Screen
          name="Dashboard"
          component={MyProfileScreen}
          options={{
            tabBarIcon: ({ size, color }) => (
              <Box bg="#fbfbfb" borderRadius="full" padding={2}>
                <Icon as={<MaterialIcons name="phone-android" />} size={size} color="#186688" />
              </Box>
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={EmptyScreen}
          options={{
            tabBarIcon: ({ size, color }) => (
              <Box bg="#fbfbfb" borderRadius="full" padding={2}>
                <Icon as={<MaterialIcons name="person-outline" />} size={size} color="#186688" />
              </Box>
            ),
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                onPress={() => {
                  handleStateToggle("settingSelectIsOpen");
                }}
              >
                {props.children}
              </TouchableOpacity>
            ),
          }}
        />
        <Tab.Screen
          name="Module Selection"
          component={EmptyScreen}
          options={{
            tabBarIcon: () => <Image source={require("../../assets/icons/ruler_logo.png")} size={35} alt="band logo" />,
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
      </Tab.Navigator>

      {/* Should pop up above the BottomTab */}

      <ModuleSelectSlider isOpen={moduleSelectIsOpen} setSelectedModule={setSelectedModule} />
    </>
  );
};

export default SettingTab;
