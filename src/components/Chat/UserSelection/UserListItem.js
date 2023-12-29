import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

import { View, Text } from "react-native";
import { TouchableOpacity } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";

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
              roomId: roomId,
              image: image,
              position: userType,
              email: email,
              type: type,
              active_member: active_member,
            });
          }
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <AvatarPlaceholder image={image} name={name} size="md" />
            <View>
              <Text>{name}</Text>
              <Text style={{ fontSize: 12, opacity: 0.5 }}>{userType}</Text>
            </View>
          </View>

          {multiSelect && (
            <View>
              {selectedUsers.find((val) => val.id === id) && (
                <MaterialCommunityIcons name="checkbox-marked" size={20} color="primary.600" />
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    )
  );
};

export default UserListItem;
