import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { useSelector } from "react-redux";

import { ScrollView } from "react-native-gesture-handler";
import { Box, Flex, Icon, Input, Pressable, Skeleton, Text } from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import AvatarPlaceholder from "../../components/shared/AvatarPlaceholder";
import { useWebsocketContext } from "../../HOC/WebsocketContextProvider";
import axiosInstance from "../../config/api";

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
            borderRadius={15}
            style={{ height: 40 }}
          />
        </Box>

        <Flex p={4} direction="row" alignItems="center" justifyContent="space-between">
          <Text opacity={0.5} fontWeight={500}>
            TEAMS
          </Text>

          <Box bg="#f1f2f3" alignItems="center" justifyContent="center" p={2} borderRadius={10}>
            <Icon as={<MaterialIcons name="add" />} color="black" />
          </Box>
        </Flex>
        {groupChats.length > 0 &&
          groupChats.map((group, idx) => {
            return (
              <Pressable
                key={idx}
                onPress={() => {
                  navigation.navigate("Chat Room", { name: group.name, image: group.image });
                }}
              >
                <Flex flexDir="row" justifyContent="space-between" p={4} borderBottomWidth={1} borderColor="#E8E9EB">
                  <Flex flexDir="row" gap={4} alignItems="center">
                    <AvatarPlaceholder image={group.image} name={group.name} size="md" />

                    <Box>
                      <Text fontSize={16}>#{group.name}</Text>

                      <Flex flexDir="row" alignItems="center" gap={1}>
                        <Text opacity={0.5}>
                          {group.latest_message.message?.length > 35
                            ? group.latest_message.message.slice(0, 35) + "..."
                            : group.latest_message.message}
                        </Text>
                      </Flex>
                    </Box>
                  </Flex>
                </Flex>
              </Pressable>
            );
          })}

        {/* ==================================================================== */}

        <Flex p={4} direction="row" alignItems="center" justifyContent="space-between">
          <Text opacity={0.5} fontWeight={500}>
            PEOPLE
          </Text>

          <Box bg="#f1f2f3" alignItems="center" justifyContent="center" p={2} borderRadius={10}>
            <Icon as={<MaterialIcons name="add" />} color="black" />
          </Box>
        </Flex>
        {personalChats.length > 0 &&
          personalChats.map((personal, idx) => {
            return (
              <Pressable
                key={idx}
                onPress={() => {
                  navigation.navigate("Chat Room", {
                    name: personal.user.name,
                    userId: personal.user.id,
                    image: personal.user.image,
                  });
                }}
              >
                <Flex flexDir="row" justifyContent="space-between" p={4} borderBottomWidth={1} borderColor="#E8E9EB">
                  <Flex flexDir="row" gap={4} alignItems="center">
                    <AvatarPlaceholder name={personal.user.name} image={personal.user.image} size="md" />

                    <Box>
                      <Text fontSize={16}>{personal.user.name}</Text>

                      <Flex flexDir="row" alignItems="center" gap={1}>
                        <Text opacity={0.5}>
                          {personal.latest_message.message.length > 35
                            ? personal.latest_message.message.slice(0, 35) + "..."
                            : personal.latest_message.message}
                        </Text>
                      </Flex>
                    </Box>
                  </Flex>
                </Flex>
              </Pressable>
            );
          })}
      </ScrollView>
    </Box>
  );
};

export default ChatListScreen;
