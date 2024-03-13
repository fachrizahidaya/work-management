import { useEffect, useState } from "react";
import RenderHtml from "react-native-render-html";

import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { StyleSheet, TouchableOpacity, View, Text, Pressable, Dimensions } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../../components/shared/AvatarPlaceholder";
import ChatTimeStamp from "../ChatTimeStamp/ChatTimeStamp";
import { TextProps } from "../../shared/CustomStylings";
import axiosInstance from "../../../config/api";

const AnimatedIcon = Animated.createAnimatedComponent(MaterialCommunityIcons);
const AnimatedText = Animated.createAnimatedComponent(Text);

const ContactListItem = ({
  chat,
  type,
  id,
  userId,
  name,
  image,
  position,
  email,
  message,
  isDeleted,
  fileName,
  project,
  task,
  time,
  timestamp,
  searchKeyword,
  active_member,
  isRead,
  isPinned,
  onClickMore,
  onPin,
  navigation,
  latest,
  userSelector,
}) => {
  const [selectedGroupMembers, setSelectedGroupMembers] = useState([]);

  const params = {
    userId: userId,
    name: name,
    roomId: id,
    image: image,
    position: position,
    email: email,
    type: type,
    active_member: active_member,
    isPinned: isPinned,
    forwardedMessage: null,
  };

  /**
   * Fetch members of selected group
   */
  const fetchSelectedGroupMembers = async () => {
    try {
      const res = await axiosInstance.get(`/chat/group/${id}/member`);
      setSelectedGroupMembers(res?.data?.data);
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Handle for mention name in group member
   */
  const memberName = selectedGroupMembers.map((item) => {
    return item?.user?.name;
  });

  /**
   * Handle showing mention chat
   */
  for (let i = 0; i < memberName.length; i++) {
    let placeholder = new RegExp(`\\@\\[${memberName[i]}\\]\\(\\d+\\)`, "g");
    message = message?.replace(placeholder, `@${memberName[i]}`);
  }

  const boldMatchCharacters = (sentence = "", characters = "") => {
    const regex = new RegExp(characters, "gi");
    return sentence?.replace(regex, `<strong style="color: #176688;">$&</strong>`);
  };

  const renderName = () => {
    return boldMatchCharacters(name, searchKeyword);
  };

  const generateIcon = () => {
    let iconName = "";
    if (fileName) {
      const file_extension = fileName.split(".")[1];
      if (
        file_extension === "gif" ||
        file_extension === "png" ||
        file_extension === "jpg" ||
        file_extension === "jpeg"
      ) {
        iconName = "image";
      } else {
        iconName = "file-document";
      }
    }
    if (project) {
      iconName = "lightning-bolt";
    }
    if (task) {
      iconName = "checkbox-marked-circle-outline";
    }
    return iconName;
  };

  const generateAttachmentText = () => {
    let text = "";
    if (fileName) {
      const file_extension = fileName.split(".")[1];
      if (
        file_extension === "gif" ||
        file_extension === "png" ||
        file_extension === "jpg" ||
        file_extension === "jpeg"
      ) {
        text = "Photo";
      } else {
        text = "File";
      }
    }
    if (project) {
      text = "Project";
    }
    if (task) {
      text = "Task";
    }
    return text;
  };

  const translateX = useSharedValue(0);
  const swipeThresholdPositive = 150;
  const swipeThresholdNegative = -150;
  const panGesture = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
    },
    onEnd: (event) => {
      if (event.translationX > 0) {
        const dismissed = translateX.value < swipeThresholdPositive;
        if (dismissed) {
          translateX.value = withTiming(0);
        } else {
          translateX.value = withTiming(70);
        }
      } else {
        const dismissed = translateX.value > swipeThresholdNegative;
        if (dismissed) {
          translateX.value = withTiming(0);
        } else {
          translateX.value = withTiming(-60);
        }
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
    ],
  }));

  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: translateX.value > 0 ? "#377893" : "#959595",
  }));

  useEffect(() => {
    fetchSelectedGroupMembers();
  }, [id]);

  return (
    <>
      <Animated.View
        style={[
          animatedBackgroundStyle,
          {
            justifyContent: "center",
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            position: "absolute",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",

            paddingVertical: 5,
            paddingHorizontal: 10,
          }}
        >
          <Pressable
            onPress={() => {
              translateX.value = withTiming(0);
              onPin(type, id, isPinned?.pin_chat ? "unpin" : "pin");
            }}
            style={{
              alignItems: "center",
              paddingLeft: isPinned?.pin_chat ? 5 : 10,
            }}
          >
            <AnimatedIcon name="pin" color="#ffffff" size={20} />
            <AnimatedText
              style={{
                color: "#FFFFFF",
              }}
            >
              {isPinned?.pin_chat ? "Unpin" : "Pin"}
            </AnimatedText>
          </Pressable>

          <Pressable
            onPress={() => {
              translateX.value = withTiming(0);
              onClickMore(chat);
            }}
            style={{ alignItems: "center", paddingRight: 5 }}
          >
            <AnimatedIcon name="dots-horizontal" color="#ffffff" size={20} style={{}} />
            <AnimatedText style={{ color: "#ffffff" }}>More</AnimatedText>
          </Pressable>
        </View>
        <PanGestureHandler onGestureEvent={panGesture} failOffsetY={[-5, 5]} activeOffsetX={[-5, 5]}>
          <Animated.View style={animatedStyle}>
            <TouchableOpacity
              style={{ backgroundColor: "#FFFFFF" }}
              activeOpacity={1}
              onPress={() => {
                navigation.navigate("Chat Room", params);
              }}
            >
              <View style={styles.contactBox}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <AvatarPlaceholder name={name} image={image} size="md" isThumb={false} />
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      {!searchKeyword ? (
                        <Text style={[{ fontSize: 14, fontWeight: "500" }]}>{name}</Text>
                      ) : (
                        <RenderHtml
                          contentWidth={400}
                          source={{
                            html: renderName(),
                          }}
                        />
                      )}
                      <View style={{ flexDirection: "row" }}>
                        <ChatTimeStamp time={time} timestamp={timestamp} />
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          flex: 1,
                        }}
                      >
                        {type === "group" && chat?.latest_message ? (
                          <Text style={[{ fontSize: 12 }, TextProps]}>
                            {userSelector?.name === chat?.latest_message?.user?.name
                              ? "You"
                              : chat?.latest_message?.user?.name}
                            :{" "}
                          </Text>
                        ) : null}
                        {!isDeleted ? (
                          <>
                            <View
                              style={{
                                flex: 1,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <View style={{ flexDirection: "row" }}>
                                {message && (
                                  <Text style={[{ fontSize: 12 }, TextProps]}>
                                    {message.length > 40 ? message.slice(0, 40) + "..." : message}
                                  </Text>
                                )}
                                {!message && (project || task || fileName) && (
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                      gap: 3,
                                    }}
                                  >
                                    <MaterialCommunityIcons name={generateIcon()} size={20} color="#3F434A" />
                                    <Text style={[{ fontSize: 12 }, TextProps]}>{generateAttachmentText()}</Text>
                                  </View>
                                )}
                              </View>
                              {!!isRead && (
                                <View
                                  style={{
                                    height: 25,
                                    width: 25,
                                    backgroundColor: "#FD7972",
                                    borderRadius: 10,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize: 12,
                                      textAlign: "center",
                                      color: "#FFFFFF",
                                    }}
                                  >
                                    {isRead > 20 ? "20+" : isRead}
                                  </Text>
                                </View>
                              )}
                            </View>
                          </>
                        ) : isDeleted && userSelector.id === latest?.user?.id ? (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 3,
                            }}
                          >
                            <MaterialCommunityIcons
                              name="block-helper"
                              size={10}
                              style={{
                                opacity: 0.5,
                                transform: [{ rotate: "90deg" }],
                              }}
                              color="#3F434A"
                            />
                            <Text
                              style={[
                                {
                                  fontSize: 12,
                                  fontStyle: "italic",
                                  opacity: 0.5,
                                },
                                TextProps,
                              ]}
                            >
                              You deleted this message
                            </Text>
                          </View>
                        ) : isDeleted && userSelector.id !== latest?.user?.id ? (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 3,
                            }}
                          >
                            <MaterialCommunityIcons
                              name="block-helper"
                              size={10}
                              style={{
                                opacity: 0.5,
                                transform: [{ rotate: "90deg" }],
                              }}
                              color="#3F434A"
                            />
                            <Text
                              style={[
                                {
                                  fontSize: 12,
                                  fontStyle: "italic",
                                  opacity: 0.5,
                                },
                                TextProps,
                              ]}
                            >
                              This message was deleted
                            </Text>
                          </View>
                        ) : null}
                      </View>
                      {isPinned?.pin_chat ? (
                        <MaterialCommunityIcons
                          name="pin"
                          size={20}
                          style={{ transform: [{ rotate: "45deg" }] }}
                          color="#3F434A"
                        />
                      ) : null}
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </>
  );
};

export default ContactListItem;

const styles = StyleSheet.create({
  contactBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#E8E9EB",
  },
});
