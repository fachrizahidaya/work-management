import { Pressable, Text } from "native-base";
import React from "react";

const LabelItem = ({ id, name, color, onPress }) => {
  return (
    <Pressable bgColor={color} p={2} borderRadius={8} onPress={() => onPress(id)}>
      <Text color="white">{name}</Text>
    </Pressable>
  );
};

export default LabelItem;
