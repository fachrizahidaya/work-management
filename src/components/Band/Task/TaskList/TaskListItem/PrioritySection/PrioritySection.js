import React from "react";

import { Box, Flex } from "native-base";

const PrioritySection = ({ priority }) => {
  return (
    <Flex flexDir="row" gap={1}>
      <Box bgColor="#49C96D" w={3} h={3} borderRadius={50}></Box>
      {(priority === "Medium" || priority === "High") && <Box bgColor="#FF965D" w={3} h={3} borderRadius={50}></Box>}
      {priority === "High" && <Box bgColor="#FD7972" w={3} h={3} borderRadius={50}></Box>}
    </Flex>
  );
};

export default PrioritySection;
