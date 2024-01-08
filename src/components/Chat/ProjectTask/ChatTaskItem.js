import dayjs from "dayjs";

import { View, Pressable, Text } from "react-native";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";
import { TextProps } from "../../shared/CustomStylings";

const ChatTaskItem = ({
  id,
  navigation,
  name,
  date,
  owner,
  image,
  setBandAttachment,
  setBandAttachmentType,
  userId,
  roomId,
  imageUser,
  position,
  email,
  nameUser,
  type,
  active_member,
  isPinned,
  item,
}) => {
  return (
    <View style={{ marginVertical: 5 }}>
      <Pressable
        onPress={() => {
          navigation.navigate("Task Detail Screen", {
            task_id: id,
            setBandAttachment: setBandAttachment,
            setBandAttachmentType: setBandAttachmentType,
            userId: userId,
            roomId: roomId,
            name: nameUser,
            image: imageUser,
            position: position,
            email: email,
            type: type,
            active_member: active_member,
            isPinned: isPinned,
            taskData: item,
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
          <Text style={[{ fontSize: 14 }, TextProps]}>{name.length > 50 ? name.slice(0, 30) + "..." : name}</Text>
          <Text style={[{ fontSize: 12, opacity: 0.5 }, TextProps]}>Due {dayjs(date).format("DD MMMM YYYY")}</Text>
        </View>
        <AvatarPlaceholder name={owner} image={image} size="sm" />
      </Pressable>
    </View>
  );
};

export default ChatTaskItem;
