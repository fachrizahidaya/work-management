import React from "react";

import { Box, Flex, Icon, Pressable, Text } from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import AvatarPlaceholder from "../../../components/shared/AvatarPlaceholder";

const ChatHeader = ({ navigation, name, image }) => {
  return (
    <Flex direction="row" justifyContent="space-between" bg="white" borderBottomWidth={1} borderColor="#E8E9EB" p={4}>
      <Flex direction="row" alignItems="center" gap={4}>
        <Pressable onPress={() => navigation.navigate("Chat List")}>
          <Icon as={<MaterialIcons name="keyboard-backspace" />} size="xl" color="#3F434A" />
        </Pressable>

        <AvatarPlaceholder name={name} image={image} size="sm" />

        <Box>
          <Text fontSize={15}>{name}</Text>
          <Text fontSize={13}>Project Analyst</Text>
        </Box>
      </Flex>

      <Flex direction="row" alignItems="center" gap={4}>
        <Pressable>
          <Icon as={<MaterialIcons name="add" />} size="xl" color="#8A9099" />
        </Pressable>

        <Pressable>
          <Icon as={<MaterialIcons name="more-horiz" />} size="xl" color="#8A9099" />
        </Pressable>
      </Flex>
    </Flex>
  );
};

export default ChatHeader;
