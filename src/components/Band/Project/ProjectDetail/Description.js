import React from "react";

import { Box, Text } from "native-base";

const Description = ({ description }) => {
  return (
    <Box>
      <Text>{description}</Text>
    </Box>
  );
};

export default Description;
