import React from "react";

import { Box, Text } from "native-base";

const SuccessToast = ({ message }) => {
  return (
    <Box bg="emerald.500" px="2" py="1" rounded="sm" mb={5}>
      <Text color="white">{message}</Text>
    </Box>
  );
};

const ErrorToast = ({ message }) => {
  return (
    <Box bg="danger.500" px="2" py="1" rounded="sm" mb={5}>
      <Text color="white">{message}</Text>
    </Box>
  );
};

export { SuccessToast, ErrorToast };
