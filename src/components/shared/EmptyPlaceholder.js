import React from "react";

import { Image, Text, View } from "react-native";
import { TextProps } from "./CustomStylings";

const EmptyPlaceholder = ({ text, height, width }) => {
  return (
    <View style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1 }}>
      <Image
        style={{ height: height, width: width, resizeMode: "contain" }}
        source={require("../../assets/vectors/empty.png")}
        alt="empty"
        resizeMode="contain"
      />
      <Text stl={TextProps}>{text}</Text>
    </View>
  );
};

export default EmptyPlaceholder;
