import React, { memo } from "react";

import { HStack, Icon } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TouchableOpacity } from "react-native";

const TaskMenuSection = ({ onCloseDetail }) => {
  return (
    <HStack justifyContent="space-between" width={81}>
      <TouchableOpacity onPress={onCloseDetail}>
        <Icon as={<MaterialCommunityIcons name="keyboard-backspace" />} size="xl" color="#3F434A" />
      </TouchableOpacity>
    </HStack>
  );
};

export default memo(TaskMenuSection);
