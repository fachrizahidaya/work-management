import { Text } from "react-native";

const ChatReplyPreviewMessage = ({ message, renderMessage, mimeTypeInfo }) => {
  return (
    <>
      {message?.delete_for_everyone ? (
        <Text>Message has been deleted</Text>
      ) : (
        renderMessage(mimeTypeInfo?.file_type === "not supported" ? mimeTypeInfo?.file_ext : mimeTypeInfo?.file_type)
      )}
    </>
  );
};

export default ChatReplyPreviewMessage;
