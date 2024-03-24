import { Pressable, Text, View } from "react-native";

import MateriaCommunitylIcons from "react-native-vector-icons/MaterialCommunityIcons";

const AttachButton = ({
  navigation,
  setBandAttachment,
  setBandAttachmentType,
  userId,
  roomId,
  name,
  image,
  position,
  email,
  type,
  active_member,
  isPinned,
  data,
  dataType,
}) => {
  return (
    <Pressable
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#FFFFFF",
        paddingVertical: 14,
        paddingHorizontal: 16,
      }}
      onPress={() => {
        setBandAttachment(data);
        setBandAttachmentType(dataType);
        navigation.navigate("Chat Room", {
          userId: userId,
          roomId: roomId,
          name: name,
          image: image,
          position: position,
          email: email,
          type: type,
          active_member: active_member,
          isPinned: isPinned,
          forwardedMessage: null,
        });
      }}
    >
      <View
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#F5F5F5",
          borderRadius: 5,
          padding: 10,
        }}
      >
        {dataType === "project" ? (
          <>
            <Text style={{ fontSize: 14, fontWeight: "400", color: "#176688" }}>Import Project</Text>
            <MateriaCommunitylIcons name="lightning-bolt" size={25} color="#176688" />
          </>
        ) : (
          <>
            <Text style={{ fontSize: 14, fontWeight: "400", color: "#176688" }}>Import Task</Text>
            <MateriaCommunitylIcons name="checkbox-outline" size={25} color="#176688" />
          </>
        )}
      </View>
    </Pressable>
  );
};

export default AttachButton;
