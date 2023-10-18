import React, { memo } from "react";

import { Checkbox, Flex, Icon, Text } from "native-base";
import { TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const ActiveTaskList = ({ id, task, title, responsible, status, priority, onPress, onPressItem }) => {
  return (
    <Flex
      flexDir="row"
      alignItems="center"
      justifyContent="space-between"
      borderLeftWidth={3}
      borderColor={priority === "Low" ? "#49c96d" : priority === "Medium" ? "#ff965d" : "#fd7972"}
      px={4}
    >
      <Checkbox
        isChecked={status === "Closed"}
        onTouchEnd={() => {
          status === "Finish" && onPress(task);
        }}
        isDisabled={status !== "Finish"}
        borderWidth={1}
      >
        <Flex flexDir="column">
          <Text opacity={0.5}>{responsible}</Text>
          <Text textDecorationLine={status === "Closed" ? "line-through" : "none"} w={200}>
            {title}
          </Text>
        </Flex>
      </Checkbox>

      <TouchableOpacity onPress={() => onPressItem(id)}>
        <Icon as={<MaterialCommunityIcons name="chevron-right" />} size="md" />
      </TouchableOpacity>
    </Flex>
  );
};

export default memo(ActiveTaskList);
