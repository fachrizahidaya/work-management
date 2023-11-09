import React from "react";

import { useSelector } from "react-redux";

import RenderHtml from "react-native-render-html";
import { Box, Flex, HStack, Text, VStack } from "native-base";
import { Dimensions } from "react-native";

import ChatTimeStamp from "../../ChatTimeStamp/ChatTimeStamp";

const GlobalSearchChatList = ({ chat, searchKeyword, group }) => {
  const { width } = Dimensions.get("screen");
  const userSelector = useSelector((state) => state.auth);

  const boldMatchCharacters = (sentence = "", characters = "") => {
    const regex = new RegExp(characters, "gi");
    return sentence.replace(regex, `<strong style="color: #176688;">$&</strong>`);
  };

  const renderChat = () => {
    return boldMatchCharacters(chat?.message, searchKeyword);
  };

  return (
    <Flex p={4} borderBottomWidth={1} borderColor="#E8E9EB">
      {group ? (
        <>
          <HStack justifyContent="space-between">
            <Text fontSize={16} fontWeight={600}>
              {group.name}
            </Text>

            <ChatTimeStamp time={chat.created_time} timestamp={chat.created_at} />
          </HStack>
          <HStack space={1}>
            <Text>{userSelector.id === chat?.user?.id ? "You: " : `${chat?.user?.name}: `}</Text>

            <Box flex={1} style={{ marginTop: 3 }}>
              <RenderHtml
                contentWidth={width}
                source={{
                  html: renderChat(),
                }}
              />
            </Box>
          </HStack>
        </>
      ) : (
        <>
          <VStack>
            <HStack justifyContent="space-between">
              <Text fontSize={16} fontWeight={600}>
                {chat?.user?.name}
              </Text>

              <ChatTimeStamp time={chat.created_time} timestamp={chat.created_at} />
            </HStack>
            <Box flex={1} style={{ marginTop: 3 }}>
              <RenderHtml
                contentWidth={width}
                source={{
                  html: renderChat(),
                }}
              />
            </Box>
          </VStack>
        </>
      )}
    </Flex>
  );
};

export default GlobalSearchChatList;
