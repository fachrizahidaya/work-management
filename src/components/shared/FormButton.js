import React, { useEffect, useState } from "react";

import { Button, Spinner, Text } from "native-base";

const FormButton = ({
  children,
  color,
  size,
  isSubmitting,
  onPress,
  disabled,
  setLoadingIndicator,
  variant,
  opacity,
  fontColor,
  fontSize,
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
    <Button
      size={size || "md"}
      bgColor={color ? color : disabled || isLoading ? "coolGray.500" : "primary.600"}
      disabled={disabled || isLoading}
      onPress={() => {
        if (isSubmitting !== undefined) {
          onPress();
        } else {
          setIsLoading(true);
          onPress(setIsLoading);
        }
      }}
      variant={variant}
      opacity={opacity ? opacity : null}
    >
      {isLoading ? (
        <Spinner size="sm" color={fontColor === "white" ? "primary.600" : "white"} />
      ) : (
        <Text fontSize={fontSize ? fontSize : null} color={fontColor ? fontColor : "#FFFFFF"}>
          {children}
        </Text>
      )}
    </Button>
  );
};

export default FormButton;
