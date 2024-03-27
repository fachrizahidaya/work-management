import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";
import { TextProps } from "../../shared/CustomStylings";

const GroupListItem = ({
  name,
  image,
  user_id,
  room_id,
  navigation,
  active_member,
  userType,
  email,
  type,
  message,
  project,
  task,
  file_path,
  file_name,
  file_size,
  mime_type,
}) => {
  return (
    <>
      <TouchableOpacity
        onPress={() => {
          navigation.push("Chat Room", {
            name: name,
            userId: user_id,
            roomId: room_id,
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
    </>
  );
};

export default GroupListItem;

const styles = StyleSheet.create({
  contactBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#E8E9EB",
  },
});
