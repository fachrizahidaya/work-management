import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { useSelector } from "react-redux";

import { StyleSheet, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Box, Flex, Icon, Input, Pressable, Text } from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { useWebsocketContext } from "../../HOC/WebsocketContextProvider";
import axiosInstance from "../../config/api";
import ContactListItem from "../../components/Chat/ContactListItem/ContactListItem";

const ChatListScreen = () => {
  const userSelector = useSelector((state) => state.auth);
  const navigation = useNavigation();
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

  return (
    <Box bgColor="white" flex={1}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box p={4}>
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
        </Box>

        <Flex p={4} direction="row" alignItems="center" justifyContent="space-between">
          <Text opacity={0.5} fontWeight={500}>
            TEAMS
          </Text>

          <TouchableOpacity style={styles.addButton}>
            <Icon as={<MaterialIcons name="add" />} color="black" />
          </TouchableOpacity>
        </Flex>
        {groupChats.length > 0 &&
          groupChats.map((group) => {
            return <ContactListItem group={group} type="group" key={group.id} />;
          })}

        {/* ==================================================================== */}

        <Flex p={4} direction="row" alignItems="center" justifyContent="space-between">
          <Text opacity={0.5} fontWeight={500}>
            PEOPLE
          </Text>

          <TouchableOpacity style={styles.addButton}>
            <Icon as={<MaterialIcons name="add" />} color="black" />
          </TouchableOpacity>
        </Flex>
        {personalChats.length > 0 &&
          personalChats.map((personal) => {
            return <ContactListItem personal={personal} type="personal" key={personal.id} />;
          })}
      </ScrollView>
    </Box>
  );
};

export default ChatListScreen;

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: "#f1f2f3",
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
    borderRadius: 8,
  },
});
