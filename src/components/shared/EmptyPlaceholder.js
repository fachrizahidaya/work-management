import React from "react";

import { Center, Image, Text } from "native-base";

const EmptyPlaceholder = ({ text, height, width }) => {
  return (
    <Center flex={1}>
      <Image source={require("../../assets/vectors/empty.png")} alt="empty" h={height} w={width} resizeMode="contain" />
      <Text fontWeight={400}>{text}</Text>
    </Center>
  );
};

export default EmptyPlaceholder;
