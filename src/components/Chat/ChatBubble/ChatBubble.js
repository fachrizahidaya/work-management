import { memo, useCallback } from "react";
import { Linking, StyleSheet, View, Text, Pressable } from "react-native";
import {
  useAnimatedStyle,
  useAnimatedGestureHandler,
  useSharedValue,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import Toast from "react-native-root-toast";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { CopyToClipboard } from "../../shared/CopyToClipboard";
import { ErrorToastProps } from "../../shared/CustomStylings";
import { EmailRedirect } from "../../shared/EmailRedirect";
import ChatBubbleItem from "./ChatBubbleItem";

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
  userSelector,
  navigation,
}) => {
  const myMessage = userSelector?.id === fromUserId;
  const imgTypes = ["jpg", "jpeg", "png"];

  /**
   * Handle showing mention chat
   */
  for (let i = 0; i < memberName.length; i++) {
    let placeholder = new RegExp(`\\@\\[${memberName[i]}\\]\\(\\d+\\)`, "g");
    content = content?.replace(placeholder, `@${memberName[i]}`);
  }

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
          <Text key={index} style={textStyle} onPress={() => linkPressHandler(item)}>
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
      } else if (allWords?.find((word) => item?.includes(word))) {
        textStyle = styles.coloredText;
        return (
          <Text key={index} style={textStyle}>
            {item}{" "}
          </Text>
        );
      } else if (item.includes("@gmail.com")) {
        textStyle = styles.highlightedText;
        return (
          <Text key={index} style={textStyle} onPress={() => EmailRedirect(item)}>
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

  const linkPressHandler = useCallback((url) => {
    const playStoreUrl = url?.includes("https://play.google.com/store/apps/details?id=");
    const appStoreUrl = url?.includes("https://apps.apple.com/id/app");
    let trimmedPlayStoreUrl;
    let trimmedAppStoreUrl;
    if (playStoreUrl) {
      trimmedPlayStoreUrl = url?.slice(37);
    } else if (appStoreUrl) {
      trimmedAppStoreUrl = url?.slice(7);
    }

    let modifiedAppStoreUrl = "itms-apps" + trimmedAppStoreUrl;
    let modifiedPlayStoreUrl = "market://" + trimmedPlayStoreUrl;

    try {
      if (playStoreUrl) {
        Linking.openURL(modifiedPlayStoreUrl);
      } else if (appStoreUrl) {
        Linking.openURL(modifiedAppStoreUrl);
      } else {
        Linking.openURL(url);
      }
    } catch (err) {
      console.log(err);
      Toast.show(err.response.data.message, ErrorToastProps);
    }
  }, []);

  const formatMimeType = (type = "") => {
    if (!type) return "Undefined";
    const typeArr = type.split("/");
    return typeArr.pop();
  };

  /**
   * Handle for minimum offset slide to reply and maximum lane
   */
  if (myMessage) {
    var MIN_TRANSLATEX = 50;
    var parentWidth = 150;
  } else {
    var MIN_TRANSLATEX = 60;
    var parentWidth = 200;
  }
  const translateX = useSharedValue(0);

  /**
   * Handle slide animation chatBubble
   */
  const panGesture = useAnimatedGestureHandler({
    onActive: (event) => {
      if (event.translationX > 0) {
        translateX.value = Math.min(event.translationX, parentWidth - MIN_TRANSLATEX);
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

  /**
   * Handle translate for chatBubble
   */
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
        paddingHorizontal: 16,
        marginBottom: isGrouped ? 3 : 5,
      }}
    >
      {!isOptimistic && (
        <Pressable
          style={{
            ...styles.iconContainer,
            marginRight: myMessage ? 5 : null,
            alignSelf: "center",
          }}
        >
          <MaterialIcons name="reply" size={15} />
        </Pressable>
      )}

      <ChatBubbleItem
        isDeleted={isDeleted}
        panGesture={panGesture}
        rTaskContainerStyle={rTaskContainerStyle}
        isOptimistic={isOptimistic}
        myMessage={myMessage}
        chat={chat}
        type={type}
        name={name}
        reply_to={reply_to}
        userSelector={userSelector}
        memberName={memberName}
        content={content}
        allWords={allWords}
        file_name={file_name}
        file_path={file_path}
        imgTypes={imgTypes}
        formatMimeType={formatMimeType}
        file_type={file_type}
        toggleFullScreen={toggleFullScreen}
        band_attachment_id={band_attachment_id}
        band_attachment_title={band_attachment_title}
        band_attachment_no={band_attachment_no}
        band_attachment_type={band_attachment_type}
        navigation={navigation}
        styledTexts={styledTexts}
        time={time}
        file_size={file_size}
        openChatBubbleHandler={openChatBubbleHandler}
      />
    </View>
  );
};
export default memo(ChatBubble);

const styles = StyleSheet.create({
  defaultText: {},
  highlightedText: {
    textDecorationLine: "underline",
    color: "#72acdc",
  },
  coloredText: {
    color: "#72acdc",
  },
  iconContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    padding: 5,
  },
});
