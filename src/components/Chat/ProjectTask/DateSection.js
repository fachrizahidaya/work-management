import { Box, Flex, Pressable, Text } from "native-base";
import React from "react";

const DateSection = ({ start, end }) => {
  return (
    <Pressable display="flex" bgColor="#ffffff" p={3} borderRadius={10} justifyContent="space-between">
      <Flex gap={2} flexDirection="row">
        <Text fontSize={12} fontWeight={400}>
          Start
        </Text>
        <Text fontSize={12} fontWeight={500}>
          {start}
        </Text>
      </Flex>
      <Flex gap={3} flexDirection="row">
        <Text fontSize={12} fontWeight={400}>
          Due
        </Text>
        <Text fontSize={12} fontWeight={500}>
          {end}
        </Text>
      </Flex>
    </Pressable>
  );
};

export default DateSection;
