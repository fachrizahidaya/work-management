import React from "react";

import { useSelector } from "react-redux";
import dayjs from "dayjs";

import { Box, Flex, Icon, Pressable, Text } from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";

const ChatBubble = ({ chat, image, name, fromUserId, id, content, time }) => {
  const userSelector = useSelector((state) => state.auth);
  const myMessage = userSelector.id === fromUserId;
  return (
    <Flex m={3} flexDirection={!myMessage ? "row" : "row-reverse"}>
      {!myMessage && <AvatarPlaceholder name={name} size="md" />}

      <Flex flexDirection={!myMessage ? "row" : "row-reverse"}>
        <Box
          borderRadius={15}
          py={2}
          px={4}
          bgColor={!myMessage ? "transparent" : "primary.600"}
          maxW={180}
          borderWidth={!myMessage ? 1 : 0}
          borderColor={!myMessage && "#E8E9EB"}
          justifyContent="center"
        >
          <Text color={!myMessage ? "black" : "white"}>{content}</Text>
        </Box>
      </Flex>
    </Flex>
  );
};

export default ChatBubble;
