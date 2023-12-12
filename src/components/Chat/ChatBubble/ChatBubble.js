import { useRef, memo } from "react";
import { useSelector } from "react-redux";

import { Dimensions, Linking, PanResponder, StyleSheet, TouchableOpacity, View } from "react-native";
import { Flex, Icon, Image, Pressable, Text } from "native-base";
import { FlingGestureHandler, Directions, State, PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  withSpring,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Swipeable } from "react-native-gesture-handler";
const LIST_ITEM_HEIGHT = 70;

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TRANSLATE_X_THRESHOLD = -SCREEN_WIDTH * 0.3;

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
  bubbleChangeColor,
  setBubbleChangeColor,
  onSwipe,
  modalAppeared,
  setModalAppeared,
}) => {
  const userSelector = useSelector((state) => state.auth);
  const myMessage = userSelector?.id === fromUserId;

  const docTypes = ["docx", "xlsx", "pptx", "doc", "xls", "ppt", "pdf", "txt"];
  const imgTypes = ["jpg", "jpeg", "png"];

  const startingPosition = 0;
  const x = useSharedValue(startingPosition);

  const translateX = useSharedValue(0);
  const itemHeight = useSharedValue(LIST_ITEM_HEIGHT);
  const marginVertical = useSharedValue(10);
  const opacity = useSharedValue(1);

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

  const eventHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {},
    onActive: (event, ctx) => {
      x.value = !myMessage ? 50 : -50;
    },
    onEnd: (event, ctx) => {
      x.value = withSpring(startingPosition);
    },
  });

  const uas = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: x.value }],
    };
  });

  const renderRightActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 1],
    });

    return (
      <>
        <Pressable
          style={{
            width: 50,
            alignItems: "center",
            justifyContent: "center",
            padding: 3,
            // transform: [{ translateX: trans }],
          }}
        >
          <Icon as={<MaterialIcons name="reply" />} />
        </Pressable>
      </>
    );
  };

  const renderLeftActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 1],
    });

    return (
      <>
        <Pressable
          style={{
            width: 50,
            alignItems: "center",
            justifyContent: "center",
            padding: 3,
            // transform: [{ translateX: trans }],
          }}
        >
          <Icon as={<MaterialIcons name="reply" />} />
        </Pressable>
      </>
    );
  };

  const panGesture = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
    },
    onEnd: () => {
      translateX.value = withTiming(0);
    },
  });

  const rStyle = useAnimatedStyle(() => ({}));

  const rIconContainerStyle = useAnimatedStyle(() => {
    const opacityValue = withTiming(translateX.value < TRANSLATE_X_THRESHOLD ? 1 : 0);
    return { opacity: opacityValue };
  });

  const rTaskContainerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
    ],
  }));

  return (
    // <Swipeable
    //   onSwipeableOpen={() => onSwipe(chat)}
    //   renderLeftActions={!myMessage && renderLeftActions}
    //   renderRightActions={myMessage && renderRightActions}
    // >
    <Flex
      alignItems="flex-end"
      gap={1}
      mb={isGrouped ? 1 : 2}
      px={2}
      flexDirection={!myMessage ? "row" : "row-reverse"}
    >
      <Pressable style={styles.iconContainer} width={50} alignItems="center" justifyContent="center" padding={3}>
        <Icon as={<MaterialIcons name="reply" />} />
      </Pressable>
      {/* {type === "group" && !myMessage && image ? (
          <AvatarPlaceholder name={name} image={image} size="sm" isThumb={false} />
          ) : type === "group" && !myMessage ? (
            <Box ml={8}></Box>
          ) : null} */}

      {/* <FlingGestureHandler
          direction={!myMessage ? Directions.RIGHT : Directions.LEFT}
          onGestureEvent={eventHandler}
          onHandlerStateChange={({ nativeEvent }) => {
            if (nativeEvent.state === State.ACTIVE) {
              onSwipe(chat);
            }
          }}
        > */}
      {/* <Animated.View style={uas}> */}
      <PanGestureHandler onEnded={() => onSwipe(chat)} onGestureEvent={panGesture}>
        <Animated.View style={[rTaskContainerStyle]}>
          <Pressable
            maxWidth={300}
            onLongPress={() => {
              !isDeleted && openChatBubbleHandler(chat, !myMessage ? "right" : "left");
              setModalAppeared(true);
            }}
            borderRadius={10}
            display="flex"
            justifyContent="center"
            py={1.5}
            px={1.5}
            bgColor={!myMessage ? "#FFFFFF" : "primary.600"}
            gap={1}
            zIndex={modalAppeared ? 2 : null}
          >
            {type === "group" && name && !myMessage && (
              <Text fontSize={12} fontWeight={700} color={!myMessage ? "primary.600" : "#FFFFFF"}>
                {name}
              </Text>
            )}
            {!isDeleted ? (
              <>
                {reply_to && (
                  <ChatReplyInfo message={reply_to} chatBubbleView={true} myMessage={myMessage} type={type} />
                )}
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
                            resizeMethod="auto"
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
                <Text fontSize={14} fontWeight={400} color={!myMessage ? "#3F434A" : "#FFFFFF"} flexShrink={1}>
                  {styledTexts}
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

              <Text alignSelf="flex-end" fontSize={8} color={!myMessage ? "#8A9099" : "#FFFFFF"}>
                {time}
              </Text>
            </Flex>
          </Pressable>
        </Animated.View>
      </PanGestureHandler>
      {/* </Animated.View> */}
      {/* </FlingGestureHandler> */}

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
    </Flex>
    // </Swipeable>
  );
};

export default memo(ChatBubble);

const styles = StyleSheet.create({
  defaultText: {},
  highlightedText: {
    textDecorationLine: "underline",
  },
  container: {
    alignItems: "flex-end",
    gap: 1,
    // mb:isGrouped ? 1 : 2,
    px: 2,
    flexDirection: "row",
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
  },
});
