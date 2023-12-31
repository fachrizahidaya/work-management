import React from "react";

import { Image, Text, View } from "react-native";

const EmptyPlaceholder = ({ text, height, width }) => {
  return (
    <View style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1 }}>
      <Image
        style={{ height: height, width: width, resizeMode: "contain" }}
        source={require("../../assets/vectors/empty.png")}
        alt="empty"
        resizeMode="contain"
      />
      <Text stl={{ fontWeight: 400 }}>{text}</Text>
    </View>
  );
};

export default EmptyPlaceholder;
