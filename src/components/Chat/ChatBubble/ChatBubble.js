import { memo } from "react";

import { Linking, StyleSheet, TouchableOpacity, View, Text, Pressable, Image } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useAnimatedGestureHandler,
  useSharedValue,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
const LIST_ITEM_HEIGHT = 70;

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { CopyToClipboard } from "../../shared/CopyToClipboard";
import FileAttachmentBubble from "./FileAttachmentBubble";
import BandAttachmentBubble from "./BandAttachmentBubble";
import ChatReplyInfo from "./ChatReplyInfo";

const ChatBubble = ({
  chat,
  name,
  fromUserId,
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
  onSwipe,
  isOptimistic,
  memberName,
  position,
  userSelector,
  navigation,
}) => {
  const myMessage = userSelector?.id === fromUserId;

  for (let i = 0; i < memberName.length; i++) {
    let placeholder = new RegExp(`\\@\\[${memberName[i]}\\]\\(\\d+\\)`, "g");
    content = content?.replace(placeholder, `@${memberName[i]}`);
  }

  const imgTypes = ["jpg", "jpeg", "png"];

  var allWords = [];

  for (var i = 0; i < memberName?.length; i++) {
    var words = memberName[i].split(/\s+/);
    allWords = allWords.concat(words);
  }

  let styledTexts = null;
  if (content?.length !== 0) {
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
      } else if (type === "group" && allWords.some((word) => item.includes(word))) {
        textStyle = styles.coloredText;
        return (
          <Text key={index} style={textStyle}>
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

  if (myMessage) {
    var MIN_TRANSLATEX = 50;
  } else {
    var MIN_TRANSLATEX = 100;
  }

  const translateX = useSharedValue(0);

  const panGesture = useAnimatedGestureHandler({
    onActive: (event) => {
      if (event.translationX > 0) {
        translateX.value = event.translationX;
      }
    },
    onEnd: (event) => {
      if (event.translationX > 0) {
        if (translateX.value > MIN_TRANSLATEX) {
          runOnJS(onSwipe)(chat);
        }
      }
      translateX.value = withTiming(0);
    },
  });

  const rTaskContainerStyle = useAnimatedStyle(() => {
    const limitedTranslateX = Math.max(translateX.value, 0);
    return {
      transform: [
        {
          translateX: limitedTranslateX,
        },
      ],
    };
  });

  return (
    <View
      style={{
        flexDirection: !myMessage ? "row" : "row-reverse",
        alignItems: "flex-end",
        gap: 5,
        paddingHorizontal: 5,
        marginBottom: isGrouped ? 3 : 5,
      }}
    >
      {!isOptimistic && (
        <Pressable style={{ ...styles.iconContainer, marginRight: myMessage ? 5 : null, alignSelf: "center" }}>
          <MaterialIcons name="reply" size={15} />
        </Pressable>
      )}
      {/* {type === "group" && !myMessage && image ? (
          <AvatarPlaceholder name={name} image={image} size="sm" isThumb={false} />
          ) : type === "group" && !myMessage ? (
            <Box ml={8}></Box>
          ) : null} */}

      <PanGestureHandler onGestureEvent={panGesture}>
        <Animated.View style={[rTaskContainerStyle]}>
          <Pressable
            style={{
              display: "flex",
              justifyContent: "center",
              maxWidth: 300,
              borderRadius: 10,
              padding: 8,
              backgroundColor: isOptimistic ? "#9E9E9E" : !myMessage ? "#FFFFFF" : "#377893",
              gap: 5,
            }}
            onLongPress={() => {
              !isDeleted && openChatBubbleHandler(chat, !myMessage ? "right" : "left");
            }}
            delayLongPress={200}
          >
            {type === "group" && name && !myMessage && (
              <Text
                style={{ fontSize: 12, fontWeight: "700", color: !myMessage ? "#176688" : "#FFFFFF" }}
                fontSize={12}
                fontWeight={700}
                color={!myMessage ? "#377893" : "#FFFFFF"}
              >
                {name}
              </Text>
            )}
            {!isDeleted ? (
              <>
                {reply_to && (
                  <ChatReplyInfo
                    message={reply_to}
                    chatBubbleView={true}
                    myMessage={myMessage}
                    type={type}
                    loggedInUser={userSelector}
                    memberName={memberName}
                    content={content}
                    allWord={allWords}
                  />
                )}
                {file_path && (
                  <>
                    {imgTypes.includes(formatMimeType(file_type)) && (
                      <>
                        <TouchableOpacity
                          style={{ borderRadius: 5 }}
                          onPress={() => file_path && toggleFullScreen(file_path)}
                        >
                          <Image
                            style={{
                              flex: 1,
                              width: 260,
                              height: 200,
                              resizeMode: "contain",
                              backgroundColor: "gray",
                            }}
                            source={{
                              uri: isOptimistic ? file_path : `${process.env.EXPO_PUBLIC_API}/image/${file_path}`,
                            }}
                            alt="Chat Image"
                            resizeMethod="auto"
                          />
                        </TouchableOpacity>
                      </>
                    )}
                    {
                      // docTypes.includes(formatMimeType(file_type)) &&
                      <FileAttachmentBubble
                        file_type={file_type}
                        file_name={file_name}
                        file_path={file_path}
                        file_size={file_size}
                        myMessage={myMessage}
                      />
                    }
                  </>
                )}
                {band_attachment_id && (
                  <BandAttachmentBubble
                    id={band_attachment_id}
                    title={band_attachment_title}
                    number_id={band_attachment_no}
                    type={band_attachment_type}
                    myMessage={myMessage}
                    navigation={navigation}
                  />
                )}
              </>
            ) : null}

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 5 }}>
              {!isDeleted ? (
                <Text
                  style={{ flexShrink: 1, fontSize: 14, fontWeight: "400", color: !myMessage ? "#3F434A" : "#FFFFFF" }}
                >
                  {styledTexts}
                </Text>
              ) : myMessage && isDeleted ? (
                <Text style={{ fontSize: 14, fontWeight: "400", fontStyle: "italic", color: "#F1F1F1" }}>
                  You have deleted this message
                </Text>
              ) : !myMessage && isDeleted ? (
                <Text style={{ fontSize: 14, fontWeight: "400", fontStyle: "italic", color: "#3F434A" }}>
                  This message has been deleted
                </Text>
              ) : null}

              <Text style={{ fontSize: 8, color: !myMessage ? "#8A9099" : "#FFFFFF", alignSelf: "flex-end" }}>
                {time}
              </Text>
            </View>
          </Pressable>
        </Animated.View>
      </PanGestureHandler>

      {/* {!isGrouped && (
          <Box
            position="absolute"
            bottom={1}
            left={type === "group" && myMessage ? 10 : type === "personal" && myMessage ? 10 : null}
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
    </View>
  );
};

export default memo(ChatBubble);

const styles = StyleSheet.create({
  defaultText: {},
  highlightedText: {
    textDecorationLine: "underline",
  },
  coloredText: {
    color: "#72acdc",
  },
  mentionText: {
    fontWeight: "600",
  },
  taskContainer: {
    width: "100%",
    alignItems: "center",
  },
  task: {
    width: "90%",
    height: LIST_ITEM_HEIGHT,
    justifyContent: "center",
    paddingLeft: 20,
    backgroundColor: "white",
    borderRadius: 10,
    shadowOpacity: 0.08,
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowRadius: 10,
    elevation: 5,
  },
  taskTitle: {
    fontSize: 16,
  },
  iconContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    padding: 5,
  },
});
