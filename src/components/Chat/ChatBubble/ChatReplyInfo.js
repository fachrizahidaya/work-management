import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MimeTypeInfo } from "../../shared/MimeTypeInfo";
import { Box, Flex, Image, Text } from "native-base";
import ChatMessageText from "../ChatMessageText/ChatMessageText";

const ChatReplyInfo = ({ message, myMessage, chatBubbleView }) => {
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
    <Flex px={2} py={2} backgroundColor={!myMessage ? "#f1f1f1" : "#1b536b"} flexDirection="row" alignItems="center">
      <Flex>
        <Text fontSize={12} fontWeight={400} color={!myMessage ? "#000000" : "#FFFFFF"}>
          {message?.from_user_id === loggedInUser.id ? "You" : message?.user?.name}
        </Text>
        <ChatMessageText message={message} myMessage={myMessage} />
      </Flex>
      {mimeTypeInfo?.file_type === "image" && (
        <Image
          source={{ uri: `${process.env.EXPO_PUBLIC_API}/image/${message?.file_path}` }}
          alt="Attachment Preview"
          width={10}
          height={10}
          resizeMode="contain"
        />
      )}
    </Flex>
  );
};

export default ChatReplyInfo;
