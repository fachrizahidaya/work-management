import { useEffect, useRef, useState } from "react";
import RenderHtml from "react-native-render-html";

import { RectButton, Swipeable } from "react-native-gesture-handler";
import { useAnimatedReaction } from "react-native-reanimated";
import { StyleSheet, TouchableOpacity, View, Text, Pressable, Animated, I18nManager } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import AvatarPlaceholder from "../../../components/shared/AvatarPlaceholder";
import ChatTimeStamp from "../ChatTimeStamp/ChatTimeStamp";
import { TextProps } from "../../shared/CustomStylings";
import axiosInstance from "../../../config/api";

const AnimatedIcon = Animated.createAnimatedComponent(MaterialCommunityIcons);

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
  onSwipe,
  onPin,
  navigation,
  latest,
  userSelector,
}) => {
  const [selectedGroupMembers, setSelectedGroupMembers] = useState([]);
  const [shrink, setShrink] = useState(false);
  const swipeableRef = useRef(null);

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

  /**
   * left view after swipe handler
   * @returns
   */
  const renderLeftView = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [0, 80],
      outputRange: [0, 1],
      extrapolate: "clamp",
    });

    return (
      <>
        <RectButton style={{ ...styles.leftAction, flex: shrink ? 0.1 : 1 }}>
          <View style={{ alignItems: "center" }}>
            <AnimatedIcon
              onPress={() => {
                if (swipeableRef.current) {
                  swipeableRef.current.close();
                }
                onPin(type, id, isPinned?.pin_chat ? "unpin" : "pin");
              }}
              name="pin"
              color="#ffffff"
              size={20}
              style={{ transform: [{ scale }] }}
            />
            <Text style={{ color: "#FFFFFF" }}>{isPinned?.pin_chat ? "Unpin" : "Pin"}</Text>
          </View>
        </RectButton>
      </>
    );
  };

  /**
   * right view after swipe handler
   * @returns
   */
  const renderRightView = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    return (
      <>
        <RectButton style={{ ...styles.rightAction, flex: shrink ? 0.1 : 1 }}>
          <View style={{ alignItems: "center" }}>
            <AnimatedIcon
              onPress={() => {
                if (swipeableRef.current) {
                  swipeableRef.current.close();
                }
                onSwipe(chat);
              }}
              name="dots-horizontal"
              color="#ffffff"
              size={20}
              style={{ transform: [{ scale }] }}
            />
            <Text style={{ color: "#ffffff" }}>More</Text>
          </View>
        </RectButton>
      </>
    );
  };

  useEffect(() => {
    fetchSelectedGroupMembers();
  }, [id]);

  return (
    <>
      <Swipeable
        leftThreshold={40}
        rightThreshold={20}
        ref={swipeableRef}
        renderLeftActions={renderLeftView}
        renderRightActions={renderRightView}
        onSwipeableOpen={(direction = "left") => {
          if (direction === "left") {
            setShrink(true);
            swipeableRef.current.openLeft();
          } else {
            setShrink(true);
            swipeableRef.current.openRight();
          }
        }}
        onSwipeableClose={() => setShrink(false)}
      >
        <TouchableOpacity
          style={{ backgroundColor: "#FFFFFF" }}
          activeOpacity={1}
          onPress={() => {
            navigation.navigate("Chat Room", {
              userId: userId,
              name: name,
              roomId: id,
              image: image,
              position: position,
              email: email,
              type: type,
              active_member: active_member,
              isPinned: isPinned,
            });
          }}
        >
          <View style={styles.contactBox}>
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 10 }}>
              <AvatarPlaceholder name={name} image={image} size="md" isThumb={false} />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  {!searchKeyword ? (
                    <Text style={[{ fontSize: 12, fontWeight: "500" }]}>{name}</Text>
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
                  <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
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
                              <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
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
                              <Text style={{ fontSize: 12, textAlign: "center", color: "#FFFFFF" }}>
                                {isRead > 20 ? "20+" : isRead}
                              </Text>
                            </View>
                          )}
                        </View>
                      </>
                    ) : isDeleted && userSelector.id === latest?.user?.id ? (
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                        <MaterialCommunityIcons
                          name="block-helper"
                          size={10}
                          style={{ opacity: 0.5, transform: [{ rotate: "90deg" }] }}
                          color="#3F434A"
                        />
                        <Text style={[{ fontSize: 12, fontStyle: "italic", opacity: 0.5 }, TextProps]}>
                          You deleted this message
                        </Text>
                      </View>
                    ) : isDeleted && userSelector.id !== latest?.user?.id ? (
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                        <MaterialCommunityIcons
                          name="block-helper"
                          size={10}
                          style={{ opacity: 0.5, transform: [{ rotate: "90deg" }] }}
                          color="#3F434A"
                        />
                        <Text style={[{ fontSize: 12, fontStyle: "italic", opacity: 0.5 }, TextProps]}>
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
      </Swipeable>
    </>
  );
};

export default ContactListItem;
const styles = StyleSheet.create({
  contactBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#E8E9EB",
  },
  leftAction: {
    // flex: 0.1,
    backgroundColor: "#377893",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 20,
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
  },
  rightAction: {
    // flex: 1,
    backgroundColor: "#959595",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 20,
    flexDirection: !I18nManager.isRTL ? "row" : "row-reverse",
  },
});
