import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { View, Text, Image, StyleSheet } from "react-native";

import { MimeTypeInfo } from "../../shared/MimeTypeInfo";
import ChatMessageText from "../ChatMessageText/ChatMessageText";

const ChatReplyInfo = ({ message, myMessage, type }) => {
  const [mimeTypeInfo, setMimeTypeInfo] = useState(null);
  const loggedInUser = useSelector((state) => state.auth);

  useEffect(() => {
    if (message) {
      setMimeTypeInfo(MimeTypeInfo(message.mime_type));
    } else {
      setMimeTypeInfo(null);
    }
  }, [message]);

  return (
    <View style={styles.container}>
      <View width={mimeTypeInfo?.file_type === "image" ? 200 : null}>
        <Text style={{ fontSize: 12, fontWeight: "700", color: !myMessage ? "#000000" : "#FFFFFF" }}>
          {message?.from_user_id === loggedInUser.id ? "You" : message?.user?.name}
        </Text>
        <ChatMessageText message={message} myMessage={myMessage} type={type} />
      </View>
      {mimeTypeInfo?.file_type === "image" && (
        <Image
          source={{ uri: `${process.env.EXPO_PUBLIC_API}/image/${message?.file_path}` }}
          alt="Attachment Preview"
          style={{ width: 9, height: 10, resizeMode: "contain" }}
        />
      )}
    </View>
  );
};

export default ChatReplyInfo;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "space-between",
    borderLeftColor: "#37b4ea",
    borderLeftWidth: 1,
    borderRadius: 5,
    px: 5,
    py: 5,
    gap: 5,
  },
});
