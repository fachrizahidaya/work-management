import { View, Text, TouchableOpacity } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";
import { TextProps } from "../../shared/CustomStylings";

const UserListItem = ({
  user,
  id,
  roomId,
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
  navigation,
  userSelector,
}) => {
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
              roomId: roomId,
              image: image,
              position: userType,
              email: email,
              type: type,
              active_member: active_member,
              forwardedMessage: null,
            });
          }
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <AvatarPlaceholder image={image} name={name} size="md" />
            <View>
              <Text style={[{ fontSize: 12 }, TextProps]}>{name}</Text>
              <Text style={[{ fontSize: 12, opacity: 0.5 }, TextProps]}>{userType}</Text>
            </View>
          </View>

          {multiSelect && (
            <View>
              {selectedUsers.find((val) => val.id === id) && (
                <MaterialCommunityIcons name="checkbox-marked" size={20} color="#176688" />
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    )
  );
};

export default UserListItem;
