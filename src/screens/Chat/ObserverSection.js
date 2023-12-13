import { Flex, Pressable, Text } from "native-base";
import React from "react";
import AvatarPlaceholder from "../../components/shared/AvatarPlaceholder";

const ObserverSection = ({ name, image }) => {
  return (
    <Flex py={1} gap={2} flexDirection="row">
      <AvatarPlaceholder name={name} image={image} />
      <Text fontSize={12} fontWeight={400}>
        {name}
      </Text>
    </Flex>
  );
};

export default ObserverSection;
