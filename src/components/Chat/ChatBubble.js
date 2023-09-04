import React from "react";
import { Avatar, Box, Flex, Icon, Pressable, Text } from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import dayjs from "dayjs";

const ChatBubble = ({ image, alignSelf, content, color }) => {
  const elon = "https://upload.wikimedia.org/wikipedia/commons/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg";
  return (
    <Flex m={3} flexDirection={alignSelf === "flex-start" ? "row" : "row-reverse"} gap={4}>
      <Avatar
        source={{
          uri: alignSelf === "flex-end" ? elon : image,
        }}
      >
        BG
      </Avatar>

      <Flex flexDirection={alignSelf === "flex-start" ? "row" : "row-reverse"} gap={4}>
        <Box
          borderRadius={15}
          py={2}
          px={4}
          bgColor={color}
          style={{ maxWidth: 180, maxHeight: 200 }}
          borderWidth={alignSelf === "flex-start" ? 1 : 0}
          borderColor={alignSelf === "flex-start" && "#E8E9EB"}
          justifyContent="center"
        >
          <Text color={alignSelf === "flex-start" ? "black" : "white"}>{content}</Text>
        </Box>

        <Pressable alignSelf="center">
          <Icon as={<MaterialIcons name="more-horiz" />} size="lg" color="#C6C9CC" />
        </Pressable>
      </Flex>
    </Flex>
  );
};

export default ChatBubble;
