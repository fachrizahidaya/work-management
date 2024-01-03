import dayjs from "dayjs";

import { View, Pressable, Text } from "react-native";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";

const ChatProjectItem = ({
  navigation,
  name,
  date,
  owner,
  image,
  id,
  selected,
  setSelected,
  nameUser,
  imageUser,
  type,
  active_member,
  isPinned,
  email,
  project,
  userId,
  roomId,
  position,
  setBandAttachment,
  setBandAttachmentType,
}) => {
  return (
    <View style={{ marginVertical: 5 }}>
      <Pressable
        onPress={() => {
          setSelected(project);
          navigation.navigate("Project Detail Screen", {
            project_id: id,
            selected: selected,
            setBandAttachment: setBandAttachment,
            setBandAttachmentType: setBandAttachmentType,
            projectData: project,
            name: nameUser,
            image: imageUser,
            type: type,
            active_member: active_member,
            isPinned: isPinned,
            email: email,
            userId: userId,
            roomId: roomId,
            position: position,
          });
        }}
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#FFFFFF",
          padding: 10,
          borderRadius: 10,
        }}
      >
        <View>
          <Text style={{ fontSize: 14, fontWeight: "400" }}>{name.length > 50 ? name.slice(0, 30) + "..." : name}</Text>
          <Text style={{ fontSize: 12, fontWeight: "300", opacity: 0.5 }}>
            Due {dayjs(date).format("DD MMMM YYYY")}
          </Text>
        </View>
        <AvatarPlaceholder name={owner} image={image} size="sm" />
      </Pressable>
    </View>
  );
};

export default ChatProjectItem;
