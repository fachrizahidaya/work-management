import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { Flex, Icon, Image, Text } from "native-base";

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
    <>
      {messageToReply && (
        <Flex flexDirection="row" alignItems="center" py={3} px={4} justifyContent="space-between">
          <Flex
            borderLeftColor="#37b4ea"
            borderLeftWidth={5}
            borderRadius={5}
            px={2}
            py={2}
            gap={2}
            width={300}
            backgroundColor="#f1f1f1"
            flexDirection="row"
            alignItems="center"
          >
            <Flex width={mimeTypeInfo?.file_type === "image" ? 200 : null}>
              <Text fontSize={12} fontWeight={700} color="#000000">
                {messageToReply?.from_user_id === loggedInUser.id ? "You" : messageToReply?.user?.name}
              </Text>
              <ChatReplyPreviewMessage
                message={messageToReply}
                myMessage={messageToReply?.from_user_id === loggedInUser?.id}
                type={type}
              />
            </Flex>
            {mimeTypeInfo?.file_type === "image" && (
              <Image
                source={{ uri: `${process.env.EXPO_PUBLIC_API}/image/${messageToReply?.file_path}` }}
                alt="Attachment Preview"
                width={10}
                height={10}
                resizeMode="contain"
              />
            )}
          </Flex>
          <Icon onPress={() => setMessageToReply(null)} as={<MaterialCommunityIcons name="close" />} size={5} />
        </Flex>
      )}
    </>
  );
};

export default ChatReplyPreview;
