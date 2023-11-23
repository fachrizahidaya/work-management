import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Flex, Image, Text } from "native-base";

import { MimeTypeInfo } from "../../shared/MimeTypeInfo";
import ChatMessageText from "../ChatMessageText/ChatMessageText";

const ChatReplyInfo = ({ message, myMessage, chatBubbleView, type }) => {
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
    <Flex
      position="relative"
      borderLeftColor="#37b4ea"
      borderLeftWidth={5}
      borderRadius={5}
      px={2}
      py={2}
      gap={2}
      backgroundColor={!myMessage ? "#f1f1f1" : "#1b536b"}
      flexDirection="row"
      justifyContent="space-between"
    >
      <Flex width={mimeTypeInfo?.file_type === "image" ? 200 : null}>
        <Text fontSize={12} fontWeight={700} color={!myMessage ? "#000000" : "#FFFFFF"}>
          {message?.from_user_id === loggedInUser.id ? "You" : message?.user?.name}
        </Text>
        <ChatMessageText message={message} myMessage={myMessage} type={type} />
      </Flex>
      {mimeTypeInfo?.file_type === "image" && (
        <Image
          source={{ uri: `${process.env.EXPO_PUBLIC_API}/image/${message?.file_path}` }}
          alt="Attachment Preview"
          width={9}
          height={10}
          resizeMode="contain"
        />
      )}
    </Flex>
  );
};

export default ChatReplyInfo;
