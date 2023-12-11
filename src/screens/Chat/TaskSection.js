import { Box, Flex, Text } from "native-base";
import React from "react";
import AvatarPlaceholder from "../../components/shared/AvatarPlaceholder";

const TaskSection = () => {
  return (
    <Box gap={2}>
      <Pressable
        //   onPress={() => navigation.navigate("Task Detail Screen")}
        display="flex"
        flexDirection="row"
        alignItems="center"
        bgColor="#ffffff"
        p={5}
        borderRadius={10}
        justifyContent="space-between"
      >
        <Flex>
          <Text fontSize={14} fontWeight={400}>
            Task Name
          </Text>
          <Text opacity={0.5} fontSize={12} fontWeight={300}>
            Due 31 December 2023
          </Text>
        </Flex>
        <AvatarPlaceholder name="Kolabora Group" size="sm" />
      </Pressable>
    </Box>
  );
};

export default TaskSection;
