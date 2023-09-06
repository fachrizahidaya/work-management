import React from "react";

import { Box, Flex, Pressable, Text } from "native-base";

import AvatarPlaceholder from "../../../shared/AvatarPlaceholder";

const MemberListItem = ({ id, image, name, userType, onPressHandler }) => {
  return (
    <Pressable onPress={() => onPressHandler(id)}>
      <Flex flexDir="row" alignItems="center" gap={2} mb={2}>
        <AvatarPlaceholder image={image} name={name} />
        <Box>
          <Text>{name}</Text>
          <Text fontSize={10} opacity={0.5}>
            {userType}
          </Text>
        </Box>
      </Flex>
    </Pressable>
  );
};

export default MemberListItem;
