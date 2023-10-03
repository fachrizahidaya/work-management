import React from "react";

import { Checkbox, Flex, Text } from "native-base";

const ActiveTaskList = ({ task, title, responsible, status, priority, onPress }) => {
  return (
    <Flex
      flexDir="row"
      alignItems="center"
      borderLeftWidth={3}
      borderColor={priority === "Low" ? "#49c96d" : priority === "Medium" ? "#ff965d" : "#fd7972"}
      px={4}
    >
      <Flex flexDir="row" alignItems="center" w="100%">
        <Checkbox
          isChecked={status === "Closed"}
          onTouchEnd={() => {
            status !== "Closed" && onPress(task);
          }}
          isDisabled={status === "Closed"}
        >
          <Flex flexDir="column">
            <Text opacity={0.5}>{responsible}</Text>
            <Text textDecorationLine={status === "Closed" ? "line-through" : "none"}>{title}</Text>
          </Flex>
        </Checkbox>
      </Flex>
    </Flex>
  );
};

export default ActiveTaskList;
