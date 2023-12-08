import { Box, Flex, Text } from "native-base";
import React from "react";

const UserPersonalized = () => {
  return (
    <Flex borderRadius={10} px={2} mx={3} py={2} gap={3} bg="#FFFFFF">
      <Box>
        <Text fontSize={14} fontWeight={400}>
          Search message
        </Text>
      </Box>

      <Box>
        <Text fontSize={14} fontWeight={400}>
          Mute notifications
        </Text>
      </Box>
    </Flex>
  );
};

export default UserPersonalized;
