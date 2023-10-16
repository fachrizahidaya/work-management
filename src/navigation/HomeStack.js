import { createStackNavigator } from "@react-navigation/stack";

import { useSelector } from "react-redux";

import Header from "../components/layout/Header";
import BandTab from "./Tabs/BandTab";
import SettingTab from "./Tabs/SettingTab";
import TribeTab from "./Tabs/TribeTab";
import ChatRoom from "../screens/Chat/ChatRoom";
import ChatListScreen from "../screens/Chat/ChatListScreen";
import SettingScreen from "../screens/Setting/SettingScreen";
import LogoutScreen from "../screens/LogoutScreen";

// Band Screens
import ProjectDetailScreen from "../screens/Band/project/[projectId]";
import ProjectTaskScreen from "../screens/Band/project/project-task";
import TaskDetailScreen from "../screens/Band/task-detail/[taskId]";

// Tribe Screens
import NewFeedScreen from "../screens/Tribe/Feed/NewFeedScreen";
import EmployeeProfileScreen from "../screens/Tribe/Employee/[employeeId]";
import NewLeaveRequest from "../screens/Tribe/Leave/NewLeaveRequest/NewLeaveRequest";
import NotificationScreen from "../screens/NotificationScreen";
import TeamLeaveScreen from "../screens/Tribe/Leave/TeamLeaveScreen";

const Stack = createStackNavigator();

const HomeStack = () => {
  const moduleSelector = useSelector((state) => state.module);

  return (
    // Includes screens after user log in
    <Stack.Navigator>
      <Stack.Screen name="Module" options={{ header: () => <Header /> }}>
        {() => {
          if (moduleSelector.module_name === "BAND") {
            return <BandTab />;
          } else if (moduleSelector.module_name === "SETTING") {
            return <SettingTab />;
          } else if (moduleSelector.module_name === "TRIBE") {
            return <TribeTab />;
            // } else if (moduleSelector.module_name === "PIPE") {
            //   return <PipeTab  />;
            // } else if (moduleSelector.module_name === "COIN") {
            //   return <CoinTab  />;
          } else {
            // Render a default component or handle unknown cases
            return <BandTab />;
          }
        }}
      </Stack.Screen>

      <Stack.Screen name="Notification" component={NotificationScreen} options={{ header: () => <Header /> }} />

      <Stack.Screen name="Chat List" component={ChatListScreen} options={{ header: () => <Header /> }} />

      <Stack.Screen name="Chat Room" component={ChatRoom} options={{ header: () => <Header /> }} />

      <Stack.Screen name="Log Out" component={LogoutScreen} options={{ headerShown: false, gestureEnabled: false }} />

      {/* Band Screens */}
      <Stack.Screen name="Project Detail" component={ProjectDetailScreen} options={{ header: () => <Header /> }} />

      <Stack.Screen name="Project Task" component={ProjectTaskScreen} options={{ header: () => <Header /> }} />

      <Stack.Screen name="Task Detail" component={TaskDetailScreen} options={{ header: () => <Header /> }} />

      {/* Tribe Screens */}
      <Stack.Screen name="New Feed" component={NewFeedScreen} options={{ header: () => <Header /> }} />

      <Stack.Screen name="Employee Profile" component={EmployeeProfileScreen} options={{ header: () => <Header /> }} />

      <Stack.Screen name="New Leave Request" component={NewLeaveRequest} options={{ header: () => <Header /> }} />

      <Stack.Screen name="Team Leave Request" component={TeamLeaveScreen} options={{ header: () => <Header /> }} />
    </Stack.Navigator>
  );
};

export default HomeStack;
