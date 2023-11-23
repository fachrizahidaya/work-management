import { memo } from "react";
import { useSelector } from "react-redux";

import { Linking, StyleSheet, TouchableOpacity } from "react-native";
import { Flex, Image, Pressable, Text } from "native-base";

import { CopyToClipboard } from "../../shared/CopyToClipboard";
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
  openChatBubbleHandler,
  toggleFullScreen,
}) => {
  const userSelector = useSelector((state) => state.auth);
  const myMessage = userSelector?.id === fromUserId;

  const docTypes = ["docx", "xlsx", "pptx", "doc", "xls", "ppt", "pdf", "txt"];
  const imgTypes = ["jpg", "jpeg", "png"];

  let styledTexts = null;
  if (content?.length > 1) {
    let words;

    if (typeof content === "number" || typeof content === "bigint") {
      words = content.toString().split(" ");
    } else {
      words = content?.split(" ");
    }

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
      } else if (typeof item === "bigint" || typeof item === "number") {
        const itemString = item.toString();
        textStyle = styles.defaultText;
        return (
          <Text key={index} style={textStyle} onPress={() => CopyToClipboard(itemString)}>
            {itemString}{" "}
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
        alignItems="flex-end"
        gap={1}
        mb={isGrouped ? 1 : 2}
        px={2}
        flexDirection={!myMessage ? "row" : "row-reverse"}
      >
        {/* {type === "group" && !myMessage && image ? (
          <AvatarPlaceholder name={name} image={image} size="sm" isThumb={false} />
        ) : type === "group" && !myMessage ? (
          <Box ml={8}></Box>
        ) : null} */}

        <Pressable
          maxWidth={300}
          onLongPress={() => !isDeleted && openChatBubbleHandler(chat)}
          borderRadius={10}
          display="flex"
          justifyContent="center"
          py={1.5}
          px={1.5}
          bgColor={!myMessage ? "#FFFFFF" : "primary.600"}
          gap={1}
        >
          {type === "group" && name && !myMessage && (
            <Text fontSize={12} fontWeight={700} color={!myMessage ? "primary.600" : "#FFFFFF"}>
              {name}
            </Text>
          )}
          {!isDeleted ? (
            <>
              {reply_to && <ChatReplyInfo message={reply_to} chatBubbleView={true} myMessage={myMessage} type={type} />}
              {file_path && (
                <>
                  {imgTypes.includes(formatMimeType(file_type)) && (
                    <>
                      <TouchableOpacity onPress={() => file_path && toggleFullScreen(file_path)}>
                        <Image
                          width={260}
                          height={200}
                          borderRadius={5}
                          source={{ uri: `${process.env.EXPO_PUBLIC_API}/image/${file_path}` }}
                          alt="Chat Image"
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
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
            </>
          ) : null}

          <Flex gap={2} flexDirection="row" alignItems="center" justifyContent="space-between">
            {!isDeleted ? (
              // <Text fontSize={14} fontWeight={400} color={!myMessage ? "#000000" : "white"}>
              //   {styledTexts}
              // </Text>
              <Text fontSize={14} fontWeight={400} color={!myMessage ? "#000000" : "white"} flexShrink={1}>
                {content}
              </Text>
            ) : myMessage && isDeleted ? (
              <Text fontSize={14} fontWeight={400} fontStyle="italic" color="#f1f1f1">
                You have deleted this message
              </Text>
            ) : !myMessage && isDeleted ? (
              <Text fontSize={14} fontWeight={400} fontStyle="italic" color="#000000">
                This message has been deleted
              </Text>
            ) : null}

            <Text alignSelf="flex-end" fontSize={10} color="#578A90">
              {time}
            </Text>
          </Flex>
        </Pressable>

        {/* {!isGrouped && (
          <Box
            position="absolute"
            bottom="0.1px"
            left={type === "group" && myMessage ? "8px" : type === "personal" && myMessage ? "8px" : null}
            right={0}
            width={15}
            height={5}
            backgroundColor={!myMessage ? "#FFFFFF" : "primary.600"}
            borderBottomRadius={50}
            style={{
              transform: [
                {
                  rotate: "180deg",
                },
              ],
            }}
            zIndex={-1}
          ></Box>
        )} */}
      </Flex>
    </>
  );
};

export default memo(ChatBubble);

const styles = StyleSheet.create({
  defaultText: {},
  highlightedText: {
    textDecorationLine: "underline",
  },
});
