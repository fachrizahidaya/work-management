import React from "react";

import { Box, Flex, Icon, Image, Menu, Pressable, Text } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const AttachmentList = ({
  id,
  title,
  from,
  size,
  time,
  type = "",
  downloadFileHandler,
  deleteFileHandler,
  iconHeight,
  iconWidth,
}) => {
  const doc = "../../../../../../assets/doc-icons/doc-format.png";
  const gif = "../../../../../../assets/doc-icons/gif-format.png";
  const jpg = "../../../../../../assets/doc-icons/jpg-format.png";
  const key = "../../../../../../assets/doc-icons/key-format.png";
  const other = "../../../../../../assets/doc-icons/other-format.png";
  const pdf = "../../../../../../assets/doc-icons/pdf-format.png";
  const png = "../../../../../../assets/doc-icons/png-format.png";
  const ppt = "../../../../../../assets/doc-icons/ppt-format.png";
  const rar = "../../../../../../assets/doc-icons/rar-format.png";
  const xls = "../../../../../../assets/doc-icons/xls-format.png";
  const zip = "../../../../../../assets/doc-icons/zip-format.png";
  return (
    <Flex flexDir="row" justifyContent="space-between" alignItems="center">
      <Flex flexDir="row" gap={3} alignItems="center">
        <Image
          resizeMode="contain"
          h={iconHeight || 50}
          w={iconWidth || 50}
          source={
            type.includes("doc")
              ? require(doc)
              : type.includes("gif")
              ? require(gif)
              : type.includes("jpg") || type.includes("jpeg")
              ? require(jpg)
              : type.includes("key")
              ? require(key)
              : type.includes("pdf")
              ? require(pdf)
              : type.includes("png")
              ? require(png)
              : type.includes("ppt") || type.includes("pptx")
              ? require(ppt)
              : type.includes("rar")
              ? require(rar)
              : type.includes("xls") || type.includes("xlsx")
              ? require(xls)
              : type.includes("zip")
              ? require(zip)
              : require(other)
          }
          alt="file icon"
        />

        <Box>
          <Text>{title.length > 30 ? title.slice(0, 30) + "..." : title}</Text>

          {time && (
            <Text opacity={0.5} maxW={150} numberOfLines={2} flexWrap="wrap">
              {time}
            </Text>
          )}
          <Text opacity={0.5}>{size}</Text>
        </Box>
      </Flex>

      <Menu
        trigger={(triggerProps) => {
          return (
            <Pressable {...triggerProps}>
              <Icon as={<MaterialCommunityIcons name="dots-vertical" />} color="black" size="md" />
            </Pressable>
          );
        }}
      >
        <Menu.Item onPress={() => downloadFileHandler(id, title, from)}>
          <Flex flexDir="row" alignItems="center" gap={2}>
            <Icon as={<MaterialCommunityIcons name="download-outline" />} size="md" />
            <Text>Download</Text>
          </Flex>
        </Menu.Item>

        <Menu.Item onPress={() => deleteFileHandler(id, from)}>
          <Flex flexDir="row" alignItems="center" gap={2}>
            <Icon as={<MaterialCommunityIcons name="delete-outline" />} size="md" color="red.600" />
            <Text color="red.500">Delete</Text>
          </Flex>
        </Menu.Item>
      </Menu>
    </Flex>
  );
};

export default AttachmentList;
