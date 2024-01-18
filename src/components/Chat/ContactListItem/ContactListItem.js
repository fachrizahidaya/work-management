import { useEffect, useRef, useState } from "react";

import { Swipeable } from "react-native-gesture-handler";
import RenderHtml from "react-native-render-html";
import { StyleSheet, TouchableOpacity, View, Text, Pressable } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import AvatarPlaceholder from "../../../components/shared/AvatarPlaceholder";
import ChatTimeStamp from "../ChatTimeStamp/ChatTimeStamp";
import { TextProps } from "../../shared/CustomStylings";
import axiosInstance from "../../../config/api";

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
  const swipeableRef = useRef(null);

  const memberName = selectedGroupMembers.map((item) => {
    return item?.user?.name;
  });

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

  const renderLeftView = () => {
    return (
      <View
        style={{
          backgroundColor: "#377893",
          width: 400,
        }}
      >
        <Pressable
          onPress={() => {
            if (swipeableRef.current) {
              swipeableRef.current.close();
            }
            onPin(type, id, isPinned?.pin_chat ? "unpin" : "pin");
          }}
          style={{
            padding: 20,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#377893",
            width: 100,
          }}
        >
          <MaterialIcons name="push-pin" color="#FFFFFF" style={{ transform: [{ rotate: "45deg" }] }} />
          <Text style={{ color: "#FFFFFF" }}>{isPinned?.pin_chat ? "Unpin" : "Pin"}</Text>
        </Pressable>
      </View>
    );
  };

  const renderRightView = () => {
    return (
      <View
        style={{
          backgroundColor: "#959595",
          width: 400,
        }}
      >
        <Pressable
          onPress={() => {
            if (swipeableRef.current) {
              swipeableRef.current.close();
            }
            onSwipe(chat);
          }}
          style={{
            marginLeft: 300,
            padding: 20,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#959595",
          }}
        >
          <MaterialIcons name="more-horiz" color="#FFFFFF" />
          <Text style={{ color: "#FFFFFF" }}>More</Text>
        </Pressable>
      </View>
    );
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

  useEffect(() => {
    fetchSelectedGroupMembers();
  }, [id]);

  return (
    <View>
      <Swipeable ref={swipeableRef} renderLeftActions={renderLeftView} renderRightActions={renderRightView}>
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
                                {message.length > 20 ? message.slice(0, 20) + "..." : message}
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
                          style={{ transform: [{ rotate: "90deg" }] }}
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
                          style={{ transform: [{ rotate: "90deg" }] }}
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
    </View>
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
});
