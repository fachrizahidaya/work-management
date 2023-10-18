import React, { useEffect, useState } from "react";

import { Button, Spinner } from "native-base";

const FormButton = ({ children, color, size, isSubmitting, onPress, disabled, setLoadingIndicator, variant }) => {
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
    >
      {isLoading ? <Spinner size="sm" color={color === "white" ? "primary.600" : "white"} /> : children}
    </Button>
  );
};

export default FormButton;
