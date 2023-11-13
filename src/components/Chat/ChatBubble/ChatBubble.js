import { useState } from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

import { Linking, StyleSheet, TouchableOpacity } from "react-native";
import { Box, Flex, Image, Modal, Text } from "native-base";

import AvatarPlaceholder from "../../shared/AvatarPlaceholder";
import { CopyToClipboard } from "../../shared/CopyToClipboard";
import ChatMessageTimeStamp from "../ChatMessageTimeStamp/ChatMessageTimeStamp";
import FileAttachment from "../Attachment/FileAttachment";
import FileAttachmentBubble from "./FileAttachmentBubble";
import BandAttachmentBubble from "./BandAttachmentBubble";

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
  fileAttachment,
  file_path,
  file_name,
  file_type,
  file_size,
  band_attachment_id,
  band_attachment_no,
  band_attachment_type,
  band_attachment_title,
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

  /**
   * Toggle fullscreen image
   */
  const [isFullScreen, setIsFullScreen] = useState(false);
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
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

  const formatMimeType = (type = "") => {
    if (!type) return "Undefined";
    const typeArr = type.split("/");
    return typeArr.pop();
  };

  return (
    <>
      <Flex
        alignItems="center"
        my={1}
        gap={1}
        mb={isGrouped ? 1 : null}
        flexDirection={!myMessage ? "row" : "row-reverse"}
      >
        {type === "group" && !myMessage && image ? (
          <AvatarPlaceholder name={name} image={image} size="sm" isThumb={false} />
        ) : type === "group" && !myMessage ? (
          <Box ml={8}></Box>
        ) : null}

        <Flex flexDirection={!myMessage ? "row" : "row-reverse"}>
          <Flex
            borderRadius={10}
            py={1.5}
            px={4}
            bgColor={!myMessage ? "white" : "primary.600"}
            maxW={280}
            flexDirection={
              type === "group" && name && !myMessage
                ? "column"
                : type === "personal" || (type === "group" && file_path)
                ? "column"
                : "row"
            }
            justifyContent="center"
          >
            {type === "group" && name && !myMessage && <Text color={!myMessage ? "grey" : "white"}>{name}</Text>}
            {file_path && (
              <>
                {imgTypes.includes(formatMimeType(file_type)) && (
                  <>
                    <TouchableOpacity onPress={toggleFullScreen}>
                      <Image
                        source={{ uri: `${process.env.EXPO_PUBLIC_API}/image/${file_path}` }}
                        width={300}
                        height={150}
                        alt="Feed Image"
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                    <Modal backgroundColor="#000000" isOpen={isFullScreen} onClose={() => setIsFullScreen(false)}>
                      <Modal.Content backgroundColor="#000000">
                        <Modal.CloseButton />
                        <Modal.Body alignContent="center">
                          <Image
                            source={{ uri: `${process.env.EXPO_PUBLIC_API}/image/${file_path}` }}
                            height={500}
                            width={500}
                            alt="Feed Image"
                            resizeMode="contain"
                          />
                        </Modal.Body>
                      </Modal.Content>
                    </Modal>
                  </>
                )}
                {docTypes.includes(formatMimeType(file_type)) && (
                  <FileAttachmentBubble
                    file_type={file_type}
                    file_name={file_name}
                    file_path={file_path}
                    file_size={file_size}
                  />
                )}
              </>
            )}
            {band_attachment_id && (
              <BandAttachmentBubble
                id={band_attachment_id}
                title={band_attachment_title}
                number_id={band_attachment_no}
                type={band_attachment_type}
              />
            )}
            {typeof content === "number" ? (
              <Text fontWeight={400} color={!myMessage ? "#000000" : "white"}>
                {content}
              </Text>
            ) : (
              <Text fontWeight={400} color={!myMessage ? "#000000" : "white"}>
                {styledTexts}
              </Text>
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
          {!isGrouped && (
            <Box
              position="absolute"
              bottom={0}
              left={0}
              width={15}
              height={5}
              backgroundColor={!myMessage ? "#FFFFFF" : "primary.600"}
              borderBottomRadius={50}
              style={{ transform: [{ rotate: "180deg" }] }}
              zIndex={-1}
            ></Box>
          )}
        </Flex>
      </Flex>
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
