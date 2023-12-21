import { TouchableOpacity } from "react-native";

import React from "react";

const Button = ({ children, styles, flex, backgroundColor, onPress, disabled, opacity, variant }) => {
  return (
    <TouchableOpacity
      style={[
        styles,
        {
          flex: flex,
          backgroundColor:
            variant === "outline" ? "white" : backgroundColor ? backgroundColor : disabled ? "gray" : "#176688",
          opacity: opacity || 1,
          borderRadius: 10,
          height: 42,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: variant === "dashed" || variant === "outline" ? 1 : 0,
          borderStyle: variant === "dashed" ? "dashed" : variant === "outline" ? "solid" : "solid",
          borderColor:
            variant === "dashed" || variant === "outline" ? "#E8E9EB" : backgroundColor ? backgroundColor : "white",
        },
      ]}
      disabled={disabled}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
};

export default Button;
