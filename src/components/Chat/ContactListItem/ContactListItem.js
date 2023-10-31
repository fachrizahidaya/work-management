import React from "react";
import { useNavigation } from "@react-navigation/native";

import { Box, Flex, Pressable, Text } from "native-base";

import AvatarPlaceholder from "../../../components/shared/AvatarPlaceholder";

const ContactListItem = ({ personal, group, type }) => {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => {
        if (type === "personal") {
          navigation.navigate("Chat Room", {
            name: personal.user.name,
            userId: personal.user.id,
            image: personal.user.image,
          });
        } else {
          navigation.navigate("Chat Room", {
            name: group.name,
            userId: group.id,
            image: group.image,
          });
        }
      }}
    >
      <Flex flexDir="row" justifyContent="space-between" p={4} borderBottomWidth={1} borderColor="#E8E9EB">
        <Flex flexDir="row" gap={4} alignItems="center">
          <AvatarPlaceholder
            name={type === "personal" ? personal.user.name : group.name}
            image={type === "personal" ? personal.user.image : group.image}
            size="md"
          />

          <Box>
            <Text fontSize={16}>{type === "personal" ? personal.user.name : group.name}</Text>

            <Flex flexDir="row" alignItems="center" gap={1}>
              {type === "personal" ? (
                <Text opacity={0.5}>
                  {personal.latest_message?.message?.length > 35
                    ? personal.latest_message?.message?.slice(0, 35) + "..."
                    : personal.latest_message?.message}
                </Text>
              ) : (
                <Text>
                  {group.latest_message?.message?.length > 35
                    ? group.latest_message?.message?.slice(0, 35) + "..."
                    : group.latest_message?.message}
                </Text>
              )}
            </Flex>
          </Box>
        </Flex>
      </Flex>
    </Pressable>
  );
};

export default ContactListItem;
