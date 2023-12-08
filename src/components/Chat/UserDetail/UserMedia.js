import { Flex, Icon, Pressable, Text } from "native-base";
import React from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const UserMedia = ({ qty }) => {
  return (
    <Flex
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      borderRadius={10}
      mx={3}
      px={2}
      py={2}
      gap={3}
      bg="#FFFFFF"
    >
      <Pressable display="flex" gap={1} flexDirection="row" alignItems="center">
        <Icon as={<MaterialIcons name="image" />} size={5} color="primary.600" />
        <Text fontSize={14} fontWeight={400}>
          Media & Docs
        </Text>
      </Pressable>
      <Pressable display="flex" gap={1} flexDirection="row" alignItems="center">
        <Text opacity={0.5} fontSize={14} fontWeight={400}>
          {qty}
        </Text>
        <Icon opacity={0.5} as={<MaterialIcons name="chevron-right" />} size={5} />
      </Pressable>
    </Flex>
  );
};

export default UserMedia;
