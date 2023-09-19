import { Pressable, Text } from "native-base";
import React from "react";

const LabelItem = ({ id, name, color, onPress, disabled }) => {
  return (
    <Pressable bgColor={color} p={2} borderRadius={8} onPress={() => onPress(id)} disabled={disabled}>
      <Text color="white">{name}</Text>
    </Pressable>
  );
};

export default LabelItem;
