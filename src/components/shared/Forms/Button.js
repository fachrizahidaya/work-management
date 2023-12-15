import { TouchableOpacity } from "react-native";

import React from "react";

const Button = ({ children, styles, flex, backgroundColor, onPress, disabled, opacity, variant }) => {
  return (
    <TouchableOpacity
      style={[
        styles,
        {
          flex: flex,
          backgroundColor: backgroundColor ? backgroundColor : disabled ? "gray" : "#176688",
          opacity: opacity || 1,
          borderRadius: 10,
          height: 42,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: variant === "dashed" ? 1 : 0,
          borderStyle: variant === "dashed" ? "dashed" : "solid",
          borderColor: variant === "dashed" ? "#E8E9EB" : "white",
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
