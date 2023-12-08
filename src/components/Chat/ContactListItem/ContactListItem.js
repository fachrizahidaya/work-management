import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import RenderHtml from "react-native-render-html";
import { TouchableOpacity } from "react-native";
import { Box, Flex, HStack, Icon, Text, useToast } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../../components/shared/AvatarPlaceholder";
import ChatTimeStamp from "../ChatTimeStamp/ChatTimeStamp";
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
  toggleDeleteModal,
  toggleContactOption,
}) => {
  const navigation = useNavigation();

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

  return (
    <TouchableOpacity
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
      // delayLongPress={370}
      onLongPress={() => {
        toggleContactOption(chat);
      }}
      delayLongPress={100} // adjust idle time for long press
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
                    {message && <Text>{message.length > 20 ? message.slice(0, 20) + "..." : message}</Text>}
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
  );
};

export default ContactListItem;
