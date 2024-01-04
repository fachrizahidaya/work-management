import React, { memo } from "react";

import RenderHtml from "react-native-render-html";
import { Dimensions, View } from "react-native";

import { hyperlinkConverter } from "../../../../helpers/hyperlinkConverter";

const Description = ({ description }) => {
  const { width } = Dimensions.get("screen");

  const baseStyles = {
    color: "#3F434A",
  };

  return (
    <View>
      <RenderHtml
        contentWidth={width}
        baseStyle={baseStyles}
        source={{
          html: hyperlinkConverter(description) || "",
        }}
      />
    </View>
  );
};

export default memo(Description);
