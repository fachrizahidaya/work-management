import React, { useEffect, useState } from "react";

import { ScrollView } from "react-native-gesture-handler";
import { Icon, Input, Pressable, VStack } from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { useWebsocketContext } from "../../HOC/WebsocketContextProvider";
import axiosInstance from "../../config/api";
import GroupSection from "../../components/Chat/GroupSection/GroupSection";
import PersonalSection from "../../components/Chat/PersonalSection/PersonalSection";

const ChatListScreen = () => {
  const userSelector = useSelector((state) => state.auth);
  const navigation = useNavigation();
  const userSelector = useSelector((state) => state.auth);
  const [personalChats, setPersonalChats] = useState([]);
  const [groupChats, setGroupChats] = useState([]);
  const { laravelEcho, setLaravelEcho } = useWebsocketContext();

  /**
   * Event listener for new chats
   */
  const personalChatEvent = () => {
    laravelEcho.channel(`personal.list.${userSelector?.id}`).listen(".personal.list", (event) => {
      setPersonalChats(event.data);
    });
  };

  /**
   * Event listener for new group chats
   */
  const groupChatEvent = () => {
    laravelEcho.channel(`group.list.${userSelector.id}`).listen(".group.list", (event) => {
      setGroupChats(event.data);
    });
  };

  /**
   * Fetch all personal chats
   */
  const fetchPersonalChats = async () => {
    try {
      const res = await axiosInstance.get("/chat/personal");
      setPersonalChats(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Fetch all personal chats
   */
  const fetchGroupChats = async () => {
    try {
      const res = await axiosInstance.get("/chat/group");
      setGroupChats(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPersonalChats();
    fetchGroupChats();
  }, []);

  useEffect(() => {
    personalChatEvent();
    groupChatEvent();
  }, [userSelector.id]);

  // Removes chat room screen from stack if app opens by pressing push notification
  useEffect(() => {
    const { routes } = navigation.getState();

    const filteredRoutes = routes.filter((route) => route.name !== "Chat Room");

    navigation.reset({
      index: filteredRoutes.length - 1,
      routes: filteredRoutes,
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack p={4} space={2}>
          <Input
            variant="unstyled"
            size="lg"
            InputLeftElement={
              <Pressable>
                <Icon as={<MaterialIcons name="search" />} size="lg" ml={2} color="muted.400" />
              </Pressable>
            }
            placeholder="Search..."
            borderColor="white"
            bgColor="#F8F8F8"
          />
        </VStack>

        <GroupSection groupChats={groupChats} />

        <PersonalSection personalChats={personalChats} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChatListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
