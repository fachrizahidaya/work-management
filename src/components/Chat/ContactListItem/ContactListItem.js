import { useRef } from "react";
import { useNavigation } from "@react-navigation/native";

import RenderHtml from "react-native-render-html";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Box, Flex, HStack, Icon, Pressable, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Swipeable } from "react-native-gesture-handler";
import AvatarPlaceholder from "../../../components/shared/AvatarPlaceholder";
import ChatTimeStamp from "../ChatTimeStamp/ChatTimeStamp";

const LIST_ITEM_HEIGHT = 70;

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
        p={5}
        justifyContent="center"
        alignItems="center"
        backgroundColor="#959595"
      >
        <Icon as={<MaterialIcons name="push-pin" />} color="white" style={{ transform: [{ rotate: "45deg" }] }} />
        <Text color="white">Pin</Text>
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
        p={5}
        justifyContent="center"
        alignItems="center"
        backgroundColor="#959595"
      >
        <Icon as={<MaterialIcons name="more-horiz" />} color="white" />
        <Text color="white">More</Text>
      </Pressable>
    );
  };

  return (
    <Box>
      <Swipeable
        ref={swipeableRef}
        renderLeftActions={renderLeftView}
        renderRightActions={renderRightView}
        rightThreshold={-100}
      >
        <TouchableOpacity
          style={{ backgroundColor: "white" }}
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
          <Flex flexDir="row" justifyContent="space-between" p={4} borderBottomWidth={1} borderColor="#E8E9EB">
            <Flex flexDir="row" gap={4} alignItems="center" flex={1}>
              <AvatarPlaceholder name={name} image={image} size="md" isThumb={false} />

              <Box flex={1}>
                <HStack justifyContent="space-between">
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

                  <Flex flexDirection="row">
                    <ChatTimeStamp time={time} timestamp={timestamp} />
                  </Flex>
                </HStack>

                <Flex flexDir="row" alignItems="center" gap={1}>
                  {!isDeleted ? (
                    <>
                      <HStack alignItems="center" justifyContent="space-between" flex={1}>
                        <Flex flexDirection="row">
                          {type === "group" && chat?.latest_message && (
                            <Text>{chat?.latest_message?.user?.name}: </Text>
                          )}
                          {message && <Text>{message.length > 20 ? message.slice(0, 20) + "..." : message}</Text>}
                        </Flex>
                        {message === null && (project || task || fileName) && (
                          <HStack alignItems="center" space={1}>
                            <Icon as={<MaterialCommunityIcons name={generateIcon()} />} size="md" />
                            <Text>{generateAttachmentText()}</Text>
                          </HStack>
                        )}
                        {!!isRead && (
                          <Box
                            style={{
                              height: 25,
                              width: 25,
                            }}
                            bgColor="#FD7972"
                            borderRadius={10}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Text fontSize={12} textAlign="center" color="white">
                              {isRead > 20 ? "20+" : isRead}
                            </Text>
                          </Box>
                        )}
                      </HStack>
                    </>
                  ) : (
                    <Text fontStyle="italic" opacity={0.5}>
                      Message has been deleted
                    </Text>
                  )}
                  {isPinned?.pin_chat ? (
                    <Icon
                      as={<MaterialCommunityIcons name="pin" />}
                      size="md"
                      style={{ transform: [{ rotate: "45deg" }] }}
                    />
                  ) : null}
                </Flex>
              </Box>
            </Flex>
          </Flex>
        </TouchableOpacity>
      </Swipeable>
    </Box>
  );
};

export default ContactListItem;

const styles = StyleSheet.create({
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
    right: 0,
  },
});
