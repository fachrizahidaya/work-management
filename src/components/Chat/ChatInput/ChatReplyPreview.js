import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { StyleSheet, View, Text, Image } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { MimeTypeInfo } from "../../shared/MimeTypeInfo";
import ChatReplyPreviewMessage from "./ChatReplyPreviewMessage";

const ChatReplyPreview = ({ messageToReply, setMessageToReply, memberName, keyword = "" }) => {
  const [mimeTypeInfo, setMimeTypeInfo] = useState(null);
  const loggedInUser = useSelector((state) => state.auth);

  const boldMatchCharacters = (sentence = "", characters = "") => {
    const regex = new RegExp(characters, "gi");
    return sentence.replace(regex, `<strong class='text-primary'>$&</strong>`);
  };

  const renderDangerouslyInnerHTMLContent = (message = "", alt_message = "") => {
    for (let i = 0; i < memberName.length; i++) {
      let placeholder = new RegExp(`\\@\\[${memberName[i]}\\]\\(\\d+\\)`, "g");
      message = message?.replace(placeholder, `@${memberName[i]}`);
    }
    if (message) {
      if (keyword) {
        return boldMatchCharacters(message, keyword);
      }
      return message;
    }
    return alt_message;
  };

  const renderMessage = (attachment_type) => {
    if (attachment_type === "image") {
      return (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "400",
              color: "#3F434A",
              width: 200,
              overflow: "hidden",
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            <MaterialCommunityIcons name="image" color="#3F434A" />
            {renderDangerouslyInnerHTMLContent(messageToReply?.message, "Image")}
          </Text>
        </View>
      );
    } else if (
      attachment_type === "document" ||
      attachment_type?.includes("spreadsheet") ||
      attachment_type?.includes("presentation") ||
      attachment_type?.includes("word")
    ) {
      return (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "400",
              color: "#3F434A",
              width: 200,
              overflow: "hidden",
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            <MaterialCommunityIcons name="file-outline" color="#3F434A" />
            {renderDangerouslyInnerHTMLContent(messageToReply?.message, messageToReply?.file_name)}
          </Text>
        </View>
      );
    } else {
      if (messageToReply?.project_id) {
        return (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "400",
                color: "#3F434A",
                width: 200,
                overflow: "hidden",
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              <MaterialCommunityIcons name="lightning-bolt" color="#3F434A" />
              {renderDangerouslyInnerHTMLContent(messageToReply?.message, messageToReply?.project_title)}
            </Text>
          </View>
        );
      } else if (messageToReply?.task_id) {
        return (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "400",
                color: "#3F434A",
                width: 200,
                overflow: "hidden",
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              <MaterialCommunityIcons name="checkbox-marked-circle-outline" color="#3F434A" />
              {renderDangerouslyInnerHTMLContent(messageToReply?.message, messageToReply?.task_title)}
            </Text>
          </View>
        );
      } else {
        return (
          <Text
            style={{
              fontSize: 12,
              fontWeight: "400",
              color: "#3F434A",
              width: 200,
              overflow: "hidden",
            }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {renderDangerouslyInnerHTMLContent(messageToReply?.message)}
          </Text>
        );
      }
    }
  };

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
          paddingHorizontal: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
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
              memberName={memberName}
              renderMessage={renderMessage}
            />
          </View>
          {mimeTypeInfo?.file_type === "image" && (
            <Image
              source={{ uri: `${process.env.EXPO_PUBLIC_API}/image/${messageToReply?.file_path}` }}
              alt="Attachment Preview"
              style={{
                width: 50,
                height: 50,
                resizeMode: "cover",
              }}
            />
          )}
        </View>
        <MaterialCommunityIcons name="close" size={20} color="#9E9E9E" onPress={() => setMessageToReply(null)} />
      </View>
    )
  );
};

export default ChatReplyPreview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderRadius: 10,
  },
});
