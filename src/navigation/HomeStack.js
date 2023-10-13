import { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { Header } from "../components/layout/Header";
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

const Stack = createStackNavigator();

const HomeStack = () => {
  const [selectedModule, setSelectedModule] = useState("BAND");

  return (
    // Includes screens after user log in
    <Stack.Navigator>
      <Stack.Screen name="Module" options={{ header: () => <Header selectedModule={selectedModule} /> }}>
        {() => {
          if (selectedModule === "BAND") {
            return <BandTab setSelectedModule={setSelectedModule} />;
          } else if (selectedModule === "SETTING") {
            return <SettingTab setSelectedModule={setSelectedModule} />;
          } else if (selectedModule === "TRIBE") {
            return <TribeTab setSelectedModule={setSelectedModule} />;
            // } else if (selectedModule === "PIPE") {
            //   return <PipeTab setSelectedModule={setSelectedModule} />;
            // } else if (selectedModule === "COIN") {
            //   return <CoinTab setSelectedModule={setSelectedModule} />;
          } else {
            // Render a default component or handle unknown cases
            return <BandTab setSelectedModule={setSelectedModule} />;
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
    </Stack.Navigator>
  );
};

export default HomeStack;
