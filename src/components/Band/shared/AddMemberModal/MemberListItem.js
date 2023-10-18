import React from "react";

import { Box, Flex, Icon, Text } from "native-base";
import { TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../../shared/AvatarPlaceholder";

const MemberListItem = ({
  id,
  image,
  name,
  userType,
  onPressAddHandler,
  onPressRemoveHandler,
  selectedUsers,
  multiSelect,
  onPressHandler,
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        if (multiSelect) {
          // If user already inside array, remove onpress
          if (selectedUsers.includes(id)) {
            onPressRemoveHandler(id);
          } else {
            // If user not inside array, add onpress
            onPressAddHandler(id);
          }
        } else {
          onPressHandler(id);
        }
      }}
    >
      <Flex flexDir="row" justifyContent="space-between" alignItems="center">
        <Flex flexDir="row" alignItems="center" gap={2} mb={2}>
          <AvatarPlaceholder image={image} name={name} />
          <Box>
            <Text>{name}</Text>
            <Text fontSize={10} opacity={0.5}>
              {userType}
            </Text>
          </Box>
        </Flex>

        {selectedUsers.includes(id) && (
          <Icon as={<MaterialCommunityIcons name="checkbox-marked" />} size="md" color="primary.600" />
        )}
      </Flex>
    </TouchableOpacity>
  );
};

export default MemberListItem;
