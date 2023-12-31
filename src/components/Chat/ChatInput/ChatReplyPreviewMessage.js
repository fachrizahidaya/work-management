import { useEffect, useState } from "react";

import { Flex, Icon } from "native-base";
import { View, Text } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { MimeTypeInfo } from "../../shared/MimeTypeInfo";

const ChatReplyPreviewMessage = ({ message, keyword = "", type }) => {
  const [mimeTypeInfo, setMimeTypeInfo] = useState(null);

  const boldMatchCharacters = (sentence = "", characters = "") => {
    const regex = new RegExp(characters, "gi");
    return sentence.replace(regex, `<strong class='text-primary'>$&</strong>`);
  };

  const renderDangerouslyInnerHTMLContent = (message = "", alt_message = "") => {
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
          <Text style={{ fontSize: 12, fontWeight: "400", color: "#000000" }}>
            <MaterialCommunityIcons name="image" color="#000000" />
            {renderDangerouslyInnerHTMLContent(message?.message, "Image")}
          </Text>
        </View>
      );
    } else if (attachment_type === "document") {
      return (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontSize: 12, fontWeight: "400", color: "#000000" }}>
            <MaterialCommunityIcons name="file-outline" color="#000000" />
            {renderDangerouslyInnerHTMLContent(message?.message, message?.file_name)}
          </Text>
        </View>
      );
    } else {
      if (message?.project_id) {
        return (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 12, fontWeight: "400", color: "#000000" }}>
              <MaterialCommunityIcons name="lightning-bolt" color="#000000" />
              {renderDangerouslyInnerHTMLContent(message?.message, message?.project_title)}
            </Text>
          </View>
        );
      } else if (message?.task_id) {
        return (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 12, fontWeight: "400", color: "#000000" }}>
              <MaterialCommunityIcons name="checkbox-marked-circle-outline" color="#000000" />
              {renderDangerouslyInnerHTMLContent(message?.message, message?.task_title)}
            </Text>
          </View>
        );
      } else {
        return (
          <Text style={{ fontSize: 12, fontWeight: "400", color: "#3F434A" }}>
            {renderDangerouslyInnerHTMLContent(message?.message)}
          </Text>
        );
      }
    }
  };

  useEffect(() => {
    if (message) {
      setMimeTypeInfo(MimeTypeInfo(message.mime_type));
    }
  }, [message]);

  return (
    <>{message?.delete_for_everyone ? <Text>Message has been deleted</Text> : renderMessage(mimeTypeInfo?.file_type)}</>
  );
};

export default ChatReplyPreviewMessage;
