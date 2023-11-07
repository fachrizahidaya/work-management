import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { Box, Flex, HStack, Icon, Pressable, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AvatarPlaceholder from "../../../components/shared/AvatarPlaceholder";

const ContactListItem = ({ type, id, name, image, message, isDeleted, fileName, project, task }) => {
  const [forceRerendered, setForceRerendered] = useState(false);
  const navigation = useNavigation();

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
    <Pressable
      onPress={() => {
        navigation.navigate("Chat Room", {
          name: name,
          userId: id,
          image: image,
          type: type,
        });
      }}
    >
      <Flex flexDir="row" justifyContent="space-between" p={4} borderBottomWidth={1} borderColor="#E8E9EB">
        <Flex flexDir="row" gap={4} alignItems="center">
          <AvatarPlaceholder name={name} image={image} size="md" />

          <Box>
            <Text fontSize={16}>{name}</Text>

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
    </Pressable>
  );
};

export default ContactListItem;
