import React, { memo } from "react";
import { useNavigation } from "@react-navigation/native";

import { HStack, Icon } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TouchableOpacity } from "react-native";

const TaskMenuSection = () => {
  const navigation = useNavigation();

  return (
    <HStack justifyContent="space-between" width={81}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon as={<MaterialCommunityIcons name="keyboard-backspace" />} size="xl" color="#3F434A" />
      </TouchableOpacity>
    </HStack>
  );
};

export default memo(TaskMenuSection);
