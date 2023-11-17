import { useState } from "react";
import { useSelector } from "react-redux";

import { Linking, StyleSheet, TouchableOpacity } from "react-native";
import { Box, Button, Flex, Icon, Image, Menu, Modal, Pressable, Text } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useDisclosure } from "../../../hooks/useDisclosure";
import { CopyToClipboard } from "../../shared/CopyToClipboard";
import AvatarPlaceholder from "../../shared/AvatarPlaceholder";
import FileAttachmentBubble from "./FileAttachmentBubble";
import BandAttachmentBubble from "./BandAttachmentBubble";
import ChatReplyInfo from "./ChatReplyInfo";

const ChatBubble = ({
  chat,
  image,
  name,
  fromUserId,
  id,
  content,
  time,
  type,
  file_path,
  file_name,
  file_type,
  file_size,
  band_attachment_id,
  band_attachment_no,
  band_attachment_type,
  band_attachment_title,
  isDeleted,
  isGrouped,
  reply_to,
  deleteMessage,
  setMessageToReply,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const userSelector = useSelector((state) => state.auth);
  const myMessage = userSelector?.id === fromUserId;

  const docTypes = ["docx", "xlsx", "pptx", "doc", "xls", "ppt", "pdf", "txt"];
  const imgTypes = ["jpg", "jpeg", "png"];

  const { isOpen: deleteModalIsOpen, toggle: toggleDeleteModal } = useDisclosure(false);

  /**
   * Toggle fullscreen image
   */
  const [isFullScreen, setIsFullScreen] = useState(false);
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  let styledTexts = null;
  if (typeof content !== "number" || content.length > 1) {
    const words = content?.split(" ");
    styledTexts = words?.map((item, index) => {
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
      <Flex alignItems="center" gap={1} mb={isGrouped ? 1 : null} flexDirection={!myMessage ? "row" : "row-reverse"}>
        {type === "group" && !myMessage && image ? (
          <AvatarPlaceholder name={name} image={image} size="sm" isThumb={false} />
        ) : type === "group" && !myMessage ? (
          <Box ml={8}></Box>
        ) : null}
        <Flex
          borderRadius={5}
          my={1}
          py={1.5}
          px={1.5}
          bgColor={!myMessage ? "white" : "primary.600"}
          maxW={280}
          justifyContent="center"
          flexDirection={
            type === "group" && name && !myMessage
              ? "column"
              : type === "group" && !name && !myMessage
              ? "column"
              : type === "group" && myMessage
              ? "column"
              : type === "personal" || (type === "group" && file_path)
              ? "column"
              : "row"
          }
        >
          <Flex flexDirection="row-reverse">
            <Menu
              ml={12}
              trigger={(trigger) => {
                return !isDeleted ? (
                  <Pressable {...trigger}>
                    <Icon
                      as={<MaterialCommunityIcons name="chevron-down" />}
                      color={!myMessage ? "#000000" : "#FFFFFF"}
                      size="md"
                    />
                  </Pressable>
                ) : null;
              }}
            >
              <Menu.Item
                onPress={() => {
                  setMessageToReply(chat);
                }}
              >
                <Text>Reply</Text>
              </Menu.Item>
              <Menu.Item onPress={toggleDeleteModal}>
                <Text>Delete</Text>
              </Menu.Item>
            </Menu>
            <Modal isOpen={deleteModalIsOpen} onClose={toggleDeleteModal}>
              <Modal.Content>
                <Modal.Body gap={1} alignItems="center" display="flex" flexDirection="row" justifyContent="center">
                  <Button onPress={toggleDeleteModal}>
                    <Text fontSize={12} fontWeight={400} color="#FFFFFF">
                      Cancel
                    </Text>
                  </Button>
                  <Button
                    onPress={async () => {
                      await deleteMessage(id, "me", setIsLoading);
                      !isLoading && toggleDeleteModal();
                    }}
                  >
                    <Text fontSize={12} fontWeight={400} color="#FFFFFF">
                      Delete for Me
                    </Text>
                  </Button>

                  {myMessage && (
                    <Button
                      onPress={async () => {
                        await deleteMessage(id, "everyone", setIsLoading);
                        !isLoading && toggleDeleteModal();
                      }}
                    >
                      <Text fontSize={12} fontWeight={400} color="#FFFFFF">
                        Delete for Everyone
                      </Text>
                    </Button>
                  )}
                </Modal.Body>
              </Modal.Content>
            </Modal>
          </Flex>
          {!isDeleted ? (
            <>
              {reply_to && <ChatReplyInfo message={reply_to} chatBubbleView={true} myMessage={myMessage} type={type} />}
              {type === "group" && name && !myMessage && <Text color={!myMessage ? "grey" : "white"}>{name}</Text>}
              {file_path && (
                <>
                  {imgTypes.includes(formatMimeType(file_type)) && (
                    <>
                      <TouchableOpacity onPress={toggleFullScreen}>
                        <Image
                          borderRadius={5}
                          source={{ uri: `${process.env.EXPO_PUBLIC_API}/image/${file_path}` }}
                          width={250}
                          height={250}
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
                      myMessage={myMessage}
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
                  myMessage={myMessage}
                />
              )}
              {typeof content === "number" ? (
                <Text fontSize={12} fontWeight={400} color={!myMessage ? "#000000" : "white"}>
                  {content}
                </Text>
              ) : (
                <Text fontSize={12} fontWeight={400} color={!myMessage ? "#000000" : "white"}>
                  {styledTexts}
                </Text>
              )}
            </>
          ) : isDeleted && myMessage ? (
            <Text fontStyle="italic" fontSize={12} fontWeight={400} color="#f1f1f1">
              You have deleted this message
            </Text>
          ) : isDeleted && !myMessage ? (
            <Text fontStyle="italic" fontSize={12} fontWeight={400} color={!myMessage ? "#000000" : "white"}>
              This message has been deleted
            </Text>
          ) : (
            ""
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
            left={type === "group" && !myMessage ? 10 : 0}
            width={15}
            height={5}
            backgroundColor={!myMessage ? "#FFFFFF" : "primary.600"}
            borderBottomRadius={50}
            style={{ transform: [{ rotate: !myMessage ? "250deg" : "100deg" }] }}
            zIndex={-1}
          ></Box>
        )}
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
