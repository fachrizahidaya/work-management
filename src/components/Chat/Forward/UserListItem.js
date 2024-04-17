import { Text, TouchableOpacity, View } from "react-native";

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
  email,
  type,
  active_member,
  navigation,
  message,
  project,
  task,
  file_path,
  file_name,
  file_size,
  mime_type,
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.push("Chat Room", {
          name: name,
          userId: id,
          roomId: roomId,
          image: image,
          position: userType,
          email: email,
          type: type,
          active_member: active_member,
          forwardedMessage: message,
          forwardedProject: project,
          forwardedTask: task,
          forwarded_file_path: file_path,
          forwarded_file_name: file_name,
          forwarded_file_size: file_size,
          forwarded_mime_type: mime_type,
        });
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

        {/* {multiSelect && (
        <View>
          {selectedUsers.find((val) => val.id === id) && (
            <MaterialCommunityIcons name="checkbox-marked" size={20} color="#176688" />
          )}
        </View>
      )} */}
      </View>
    </TouchableOpacity>
  );
};

export default UserListItem;
