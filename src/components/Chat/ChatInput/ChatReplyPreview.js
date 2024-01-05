import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { StyleSheet, View, Text, Image } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { MimeTypeInfo } from "../../shared/MimeTypeInfo";
import ChatReplyPreviewMessage from "./ChatReplyPreviewMessage";

const ChatReplyPreview = ({ messageToReply, setMessageToReply, type }) => {
  const [mimeTypeInfo, setMimeTypeInfo] = useState(null);
  const loggedInUser = useSelector((state) => state.auth);

  useEffect(() => {
    if (messageToReply) {
      setMimeTypeInfo(MimeTypeInfo(messageToReply.mime_type));
    } else {
      setMimeTypeInfo(null);
    }
  }, [messageToReply]);

  return (
    messageToReply && (
      <View
        style={{
          paddingVertical: 5,
          paddingHorizontal: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={styles.container}>
          <View style={{ width: mimeTypeInfo?.file_type === "image" ? 200 : 200 }}>
            <Text style={{ fontSize: 12, fontWeight: "700", color: "#176688" }}>
              {messageToReply?.from_user_id === loggedInUser.id ? "You" : messageToReply?.user?.name}
            </Text>
            <ChatReplyPreviewMessage
              message={messageToReply}
              myMessage={messageToReply?.from_user_id === loggedInUser?.id}
              type={type}
            />
          </View>
          {mimeTypeInfo?.file_type === "image" && (
            <Image
              source={{ uri: `${process.env.EXPO_PUBLIC_API}/image/${messageToReply?.file_path}` }}
              alt="Attachment Preview"
              style={{
                width: 50,
                height: 50,
                resizeMode: "contain",
              }}
            />
          )}
        </View>
        <MaterialCommunityIcons
          name="close-circle-outline"
          size={20}
          color="#9E9E9E"
          onPress={() => setMessageToReply(null)}
        />
      </View>
    )
  );
};

export default ChatReplyPreview;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#17668814",
    borderLeftWidth: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderLeftColor: "#176688",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});
