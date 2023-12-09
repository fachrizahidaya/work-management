import { Box, Flex, Pressable, Text } from "native-base";
import React from "react";

const OptionButton = ({ tabValue, setTabValue }) => {
  return (
    <Flex flexDir="row" background="#ffffff" flex={0} justifyContent="center" alignItems="center">
      <Flex
        bgColor="#fafafa"
        gap={3}
        borderRadius={10}
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        p={2}
        my={2}
      >
        <Pressable
          p={2}
          borderRadius={10}
          bgColor={tabValue === "project" ? "#E6E6E6" : null}
          onPress={() => tabValue === "task" && setTabValue("project")}
        >
          <Text>Project</Text>
        </Pressable>
        <Pressable
          p={2}
          borderRadius={10}
          bgColor={tabValue === "task" ? "#E6E6E6" : null}
          onPress={() => tabValue === "project" && setTabValue("task")}
        >
          <Text>Ad Hoc</Text>
        </Pressable>
      </Flex>
    </Flex>
  );
};

export default OptionButton;
