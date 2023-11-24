import React from "react";

import RenderHtml from "react-native-render-html";
import { Box } from "native-base";
import { Dimensions } from "react-native";

import { hyperlinkConverter } from "../../../../helpers/hyperlinkConverter";

const Description = ({ description }) => {
  const { width } = Dimensions.get("screen");

  return (
    <Box>
      <RenderHtml
        contentWidth={width}
        source={{
          html: hyperlinkConverter(description) || "",
        }}
      />
    </Box>
  );
};

export default Description;
