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
  fontColor,
  variant,
  style,
  borderRadius,
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
          height: 42,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: variant === "dashed" ? 1 : 0,
          borderStyle: variant === "dashed" ? "dashed" : "solid",
          borderColor: variant === "dashed" ? "#E8E9EB" : "white",
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
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <Text style={{ fontSize: fontSize || 14, fontWeight: 500, color: fontColor || "black" }}>{children}</Text>
      )}
    </TouchableOpacity>
  );
};

export default FormButton;
