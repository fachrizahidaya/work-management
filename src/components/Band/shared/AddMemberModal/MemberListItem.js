import React from "react";

import { Text, TouchableOpacity, View } from "react-native";
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
  avatarSize,
  descriptionSize,
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
      <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <AvatarPlaceholder image={image} name={name} size={avatarSize} />
          <View>
            <Text style={{ fontWeight: 500 }}>{name}</Text>
            <Text style={{ fontWeight: 500, fontSize: descriptionSize || 10, opacity: 0.5 }}>{userType}</Text>
          </View>
        </View>

        {selectedUsers.includes(id) && <MaterialCommunityIcons name="checkbox-marked" color="#176688" size={20} />}
      </View>
    </TouchableOpacity>
  );
};

export default MemberListItem;
