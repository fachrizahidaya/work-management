import React from "react";
import { useNavigation } from "@react-navigation/native";

import { useSelector } from "react-redux";

import { Box, Flex, Icon, Text } from "native-base";
import { TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";

const UserListItem = ({
  user,
  id,
  image,
  name,
  userType,
  onPressAddHandler,
  onPressRemoveHandler,
  selectedUsers,
  multiSelect,
  email,
  type,
  active_member,
  setForceRender,
  forceRender,
  selectedGroupMembers,
}) => {
  const userSelector = useSelector((state) => state.auth);
  const navigation = useNavigation();

  return (
    userSelector.id !== id && (
      <TouchableOpacity
        onPress={() => {
          if (multiSelect) {
            // If user already inside array, remove onpress
            if (selectedUsers.find((val) => val.id === id)) {
              onPressRemoveHandler(user);
            } else {
              // If user not inside array, add onpress
              onPressAddHandler(user);
            }
          } else {
            navigation.navigate("Chat Room", {
              name: name,
              userId: id,
              image: image,
              position: userType,
              email: email,
              type: type,
              active_member: active_member,
              setForceRender: setForceRender,
              forceRender: forceRender,
              selectedGroupMembers: selectedGroupMembers,
            });
          }
        }}
      >
        <Flex flexDir="row" justifyContent="space-between" alignItems="center">
          <Flex flexDir="row" alignItems="center" gap={2} mb={2}>
            <AvatarPlaceholder image={image} name={name} size="md" />
            <Box>
              <Text>{name}</Text>
              <Text fontSize={12} opacity={0.5}>
                {userType}
              </Text>
            </Box>
          </Flex>

          {multiSelect && (
            <>
              {selectedUsers.find((val) => val.id === id) && (
                <Icon as={<MaterialCommunityIcons name="checkbox-marked" />} size="md" color="primary.600" />
              )}
            </>
          )}
        </Flex>
      </TouchableOpacity>
    )
  );
};

export default UserListItem;
