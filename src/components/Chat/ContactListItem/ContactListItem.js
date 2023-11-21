import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import RenderHtml from "react-native-render-html";
import { Box, Flex, HStack, Icon, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../../components/shared/AvatarPlaceholder";
import ChatTimeStamp from "../ChatTimeStamp/ChatTimeStamp";
import { TouchableOpacity } from "react-native";
import axiosInstance from "../../../config/api";

const ContactListItem = ({
  type,
  id,
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
  setForceRerender,
  forceRerender,
}) => {
  const [selectedGroupMembers, setSelectedGroupMembers] = useState([]);
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

  /**
   * Fetch members of selected group
   */
  const fetchSelectedGroupMembers = async () => {
    try {
      const res = await axiosInstance.get(`/chat/group/${id}/member`);
      setSelectedGroupMembers(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSelectedGroupMembers();
  }, [id]);

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Chat Room", {
          name: name,
          userId: id,
          image: image,
          position: position,
          email: email,
          type: type,
          active_member: active_member,
          setForceRender: setForceRerender,
          forceRender: forceRerender,
          selectedGroupMembers: selectedGroupMembers,
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

              <ChatTimeStamp time={time} timestamp={timestamp} />
            </HStack>

            <Flex flexDir="row" alignItems="center" gap={1}>
              {!isDeleted ? (
                <>
                  {message && <Text>{message.length > 35 ? message.slice(0, 35) + "..." : message}</Text>}
                  {message === null && (project || task || fileName) && (
                    <HStack alignItems="center" space={1}>
                      <Icon as={<MaterialCommunityIcons name={generateIcon()} />} size="md" />
                      <Text>{generateAttachmentText()}</Text>
                    </HStack>
                  )}
                </>
              ) : (
                <Text fontStyle="italic" opacity={0.5}>
                  Message has been deleted
                </Text>
              )}
            </Flex>
          </Box>
        </Flex>
      </Flex>
    </TouchableOpacity>
  );
};

export default ContactListItem;
