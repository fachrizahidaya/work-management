import React, { useEffect, useState } from "react";

import { TouchableOpacity, Text, ActivityIndicator } from "react-native";

const FormButton = ({
  children,
  backgroundColor,
  isSubmitting,
  onPress,
  disabled,
  setLoadingIndicator,
  opacity,
  fontSize,
  variant,
  style,
  borderRadius,
  padding,
  height,
}) => {
  const [isLoading, setIsLoading] = useState(isSubmitting ? isSubmitting : false);

  // Update the loading state when the 'isSubmitting' prop changes
  useEffect(() => {
    if (isSubmitting !== undefined) {
      setIsLoading(isSubmitting);
    }
  }, [isSubmitting]);

  // Notify parent component about loading state (if setLoadingIndicator is provided)
  useEffect(() => {
    setLoadingIndicator && setLoadingIndicator(isLoading);
  }, [isLoading]);
  return (
    <TouchableOpacity
      style={[
        style,
        {
          backgroundColor: backgroundColor ? backgroundColor : disabled || isLoading ? "gray" : "#176688",
          opacity: opacity || 1,
          borderRadius: borderRadius || 10,
          height: height ? height : 42,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: variant === "dashed" || variant === "outline" ? 1 : 0,
          borderStyle: variant === "dashed" ? "dashed" : "solid",
          borderColor: variant === "dashed" || variant === "outline" ? "#E8E9EB" : "white",
          padding: padding ? padding : null,
        },
      ]}
      disabled={disabled || isLoading}
      onPress={() => {
        if (isSubmitting !== undefined) {
          onPress();
        } else {
          setIsLoading(true);
          onPress(setIsLoading);
        }
      }}
    >
      {isLoading ? <ActivityIndicator /> : children}
    </TouchableOpacity>
  );
};

export default FormButton;
