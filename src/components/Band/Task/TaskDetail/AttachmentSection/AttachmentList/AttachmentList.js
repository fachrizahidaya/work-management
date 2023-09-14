import React from "react";

import { Box, Flex, Icon, IconButton, Image, Text } from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const AttachmentList = ({ title, size, time, type = "" }) => {
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
    <Flex flexDir="row" justifyContent="space-between">
      <Flex flexDir="row" gap={3} alignItems="center">
        <Image
          resizeMode="contain"
          height={50}
          w={50}
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
          <Text opacity={0.5} maxW={150} numberOfLines={2} flexWrap="wrap">
            {time}
          </Text>
          <Text opacity={0.5}>{size}</Text>
        </Box>
      </Flex>

      <Flex flexDir="row" alignItems="center">
        <IconButton
          size="md"
          borderRadius="full"
          icon={<Icon as={<MaterialIcons name="file-download" />} color="gray.600" />}
        />

        <IconButton
          size="md"
          borderRadius="full"
          icon={<Icon as={<MaterialIcons name="delete" />} color="gray.600" />}
        />
      </Flex>
    </Flex>
  );
};

export default AttachmentList;
