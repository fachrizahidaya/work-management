import { Flex, Pressable, Text } from "native-base";
import React from "react";
import AvatarPlaceholder from "../../components/shared/AvatarPlaceholder";

const ObserverSection = ({ name, image }) => {
  return (
    <Pressable gap={2} display="flex" bgColor="#ffffff" p={3} borderRadius={10} justifyContent="space-between">
      <Flex gap={2} flexDirection="row">
        <Text fontSize={12} fontWeight={400}>
          Observed by
        </Text>
      </Flex>
      <Flex gap={2} flexDirection="row">
        <AvatarPlaceholder name={name} image={image} />
        <Text fontSize={12} fontWeight={400}>
          {name}
        </Text>
      </Flex>
    </Pressable>
  );
};

export default ObserverSection;
