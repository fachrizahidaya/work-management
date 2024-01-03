import { useRef } from "react";
import { useNavigation } from "@react-navigation/native";

import { Swipeable } from "react-native-gesture-handler";
import RenderHtml from "react-native-render-html";
import { StyleSheet, TouchableOpacity, View, Text, Pressable } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import AvatarPlaceholder from "../../../components/shared/AvatarPlaceholder";
import ChatTimeStamp from "../ChatTimeStamp/ChatTimeStamp";

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
}) => {
  const navigation = useNavigation();
  const swipeableRef = useRef(null);

  const boldMatchCharacters = (sentence = "", characters = "") => {
    const regex = new RegExp(characters, "gi");
    return sentence.replace(regex, `<strong style="color: #176688;">$&</strong>`);
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

  const renderLeftView = (progress, dragX) => {
    return (
      <Pressable
        onPress={() => {
          if (swipeableRef.current) {
            swipeableRef.current.close();
          }
          onPin(type, id, isPinned?.pin_chat ? "unpin" : "pin");
        }}
        style={{
          padding: 10,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#959595",
        }}
      >
        <MaterialIcons name="push-pin" color="white" style={{ transform: [{ rotate: "45deg" }] }} />
        <Text style={{ color: "#FFFFFF" }}>Pin</Text>
      </Pressable>
    );
  };

  const renderRightView = (progress, dragX) => {
    return (
      <Pressable
        onPress={() => {
          if (swipeableRef.current) {
            swipeableRef.current.close();
          }
          onSwipe(chat);
        }}
        style={{
          padding: 10,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#959595",
        }}
      >
        <MaterialIcons name="more-horiz" color="#FFFFFF" />
        <Text style={{ color: "#FFFFFF" }}>More</Text>
      </Pressable>
    );
  };

  return (
    <View>
      <Swipeable
        ref={swipeableRef}
        renderLeftActions={renderLeftView}
        renderRightActions={renderRightView}
        rightThreshold={-100}
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
                    <Text>{name}</Text>
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

                <View style={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
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
                          {type === "group" && chat?.latest_message ? (
                            <Text>{chat?.latest_message?.user?.name}: </Text>
                          ) : null}
                          {message && <Text>{message.length > 20 ? message.slice(0, 20) + "..." : message}</Text>}
                          {message === null && (project || task || fileName) && (
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                              <MaterialCommunityIcons name={generateIcon()} size={20} />
                              <Text>{generateAttachmentText()}</Text>
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
                  ) : (
                    <Text style={{ fontStyle: "italic", opacity: 0.5 }}>Message has been deleted</Text>
                  )}
                  {isPinned?.pin_chat ? (
                    <MaterialCommunityIcons name="pin" size={20} style={{ transform: [{ rotate: "45deg" }] }} />
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
