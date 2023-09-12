import React, { useEffect, useState } from "react";

import { Button, Spinner } from "native-base";

const FormButton = ({ title, color, isSubmitting, onPress, disabled, setLoadingIndicator }) => {
  const [isLoading, setIsLoading] = useState(isSubmitting ? isSubmitting : false);

  // Update the loading state when the 'isSubmitting' prop changes
  useEffect(() => {
    setIsLoading(isSubmitting);
  }, [isSubmitting]);

  // Notify parent component about loading state (if setLoadingIndicator is provided)
  useEffect(() => {
    setLoadingIndicator && setLoadingIndicator(isLoading);
  }, [isLoading]);
  return (
    <Button
      bgColor={color ? color : disabled || isLoading ? "coolGray.500" : "primary.600"}
      disabled={disabled || isLoading}
      onPress={onPress}
    >
      {isLoading ? <Spinner size="sm" color="white" /> : title}
    </Button>
  );
};

export default FormButton;
