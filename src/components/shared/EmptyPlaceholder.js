import React from "react";

import { Image, Text, View } from "react-native";
import { TextProps } from "./CustomStylings";

const EmptyPlaceholder = ({ text, height, width, padding }) => {
  return (
    <View style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, padding: padding }}>
      {/* <Image
        style={{ height: height, width: width, resizeMode: "contain" }}
        source={require("../../assets/vectors/empty.png")}
        alt="empty"
        resizeMode="contain"
      /> */}
      <Text style={[TextProps]}>{text}</Text>
    </View>
  );
};

export default EmptyPlaceholder;
