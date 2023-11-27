import React, { memo } from "react";

import RenderHtml from "react-native-render-html";
import { Box } from "native-base";
import { Dimensions } from "react-native";

import { hyperlinkConverter } from "../../../../helpers/hyperlinkConverter";

const Description = ({ description }) => {
  const { width } = Dimensions.get("screen");

  const baseStyles = {
    color: "#3F434A",
    fontWeight: 500,
  };

  return (
    <Box>
      <RenderHtml
        contentWidth={width}
        baseStyle={baseStyles}
        source={{
          html: hyperlinkConverter(description) || "",
        }}
      />
    </Box>
  );
};

export default memo(Description);
