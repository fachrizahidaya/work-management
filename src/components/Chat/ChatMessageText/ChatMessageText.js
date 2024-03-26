import { Text } from "react-native";

const ChatMessageText = ({ message, myMessage, mimeTypeInfo, renderMessage }) => {
  return (
    <>
      {message?.delete_for_everyone ? (
        <Text
          style={{ fontSize: 12, fontWeight: "400", fontStyle: "italic", color: !myMessage ? "#3F434A" : "#FFFFFF" }}
        >
          Message has been deleted
        </Text>
      ) : (
        renderMessage(mimeTypeInfo?.file_type)
      )}
    </>
  );
};

export default ChatMessageText;
