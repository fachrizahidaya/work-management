import { Flex, Text } from "native-base";
import React from "react";

const MentionSelectItem = ({ image, name, username, onSelect }) => {
  return (
    <Flex>
      <Text onPress={() => onSelect(username)}>{name}</Text>
    </Flex>
  );
};

export default MentionSelectItem;
