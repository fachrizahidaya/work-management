import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

import { Linking, StyleSheet } from "react-native";
import { Box, Flex, Text } from "native-base";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";
import { CopyToClipboard } from "../../shared/CopyToClipboard";
import ChatMessageTimeStamp from "../ChatMessageTimeStamp/ChatMessageTimeStamp";

const ChatBubble = ({
  chat,
  image,
  name,
  fromUserId,
  id,
  content,
  time,
  onMessageDelete,
  onMessageReply,
  chatList,
  type,
  isGrouped,
  index,
}) => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const userSelector = useSelector((state) => state.auth);
  const myMessage = userSelector.id === fromUserId;

  const docTypes = ["docx", "xlsx", "pptx", "doc", "xls", "ppt", "pdf", "txt"];
  const imgTypes = ["jpg", "jpeg", "png"];

  const handleClose = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };

  /**
   * Handle delete message click from context menu
   */
  const messagDeleteHandler = () => {
    if (selectedMessage) {
      onMessageDelete(selectedMessage);
      handleClose();
    }
  };

  const messageReplyHandler = () => {
    if (selectedMessage) {
      onMessageReply(selectedMessage);
      handleClose();
    }
  };

  if (typeof content !== "number" || content.length > 1) {
    const words = content?.split(" ");
    var styledTexts = words?.map((item, index) => {
      let textStyle = styles.defaultText;
      if (item.includes("https")) {
        textStyle = styles.highlightedText;
        return (
          <Text key={index} style={textStyle} onPress={() => handleLinkPress(item)}>
            {item}{" "}
          </Text>
        );
      } else if (item.includes("08") || item.includes("62")) {
        textStyle = styles.highlightedText;
        return (
          <Text key={index} style={textStyle} onPress={() => CopyToClipboard(item)}>
            {item}{" "}
          </Text>
        );
      } else if (item.includes("@gmail.com")) {
        textStyle = styles.highlightedText;
        return (
          <Text key={index} style={textStyle} onPress={() => handleEmailPress(item)}>
            {item}{" "}
          </Text>
        );
      }
      return (
        <Text key={index} style={textStyle}>
          {item}{" "}
        </Text>
      );
    });
  }

  const handleLinkPress = (url) => {
    Linking.openURL(url);
  };

  const handleEmailPress = (email) => {
    try {
      const emailUrl = `mailto:${email}`;
      Linking.openURL(emailUrl);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Box>
        <>
          {/* {chatList.map((item, index) => {
            return (
              <> */}
          {chat[index - 1] ? (
            !dayjs(chat?.created_at).isSame(dayjs(chat[index - 1]?.created_at), "date") ? (
              <>
                <ChatMessageTimeStamp key={`${chat.id}_${index}_timestamp-group`} timestamp={chat?.created_at} />
              </>
            ) : (
              ""
            )
          ) : (
            <ChatMessageTimeStamp key={`${chat.id}_${index}_timestamp-group`} timestamp={chat?.created_at} />
          )}
          {/* </>
            );
          })} */}
        </>

        <Flex alignItems="center" my={3} gap={1} flexDirection={!myMessage ? "row" : "row-reverse"}>
          {type === "group" && !myMessage && image ? (
            <AvatarPlaceholder name={name} image={image} size="sm" isThumb={false} />
          ) : type === "group" && !myMessage ? (
            <Box ml={8}></Box>
          ) : null}

          <Flex flexDirection={!myMessage ? "row" : "row-reverse"}>
            <Flex
              borderRadius={10}
              py={2}
              px={4}
              bgColor={!myMessage ? "white" : "primary.600"}
              maxW={280}
              flexDirection={type === "group" && name && !myMessage ? "column" : "row"}
              justifyContent="center"
              // borderWidth={!myMessage ? 1 : 0}
              // borderColor={!myMessage && "#E8E9EB"}
            >
              {type === "group" && name && !myMessage && (
                <Text color={!myMessage ? "primary.600" : "white"}>{name}</Text>
              )}
              {typeof content === "number" ? (
                <Text color={!myMessage ? "primary.600" : "white"}>{content}</Text>
              ) : (
                <Text color={!myMessage ? "primary.600" : "white"}>{styledTexts}</Text>
              )}
              <Text
                mt={type === "group" && name && !myMessage ? null : 2.5}
                alignSelf="flex-end"
                fontSize={10}
                color="#578A90"
              >
                {time}
              </Text>
            </Flex>
          </Flex>
        </Flex>
        {!isGrouped && (
          <Box
            position="absolute"
            bottom={0}
            left={0}
            width={15}
            height={10}
            backgroundColor="#FFFFFF"
            borderBottomRadius={50}
            // style={{ transform: "rotate: 180deg" }}
            zIndex={-1}
          ></Box>
        )}
      </Box>
    </>
  );
};

export default ChatBubble;

const styles = StyleSheet.create({
  defaultText: {},
  highlightedText: {
    textDecorationLine: "underline",
  },
});
