import { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import messaging from "@react-native-firebase/messaging";

import { useSelector } from "react-redux";

import Header from "../components/layout/Header";
import BandTab from "./Tabs/BandTab";
import SettingTab from "./Tabs/SettingTab";
import TribeTab from "./Tabs/TribeTab";

// Independent Screens
import LogoutScreen from "../screens/LogoutScreen";
import NotificationScreen from "../screens/NotificationScreen";

// Band Screens
import ProjectDetailScreen from "../screens/Band/project/[projectId]";
import ProjectTaskScreen from "../screens/Band/project/project-task";
import TaskDetailScreen from "../screens/Band/task-detail/[taskId]";

// Tribe Screens
import NewFeedScreen from "../screens/Tribe/Feed/NewFeedScreen/NewFeedScreen";
import EmployeeProfileScreen from "../screens/Tribe/Employee/[employeeId]";
import NewLeaveRequest from "../screens/Tribe/Leave/NewLeaveRequest/NewLeaveRequest";
import TeamLeaveScreen from "../screens/Tribe/Leave/TeamLeaveScreen/TeamLeaveScreen";
import NewReimbursement from "../screens/Tribe/Reimbursement/NewReimbursement/NewReimbursement";

// Settings Screens
import MyProfileScreen from "../screens/Setting/Account/MyProfileScreen";
import AccountScreen from "../screens/Setting/Account/AccountScreen";
import CompanyScreen from "../screens/Setting/Account/CompanyScreen";
import SubscriptionScreen from "../screens/Setting/Account/SubscriptionScreen";
import PaymentScreen from "../screens/Setting/Account/PaymentScreen";
import ChangePasswordScreen from "../screens/Setting/ChangePasswordScreen";

// Nest Screens
import ChatRoom from "../screens/Chat/ChatRoom";
import ChatListScreen from "../screens/Chat/ChatListScreen";
import AddGroupParticipantScreen from "../screens/Chat/AddGroupParticipantScreen";
import GroupFormScreen from "../screens/Chat/GroupFormScreen";
import AddPersonalChatScreen from "../screens/Chat/AddPersonalChatScreen";

const Stack = createStackNavigator();

const HomeStack = () => {
  const navigation = useNavigation();
  const moduleSelector = useSelector((state) => state.module);

  useEffect(() => {
    messaging()
      .getInitialNotification()
      .then((message) => {
        if (message) {
          console.log(message);
          // if (message.data.type === "Chat") {
          //   navigation.navigate("Chat Room", {
          //     name: message.data.name,
          //     userId: message.data.user_id,
          //     image: message.data.image,
          //   });
          // }
        }
        // console.log("notif openend the app");
      });
  }, []);

  return (
    // Includes screens after user log in
    <Stack.Navigator>
      <Stack.Screen name="Module" options={{ header: () => <Header /> }}>
        {() => {
          if (moduleSelector.module_name === "BAND") {
            return <BandTab />;
          } else if (moduleSelector.module_name === "TRIBE") {
            return <TribeTab />;
          } else if (moduleSelector.module_name === "SETTING") {
            return <SettingTab />;
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

      {/* Independent Screens */}
      <Stack.Screen name="Notification" component={NotificationScreen} options={{ header: () => <Header /> }} />

      <Stack.Screen name="Log Out" component={LogoutScreen} options={{ headerShown: false, gestureEnabled: false }} />

      {/* Nest Screens */}
      <Stack.Screen
        name="Chat List"
        component={ChatListScreen}
        options={{
          gestureEnabled: true,
          header: () => <Header />,
        }}
      />

      <Stack.Screen name="Chat Room" component={ChatRoom} options={{ headerShown: false }} />

      <Stack.Screen name="Group Participant" component={AddGroupParticipantScreen} options={{ headerShown: false }} />

      <Stack.Screen name="Group Form" component={GroupFormScreen} options={{ headerShown: false }} />

      <Stack.Screen name="New Chat" component={AddPersonalChatScreen} options={{ headerShown: false }} />

      {/* Band Screens */}
      <Stack.Screen name="Project Detail" component={ProjectDetailScreen} options={{ header: () => <Header /> }} />

      <Stack.Screen name="Project Task" component={ProjectTaskScreen} options={{ header: () => <Header /> }} />

      <Stack.Screen name="Task Detail" component={TaskDetailScreen} options={{ header: () => <Header /> }} />

      {/* Tribe Screens */}
      <Stack.Screen name="New Feed" component={NewFeedScreen} options={{ header: () => <Header /> }} />

      <Stack.Screen name="Employee Profile" component={EmployeeProfileScreen} options={{ header: () => <Header /> }} />

      <Stack.Screen name="New Leave Request" component={NewLeaveRequest} options={{ header: () => <Header /> }} />

      <Stack.Screen name="Team Leave Request" component={TeamLeaveScreen} options={{ header: () => <Header /> }} />

      <Stack.Screen name="New Reimbursement" component={NewReimbursement} options={{ header: () => <Header /> }} />

      {/* Setting Screens */}
      <Stack.Screen name="Account Screen" component={AccountScreen} options={{ header: () => <Header /> }} />

      <Stack.Screen name="Profile Screen" component={MyProfileScreen} options={{ header: () => <Header /> }} />

      <Stack.Screen name="Company Screen" component={CompanyScreen} options={{ header: () => <Header /> }} />

      <Stack.Screen name="Subscription Screen" component={SubscriptionScreen} options={{ header: () => <Header /> }} />

      <Stack.Screen name="Payment Screen" component={PaymentScreen} options={{ header: () => <Header /> }} />

      <Stack.Screen name="Change Password" component={ChangePasswordScreen} options={{ header: () => <Header /> }} />
    </Stack.Navigator>
  );
};

export default HomeStack;
