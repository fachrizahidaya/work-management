import React, { useEffect, useState } from "react";

import { Flex, Icon, Text } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { MimeTypeInfo } from "../../shared/MimeTypeInfo";

const ChatMessageText = ({ message, myMessage, keyword = "", type }) => {
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
        <Flex alignItems="flex-start" flexDirection="row">
          <Text fontSize={12} fontWeight={400} color={!myMessage ? "#000000" : "#FFFFFF"}>
            <Icon
              as={<MaterialCommunityIcons name="image" />}
              color={!myMessage ? "#000000" : type === "group" && !myMessage ? "#000000" : "#FFFFFF"}
            />
            {renderDangerouslyInnerHTMLContent(message?.message, "Image")}
          </Text>
        </Flex>
      );
    } else if (attachment_type === "document") {
      return (
        <Flex alignItems="flex-start" flexDirection="row">
          <Text fontSize={12} fontWeight={400} color={!myMessage ? "#000000" : "#FFFFFF"}>
            <Icon
              as={<MaterialCommunityIcons name="file-outline" />}
              color={!myMessage ? "#000000" : type === "group" && !myMessage ? "#000000" : "#FFFFFF"}
            />
            {renderDangerouslyInnerHTMLContent(message?.message, message?.file_name)}
          </Text>
        </Flex>
      );
    } else {
      if (message?.project_id) {
        return (
          <Flex alignItems="flex-start" flexDirection="row">
            <Text fontSize={12} fontWeight={400} color={!myMessage ? "#000000" : "#FFFFFF"}>
              <Icon
                as={<MaterialCommunityIcons name="lightning-bolt" />}
                color={!myMessage ? "#000000" : type === "group" && !myMessage ? "#000000" : "#FFFFFF"}
              />
              {renderDangerouslyInnerHTMLContent(message?.message, message?.project_title)}
            </Text>
          </Flex>
        );
      } else if (message?.task_id) {
        return (
          <Flex alignItems="flex-start" flexDirection="row">
            <Text
              fontSize={12}
              fontWeight={400}
              color={!myMessage ? "#000000" : type === "group" ? "#000000" : "#FFFFFF"}
            >
              <Icon
                as={<MaterialCommunityIcons name="checkbox-marked-circle-outline" />}
                color={!myMessage ? "#000000" : type === "group" && !myMessage ? "#000000" : "#FFFFFF"}
              />
              {renderDangerouslyInnerHTMLContent(message?.message, message?.task_title)}
            </Text>
          </Flex>
        );
      } else {
        return (
          <Text
            fontSize={12}
            fontWeight={400}
            color={!myMessage ? "#000000" : type === "group" && !myMessage ? "#000000" : "#FFFFFF"}
          >
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
    <>
      {message?.delete_for_everyone ? (
        <Text fontSize={12} fontWeight={400} color={!myMessage ? "black" : "white"} fontStyle="italic">
          Message has been deleted
        </Text>
      ) : (
        renderMessage(mimeTypeInfo?.file_type)
      )}
    </>
  );
};

export default ChatMessageText;
